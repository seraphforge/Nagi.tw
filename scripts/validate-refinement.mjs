import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
for (const prefix of ['', 'en/', 'ja/']) {
  const home = read(`dist/${prefix}index.html`);
  const projects = read(`dist/${prefix}projects/index.html`);
  assert.ok(!/id="pi"|Raspberry Pi|Home Lab|Homelab/i.test(projects), 'Non-portfolio work must not appear in Projects');
  assert.ok(!/<a class="brand"[^>]*>\s*<img/.test(home), 'Text-only brand');
  assert.ok(home.includes('data-theme-select="light"') && home.includes('data-theme-select="dark"'), 'Manual Light / Dark controls');
  assert.ok(home.includes('data-penguin-toggle') && home.includes('Hello, world!'), 'Penguin greeting');
  assert.ok(!existsSync(new URL(`../dist/${prefix}articles/why-i-still-use-codex/index.html`, import.meta.url)));
  assert.equal((read(`dist/${prefix}articles/index.html`).match(/<div[^>]*data-article-group/g) ?? []).length, 11);
}
for (const file of ['rss.xml', 'search-index.json', 'sitemap-0.xml']) assert.ok(!read('dist/' + file).includes('why-i-still-use-codex'), file);
console.log('Refinement: PASS (portfolio exclusions, brand, theme controls, greeting, article identities and removal)');
