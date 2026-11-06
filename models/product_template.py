from odoo import api, models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    @api.model
    def _load_pos_data_fields(self, config):
        fields_to_load = super()._load_pos_data_fields(config)
        if "qty_available" not in fields_to_load:
            fields_to_load.append("qty_available")
        return fields_to_load
