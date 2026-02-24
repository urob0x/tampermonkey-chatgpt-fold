// ==UserScript==
// @name         ChatGPT - Fold long user messages
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replicates the fold long user messages feature in ChatGPT.
// @author       urob0x
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // Inject necessary CSS
    GM_addStyle(`
        .msg-collapsed {
            max-height: 120px !important; /* Height of the collapsed message */
            overflow: hidden !important;

            /* Bottom fade effect that works in both light and dark themes */
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

    // Height (in pixels) above which a message is considered "long" and gets folded
    const MAX_HEIGHT = 150;

    function processMessages() {
        // Select user messages that haven't been processed yet
        const userMessages = document.querySelectorAll(
            '[data-message-author-role="user"]:not(.folded-processed)'
        );

        userMessages.forEach((messageContainer) => {
            messageContainer.classList.add('folded-processed');

            // Find the element containing the text (usually has this class in ChatGPT)
            const contentNode =
                messageContainer.querySelector('.whitespace-pre-wrap') || messageContainer;

            // Give the browser time to render to measure height correctly
            requestAnimationFrame(() => {
                if (contentNode.scrollHeight > MAX_HEIGHT) {
                    contentNode.classList.add('msg-collapsed');

                    // Create the button
                    const button = document.createElement('button');
                    button.className = 'toggle-fold-btn';
                    button.innerText = '▼ Show more';

                    // Logic to expand/fold
                    button.addEventListener('click', () => {
                        const isFolded = contentNode.classList.contains('msg-collapsed');

                        if (isFolded) {
                            contentNode.classList.remove('msg-collapsed');

                            // Remove the fade effect when expanding
                            contentNode.style.webkitMaskImage = 'none';
                            contentNode.style.maskImage = 'none';

                            button.innerText = '▲ Show less';
                        } else {
                            contentNode.classList.add('msg-collapsed');

                            // Restore the fade effect when folding
                            contentNode.style.webkitMaskImage = '';
                            contentNode.style.maskImage = '';

                            button.innerText = '▼ Show more';
                        }
                    });

                    // Insert the button at the end of the message container
                    messageContainer.appendChild(button);
                }
            });
        });
    }

    // Observer to detect when ChatGPT loads new messages
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;

        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }

        if (shouldProcess) {
            // Small delay to avoid performance issues while typing
            clearTimeout(window.foldDebounce);
            window.foldDebounce = setTimeout(processMessages, 300);
        }
    });

    // Start observing the chat
    observer.observe(document.body, { childList: true, subtree: true });

    // Process existing messages when the page first loads
    setTimeout(processMessages, 1000);
})();
