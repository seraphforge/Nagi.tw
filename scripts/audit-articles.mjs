import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
const root = fileURLToPath(new URL('../', import.meta.url));
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? walk(join(dir, item.name)) : [join(dir, item.name)]);
const files = walk(join(root, 'articles')).filter(file => /\.mdx?$/.test(file));
const records = files.map(file => {
 const source = readFileSync(file, 'utf8');
 const data = parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
 const stem = file.split(/[\\/]/).at(-1).replace(/\.mdx?$/, '');
 const language = /\.en$/.test(stem) ? 'en' : /\.ja$/.test(stem) ? 'ja' : data.site_lang?.startsWith('en') ? 'en' : data.site_lang?.startsWith('ja') ? 'ja' : 'zh';
 const key = data.translation_key ?? stem.replace(/\.(en|ja)$/, '');
 const slug = data.slug ?? stem.replace(/\.(en|ja)$/, '');
 assert.ok(Number.isFinite(new Date(data.date).valueOf()), `Invalid date: ${file}`);
 return { file: relative(root, file).replaceAll('\\', '/'), key, slug, language, published: data.published !== false, tags: data.tags };
});
const publicRecords = records.filter(item => item.published);
assert.equal(new Set(records.map(item => `${item.key}/${item.language}`)).size, records.length, 'Duplicate translation edition');
const slugs = new Map();
for (const item of records) {
 assert.ok(!slugs.has(item.slug) || slugs.get(item.slug) === item.key, `Slug collision: ${item.slug}`);
 slugs.set(item.slug, item.key);
}
const search = JSON.parse(readFileSync(join(root, 'dist/search-index.json'), 'utf8'));
assert.deepEqual(search.map(item => item.key).sort(), [...new Set(publicRecords.map(item => item.key))].sort(), 'Published identity excluded from search');
for (const item of publicRecords) {
 const group = search.find(group => group.key === item.key);
 assert.ok(group.variants[item.language], `Missing published edition: ${item.file}`);
 assert.deepEqual(group.variants[item.language].tags, item.tags, 'Detailed tag metadata changed');
}
const listingCounts = {};
for (const locale of ['zh', 'en', 'ja']) {
 const html = readFileSync(join(root, 'dist', locale === 'zh' ? '' : locale, 'articles/index.html'), 'utf8');
 const keys = [...html.matchAll(/data-group-key="([^"<>]+)"/g)].map(match => match[1]);
 assert.deepEqual(keys.sort(), search.map(item => item.key).sort(), `Published identity excluded in ${locale}`);
 listingCounts[locale] = keys.length;
}
const byLanguage = list => Object.fromEntries(['zh', 'en', 'ja'].map(language => [language, list.filter(item => item.language === language).length]));
console.log(JSON.stringify({ markdownSources: records.length, uniqueIdentities: new Set(records.map(item => item.key)).size, editions: byLanguage(records), publishedEditions: publicRecords.length, publishedByLanguage: byLanguage(publicRecords), unpublishedEditions: records.length - publicRecords.length, unpublishedIdentities: [...new Set(records.filter(item => !item.published).map(item => item.key))], articlesShown: listingCounts, collisions: 0, missingPublishedEditions: 0 }, null, 2));
