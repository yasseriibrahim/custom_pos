/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { NumberPopup } from "@point_of_sale/app/components/popups/number_popup/number_popup";
import { makeAwaitable } from "@point_of_sale/app/utils/make_awaitable_dialog";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";

patch(ControlButtons.prototype, {
    async clickFixedDiscountAmount() {
        const line = this.currentOrder?.getSelectedOrderline();
        if (!line) {
            this.dialog.add(AlertDialog, {
                title: _t("Select a product"),
                body: _t("Select the product line that should receive the fixed discount."),
            });
            return;
        }

        const maximum = Math.abs(line.displayPriceNoDiscount || 0);
        const value = await makeAwaitable(this.dialog, NumberPopup, {
            title: _t("Fixed Discount Amount (SAR)"),
            startingValue: line.fixed_discount_amount || 0,
            isValid: (amount) => Number(amount) >= 0 && Number(amount) <= maximum,
            formatDisplayedValue: (amount) => `${amount} SAR`,
        });
        if (value === undefined) {
            return;
        }

        const amount = Number(value) || 0;
        if (amount > maximum) {
            this.dialog.add(AlertDialog, {
                title: _t("Discount is too high"),
                body: _t("The fixed discount cannot exceed the selected line total."),
            });
            return;
        }
        line.setFixedDiscountAmount(amount);
        this.props.close?.();
    },
});
