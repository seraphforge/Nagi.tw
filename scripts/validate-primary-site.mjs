import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import config from '../astro.config.mjs';
import { ui } from '../src/i18n/ui.ts';

assert.equal(config.site, 'https://nagi.tw');
assert.equal(config.base ?? '/', '/');
const dist = new URL('../dist/', import.meta.url);
for (const prefix of ['', 'en/', 'ja/']) {
  for (const route of ['', 'research/', 'projects/', 'experience/', 'articles/', 'about/', 'topics/', 'archive/', 'contact/']) {
    const file = new URL(`${prefix}${route}index.html`, dist);
    assert.ok(existsSync(file), `Missing ${prefix}${route}`);
    const html = readFileSync(file, 'utf8');
    const head = html.split('</head>')[0];
    assert.ok(head.includes(`https://nagi.tw/${prefix}${route}`));
    assert.ok(head.includes('name="twitter:card"'));
    assert.ok(head.includes('application/ld+json'));
    assert.ok(!/Nagi Notes|notes\.nagi\.tw|seraphforge\.github\.io/.test(head));
  }
  const home = readFileSync(new URL(`${prefix}index.html`, dist), 'utf8');
  for (const id of ['currently', 'featured-research', 'featured-projects', 'recent-articles', 'experience-preview']) {
    assert.ok(home.includes(`id="${id}"`), `Missing home section ${id}`);
  }
  assert.ok(home.includes('Hong Xin-Fu / Nagi'));
  assert.ok(home.includes('Security · Systems · Research'));
  const locale = prefix === 'en/' ? 'en' : prefix === 'ja/' ? 'ja' : 'zh';
  const navigation = home.match(/<nav id="nav-links"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(navigation, 'Missing main navigation');
  const labels = [...navigation.matchAll(/<a\b[^>]*>(.*?)<\/a>/g)].map(match => match[1]);
  assert.equal(labels.length, 6);
  assert.ok(labels.includes(ui[locale].nav.experience), 'Experience label must not use the preview heading');
  assert.equal(new Set(labels).size, labels.length, 'Duplicate main navigation');
  const projects = readFileSync(new URL(`${prefix}projects/index.html`, dist), 'utf8');
  assert.ok(!/homelab/i.test(projects));
}
const rss = readFileSync(new URL('rss.xml', dist), 'utf8');
assert.equal((rss.match(/<item>/g) ?? []).length, 24);
assert.ok(rss.includes('<title>Nagi.tw</title>'));
assert.ok(!/notes\.nagi\.tw|seraphforge\.github\.io/.test(rss));
console.log('Primary site: PASS (27 core pages, identity, sections, metadata, portfolio scope, 24 RSS editions)');
