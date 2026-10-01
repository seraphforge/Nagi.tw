"""Generate review-only inventories/imports. Never writes public/ or hosting config."""
import csv
import io
import json
import re
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
OUT = ROOT / 'docs' / 'redirects'
check = '--check' in sys.argv
entries = {}


def url(host, path):
    return 'https://' + host + quote(unquote(path), safe='/-._~')


def add(source, target, category, reason, evidence):
    row = dict(source=source, target=target, category=category, reason=reason, evidence=evidence)
    if source in entries:
        assert entries[source]['target'] == target and entries[source]['category'] == category, source
        return
    entries[source] = row


def redirects(host, path, target, reason, evidence):
    paths = [path]
    if path.endswith('/') and path != '/':
        paths.append(path[:-1])
    for alias in paths:
        add(url(host, alias), target, 'B', reason, evidence)


pages = sorted('/' + p.relative_to(DIST).as_posix().removesuffix('index.html') for p in DIST.rglob('index.html'))
assets = sorted('/' + p.relative_to(ROOT / 'public').as_posix() for p in (ROOT / 'public').rglob('*') if p.is_file())
endpoints = ['/rss.xml', '/search-index.json', '/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml']
paths = pages + assets + endpoints

# Every existing inventory row is classified. Keep its original columns/knowledge.
legacy_file = ROOT / 'docs/legacy-url-map.csv'
with legacy_file.open(encoding='utf-8', newline='') as f:
    legacy = list(csv.DictReader(f))
for row in legacy:
    target = row['new_url']
    target_path = unquote(urlsplit(target).path)
    assert target_path in paths, target
    old_path = unquote(urlsplit(row['old_notes_url']).path)
    row['category'] = 'B'
    row['path_compatibility'] = 'A' if old_path == target_path else 'B'
    row['resolution'] = 'same path; host/base redirect only' if old_path == target_path else 'known language suffix maps to published locale edition'
    for key in ['old_notes_url', 'old_github_pages_url']:
        source = urlsplit(row[key])
        redirects(source.netloc, source.path, url('nagi.tw', target_path), row['resolution'], 'legacy-url-map.csv')

for path in paths:
    target = url('nagi.tw', path)
    add(target, target, 'A', 'generated route or preserved public asset', 'dist / public inventory')
    redirects('notes.nagi.tw', path, target, 'allowlisted same-path domain cutover', 'dist / public inventory')
    if path in pages:
        redirects('notes.nagi.tw', path + 'index.html', target, 'explicit static index alias', 'generated index.html')

# All ten source-defined public routes of the previous primary site.
for path in ['/', '/research/', '/projects/', '/experience/', '/contact/']:
    assert path in pages
    old_zh = '/zh' + path
    redirects('nagi.tw', old_zh, url('nagi.tw', path), 'old explicit Chinese route; root remains Chinese', 'previous primary src/pages/zh/[...path].astro')

groups = json.loads((DIST / 'search-index.json').read_text(encoding='utf-8'))
for group in groups:
    for language, variant in group['variants'].items():
        if language not in ['en', 'ja']:
            continue
        target = url('nagi.tw', variant['url'])
        slug = variant['url'].strip('/').split('/')[-1]
        for host in ['nagi.tw', 'notes.nagi.tw']:
            redirects(host, f'/articles/{slug}/{language}/', target, 'known published language suffix', 'committed article URL helper / current public variants')
            for alias in [f'/articles/{slug}.{language}/', f'/articles/{slug}.{language}.html']:
                redirects(host, alias, target, 'deterministic filename-style compatibility alias; historic exposure unconfirmed', 'exact public slug and available translation only')

# Earlier dated URLs are recorded, not guessed from publication dates.
history = (ROOT / 'migration-report.md').read_text(encoding='utf-8')
for old in re.findall(r'`(https://seraphforge\.github\.io/[^`]+)`', history):
    path = urlsplit(old).path
    slug = path.strip('/').split('/')[-1]
    language = 'zh' if path.startswith('/zh/') else 'ja' if path.startswith('/ja/') else 'en'
    group = next((g for g in groups if g['key'] == slug), None)
    if group and language in group['variants']:
        redirects('seraphforge.github.io', path, url('nagi.tw', group['variants'][language]['url']), 'recorded Hexo permalink', 'migration-report.md canonical URL table')
    elif slug in ['from-nihscsed-to-control-team', 'why-i-still-use-codex']:
        add(old, '', 'C', 'intentionally not public; do not resurrect or redirect to unrelated content', 'publication flags or explicit article removal')
    else:
        add(old, '', 'D', 'no exact published edition found', 'migration-report.md')

# Non-exact patterns are review issues, never executable redirect rules.
for source, reason in [
    ('https://nagi.tw/zh/<unknown-path>', 'only the five source-defined /zh routes are deterministic; obtain old access logs before mapping others'),
    ('https://notes.nagi.tw/articles/<unknown-slug>.en.*', 'unknown slug or filename form; exact public slug aliases only'),
    ('https://notes.nagi.tw/articles/<unknown-slug>.ja.*', 'unknown slug or filename form; exact public slug aliases only'),
]:
    add(source, '', 'D', reason, 'requires actual legacy URL evidence / owner confirmation')

rows = sorted(entries.values(), key=lambda row: row['source'])
counts = dict(sorted(Counter(row['category'] for row in rows).items()))
manifest = dict(version=1, active=False, hosting='GitHub Pages origin (repository workflow); Cloudflare Bulk Redirects proposed at edge',
                policy='Exact allowlist only; 301; preserve query; unknown paths do not redirect; no wildcard/subpath matching',
                counts=counts, entries=rows)


def csv_text(rows):
    out = io.StringIO(newline='')
    csv.writer(out, lineterminator='\n').writerows(rows)
    return out.getvalue()


def save(path, text):
    if check:
        assert path.read_text(encoding='utf-8') == text, f'Stale generated artifact: {path}'
    else:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf-8')


save(legacy_file, csv_text([list(legacy[0])] + [list(row.values()) for row in legacy]))
save(OUT / 'manifest.json', json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
save(OUT / 'classified-routes.csv', csv_text([list(rows[0])] + [list(row.values()) for row in rows]))
for host, filename in [('notes.nagi.tw', 'cloudflare-notes.csv'), ('nagi.tw', 'cloudflare-primary.csv')]:
    # Protocol-free source matches HTTP and HTTPS; explicit false prevents prefix redirects.
    redirect_rows = [[row['source'].removeprefix('https://'), row['target'], 301, 'TRUE', 'FALSE', 'FALSE', 'FALSE']
                     for row in rows if row['category'] == 'B' and urlsplit(row['source']).netloc == host]
    save(OUT / filename, csv_text(redirect_rows))
external = [row for row in rows if row['category'] == 'B' and urlsplit(row['source']).netloc == 'seraphforge.github.io']
save(OUT / 'github-origin-review.csv', csv_text([list(rows[0])] + [list(row.values()) for row in external]))
notes_map = {urlsplit(row['source']).path: row['target'] for row in rows if row['category'] == 'B' and urlsplit(row['source']).netloc == 'notes.nagi.tw'}
save(OUT / 'notes-routes.mjs', '// Generated allowlist. Inactive: imported only by the review-only edge Worker.\nexport const notesRedirects = ' + json.dumps(notes_map, ensure_ascii=True, indent=2) + ';\n')
print(('Checked' if check else 'Prepared inactive') + f' redirect inventory: {counts}; {len(legacy)} original mapping rows retained')
