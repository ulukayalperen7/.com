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
- Phase 2: projects before skills, separate experience, concise education and grouped stack.
- Phase 3: system typography, neutral themes with a green accent, compact hero, responsive content and integrated chat. Removed decorative animations, old card styles, font/icon CDNs and placeholder avatar.
- Phase 4: native section anchors with measured header offset, clear Formspree handoff, 90-second chat timeout and retained input on failure. No automatic retries; browser abort does not guarantee cancellation of server-side LLM work.

Browser automation was unavailable during these changes. Rendered verification remains required.

## Content sources and limits

Reviewed on 2026-09-18:

- [TripMate README](https://github.com/ulukayalperen7/san-tsg-internship/blob/main/README.md): project purpose, Sanifest team membership, stack, public site URL, and backend-only external travel integration. Planned MVP items are not presented as individual accomplishments. No individual feature ownership is claimed.
- [GiraffeGraph README](https://github.com/GiraffeGraph/giraffegraph-core/blob/main/README.md): extraction/validation/review workflow, development status, Python commands, PostgreSQL and Neo4j. The portfolio owner supplied this project as relevant work. Alperen's exact contribution/title was not independently verified, so none is published.
- Talya company, dates and full-stack internship context come from the existing portfolio. No project from another person's forked README is attributed to Alperen.
- SAN TSG / Paximum and 2026 come from the owner's explicit instructions. TripMate's public README confirms the internship context; an exact official title and date range are not established. The public entry says only “Internship”.
- Education comes from the existing portfolio; Angular and FastAPI are supported by the existing public profile, React/PostgreSQL by TripMate. No proficiency percentages, metrics, current employment status or seniority are inferred.
- AntAPP and the portfolio assistant were considered, but the selected work remains focused on the two requested projects. Internal employer details are not published.
