# tampermonkey-chatgpt-fold

A Tampermonkey userscript that allows you to **fold and unfold long user messages** in ChatGPT (chatgpt.com), adding a "Show more / Show less" button.

## Installation

1. Install the **Tampermonkey** extension:
   - Chrome/Chromium: https://www.tampermonkey.net/
   - Firefox: https://www.tampermonkey.net/

2. Create a new script in Tampermonkey.
3. Paste the contents of `chatgpt-fold-long-user-messages.user.js`.
4. Save the script.
5. Open https://chatgpt.com/ and test it with a long message.

## How it works

- Detects user messages (`data-message-author-role="user"`).
- If the content exceeds a certain height, it **folds** it and adds a button to unfold or fold it again.

## Quick settings

In the script you can modify:
- `MAX_HEIGHT` (in px): the height above which messages are folded.
- `max-height` in the CSS (`.msg-collapsed`): the visible height when folded.

## Compatibility

- Designed for: `https://chatgpt.com/*`
- If you use a different domain (e.g., the old one), add another `@match` rule.

## License

MIT
