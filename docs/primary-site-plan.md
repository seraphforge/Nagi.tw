# Nagi.tw primary-site preparation

## Design and scope

Extend the existing static Astro app and its shared locale dispatcher. Traditional Chinese stays at the root, English at /en/, Japanese at /ja/. Keep content collection schemas, translation selection, publication flags, article bodies, slugs, taxonomy and experience records intact. Add curated research and projects views; never derive a portfolio from article category tags. Use the existing typography and palette with a compact identity introduction and unchanged penguin SVG copied from the adjacent personal-site checkout.

## Audit

- astro.config.mjs: GitHub Pages origin and /notes.nagi.tw base.
- package.json/package-lock.json: nagi-notes package identity.
- BaseLayout: Nagi Notes title suffix and RSS label; missing Twitter and structured metadata.
- SiteHeader/Home: Notes identity and blog-only navigation/home layout.
- SiteFooter/About: duplicate homepage links and wording implying separate sites.
- rss.xml.js: Notes feed identity; serializer errors can stop the entire build.
- validate-ui: requires Notes-only homepage and rejects portfolio sections.
- validate-base-path: incorrectly rejects all nagi.tw URLs for this migration.
- validate-i18n: hard-coded old page counts and footer wording.
- Other URL checks already derive their origin/base from config; keep that behavior.
- README describes temporary GitHub Pages deployment. Historical migration documents retain legacy origins intentionally.
- No old-domain assumptions found in article assets or current article source URL references.
- Existing deployment workflow automatically deploys pushes to main. Leave it untouched; do not push this preparation.

## Implementation sequence

1. Add migration regression checks; record existing article/asset hashes and pre-migration routes.
2. Set root production origin and package/site metadata; retain generic URL helpers.
3. Add translated, explicitly curated research/project records backed by public articles; reuse them on the homepage and section pages.
4. Update header, footer, about integration, penguin and SEO. Isolate RSS serialization failure with an explicit diagnostic and valid fallback feed.
5. Update validation expectations, audit every generated local URL and asset, test RSS failure behavior, run check/build/static/browser checks.
6. Document exact legacy route mappings, preservation evidence, files changed and production blockers. No deployment, DNS, repository settings or old-site changes.

## Review focus

Publication filtering; locale fallback bodies; root vs old base; RSS errors; duplicate navigation; mobile overflow; unsupported claims; unchanged article and asset bytes. Preserve all pre-existing uncommitted changes.
