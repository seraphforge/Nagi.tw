import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname.replace(/^\/(.:)/, '$1');
const dist = join(root, 'dist');
const articleRoot = join(root, 'articles');
const homepage = readFileSync(join(dist, 'index.html'), 'utf8');
const rss = readFileSync(join(dist, 'rss.xml'), 'utf8');
const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
const failures = [];
const languages = { zh: 0, en: 0, ja: 0 };
const routes = [];
const allLogicalTopics = new Set();
const publicLogicalTopics = new Set();
if (readFileSync(join(dist, 'CNAME'), 'utf8').trim() !== 'nagi.tw') failures.push('CNAME must point to nagi.tw');
if (!homepage.includes('rel="canonical" href="https://nagi.tw/"')) failures.push('homepage canonical must point to nagi.tw');
if (!homepage.includes('href="https://notes.nagi.tw/"')) failures.push('personal-site link must point to notes.nagi.tw');
if (!rss.includes('<link>https://nagi.tw/</link>')) failures.push('RSS site link must point to nagi.tw');
if (!robots.includes('Sitemap: https://nagi.tw/sitemap-index.xml')) failures.push('robots sitemap must point to nagi.tw');
if (!sitemap.includes('<loc>https://nagi.tw/</loc>')) failures.push('sitemap URLs must point to nagi.tw');
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((item) => item.isDirectory() ? walk(join(dir, item.name)) : [join(dir, item.name)]);
const value = (text, key) => text.match(new RegExp(`^${key}:\\s*["']?([^\\r\\n"']+)`, 'm'))?.[1]?.trim();

for (const file of walk(articleRoot).filter((file) => /\.mdx?$/.test(file))) {
  const source = readFileSync(file, 'utf8');
  const stem = file.split(/[\\/]/).at(-1).replace(/\.mdx?$/, '').replace(/\.(en|ja)$/, '');
  const logicalTopic = value(source, 'translation_key') ?? stem;
  allLogicalTopics.add(logicalTopic);
  if (value(source, 'published') === 'false') continue;
  publicLogicalTopics.add(logicalTopic);
  const language = /\.en\.mdx?$/.test(file) ? 'en' : /\.ja\.mdx?$/.test(file) ? 'ja' : 'zh';
  const slug = value(source, 'slug') ?? stem;
  const route = join(dist, 'articles', slug, language === 'zh' ? '' : language, 'index.html');
  routes.push(route);
  languages[language]++;
  if (!existsSync(route)) failures.push(`missing article route: ${route}`);
}

const unpublishedLogicalTopics = [...allLogicalTopics].filter((key) => !publicLogicalTopics.has(key));
if (allLogicalTopics.size !== 13) failures.push(`expected 13 retained logical topics, found ${allLogicalTopics.size}`);
if (publicLogicalTopics.size !== 12) failures.push(`expected 12 public logical topics, found ${publicLogicalTopics.size}`);
if (unpublishedLogicalTopics.sort().join(',') !== 'from-nihscsed-to-control-team') {
  failures.push(`unexpected unpublished logical topics: ${unpublishedLogicalTopics.join(',')}`);
}

if (routes.length !== 26) failures.push(`expected 26 public article editions, found ${routes.length}`);
if (languages.zh !== 12 || languages.en !== 5 || languages.ja !== 9) failures.push(`language route counts: ${JSON.stringify(languages)}`);
if (existsSync(join(dist, 'articles', 'from-nihscsed-to-control-team'))) failures.push('excluded article route exists');

for (const route of ['index.html', 'articles/index.html', 'topics/index.html', 'archive/index.html', 'about/index.html', 'experience/index.html', 'rss.xml', 'search-index.json', 'sitemap-index.xml']) {
  if (!existsSync(join(dist, route))) failures.push(`missing core route: ${route}`);
}
for (const topic of ['research', 'projects', 'engineering', 'security', 'ctf', 'personal']) {
  if (!existsSync(join(dist, 'topics', topic, 'index.html'))) failures.push(`missing topic route: ${topic}`);
}
for (const image of ['casper.png', 'cybersec-2026.jpg', 'seraph.png']) {
  if (!existsSync(join(dist, 'assets', 'images', image))) failures.push(`missing image: ${image}`);
}

const search = JSON.parse(readFileSync(join(dist, 'search-index.json'), 'utf8'));
if (search.length !== 12) failures.push(`search index expected 12 logical topics, found ${search.length}`);
if (search.some((item) => JSON.stringify(item.variants).includes('from-nihscsed'))) failures.push('excluded article in search index');
if (new Set(search.map((item) => item.key)).size !== search.length) failures.push('duplicate logical topics in search index');
for (const item of search) {
  const available = Object.keys(item.variants);
  if (available.join(',') !== item.languages.join(',')) failures.push(`language availability mismatch: ${item.key}`);
  for (const requested of ['zh', 'en', 'ja']) {
    const actual = [requested, 'zh', 'en', 'ja'].find((language) => available.includes(language));
    if (!actual || !item.variants[actual]) failures.push(`fallback failed for ${item.key} requesting ${requested}`);
  }
}
const publicDocuments = ['index.html', 'articles/index.html', 'archive/index.html', 'rss.xml', 'sitemap-0.xml'].map((file) => existsSync(join(dist, file)) ? readFileSync(join(dist, file), 'utf8') : '').join('\n');
if (publicDocuments.includes('from-nihscsed-to-control-team')) failures.push('excluded article leaked into a public index');
if (publicDocuments.includes('taiwan-student-cybersecurity-growing-apart')) failures.push('excluded 資安陌路 article leaked into a public index');
const unpublishedAuditDocuments = [
  'index.html',
  'articles/index.html',
  'topics/research/index.html',
  'archive/index.html',
  'search-index.json',
  'rss.xml',
  'sitemap-0.xml',
].map((file) => existsSync(join(dist, file)) ? readFileSync(join(dist, file), 'utf8') : '').join('\n');
if (unpublishedAuditDocuments.includes('taiwan-student-cybersecurity-growing-apart')) {
  failures.push('excluded 資安陌路 topic leaked into a production surface');
}
if (existsSync(join(dist, 'articles', 'taiwan-student-cybersecurity-growing-apart'))) {
  failures.push('excluded 資安陌路 generated an article route');
}

console.log(`Validated ${routes.length} article routes (${languages.zh} zh, ${languages.en} en, ${languages.ja} ja)`);
console.log(`Accounted for ${allLogicalTopics.size} logical topics: ${publicLogicalTopics.size} public + ${unpublishedLogicalTopics.length} unpublished`);
console.log('Validated homepage, Articles, Topics, Archive, search, RSS, sitemap, and 3 images');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Failures: 0');
