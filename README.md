# Alperen Ulukaya — portfolio frontend

Static HTML, CSS and native JavaScript modules. No package installation or build step.

Run a local HTTP server (modules do not run from `file://`):

```sh
python -m http.server 5501
```

Open `http://localhost:5501`. Deploy the directory unchanged to a static host.

- `index.html`: semantic content and English defaults.
- `js/i18n.js`: Turkish translations and language switching.
- `js/main.js`: initialization, theme and navigation.
- `js/chat.js`: session, requests and safe chat rendering.
- `css/style.css`, `css/chat.css`: page and chat presentation.

English text lives in HTML; each translated field has a semantic `data-i18n` key.
Matching Turkish keys live in `i18n.js`. Never publish inferred roles, metrics or links.
Only theme and language preferences are stored locally; conversation state is in memory.

## Verification

```sh
python -B tests/check.py
node tests/interactions.cjs
```

The interaction checks use a minimal DOM mock. They do not prove browser layout,
accessibility-tree behavior, sanitizer behavior in a browser, or delivery to external services.
Do not submit test messages to the production APIs during automated checks.

## Progress

- Phase 0: safe chat rendering, request serialization, mobile cascade, localized identity and honest contact behavior.
- Phase 1: three JavaScript modules, one initialization path, semantic localization keys and optional preference storage.

Browser automation was unavailable during these changes. Rendered verification remains required.
