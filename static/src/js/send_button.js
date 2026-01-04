/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";
import { SaveButton } from "@point_of_sale/app/screens/product_screen/control_buttons/save_button/save_button";
import { ConfirmPopup } from "@point_of_sale/app/utils/confirm_popup/confirm_popup";
import { ErrorPopup } from "@point_of_sale/app/errors/popups/error_popup";
import { Navbar } from "@point_of_sale/app/navbar/navbar";
import { patch } from "@web/core/utils/patch";

export class SendButton extends SaveButton {
    static template = "pos_send_confirm_receipt.SendButton";

    setup() {
        super.setup();
        this.popup = useService("popup");
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

        const orderToSend = this.pos.get_order();
        const savePromise = this._executeNativeSave();
        await savePromise;

        await this.popup.add(ErrorPopup, {
            title: _t("Orden enviada"),
            body: _t("%s enviada con éxito", orderToSend.get_name()),
            confirmText: _t("OK"),
        });
    }

    _executeNativeSave() {
        const originalSendDraftToServer = this.pos.sendDraftToServer.bind(this.pos);
        let sendDraftPromise = Promise.resolve();

        this.pos.sendDraftToServer = (...args) => {
            const promise = originalSendDraftToServer(...args);
            sendDraftPromise = promise;
            return promise;
        };

        try {
            super.onClick();
        } finally {
            this.pos.sendDraftToServer = originalSendDraftToServer;
        }

        return sendDraftPromise;
    }
}

patch(Navbar, {
    components: { ...Navbar.components, SendButton },
});
