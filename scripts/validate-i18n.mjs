import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { relative, join } from 'node:path';
import config from '../astro.config.mjs';
import { ui } from '../src/i18n/ui.ts';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const root = new URL(`${config.base.replace(/\/$/, '')}/`, config.site);
const locales = ['zh', 'en', 'ja'];
const tags = { zh: 'zh-Hant', en: 'en', ja: 'ja' };
const prefix = (locale) => locale === 'zh' ? '' : `${locale}/`;
const urlFor = (locale, route) => new URL(`${prefix(locale)}${route}`, root);
const page = (locale, route) => readFileSync(join(dist, prefix(locale), route, 'index.html'), 'utf8').replaceAll('&amp;', '&');
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [match[1], match[2].replaceAll('&amp;', '&')]));
const allPages = walk(dist).filter((file) => file.endsWith('.html'));
const counts = { zh: 0, en: 0, ja: 0 };
const canonicals = new Set();
let switches = 0;
for (const locale of locales) {
  for (const route of ['', 'about/', 'contact/', 'research/', 'projects/', 'experience/', 'articles/', 'archive/', 'topics/']) {
    assert.ok(existsSync(join(dist, prefix(locale), route, 'index.html')), `Missing ${locale}/${route}`);
  }
}
for (const file of allPages) {
  const localPath = relative(dist, file).replaceAll('\\', '/').replace(/index\.html$/, '');
  const locale = localPath.startsWith('en/') ? 'en' : localPath.startsWith('ja/') ? 'ja' : 'zh';
  const route = locale === 'zh' ? localPath : localPath.slice(3);
  const html = new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(file));
  assert.ok(!/[\uFFFD\uE000-\uF8FF]/u.test(html), `Corrupt Unicode: ${file}`);
  assert.ok(!/^articles\/[^/]+\/(en|ja)\/$/.test(route), `Old language suffix: ${file}`);
  assert.equal(attrs(html.match(/<html\b[^>]*>/)[0]).lang, tags[locale]);
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attrs(tag));
  const canonical = links.filter((link) => link.rel === 'canonical');
  assert.equal(canonical.length, 1);
  assert.equal(canonical[0].href, urlFor(locale, route).href, `Canonical: ${file}`);
  canonicals.add(canonical[0].href);
  const alternates = links.filter((link) => link.hreflang);
  assert.equal(alternates.length, 4);
  for (const language of locales) {
    assert.equal(alternates.find((link) => link.hreflang === tags[language])?.href, urlFor(language, route).href);
    assert.ok(existsSync(join(dist, prefix(language), route, 'index.html')));
  }
  assert.equal(alternates.find((link) => link.hreflang === 'x-default')?.href, urlFor('zh', route).href);
  const buttons = [...html.matchAll(/<button\b[^>]*data-language-select="[^"<>]+"[^>]*>/g)].map(([tag]) => attrs(tag));
  assert.equal(buttons.length, 3);
  for (const button of buttons) {
    assert.equal(new URL(button['data-locale-url'], root).href, urlFor(button['data-language-select'], route).href);
    assert.equal(button['aria-pressed'], String(button['data-language-select'] === locale));
    switches++;
  }
  const metadata = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attrs(tag));
  assert.equal(metadata.find((meta) => meta.property === 'og:url')?.content, canonical[0].href);
  assert.ok(metadata.find((meta) => meta.name === 'description')?.content);
  assert.ok(html.includes(ui[locale].nav.about));
  assert.ok(html.includes(ui[locale].common.skip));
  assert.ok(html.includes(ui[locale].nav.archive));
  counts[locale]++;
}
assert.deepEqual(counts, { zh: 76, en: 76, ja: 76 });
for (const locale of locales) {
  assert.ok(page(locale, '').includes(ui[locale].home.latest));
  assert.ok(page(locale, 'about/').includes(ui[locale].about.heading));
  assert.ok(page(locale, 'experience/').includes(ui[locale].experience.intro));
  assert.ok(page(locale, 'archive/').includes(ui[locale].archive.eyebrow));
  assert.ok(page(locale, 'topics/').includes(ui[locale].topics.eyebrow));
}
const sitemapIndex = readFileSync(join(dist, 'sitemap-index.xml'), 'utf8');
const sitemapUrls = [...sitemapIndex.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]));
const sitemapPages = new Set();
for (const sitemap of sitemapUrls) {
  assert.ok(sitemap.href.startsWith(root.href));
  const xml = readFileSync(join(dist, decodeURIComponent(sitemap.pathname.slice(root.pathname.length))), 'utf8');
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) sitemapPages.add(new URL(match[1]).href);
}
assert.deepEqual(sitemapPages, canonicals, 'Sitemap must list every canonical locale page exactly once');
const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
assert.ok(robots.includes(`Sitemap: ${new URL('sitemap-index.xml', root)}`));
assert.ok(robots.includes('Allow: /'));
console.log(`Site-wide i18n: PASS (${allPages.length} pages, ${JSON.stringify(counts)}, ${switches} same-context switch URLs; canonical/hreflang/x-default/OG/sitemap/robots/UTF-8)`);
