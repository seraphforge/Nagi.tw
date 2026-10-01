# Site-wide i18n implementation plan

Implement the supplied locale-prefix specification in the current workspace.

- [ ] Add a failing generated-output test for three complete locale trees.
- [ ] Centralize UI translations, locale detection, route URLs, topic labels and dates.
- [ ] Render shared page templates through one static route manifest: default Chinese, en, ja.
- [ ] Render each article group in all locales, selecting existing translations or Chinese fallback; preserve all Markdown bytes.
- [ ] Replace preference/filter switching with same-context locale navigation, including query and hash.
- [ ] Emit locale-specific metadata, canonical and reciprocal hreflang on every page.
- [ ] Update RSS/search links, robots/sitemap checks and existing validation scripts.
- [ ] Run npm ci, build, base-path, multilingual, browser and existing regression validation.

Constraints: no CSS or visual redesign; no workflow edits; no commits or pushes; no generated article translations. Retain topic slugs and legacy topic indexes. Remove suffix-language article routes. Verify non-root deployment, missing translations, Unicode topic slugs, empty categories, and query/hash preservation.
