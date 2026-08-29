from odoo import fields, models


class PosOrder(models.Model):
    _inherit = "pos.order"

    is_exchange = fields.Boolean(
        string="Exchange Order",
        readonly=True,
        copy=False,
        help="The order contains returned products and their replacements.",
    )
    exchange_origin_order_id = fields.Many2one(
        "pos.order",
        string="Original Exchange Order",
        readonly=True,
        copy=False,
        index=True,
        help="The completed POS order from which this exchange originated.",
    )
    exchange_order_ids = fields.One2many(
        "pos.order",
        "exchange_origin_order_id",
        string="Exchange Orders",
        readonly=True,
    )

class PosOrderLine(models.Model):
    _inherit = "pos.order.line"

    fixed_discount_amount = fields.Monetary(
        string="Fixed Discount",
        currency_field="currency_id",
        default=0.0,
        help="Exact monetary discount entered by the cashier for this line.",
    )

    def _load_pos_data_fields(self, config):
        fields_to_load = super()._load_pos_data_fields(config)
        return fields_to_load + ["fixed_discount_amount"]
