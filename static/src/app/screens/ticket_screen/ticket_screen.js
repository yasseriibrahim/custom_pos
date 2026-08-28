/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { TicketScreen } from "@point_of_sale/app/screens/ticket_screen/ticket_screen";

patch(TicketScreen.prototype, {
    async onDoExchange() {
        const originalOrder = this.getSelectedOrder();
        if (!originalOrder || !this.getHasItemsToRefund()) {
            return;
        }

        // Let the standard refund implementation create the negative lines,
        // preserve lots/taxes/discounts, and link each line to the original.
        await this.onDoRefund();

        const exchangeOrder = this.pos.getOrder();
        if (!exchangeOrder || exchangeOrder === originalOrder) {
            return;
        }

        exchangeOrder.is_exchange = true;
        exchangeOrder.exchange_origin_order_id = originalOrder;
        exchangeOrder.is_refund = false;
        exchangeOrder.setScreenData({ name: "ProductScreen" });

        this.env.services.notification.add(
            _t("Select the replacement product, then validate and settle the price difference."),
            { type: "info" }
        );
        this.pos.navigate("ProductScreen", { orderUuid: exchangeOrder.uuid });
    },
});
