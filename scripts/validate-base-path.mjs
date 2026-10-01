import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import config from '../astro.config.mjs';

const dist = new URL('../dist/', import.meta.url);
const root = new URL(config.base.replace(/\/?$/, '/'), config.site);
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(new URL(`${entry.name}/`, dir)) : [new URL(entry.name, dir)]);
let references = 0;
const failures = [];
function check(value, source) {
  const url = new URL(value.replaceAll('&amp;', '&'), root);
  // Historical links in article prose are preserved; production metadata is checked separately.
  if (url.origin !== root.origin) return;
  if (!url.pathname.startsWith(root.pathname)) {
    failures.push(`${source}: outside base: ${value}`);
    return;
  }
  const target = new URL(decodeURIComponent(url.pathname.slice(root.pathname.length)), dist);
  if (!existsSync(target) && !existsSync(new URL(`${target.href.replace(/\/$/, '')}/index.html`))) failures.push(`${source}: missing target: ${value}`);
  references++;
}
const pages = walk(dist).filter((file) => file.pathname.endsWith('.html'));
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src|content)="([^"<>]+)"/g)) {
    if (/^(?:\/|https?:\/\/)/.test(match[1])) check(match[1], file.pathname);
  }
}
check(new URL('search-index.json', root).href, 'search endpoint');
const index = JSON.parse(readFileSync(new URL('search-index.json', dist), 'utf8'));
for (const group of index) for (const variant of Object.values(group.variants)) check(variant.url, 'search-index.json');
const rss = readFileSync(new URL('rss.xml', dist), 'utf8');
for (const match of rss.matchAll(/<link>(.*?)<\/link>/g)) check(match[1], 'rss.xml');
for (const file of walk(dist).filter((file) => /\.(css|js)$/.test(file.pathname))) {
  for (const match of readFileSync(file, 'utf8').matchAll(/(?:url\(["']?|["'`])(\/(?!\/)[^\s"'`()]+\.(?:css|js|png|jpg|svg|woff2?|json))(?:["'`)]|$)/g)) check(match[1], file.pathname);
}
assert.equal(failures.length, 0, failures.slice(0, 20).join('\n') + `\nTotal broken references: ${failures.length}`);
console.log(`PASS: ${pages.length} HTML pages; ${references} local references including assets, RSS and search-index URLs stay under ${root.pathname} and resolve in dist.`);
