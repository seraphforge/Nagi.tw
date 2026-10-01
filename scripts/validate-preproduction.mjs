import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(new URL(`${entry.name}/`, dir)) : [new URL(entry.name, dir)]);
const read = (file) => readFileSync(file, 'utf8');
const manifest = JSON.parse(read(new URL('docs/redirects/manifest.json', root)));
assert.equal(manifest.active, false);
const bySource = new Map(manifest.entries.map(row => [row.source, row]));
assert.equal(bySource.size, manifest.entries.length);
const targetExists = (value) => {
  const url = new URL(value);
  assert.equal(url.origin, 'https://nagi.tw');
  assert.equal(url.search, '');
  const path = decodeURIComponent(url.pathname).replace(/^\//, '');
  return existsSync(new URL(path.endsWith('/') ? `${path}index.html` : path, dist));
};
for (const row of manifest.entries) {
  assert.ok(['A', 'B', 'C', 'D'].includes(row.category));
  if (row.category === 'A') { assert.equal(row.source, row.target); assert.ok(targetExists(row.target), row.source); }
  if (row.category === 'B') {
    assert.notEqual(row.source, row.target);
    assert.ok(targetExists(row.target), row.source);
    assert.equal(bySource.get(row.target)?.category, 'A', `Redirect chain/loop: ${row.source}`);
  }
  if (['C', 'D'].includes(row.category)) assert.equal(row.target, '');
}
for (const kind of ['notes', 'primary']) {
  const text = read(new URL(`docs/redirects/cloudflare-${kind}.csv`, root)).trim();
  const rows = text.split(/\r?\n/).map(line => line.split(','));
  for (const [source, target, status, query, subdomains, subpaths, suffix] of rows) {
    assert.equal(status, '301'); assert.equal(query, 'TRUE');
    assert.deepEqual([subdomains, subpaths, suffix], ['FALSE', 'FALSE', 'FALSE']);
    assert.ok(!source.includes('*') && !source.includes('?') && !source.includes('://'));
    assert.equal(bySource.get(`https://${source}`)?.target, target);
    const incoming = new URL(`https://${source}?q=a%2Fb&tag=x&tag=y`);
    const outgoing = new URL(target); outgoing.search = incoming.search;
    assert.equal(outgoing.search, incoming.search);
    assert.ok(targetExists(target));
  }
  const host = kind === 'notes' ? 'notes.nagi.tw' : 'nagi.tw';
  const expected = manifest.entries.filter(row => row.category === 'B' && new URL(row.source).hostname === host).map(row => row.source.replace('https://', '')).sort();
  const actual = rows.map(([source]) => source).sort();
  assert.equal(new Set(actual).size, actual.length, 'Duplicate redirect source in import');
  assert.deepEqual(actual, expected, 'Import must contain exactly this host’s category-B sources');
  assert.ok(!rows.some(([source]) => source.endsWith('/definitely-missing/')));
}

let pages = 0;
const stale = /notes\.nagi\.tw|seraphforge\.github\.io\/notes\.nagi\.tw|nagi-notes/;
for (const file of walk(dist).filter(file => /\.(html|xml|json|js|css|txt)$/.test(file.pathname))) {
  let text = read(file);
  if (file.pathname.endsWith('.html')) {
    const schemas = [...text.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    assert.equal(schemas.length, 1, file.pathname);
    const data = JSON.parse(schemas[0][1]);
    assert.equal(data['@context'], 'https://schema.org');
    for (const item of data['@graph']) {
      assert.equal(new URL(item['@id']).origin, 'https://nagi.tw');
      assert.equal(item.url, 'https://nagi.tw/');
    }
    // Only exact rendered article prose is exempt from historical-branding checks.
    text = text.replace(/<div class="prose"[^>]*>[\s\S]*?<\/div><\/div><footer/g, '<footer');
    pages++;
  }
  assert.ok(!stale.test(text), `Stale production branding: ${file.pathname}`);
}
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const penguin = new URL('public/nagi-penguin.svg', root);
const baseline = JSON.parse(read(new URL('docs/penguin-preservation.json', root)));
assert.equal(hash(penguin), baseline.sha256);
assert.equal(hash(new URL('nagi-penguin.svg', dist)), baseline.sha256);
const oldPenguin = new URL('../nagi.tw/public/nagi-penguin.svg', root);
if (existsSync(oldPenguin)) assert.equal(hash(penguin), hash(oldPenguin));
const styles = walk(new URL('src/', root)).filter(file => /\.(astro|css)$/.test(file.pathname)).map(read).join('\n');
assert.ok(!/\b(?:filter|fill)\s*:/.test(styles), 'Review possible penguin color/filter override');
assert.ok(/data-penguin-toggle/.test(styles), 'Penguin must have an accessible interaction');
assert.ok(!existsSync(new URL('public/_redirects', root)), 'Redirects must remain inactive');
console.log(`Pre-production: PASS (${pages} metadata/branding pages; redirect targets, no chains/loops, exact matching/query retention; original penguin)`);
