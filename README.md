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

Final checks on 2026-09-19 cover JavaScript syntax, local references, semantic IDs,
all translation keys, theme token contrast, API contracts, preference failures,
menu controls, request serialization, timeout recovery and sanitizer boundaries.
Sanitizer tests inspect the options and plain-text fallback with mocked libraries;
they do not replace browser XSS tests against the pinned CDN libraries.

## Progress

- Phase 0: safe chat rendering, request serialization, mobile cascade, localized identity and honest contact behavior.
- Phase 1: three JavaScript modules, one initialization path, semantic localization keys and optional preference storage.
- Phase 2: projects before skills, separate experience, concise education and grouped stack.
- Phase 3: system typography, neutral themes with a green accent, compact hero, responsive content and integrated chat. Removed decorative animations, old card styles, font/icon CDNs and placeholder avatar.
- Phase 4: native section anchors with measured header offset, clear Formspree handoff, 90-second chat timeout and retained input on failure. No automatic retries; browser abort does not guarantee cancellation of server-side LLM work.
- Phase 5: skip link, named chat region/log, explicit input label, keyboard-scrollable code/tables, stronger border contrast, no-JavaScript navigation, canonical URL and nonblocking optional Markdown scripts.
- Refinement: one hero action, a secondary GitHub link after the two selected projects, compact social links in the footer, and technologies framed as project/coursework experience. AI & NLP separates core areas from representative tools without proficiency claims.

Refinement verification: all EN/TR keys and existing checks pass. Focused checks
confirm link destinations, retained contact options, Neo4j, unchanged responsive
rules, chat source and Formspree form. Mobile review is source-only.

The final content pass removes the header subtitle, uses the owner's confirmed
final-year identity, and describes both roles as Software Engineering Intern.
Both experience rows use a date column followed by company, role and contribution.
The stack and visual system are unchanged. Antepe is the third selected project;
only its owner-confirmed name and course context are published pending identity
confirmation against the public AntAPP repository.

Browser automation was unavailable during these changes. Rendered verification remains required.

## Remaining verification and assets

- Check 320, 375, 430, 768, 1024px and desktop widths in both languages and themes. Inspect long Turkish labels, header wrapping, projects, contact and chat, including the mobile keyboard.
- Use keyboard-only navigation: skip link, mobile menu open/link/Escape, theme/language controls, chat open/close/Escape, long code blocks and tables. Check screen-reader announcements for loading and replies, and reduced motion.
- With a local mocked chat response, inspect Markdown links, code, tables and malicious HTML/protocol payloads in a real browser. Repeat with the CDN blocked; replies should remain plain text.
- Confirm navigation and native contact fields work with JavaScript disabled. A controlled live check is still needed for Render cold starts and Formspree delivery; automated checks never submit to either production service.
- Supply an approved favicon and social preview image later. No missing or fabricated image references are published.
- Confirm Antepe's repository identity before adding its purpose, technologies, contribution or links. The available public course-project README is titled AntAPP, and the mapping is unconfirmed.
- Confirm GiraffeGraph contribution wording and SAN TSG / Paximum's exact date range. Source limits are recorded below.

## Content sources and limits

Reviewed on 2026-09-18; updated with the owner's refinement instructions:

- [TripMate README](https://github.com/ulukayalperen7/san-tsg-internship/blob/main/README.md): project purpose, Sanifest team membership, stack, public site URL, and backend-only external travel integration. The [project report](https://github.com/ulukayalperen7/san-tsg-internship/blob/main/docs/REPORT.md) assigns Alperen backend/TourVisio and Scrum coordination responsibilities. His [administrative-feature fix](https://github.com/ulukayalperen7/san-tsg-internship/commit/0b211adf0e0db0464540fac07800584df592e23c) supports concrete work beyond the report's older planned scope. The owner also explicitly confirmed these areas. No sole ownership, impact metrics or individual testing/deployment accomplishments are inferred.
- [GiraffeGraph README](https://github.com/GiraffeGraph/giraffegraph-core/blob/main/README.md): extraction/validation/review workflow, development status, Python commands, PostgreSQL and Neo4j. The portfolio owner supplied this project as relevant work. Alperen's exact contribution/title was not independently verified, so none is published.
- Talya company and dates come from the existing portfolio. Alperen's [Talya showcase](https://github.com/ulukayalperen7/WELCOME-TALYA-2025/blob/master/index.html) links his [AI API project](https://github.com/ulukayalperen7/AI-API-project). Its README, package.json and src/services/template.service.ts confirm Node.js/TypeScript, Gemini/OpenAI, Prisma/PostgreSQL, templates, validation and model checks. Commits attributed to his GitHub account during the internship corroborate [TypeScript migration](https://github.com/ulukayalperen7/AI-API-project/commit/81a910556b6e2f0ba73edbcb4bed5883367cb925), [OpenAI/model selection](https://github.com/ulukayalperen7/AI-API-project/commit/d3163b25c85084e9d7ba5e4e998af9b08b464efb) and [validation](https://github.com/ulukayalperen7/AI-API-project/commit/4f03bc7bb81b89026020423f54bf112b518d3f5b). The internship association is supported by the showcase links and dates, not repository ownership alone. Another person's chatbot README is not attributed to Alperen.
- SAN TSG / Paximum and 2026 come from the owner's instructions. Both entries use the owner-approved descriptive role “Software Engineering Intern”; SAN's exact date range is not established, so only the year is published.
- Education comes from the existing portfolio; Angular and FastAPI are supported by the existing public profile, React/PostgreSQL by TripMate. No proficiency percentages, metrics, current employment status or seniority are inferred.
- The owner explicitly confirmed project/coursework use of LLM integration, NLP, prompt engineering, Gemini API, LangGraph, CrewAI and AutoGen for the refinement pass. The framework list is representative, not an exhaustive list or a mastery claim.
- Antepe's name and Software Engineering course context come from the owner. The [AntAPP README](https://github.com/ulukayalperen7/AntAPP/blob/main/README.md) describes an Antalya route/community platform and its technologies, but does not identify it as Antepe. Those details and URLs are not assigned to Antepe without confirmation. No individual contribution is inferred. Internal employer details are not published.
