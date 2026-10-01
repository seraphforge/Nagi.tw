# Inactive compatibility artifacts

Nothing in this directory is copied to `dist/`, imported by the Astro app, or activated by its workflow. No production rules, DNS records, repository settings, or deployment jobs were changed.

The repository workflow establishes **GitHub Pages** as the origin. **Cloudflare edge redirects** are the prepared assumption, not a verified account configuration. Confirm that hosting choice and available account capabilities before using these artifacts.

## Inventory and classification

Run after building:

```sh
python scripts/prepare-redirects.py
python scripts/prepare-redirects.py --check
node scripts/validate-preproduction.mjs
node scripts/test-redirects.mjs
```

`manifest.json` is authoritative; `classified-routes.csv` is its readable equivalent. The original 229 rows in `../legacy-url-map.csv` retain their old/new URL columns and now have classification and path-compatibility columns.

| Category | Meaning | Entries |
| --- | --- | ---: |
| A | Exact current production URL exists | 228 |
| B | Redirect required; final destination exists | 1,308 |
| C | Intentionally not public; no redirect | 3 |
| D | Unrecorded URL families needing evidence/confirmation | 3 |

A includes 219 pages, four public assets and five endpoints. B includes exact slashless and index aliases, not 1,308 independently observed historical URLs. All original Notes/GitHub URLs are B because their host/base changes; 215 of the original mapping rows have A path compatibility and 14 have B language-path compatibility.

The 14 known translated suffix routes map `/articles/{slug}/{en|ja}/` to `/{en|ja}/articles/{slug}/`. Filename-style `/{slug}.en/`, `.en.html`, `.ja/` and `.ja.html` aliases are limited to the exact public slug and an existing translation; these are deterministic compatibility conveniences, not claims that each was deployed. No general suffix-regex redirect is provided. Unknown slugs, source filenames that differ from slugs, and other `*.en.*`/`*.ja.*` forms remain D until actual URLs are supplied.

All ten source-defined old primary routes are resolved: `/`, `/research/`, `/projects/`, `/experience/`, `/contact/` remain; their five `/zh/...` equivalents have direct root-language targets. `/contact/` preserves the previous public email and GitHub link. Root sections intentionally retain the approved Chinese default, even though the old root UI was English; `/en/...` remains available. No blanket `/zh/*` rule exists.

C records the three old dated URLs of `from-nihscsed-to-control-team`, which remains unpublished. Leave them 404; do not publish the article or redirect it to an unrelated page. D contains review patterns, not executable rules or identified missing content.

## Notes subdomain: exact 301 allowlist

`notes-worker.mjs` and generated `notes-routes.mjs` are the recommended review-only Notes redirect service. Later bind it **only to `notes.nagi.tw`**, never `*.nagi.tw` or `nagi.tw`. It is a redirect/error handler, not a second frontend.

- 735 exact paths; HTTP/HTTPS and GET/HEAD map directly to the final HTTPS destination.
- Query strings retain encoded values and repeated parameters. Fragments never reach the server; ordinary browser redirect fragment inheritance should be smoke-tested with real article anchors.
- Existing same-path article, language, topic, archive, endpoint and public-asset paths stay identical apart from origin and canonical trailing slash.
- Known suffix exceptions go directly to their language-prefix target, without an intermediate root-language redirect.
- Unknown paths, unpublished content, unknown assets, unsupported language filenames and unrecorded `/zh/*` return **404 without Location**. Non-read methods return 405.
- Never fetch the old GitHub origin on a miss: an origin host redirect could otherwise redirect an unknown URL blindly.
- Old hashed `/_astro/*` files are deliberately not allowlisted: they are build-specific, not permanent article assets. Missing files return 404; old cached pages need a fresh reload.

`cloudflare-notes.csv` is an alternative Bulk Redirect import containing the same 735 exact matches. If using it instead of the Worker, provide an independently verified 404-only fallback for misses. Do not combine it with a wildcard host redirect. Prefer the Worker when the account's Bulk Redirect quota or fallback setup is unsuitable. Do not activate both approaches unnecessarily.

## Primary-host legacy paths

`cloudflare-primary.csv`: 80 exact entries for the five `/zh/...` routes and known language aliases (including slashless variants). Import as a disabled/review-only list first during the later authorized cutover. Preserve the UI-generated list lookup rule and confirm its behavior with Cloudflare Trace. Never add a redirect for an A URL, especially `/`, `/en/`, `/ja/`, or `/contact/`.

CSV files have no header and use: source, target, `301`, `TRUE` (query), `FALSE` (subdomains), `FALSE` (subpaths), `FALSE` (suffix). Scheme-free sources match HTTP and HTTPS. This follows the official [CSV format](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/reference/csv-file-format/) and [redirect parameter documentation](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/reference/parameters/). Account limits and existing rules are not inspected or assumed. Check for earlier Single Redirect/Page Rules that could preempt the intended exact matching.

## GitHub-owned hostname: separate blocker

`github-origin-review.csv` records 493 exact aliases on `seraphforge.github.io`, including the old repository base and documented Hexo dated URLs. They have deterministic destinations but **cannot be installed in the nagi.tw Cloudflare zone**, which does not control github.io.

GitHub Pages' custom-domain behavior must be tested after authorized configuration; do not assume arbitrary path redirects or `_redirects` support. If old paths remain unresolved, choose a separately approved GitHub-origin compatibility strategy. A static HTML redirect page is not an HTTP 301; do not claim equivalence. No fallback pages, origin changes or repository archives were created here. Consult [GitHub custom-domain configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Regeneration and safety

Build, regenerate, test, and review the diff before importing a manifest. Every B target must exist in `dist/`, and must be an A terminal destination; the validator rejects chains/loops. Never add a destination derived only from an unknown incoming string. Keep C/D entries out of import files. Re-run this process when articles are unpublished or routes change, so an old allowlist cannot point at removed pages.
