# Final pre-production compatibility pass

No deployment, push, DNS, Cloudflare, repository setting or workflow change was performed. Redirect artifacts remain under `docs/redirects/`, outside the production build. This report supersedes the unresolved Contact/Chinese-prefix items in the earlier migration report.

## Legacy routes

- All 229 original mapping rows retained and classified. 215 preserve their relative path, 14 require a language-prefix change. Old hosts still require redirects even where paths are identical.
- Complete expanded inventory: A = 228 exact production URLs (219 HTML pages, four public assets, five endpoints); B = 1,308 deterministic redirects/aliases; C = three recorded dated URLs for an unpublished article; D = three unrecorded URL families requiring actual URL evidence, not executable wildcard rules.
- B separates 735 Notes paths, 80 old primary-host paths, and 493 GitHub-owned origin paths. Counts include slashless/static-index/filename aliases and should not be read as observed production traffic.
- All ten old source-defined primary routes have a resolution: five root pages remain and their five `/zh/...` forms have direct mappings. `/contact/` now preserves the prior public email/GitHub details, with English/Japanese counterparts. Existing `/en/...` and `/ja/...` routes keep their paths. Article slugs remain unchanged.
- Exact known suffix routes and filename-style aliases map only to existing published language editions. Unknown filenames/slugs and unrecorded `/zh/*` are D, with no invented redirects.

## Notes plan

The review-only Notes Worker performs exact lookup, preserves query strings, returns a single permanent 301 to a validated final page, and returns 404 without Location for unknown/unpublished paths. The Bulk Redirect CSV is an alternative requiring a verified 404-only fallback. Neither is active. Fragment behavior requires browser smoke testing because fragments do not reach servers.

The primary-host Bulk CSV is separate. GitHub-owned URLs cannot be controlled by a Cloudflare rule for nagi.tw; their deterministic mapping is recorded separately for the later origin-level decision.

## Responsive and preservation results

Only structural wrapping/containment, mobile menu placement/gap, and article navigation sizing were adjusted. [Width-by-width source audit](responsive-readiness.md). Screenshot review is outstanding; **visual QA has not passed**.

31 article source files and three existing images remain byte-identical. The original penguin, its explicit colors, and its built copy match the SHA-256 baseline. No theme-dependent fill/filter rule or Hello-world interaction exists.

## Validation results

All passed:

- `npm run check`, `npm run build`: 219 pages; zero diagnostics.
- `npm run validate`: 26 public editions, unchanged publication exclusions.
- `validate-ui`, `validate-taxonomy`: structure/encoding/palette and 5,457 internal references.
- `validate-base-path`: 5,742 resolved local references, including assets/feed/search.
- `validate-i18n`: 219 pages, 73 per language; 657 language-switch destinations; sitemap, robots, canonical, hreflang and OpenGraph checks.
- `validate-language-urls`: 36 article locale pages, 108 switch targets, 14 translations and 10 exact Chinese fallbacks.
- `validate-primary-site`, `validate-preservation`, `test-rss`.
- `prepare-redirects.py --check`, `validate-preproduction`, `test-redirects`: reproducible manifests, terminal existing destinations, no chains/loops, exact per-host CSV source sets, production branding and parsed structured data, original penguin, HTTP/HTTPS and query retention, unknown/unpublished 404.
- `npm run validate:runtime`: 207 context/query/hash switches, 219 HTTP 200 routes, filters/translations/fallbacks, three locales at 320/375/390/768/1024/1440px; no runtime/network errors.

The stale-branding scan exempts only rendered historical article prose. Site UI, metadata, sitemap, robots, RSS and JSON-LD pass with the new identity/origin. No historical source articles were changed.

## Exact remaining gates

1. Confirm actual GitHub Pages/Cloudflare account setup, proxy/certificate readiness, deployment gating and redirect capabilities. The existing workflow deploys pushes to `main`; this pass did not inspect account settings.
2. Choose and test a GitHub-origin compatibility solution for `seraphforge.github.io` URLs. Their targets are known; the nagi.tw Cloudflare zone cannot serve their redirects.
3. Reconcile the local route inventory with actual deployed sitemap/access-log evidence. Supply concrete URLs for the three D families if they have historical traffic; otherwise leave misses 404.
4. Complete manual visual review at the four requested widths.
5. Separately authorize publication, custom-domain transfer, redirect activation and DNS changes using [production-cutover.md](production-cutover.md), with the documented rollback artifacts retained.
