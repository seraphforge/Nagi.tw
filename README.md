# Nagi.tw

Hong Xin-Fu / Nagi — Security · Systems · Research. This repository is the main personal website for **https://nagi.tw/**, built as one static Astro application.

Home, Research, Projects, Experience, Articles, and About form the primary navigation. Topics and Archive are secondary indexes. Research and project selections are explicitly curated from public article evidence in `src/lib/portfolio.ts`, with translated summaries in `src/i18n/profile.ts`; category tags do not automatically create portfolio entries. Home Lab is not a featured project.

The homepage connects identity, current interests (dated to the latest public update), featured research/projects, recent articles, and experience. The original penguin SVG is a small, fixed-color brand signature.

## Content

- Every edition has exactly one primary frontmatter category: `life`, `security`, `projects`, or `research`.
- Categorize by primary purpose, not tags or existing folders. Folder names remain for stable collection identities and compatibility.
- Tags supply detailed Topics across categories; old topic URLs remain available.
- `/experience/` is a separate chronological event index, not an article category.
- `public/assets/images/` contains shared article assets.

Language variants share one category. Chinese uses `name.md`, English uses `name.en.md`, and Japanese uses `name.ja.md`. Keep article bodies, slugs, translation keys, and publication flags unchanged during taxonomy edits.

See [migration-report.md](migration-report.md) for provenance, metadata changes, and validation notes.

See [the primary-site migration report](docs/primary-site-migration.md) and [legacy URL inventory](docs/legacy-url-map.csv) for this domain migration. Earlier migration documentation remains historical evidence.

The [manual production cutover checklist](docs/production-cutover.md), [inactive redirect artifacts](docs/redirects/README.md), and [responsive readiness audit](docs/responsive-readiness.md) cover the final compatibility pass. Contact details from the previous primary site are retained at `/contact/` and its language counterparts. None of the redirect artifacts are active or included in the site build. Visual screenshot QA remains outstanding.

## Development

This site uses Astro with a typed content collection and static output.

```sh
npm install
npm run dev
npm run build
npm run validate
node scripts/validate-ui.mjs
node scripts/validate-taxonomy.mjs
# Against a running local server:
npm run validate:runtime
```

Production files are generated in `dist/`, with `site: 'https://nagi.tw'` and `base: '/'`. Unpublished articles are excluded from routes, indexes, RSS, sitemap, and curated portfolio selections. This is codebase preparation only: no DNS, host settings, or deployment changes have been made. The existing workflow still deploys pushes to `main`; coordinate the production cutover before pushing there.

RSS uses production absolute URLs and retains all published editions. Feed generation errors emit a diagnostic and a valid empty fallback feed so unrelated pages can build. The validation suite rejects an unexpectedly empty feed; inspect and fix feed diagnostics before release.


## Site-wide languages

The URL determines the interface language. Traditional Chinese uses the base
route, English uses `en/`, and Japanese uses `ja/`. Article URLs are
`articles/{slug}/`, `en/articles/{slug}/`, and `ja/articles/{slug}/` underneath
the configured Astro base. Language suffix routes are no longer generated.

`src/i18n/ui.ts` owns interface translations; `routes.ts` owns URL generation
and locale detection; `helpers.ts` localizes dates; `topics.ts` translates topic
labels without changing slugs. `manifest.ts` generates the three complete route
trees through `src/pages/[...path].astro` and shared `src/views/` templates.

Each public article has a page in every locale. Existing translations are used
as-is. Missing translations display the original Chinese body with a translated
notice while keeping the selected interface language. No article bodies are
machine-translated. Header switching preserves the page, query string and hash;
storage never overrides the locale URL. Every page declares its canonical URL
and `zh-Hant`, `en`, `ja`, and `x-default` alternates.

```sh
npm ci
npm run build
node scripts/validate-base-path.mjs
node scripts/validate-i18n.mjs
node scripts/validate-language-urls.mjs
npm run validate
node scripts/validate-ui.mjs
node scripts/validate-taxonomy.mjs
node scripts/validate-primary-site.mjs
node scripts/validate-preservation.mjs
node scripts/test-rss.mjs
python scripts/prepare-redirects.py --check
node scripts/validate-preproduction.mjs
node scripts/test-redirects.mjs
npm run preview
# In another terminal, with the preview server running:
npm run validate:runtime
```

The runtime check uses a temporary headless Chromium profile and verifies
context-preserving switches, query/hash retention, translations and fallbacks,
all generated locale pages over HTTP, category filtering, and mobile overflow.
