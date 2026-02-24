// ==UserScript==
// @name         ChatGPT - Plegar mensajes largos del usuario
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replica la función de plegar mensajes largos del usuario en ChatGPT.
// @author       urob0x
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // Inyectamos el CSS necesario
    GM_addStyle(`
        .msg-collapsed {
            max-height: 120px !important; /* Altura del mensaje plegado */
            overflow: hidden !important;

            /* Difuminado inferior que funciona en tema claro y oscuro */
            -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
            mask-image: linear-gradient(to bottom, black 50%, transparent 100%);

            transition: max-height 0.3s ease;
        }

        .toggle-fold-btn {
            background-color: transparent;
            color: #888;
            border: none;
            font-size: 0.85rem;
            cursor: pointer;
            padding: 4px 0;
            margin-top: 8px;
            display: block;
            font-weight: 500;
            transition: color 0.2s;
        }

        .toggle-fold-btn:hover {
            color: #555;
            text-decoration: underline;
        }
    `);

    // Altura (en píxeles) a partir de la cual el mensaje se considera "largo" y se pliega
    const MAX_HEIGHT = 150;

    function procesarMensajes() {
        // Seleccionamos los mensajes del usuario que aún no hayamos procesado
        const mensajesUsuario = document.querySelectorAll(
            '[data-message-author-role="user"]:not(.folded-processed)'
        );

        mensajesUsuario.forEach((contenedorMensaje) => {
            contenedorMensaje.classList.add('folded-processed');

            // Buscamos el elemento que contiene el texto (suele llevar esta clase en ChatGPT)
            const nodoContenido =
                contenedorMensaje.querySelector('.whitespace-pre-wrap') || contenedorMensaje;

            // Damos tiempo al navegador a renderizar para medir la altura correctamente
            requestAnimationFrame(() => {
                if (nodoContenido.scrollHeight > MAX_HEIGHT) {
                    nodoContenido.classList.add('msg-collapsed');

                    // Creamos el botón
                    const boton = document.createElement('button');
                    boton.className = 'toggle-fold-btn';
                    boton.innerText = '▼ Mostrar más';

                    // Lógica para expandir/plegar
                    boton.addEventListener('click', () => {
                        const estaPlegado = nodoContenido.classList.contains('msg-collapsed');

                        if (estaPlegado) {
                            nodoContenido.classList.remove('msg-collapsed');

                            // Quitamos el difuminado al expandir
                            nodoContenido.style.webkitMaskImage = 'none';
                            nodoContenido.style.maskImage = 'none';

                            boton.innerText = '▲ Mostrar menos';
                        } else {
                            nodoContenido.classList.add('msg-collapsed');

                            // Restauramos el difuminado al plegar
                            nodoContenido.style.webkitMaskImage = '';
                            nodoContenido.style.maskImage = '';

                            boton.innerText = '▼ Mostrar más';
                        }
                    });

                    // Insertamos el botón al final del contenedor del mensaje
                    contenedorMensaje.appendChild(boton);
                }
            });
        });
    }

    // Observador para detectar cuando ChatGPT carga mensajes nuevos
    const observador = new MutationObserver((mutations) => {
        let deberiaProcesar = false;

        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                deberiaProcesar = true;
                break;
            }
        }

        if (deberiaProcesar) {
            // Pequeño retardo para no saturar el rendimiento mientras se escribe
            clearTimeout(window.foldDebounce);
            window.foldDebounce = setTimeout(procesarMensajes, 300);
        }
    });

    // Iniciar la observación del chat
    observador.observe(document.body, { childList: true, subtree: true });

    // Procesar los mensajes ya existentes al cargar la página por primera vez
    setTimeout(procesarMensajes, 1000);
})();
