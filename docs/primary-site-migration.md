# Nagi.tw primary-site migration report

Prepared 2026-09-30. Codebase preparation only; nothing deployed or pushed. DNS, Cloudflare, repository settings, the deployment workflow, and the adjacent old `nagi.tw` repository were not modified.

Follow-up: [final pre-production compatibility report](preproduction-report.md) resolves Contact and the known Chinese-prefix routes and provides inactive redirect artifacts. Counts/results below describe the initial migration stage; the follow-up includes three Contact pages and expanded validation.

## 1. Architecture

One static Astro application now serves `/`, `/about/`, `/projects/`, `/research/`, `/experience/`, `/articles/`, `/topics/`, and `/archive/`. The existing catch-all route dispatcher, typed collection, article grouping, search index, taxonomy, RSS and sitemap remain. Each section exists in Traditional Chinese, English and Japanese: 216 generated pages, 72 per locale.

Primary navigation: Home, Research, Projects, Experience, Articles, About. Topics, Archive and RSS are in the footer. Redundant links suggesting a separate Notes product were removed.

## 2. Homepage

Compact identity introduction: **Hong Xin-Fu / Nagi**, **Security · Systems · Research**. Includes Currently, Featured Research, Featured Projects, three recent article groups, and an experience preview. Current interests are explicitly dated to the latest public update (2026-09-04), rather than implying independently verified present-day progress.

Two research directions are supported by article bodies: clinical requirements for healthcare security, and offline AI/system permissions. Each states its area, question, documented status, and source article. No publications, measurements, acceptance, awards or DOI claims were added. No related project is asserted where the source does not establish one.

The single project selection is a descriptive index entry for the Raspberry Pi Linux setup documented in `articles/projects/recent-projects-and-life-update.md`. It describes configuration/debugging work, not a finished product or new named invention. Home Lab is not promoted. Article categories are not used as portfolio membership rules.

The 24px penguin and favicon reuse the unchanged SVG from the adjacent personal-site checkout. It uses its original fixed colors, without theme recoloring or new interaction.

## 3. Domain and base

`astro.config.mjs`: `site: 'https://nagi.tw'`, `base: '/'`, static output and trailing slashes preserved. Existing `withBase`, locale URL and article URL helpers work at the root. No new frontend or hosting redirects were created.

## 4. Branding

Updated header, page title suffix, feed title, footer integration, homepage and README. Package identity is `nagi-tw`; dependency versions and dependency behavior are unchanged. Historic repository names and legacy domains remain in migration documentation and redirect inventories intentionally. Historical article bodies are untouched.

## 5. Article and asset preservation

All **31 article source files and three original images** are byte-identical to the pre-migration snapshot. SHA-256 inventory: [content-preservation.json](content-preservation.json). Run `node scripts/validate-preservation.mjs` to reproduce this migration-specific check; intentionally editing content later requires reviewing/updating that baseline.

Retained 13 logical article groups: 12 public and one unpublished. All 26 public editions remain (12 Chinese, five English, nine Japanese). Dates, categories, tags, translation keys, slugs, publication flags and article bodies were not edited. The experience view and its uncertain historical dates were not changed.

## 6. Multilingual preservation

Traditional Chinese stays at `/`; English at `/en/`; Japanese at `/ja/`. Existing filename relationships and source translations remain. There are 36 article pages: 26 actual editions and 10 exact Chinese-body fallbacks with localized notices. Locale switching keeps the route, query string and fragment.

This checkout already contained extensive uncommitted multilingual work before the migration. Its route dispatcher and prefix-based locale scheme were preserved. The deleted individual page files shown by `git status` predate this task; their views were already moved into `src/views/`.

## 7. SEO

All generated canonical, OpenGraph, hreflang, x-default, RSS, sitemap and robots URLs use the new production origin. Added Twitter card metadata and Person/WebSite JSON-LD identifying Hong Xin-Fu / Nagi and Nagi.tw. Every generated locale page remains in the sitemap and has a resolvable language-switch target. Existing fallback-page canonical/hreflang behavior is retained.

## 8. RSS

Feed title is Nagi.tw; links use the domain root and preserve published language editions. There are 26 feed items. A tested failure boundary logs a diagnostic and emits a valid empty RSS feed if serialization fails, allowing unrelated static pages to build. Release validation still rejects missing items, so a fallback feed must be repaired before production switching. Readers may treat changed absolute link-based identifiers as new items after the origin migration.

## 9. Legacy URL considerations

[legacy-url-map.csv](legacy-url-map.csv) inventories both old Notes and temporary GitHub Pages URLs and their intended production destinations:

- 210 existing locale routes retain their paths unchanged; only host/base changes.
- Five generated endpoints retain their paths, including RSS and sitemap files.
- 14 older published English/Japanese suffix URLs need explicit review: `/articles/{slug}/en/` → `/en/articles/{slug}/`, and `/articles/{slug}/ja/` → `/ja/articles/{slug}/`. These are present in committed `HEAD` but had already been replaced by the uncommitted i18n work. No suffix redirects were activated.
- Original assets remain at `/assets/images/{filename}`. Future host/base redirects should preserve paths, queries and fragments where the hosting mechanism permits.
- Still older Hexo date-based paths remain documented in the untouched root [migration-report.md](../migration-report.md). Review those mappings before configuring redirects; do not expose unpublished posts.

The adjacent old primary-site checkout also has `/contact/`, `/zh/`, `/zh/research/`, `/zh/projects/`, `/zh/experience/`, and `/zh/contact/`. These are not routes in the new app. Its unprefixed pages are English, whereas this repository's unprefixed pages remain Chinese. This is a pre-cutover compatibility decision: decide how to retain contact information and map old primary-site URLs without changing the requested default locale. The local checkout is evidence of candidate URLs, not proof of what is currently deployed.

## 10. Files changed by this migration

- Configuration/identity: `astro.config.mjs`, `package.json`, `package-lock.json`, `README.md`.
- Integration: `src/i18n/manifest.ts`, `src/i18n/ui.ts`, `src/pages/[...path].astro`, `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/views/Home.astro`, `src/views/About.astro`.
- New main-site content: `src/i18n/profile.ts`, `src/lib/portfolio.ts`, `src/components/PortfolioList.astro`, `src/views/Research.astro`, `src/views/Projects.astro`, `public/nagi-penguin.svg`.
- Feed: `src/pages/rss.xml.js`, `src/lib/rss.mjs`.
- Validation: `scripts/validate-ui.mjs`, `scripts/validate-base-path.mjs`, `scripts/validate-i18n.mjs`, `scripts/validate-language-runtime.mjs`; new `scripts/validate-primary-site.mjs`, `scripts/validate-preservation.mjs`, `scripts/test-rss.mjs`.
- Documentation/evidence: this report, `docs/primary-site-plan.md`, `docs/legacy-url-map.csv`, `docs/content-preservation.json`.

Other files shown as dirty in Git belonged to the pre-existing multilingual implementation. No commits were created.

## 11. Validation

Passed locally (Windows uses `npm.cmd` because PowerShell blocks `npm.ps1`):

| Check | Result |
| --- | --- |
| `npm run check` / `npm run build` | 216 pages; build diagnostics: zero errors, warnings or hints |
| `npm run validate` | 26 public article editions; unpublished content excluded |
| `validate-ui` | Main-site structure, existing palette/contrast and UTF-8 checks pass |
| `validate-taxonomy` | Taxonomy/publication and 5,181 references pass |
| `validate-base-path` | 5,463 local references resolve at root |
| `validate-i18n` | 216 pages, 648 switch targets, metadata/sitemap/robots pass |
| `validate-language-urls` | 36 pages, 108 switch targets, 14 translations and 10 exact fallbacks |
| `validate-primary-site` | Core routes, identity, metadata, project scope and 26 RSS items |
| `validate-preservation` | 34 source/asset files unchanged |
| `test-rss` | Successful response and forced failure isolation pass |
| `npm run validate:runtime` | 198 context/query/hash switches; 216 HTTP 200 routes; filters and all three locales at 320px/390px; no runtime/network errors |

The in-app Browser connection reported no available browser, so visual screenshot review could not be completed through that tool. The existing headless browser runtime validator ran successfully.

## 12. Before production switching

No code/build failure currently blocks preparation. Production switching still requires a separately authorized hosting cutover and review of the legacy routes above, particularly old suffix-language URLs and the old primary site's contact/Chinese-prefix pages. Review the uncommitted multilingual changes with this migration before publishing. Configure redirects only after resolving compatibility and verifying the actually deployed old URL inventory.

The unchanged GitHub workflow deploys on pushes to `main`; pushing there is not a safe review-only action. No push, DNS change, Cloudflare action, repository-setting change, deployment, or archive/deletion of the old primary repository was performed.
