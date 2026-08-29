{
    "name": "Custom POS",
    "version": "19.0.1.0.0",
    "summary": "Fixed POS line discounts, product exchanges, and SUMER receipt layout",
    "category": "Point of Sale",
    "license": "LGPL-3",
    "depends": ["point_of_sale"],
    "data": [
        "views/pos_order_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "custom_pos/static/src/app/models/pos_order_line.js",
            "custom_pos/static/src/app/screens/product_screen/control_buttons.js",
            "custom_pos/static/src/app/screens/product_screen/control_buttons.xml",
            "custom_pos/static/src/app/screens/ticket_screen/ticket_screen.js",
            "custom_pos/static/src/app/screens/ticket_screen/ticket_screen.xml",
            "custom_pos/static/src/app/screens/orderline/orderline.xml",
            "custom_pos/static/src/app/screens/receipt_screen/order_receipt.xml",
            "custom_pos/static/src/app/screens/receipt_screen/order_receipt.scss",
        ],
    },
    "installable": True,
    "application": False,
}
