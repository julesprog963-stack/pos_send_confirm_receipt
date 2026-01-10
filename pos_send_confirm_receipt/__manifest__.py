{
    "name": "POS Send Confirm Receipt",
    "summary": "Botón Enviar en POS con confirmación y popup de recibo.",
    "description": "Añade un botón Enviar en la barra superior del POS que reutiliza la lógica nativa de guardado. Valida pedido vacío, pide confirmación y muestra un popup de éxito con el mismo número de recibo del core.",
    "version": "17.0.1.0.2",
    "category": "Point of Sale",
    "author": "JDA SOLUTIONS",
    "website": "https://github.com/julesprog963-stack/pos_send_confirm_receipt.git",
    "license": "LGPL-3",
    "depends": ["point_of_sale"],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_send_confirm_receipt/static/src/js/send_button.js",
            "pos_send_confirm_receipt/static/src/xml/send_button.xml",
        ],
    },
    "images": [
        "static/description/icon.png",
        "static/description/screenshot_confirm.png",
        "static/description/screenshot_success.png",
        "static/description/screenshot_list.png",
    ],
}
