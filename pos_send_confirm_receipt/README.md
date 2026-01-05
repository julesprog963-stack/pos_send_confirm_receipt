# pos_send_confirm_receipt

### Instalación
- Copiar el módulo en `custom_addons` (montado en `/mnt/extra-addons`).
- Actualizar la lista de aplicaciones y buscar **POS Send Confirm Receipt**.
- Instalar; depende solo de `point_of_sale`.

### Upgrade
- En Apps, pulsar **Actualizar lista de aplicaciones**.
- Entrar al módulo y elegir **Actualizar** (o `-u pos_send_confirm_receipt` por CLI).

### Refresco del POS
- Hacer hard refresh del POS (Ctrl+F5) o limpiar caché del navegador tras actualizar para cargar los nuevos assets.

### Odoo Apps / empaquetado
- Incluir en `static/description/`:
  - `icon.png` (512x512).
  - `screenshot_list.png`, `screenshot_confirm.png`, `screenshot_success.png` (capturas del flujo).
- Ajustar `website` en el manifest si aplica.
