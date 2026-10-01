import { ui } from '../src/i18n/ui.ts';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname.replace(/^\/(.:)/, '$1');
const dist = join(root, 'dist');
const src = join(root, 'src');
const failures = [];

const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
  entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)],
);

const sourceFiles = walk(src).filter((path) => /\.(astro|ts|css)$/.test(path));
const sourceBundle = sourceFiles.map((file) => readFileSync(file, 'utf8')).join('\n');

for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8');
  if (/[\uE000-\uF8FF]|�/.test(source)) failures.push(`suspicious UI encoding in ${file}`);
}

const pages = {
  home: readFileSync(join(dist, 'index.html'), 'utf8'),
  articles: readFileSync(join(dist, 'articles', 'index.html'), 'utf8'),
  topics: readFileSync(join(dist, 'topics', 'index.html'), 'utf8'),
  topic: readFileSync(join(dist, 'topics', 'research', 'index.html'), 'utf8'),
  archive: readFileSync(join(dist, 'archive', 'index.html'), 'utf8'),
};
const headerSource = readFileSync(join(src, 'components', 'SiteHeader.astro'), 'utf8');
const globalSource = readFileSync(join(src, 'styles', 'global.css'), 'utf8');

const cssToken = (name) => globalSource.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`))?.[1];
const relativeLuminance = (hex) => {
  const channels = hex.slice(1).match(/../g).map((channel) => parseInt(channel, 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};
const contrastRatio = (foreground, background) => {
  const light = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const dark = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (light + 0.05) / (dark + 0.05);
};

const requireClass = (page, className) => {
  const classPattern = new RegExp(`class="[^"]*\\b${className}\\b[^"]*"`);
  if (!classPattern.test(pages[page])) failures.push(`${page} missing .${className}`);
};

requireClass('home', 'primary-home');
requireClass('home', 'currently');
if (!pages.home.includes('Hong Xin-Fu / Nagi') || !pages.home.includes(ui.zh.home.latest)) failures.push('Primary identity or recent articles missing');
for (const section of ['research', 'projects', 'experience', 'articles', 'about']) {
  if (!pages.home.includes(`href="/${section}/"`)) failures.push(`Homepage missing section ${section}`);
}
requireClass('articles', 'article-index');
requireClass('articles', 'category-navigation');
for (const category of ['all', 'life', 'security', 'projects', 'research']) {
  if (!pages.articles.includes(`data-category-filter="${category}"`)) failures.push(`articles missing category filter ${category}`);
}
requireClass('topics', 'practice-list');
requireClass('topic', 'article-index');
requireClass('archive', 'archive-year');
requireClass('archive', 'archive-entry');

const classCount = (html, className) =>
  [...html.matchAll(/class="([^"]+)"/g)].filter((match) => match[1].split(/\s+/).includes(className)).length;

if (classCount(pages.home, 'article-group') !== 3) failures.push('home must show exactly 3 recent notes');
if (classCount(pages.articles, 'article-group') !== 11) failures.push('articles must show 11 public logical topics');
if (classCount(pages.home, 'article-group') !== 3) failures.push('home notes must show 3 logical topics');
if (classCount(pages.archive, 'archive-row') !== 11) failures.push('archive must show 11 public logical topics');

for (const [name, html] of Object.entries(pages)) {
  if (!html.includes('data-language-switcher')) failures.push(`${name} missing global language switcher`);
}

for (const locale of ['zh', 'en', 'ja']) {
  const prefix = locale === 'zh' ? '' : locale;
  const listing = readFileSync(join(dist, prefix, 'articles/index.html'), 'utf8');
  const home = readFileSync(join(dist, prefix, 'index.html'), 'utf8');
  if (!home.includes(ui[locale].home.latest)) failures.push(`${locale}: untranslated home UI`);
  if (classCount(listing, 'article-group') !== 11) failures.push(`${locale}: missing article groups`);
  if (!listing.includes('data-actual-language')) failures.push(`${locale}: missing actual-language labels`);
  for (const language of ['zh', 'en', 'ja']) {
    if (!listing.includes(`data-language-select="${language}"`)) failures.push(`${locale}: missing locale control ${language}`);
  }
}
if (!headerSource.includes('target.search = location.search') || !headerSource.includes('target.hash = location.hash')) failures.push('locale navigation must preserve query and hash');
if (headerSource.includes('localStorage')) failures.push('storage must not override URL locale');

for (const color of ['#F7F8F6', '#17252B', '#3A8FA3', '#DCECEF', '#C9DBA7', '#EEE3B8', '#D8B6A4', '#B8C4C6', '#66777C']) {
  if (!globalSource.toUpperCase().includes(color)) failures.push(`missing Nagi lab palette color ${color}`);
}
for (const [foregroundName, backgroundName, minimum] of [
  ['ink', 'paper', 7],
  ['muted-readable', 'paper', 4.5],
  ['ink', 'ice', 7],
]) {
  const foreground = cssToken(foregroundName);
  const background = cssToken(backgroundName);
  if (!foreground || !background) {
    failures.push(`missing contrast token pair: ${foregroundName}/${backgroundName}`);
  } else if (contrastRatio(foreground, background) < minimum) {
    failures.push(`${foregroundName}/${backgroundName} contrast is below ${minimum}:1`);
  }
}
for (const color of ['#DDEFF0', '#E3EBF4', '#E5EDE4', '#F3ECDE', '#EAE8F0', '#172126']) {
  if (sourceBundle.toUpperCase().includes(color)) failures.push(`legacy pastel remains: ${color}`);
}
if (/gradient\s*\(|glassmorphism|neon/i.test(sourceBundle)) failures.push('prohibited visual treatment present');

for (const [name, html] of Object.entries(pages)) {
  if (/[\uE000-\uF8FF]|�/.test(html)) failures.push(`suspicious rendered encoding on ${name}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Editorial UI structure: PASS');
console.log('UI encoding scan: PASS');
