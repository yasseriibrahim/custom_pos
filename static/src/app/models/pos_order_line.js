/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";

patch(PosOrderline.prototype, {
    setup(vals) {
        super.setup(...arguments);
        if (this.fixed_discount_amount === undefined || this.fixed_discount_amount === null) {
            this.fixed_discount_amount = 0;
        }

        // Standard POS copies the percentage when a refund line is created. Keep
        // the exact monetary value too, prorated for partial-quantity refunds.
        const refundedLine = this.refunded_orderline_id;
        if (!this.fixed_discount_amount && refundedLine?.fixed_discount_amount) {
            const originalQty = Math.abs(refundedLine.qty) || 1;
            this.fixed_discount_amount =
                (refundedLine.fixed_discount_amount * Math.abs(this.qty)) / originalQty;
        }
    },

    setFixedDiscountAmount(amount) {
        const requestedAmount = Math.max(Number(amount) || 0, 0);
        const grossLineTotal = Math.abs(this.displayPriceNoDiscount || 0);
        const boundedAmount = Math.min(requestedAmount, grossLineTotal);
        const percentage = grossLineTotal ? (boundedAmount / grossLineTotal) * 100 : 0;

        this.fixed_discount_amount = boundedAmount;
        this._settingFixedDiscount = true;
        try {
            super.setDiscount(percentage);
        } finally {
            this._settingFixedDiscount = false;
        }
        this.order_id?.triggerRecomputeAllPrices();
    },

    setDiscount(discount) {
        const result = super.setDiscount(...arguments);
        if (!this._settingFixedDiscount) {
            this.fixed_discount_amount = 0;
        }
        return result;
    },

    setQuantity(quantity, keepPrice) {
        const fixedAmount = this.fixed_discount_amount || 0;
        const result = super.setQuantity(...arguments);
        if (fixedAmount) {
            this.setFixedDiscountAmount(fixedAmount);
        }
        return result;
    },

    setUnitPrice(price) {
        const fixedAmount = this.fixed_discount_amount || 0;
        const result = super.setUnitPrice(...arguments);
        if (fixedAmount && !this._settingFixedDiscount) {
            this.setFixedDiscountAmount(fixedAmount);
        }
        return result;
    },
});
