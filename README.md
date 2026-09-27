# notes.nagi.tw

Life, Security, Projects, and Research: personal writing, technical exploration, things built, and current research questions.

## Content

- Every edition has exactly one primary frontmatter category: `life`, `security`, `projects`, or `research`.
- Categorize by primary purpose, not tags or existing folders. Folder names remain for stable collection identities and compatibility.
- Tags supply detailed Topics across categories; old topic URLs remain available.
- `/experience/` is a separate chronological event index, not an article category.
- `public/assets/images/` contains shared article assets.

Language variants share one category. Chinese uses `name.md`, English uses `name.en.md`, and Japanese uses `name.ja.md`. Keep article bodies, slugs, translation keys, and publication flags unchanged during taxonomy edits.

See [migration-report.md](migration-report.md) for provenance, metadata changes, and validation notes.

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

Production files are generated in `dist/`. Deployment targets `https://nagi.tw/`; unpublished articles are excluded from routes, indexes, RSS, and sitemap generation.
