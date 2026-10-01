import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import config from '../astro.config.mjs';
import { ui } from '../src/i18n/ui.ts';
const dist = new URL('../dist/', import.meta.url);
const root = new URL(`${config.base.replace(/\/$/, '')}/`, config.site);
const groups = JSON.parse(readFileSync(new URL('search-index.json', dist), 'utf8'));
const locales = ['zh', 'en', 'ja'];
const prefix = (locale) => locale === 'zh' ? '' : `${locale}/`;
const page = (locale, slug) => readFileSync(new URL(`${prefix(locale)}articles/${slug}/index.html`, dist), 'utf8');
const body = (html) => html.match(/<div class="prose"[^>]*>([\s\S]*?)<\/div><\/div><footer/)[1];
let pages = 0, switches = 0, translated = 0, fallbacks = 0;
for (const group of groups) {
  const slug = new URL(group.variants.zh.url, root).pathname.split('/').filter(Boolean).at(-1);
  const original = body(page('zh', slug));
  for (const locale of locales) {
    const html = page(locale, slug);
    const actual = group.variants[locale] ? locale : 'zh';
    assert.ok(html.includes(`data-current-article-language="${actual}"`));
    assert.ok(html.includes(`data-locale="${locale}"`));
    assert.ok(html.includes(`data-body-language="${actual}"`));
    assert.ok(html.includes(ui[locale].common.back));
    if (actual !== locale) {
      assert.equal(body(html), original, `Fallback body changed: ${group.key}/${locale}`);
      assert.ok(html.includes(ui[locale].articles.fallback));
      assert.ok(html.includes('data-translation-fallback'));
      fallbacks++;
    } else {
      assert.ok(!html.includes('data-translation-fallback'));
      if (locale !== 'zh') {
        assert.notEqual(body(html), original, `Translation not rendered: ${group.key}/${locale}`);
        translated++;
      }
      const expected = new URL(`${prefix(locale)}articles/${slug}/`, root).pathname;
      assert.equal(group.variants[locale].url, expected);
    }
    for (const target of locales) {
      const expected = new URL(`${prefix(target)}articles/${slug}/`, root).pathname;
      const tag = [...html.matchAll(/<a\b[^>]*>/g)].find(([tag]) => tag.includes(`data-article-language-link="${target}"`))?.[0];
      assert.ok(tag?.includes(`href="${expected}"`));
      assert.ok(existsSync(new URL(`${prefix(target)}articles/${slug}/index.html`, dist)));
      switches++;
    }
    for (const oldLanguage of ['en', 'ja']) assert.ok(!existsSync(new URL(`articles/${slug}/${oldLanguage}/index.html`, dist)), 'Old suffix route still exists');
    pages++;
  }
}
assert.equal(pages, 33);
assert.equal(translated, 13);
assert.equal(fallbacks, 9);
console.log(`Language URLs/content: PASS (${pages} article pages; ${switches} switch targets; ${translated} real translations; ${fallbacks} exact Chinese fallbacks)`);
