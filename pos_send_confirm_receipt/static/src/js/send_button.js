/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";
import { SaveButton } from "@point_of_sale/app/screens/product_screen/control_buttons/save_button/save_button";
import { ConfirmPopup } from "@point_of_sale/app/utils/confirm_popup/confirm_popup";
import { ErrorPopup } from "@point_of_sale/app/errors/popups/error_popup";
import { Navbar } from "@point_of_sale/app/navbar/navbar";
import { patch } from "@web/core/utils/patch";
import { Component } from "@odoo/owl";

export class SendReceipt58mm extends Component {
    static template = "pos_send_confirm_receipt.SendReceipt58mm";
    static props = {
        data: Object,
    };
}

export class SendButton extends SaveButton {
    static template = "pos_send_confirm_receipt.SendButton";

    setup() {
        super.setup();
        this.popup = useService("popup");
        this.printer = useService("printer");
    }

    async _saveCurrentOrderForLater() {
        const orders = this.pos.get_order_list();
        const emptyOrders = orders.filter((posOrder) => posOrder.is_empty());
        // Fuerza incluir la orden actual, incluso si vino del cache y no tuvo cambios hoy.
        this.pos.addOrderToUpdateSet();
        await this.pos.sendDraftToServer();
        if (emptyOrders.length > 0) {
            this.pos.set_order(emptyOrders[0]);
        } else {
            this.pos.add_new_order();
        }
    }

    _getBarcodeTicketCode(orderName) {
        return (orderName || "").replace(/^(Order|Orden)\s+/i, "").trim();
    }

    async onClick() {
        const order = this.pos.get_order();
        const hasProducts = order?.get_orderlines().length;
        if (!hasProducts) {
            await this.popup.add(ErrorPopup, {
                title: _t("Pedido vacío"),
                body: _t("Agrega productos antes de enviar la orden"),
                confirmText: _t("OK"),
            });
            return;
        }

        const { confirmed } = await this.popup.add(ConfirmPopup, {
            title: _t("¿Seguro de enviar la orden?"),
            body: _t("Se enviará la orden actual."),
            confirmText: _t("Enviar"),
            cancelText: _t("Cancelar"),
        });

        if (!confirmed) {
            return;
        }

        const orderName = order.get_name(); // capturamos la referencia antes del envío
        const barcodeTicketCode = this._getBarcodeTicketCode(orderName);
        const receiptData = {
            companyName: this.pos.company.name,
            orderName: barcodeTicketCode,
            date: order.export_for_printing().date,
            total: this.env.utils.formatCurrency(order.get_total_with_tax()),
            // Se codifica exactamente el folio actual, incluyendo guiones si existen.
            barcodeSrc: `/report/barcode/?barcode_type=Code128&value=${encodeURIComponent(barcodeTicketCode)}&width=900&height=260&humanreadable=0&quiet=0`,
        };
        await this._saveCurrentOrderForLater();
        for (let copy = 0; copy < 2; copy++) {
            await this.printer.print(
                SendReceipt58mm,
                { data: receiptData },
                { webPrintFallback: true }
            );
        }
        await this.popup.add(ErrorPopup, {
            title: _t("Orden enviada"),
            body: _t("%s enviada con éxito", orderName),
            confirmText: _t("OK"),
        });
    }
}

patch(Navbar, {
    components: { ...Navbar.components, SendButton },
});
