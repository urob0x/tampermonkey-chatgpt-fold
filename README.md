# tampermonkey-chatgpt-fold

Userscript para Tampermonkey que permite **plegar y desplegar mensajes largos del usuario** en ChatGPT (chatgpt.com), añadiendo un botón “Mostrar más / Mostrar menos”.

## Instalación

1. Instala la extensión **Tampermonkey**:
   - Chrome/Chromium: https://www.tampermonkey.net/
   - Firefox: https://www.tampermonkey.net/

2. Crea un script nuevo en Tampermonkey.
3. Pega el contenido de `chatgpt-fold-long-user-messages.user.js`.
4. Guarda el script.
5. Abre https://chatgpt.com/ y prueba con un mensaje largo.

## Cómo funciona

- Detecta los mensajes del usuario (`data-message-author-role="user"`).
- Si el contenido supera una cierta altura, lo **pliega** y añade un botón para desplegarlo o volver a plegarlo.

## Ajustes rápidos

En el script puedes modificar:
- `MAX_HEIGHT` (en px): altura a partir de la cual se pliega.
- `max-height` en el CSS (`.msg-collapsed`): altura visible cuando está plegado.

## Compatibilidad

- Diseñado para: `https://chatgpt.com/*`
- Si utilizas otro dominio (por ejemplo, el anterior), añade otra regla `@match`.

## Licencia

MIT
