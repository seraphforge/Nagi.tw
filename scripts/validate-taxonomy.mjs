import config from '../astro.config.mjs';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { parse } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
const removed = 'taiwan-student-cybersecurity-growing-apart';
const hidden = 'from-nihscsed-to-control-team';
const security = new Set(['2026-security-conference', 'ctf-meets-malware-analysis-windows', 'retail-work-sme-security-culture']);
const files = walk(join(root, 'articles')).filter((file) => /\.mdx?$/.test(file));
assert.ok(!files.some((file) => file.includes(removed)), 'Removed article still exists in the content collection');
assert.equal(files.length, 27, 'Preserve all other language editions');
const groups = new Map();
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const data = parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  const key = data.translation_key ?? file.split(/[\\/]/).at(-1).replace(/(?:\.(en|ja))?\.md$/, '');
  assert.deepEqual(data.categories, [security.has(key) ? 'security' : 'life'], `Incorrect primary purpose: ${file}`);
  assert.equal(data.published === false, key === hidden, `Publication state changed: ${file}`);
  groups.set(key, data);
}
assert.equal(groups.size, 12);
const dist = join(root, 'dist');
const siteRoot = new URL(`${config.base.replace(/\/$/, '')}/`, config.site);
const search = JSON.parse(readFileSync(join(dist, 'search-index.json'), 'utf8'));
assert.equal(search.length, 11);
assert.deepEqual(Object.fromEntries(['life', 'security', 'projects', 'research'].map((category) => [category, search.filter((group) => group.category === category).length])), { life: 8, security: 3, projects: 0, research: 0 });
for (const group of search) {
  assert.equal(group.category, security.has(group.key) ? 'security' : 'life');
  assert.ok(group.languages.includes('zh'));
}
for (const slug of [removed, hidden, 'why-i-still-use-codex']) assert.ok(!existsSync(join(dist, 'articles', slug)), `Forbidden route exists: ${slug}`);
let checkedLinks = 0;
for (const file of walk(dist).filter((file) => /\.(html|xml|json|js)$/.test(file))) {
  const text = readFileSync(file, 'utf8');
  for (const slug of [removed, hidden, 'why-i-still-use-codex']) assert.ok(!text.includes(slug), `Forbidden reference in ${relative(dist, file)}`);
  assert.ok(!/[\uE000-\uF8FF\uFFFD]/u.test(text), `Invalid encoding in ${relative(dist, file)}`);
  if (!file.endsWith('.html')) continue;
  for (const match of text.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), new URL(relative(dist, file).replaceAll('\\', '/'), siteRoot));
    if (url.origin !== siteRoot.origin) continue;
    assert.ok(url.pathname.startsWith(siteRoot.pathname), `Outside base: ${url}`);
    const path = decodeURIComponent(url.pathname.slice(siteRoot.pathname.length));
    const target = join(dist, path);
    assert.ok(existsSync(target) || existsSync(join(target, 'index.html')), `Broken local reference: ${relative(dist, file)} -> ${path}`);
    checkedLinks++;
  }
}
const articles = readFileSync(join(dist, 'articles/index.html'), 'utf8');
const oldPersonal = readFileSync(join(dist, 'topics/personal/index.html'), 'utf8');
for (const key of ['not-everyone-has-to-walk-the-same-road', 'prologue-the-people-i-met-along-the-way', 'ten-years-from-now-dont-forget-who-you-are-now']) {
  assert.ok(oldPersonal.includes(`data-group-key="${key}"`), `Legacy personal topic lost an article: ${key}`);
}
for (const category of ['all', 'life', 'security', 'projects', 'research']) assert.ok(articles.includes(`data-category-filter="${category}"`), `Missing filter: ${category}`);
for (const route of ['experience', 'about']) assert.ok(existsSync(join(dist, route, 'index.html')));
const about = readFileSync(join(dist, 'about/index.html'), 'utf8');
assert.ok(about.includes('安靜地做，慢慢地累積。') && about.includes('我相信我的故事，有一天會被別人看見。'));
console.log(`Taxonomy, removal, publication, encoding, and ${checkedLinks} internal references: PASS`);
