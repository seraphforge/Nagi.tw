import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import config from '../astro.config.mjs';
import { ui } from '../src/i18n/ui.ts';

const basePath = `${config.base.replace(/\/$/, '')}/`;
const baseUrl = (process.env.NAGI_TEST_URL ?? `http://127.0.0.1:4321${basePath}`).replace(/\/$/, '');
const chromeCandidates = process.platform === 'win32'
  ? [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    ]
  : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
const chrome = chromeCandidates.find(existsSync);
if (!chrome) throw new Error('Chromium browser not found for runtime language validation');

const profile = mkdtempSync(join(tmpdir(), 'nagi-language-runtime-'));
const processHandle = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-extensions',
  '--no-first-run',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  `${baseUrl}/`,
], { stdio: 'ignore' });

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
let socket;

try {
  const portFile = join(profile, 'DevToolsActivePort');
  for (let attempt = 0; attempt < 100 && !existsSync(portFile); attempt++) await delay(50);
  if (!existsSync(portFile)) throw new Error('Chromium DevTools endpoint did not start');
  const [port] = readFileSync(portFile, 'utf8').split(/\r?\n/);
  let targets = [];
  for (let attempt = 0; attempt < 100 && targets.length === 0; attempt++) {
    try {
      targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
    } catch {}
    if (!targets.length) await delay(50);
  }
  const target = targets.find((item) => item.type === 'page');
  if (!target) throw new Error('Chromium page target not found');

  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  let messageId = 0;
  const pending = new Map();
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  socket.addEventListener('close', () => {
    for (const { reject } of pending.values()) reject(new Error('Chromium DevTools connection closed'));
    pending.clear();
  });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++messageId;
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Chromium command timed out: ${method}`));
    }, 5000);
    pending.set(id, {
      resolve: (value) => { clearTimeout(timeout); resolve(value); },
      reject: (error) => { clearTimeout(timeout); reject(error); },
    });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const waitForPage = async (pathname) => {
    for (let attempt = 0; attempt < 100; attempt++) {
      const ready = await evaluate(`location.pathname === ${JSON.stringify(`${new URL(baseUrl).pathname.replace(/\/$/, '')}${pathname}`)} && document.readyState === 'complete'`);
      if (ready) return;
      await delay(50);
    }
    throw new Error(`Timed out waiting for ${pathname}`);
  };
  const navigate = async (pathname) => {
    await command('Page.navigate', { url: `${baseUrl}${pathname}` });
    await waitForPage(pathname);
  };
  const switchLanguage = async (language) => {
    await evaluate(`document.querySelector('[data-language-select="${language}"]').click()`);
    await delay(80);
  };
  const expect = (condition, message) => { if (!condition) throw new Error(message); };
  const locales = ['zh', 'en', 'ja'];
  const prefix = (locale) => locale === 'zh' ? '' : `${locale}/`;
  const tags = { zh: 'zh-Hant', en: 'en', ja: 'ja' };
  const groups = JSON.parse(readFileSync(new URL('../dist/search-index.json', import.meta.url), 'utf8'));
  const failures = [];
  socket.addEventListener('message', ({ data }) => {
    const event = JSON.parse(data);
    if (event.method === 'Runtime.exceptionThrown') failures.push(event.params.exceptionDetails.text);
    if (event.method === 'Network.responseReceived' && event.params.response.status >= 400) failures.push(`${event.params.response.status}: ${event.params.response.url}`);
  });
  await command('Runtime.enable');
  await command('Network.enable');
  // Neither an old preference nor inaccessible storage may override the URL.
  const blockedStorageScript = await command('Page.addScriptToEvaluateOnNewDocument', { source: `Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });` });
  const routeFor = (locale, route) => `/${prefix(locale)}${route}`;
  const checkSwitch = async (source, target, route, group) => {
    const sourceRoute = routeFor(source, route);
    await command('Page.navigate', { url: `${baseUrl}${sourceRoute}?category=security&from=language-test#main` });
    await waitForPage(sourceRoute);
    await switchLanguage(target);
    const targetRoute = routeFor(target, route);
    await waitForPage(targetRoute);
    expect(await evaluate(`location.search`) === '?category=security&from=language-test', `Query lost: ${route}`);
    expect(await evaluate(`location.hash`) === '#main', `Hash lost: ${route}`);
    expect(await evaluate(`document.documentElement.lang`) === tags[target], `Wrong shell language: ${route}`);
    expect(await evaluate(`document.querySelector('#nav-links').textContent.includes(${JSON.stringify(ui[target].nav.about)})`), `Untranslated navigation: ${route}`);
    expect(await evaluate(`document.querySelector('[data-language-select="${target}"]').getAttribute('aria-pressed')`) === 'true', `Wrong active locale: ${route}`);
    if (group) {
      const actual = group.variants[target] ? target : 'zh';
      expect(await evaluate(`document.querySelector('[data-body-language]').dataset.bodyLanguage`) === actual, `Wrong article body: ${group.key}/${target}`);
      expect(await evaluate(`Boolean(document.querySelector('[data-translation-fallback]'))`) === (actual !== target), `Wrong fallback notice: ${group.key}/${target}`);
      if (actual !== target) expect(await evaluate(`document.querySelector('[data-translation-fallback]').textContent`) === ui[target].articles.fallback, 'Untranslated fallback notice');
    }
  };
  let switches = 0;
  for (const route of ['', 'about/', 'contact/', 'research/', 'projects/', 'experience/', 'articles/', 'archive/', 'topics/', 'topics/medical-cybersecurity/', 'topics/%E8%BF%91%E6%B3%81/']) {
    for (const source of locales) for (const target of locales) { await checkSwitch(source, target, route); switches++; }
  }
  for (const group of groups) {
    const slug = new URL(group.variants.zh.url, baseUrl).pathname.split('/').filter(Boolean).at(-1);
    for (const source of locales) for (const target of locales) { await checkSwitch(source, target, `articles/${slug}/`, group); switches++; }
  }
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(new URL(`${entry.name}/`, dir)) : [new URL(entry.name, dir)]);
  const dist = new URL('../dist/', import.meta.url);
  let responses = 0;
  for (const file of walk(dist).filter((file) => file.pathname.endsWith('index.html'))) {
    const route = file.href.slice(dist.href.length).replace(/index\.html$/, '');
    const response = await fetch(`${baseUrl}/${route}`);
    expect(response.status === 200, `Locale route HTTP ${response.status}: ${route}`);
    responses++;
  }
  for (const locale of locales) {
    await navigate(routeFor(locale, 'articles/'));
    for (const [category, count] of [['life', 8], ['security', 3], ['projects', 0], ['research', 0], ['all', 11]]) {
      await evaluate(`document.querySelector('[data-category-filter="${category}"]').click()`);
      expect(await evaluate(`document.querySelectorAll('[data-article-group]:not([hidden])').length`) === count, `${locale}/${category}: incorrect filtering`);
      expect(await evaluate(`document.querySelector('#empty').hidden`) === (count > 0), `${locale}/${category}: incorrect empty state`);
    }
    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      await command('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width < 768 });
      for (const route of ['', 'articles/', 'about/', 'contact/', 'research/', 'projects/', 'experience/', 'archive/', 'topics/', 'articles/ctf-meets-malware-analysis-windows/']) {
        await navigate(routeFor(locale, route));
        expect(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), `${locale}/${route}: horizontal overflow at ${width}`);
      }
    }
  }
  // Manual theme still works when browser storage is blocked.
  await navigate('/');
  await evaluate(`document.querySelector('[data-theme-select="dark"]').click()`);
  expect(await evaluate(`document.documentElement.dataset.theme`) === 'dark', 'Blocked storage must not disable theme');
  await command('Page.removeScriptToEvaluateOnNewDocument', { identifier: blockedStorageScript.identifier });
  await navigate('/');
  await evaluate(`document.querySelector('[data-theme-select="dark"]').click()`);
  await navigate('/projects/');
  expect(await evaluate(`document.documentElement.dataset.theme`) === 'dark', 'Theme preference did not persist');
  for (const locale of locales) {
    await navigate(routeFor(locale, 'about/'));
    expect(await evaluate(`document.querySelector('.brand img') === null`), 'Penguin must not be brand');
    const originalSource = await evaluate(`document.querySelector('[data-penguin-toggle] img').src`);
    await evaluate(`document.querySelector('[data-penguin-toggle]').focus()`);
    for (const [key, code, virtual, open] of [['Enter', 'Enter', 13, true], [' ', 'Space', 32, false]]) {
      await command('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: virtual, text: key === 'Enter' ? '\r' : ' ' });
      await command('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: virtual });
      expect(await evaluate(`document.querySelector('[data-penguin-toggle]').getAttribute('aria-expanded')`) === String(open), `${locale}: keyboard toggle failed`);
      expect(await evaluate(`document.querySelector('#penguin-greeting').hidden`) === !open, 'Greeting visibility mismatch');
    }
    const rect = await evaluate(`(() => { const r = document.querySelector('[data-penguin-toggle]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
    await command('Input.dispatchMouseEvent', { type: 'mousePressed', ...rect, button: 'left', clickCount: 1 });
    await command('Input.dispatchMouseEvent', { type: 'mouseReleased', ...rect, button: 'left', clickCount: 1 });
    expect(await evaluate(`document.querySelector('#penguin-greeting').hidden`) === false, 'Pointer greeting toggle failed');
    for (const theme of ['light', 'dark']) {
      await evaluate(`document.querySelector('[data-theme-select="${theme}"]').click()`);
      expect(await evaluate(`document.querySelector('[data-penguin-toggle] img').src`) === originalSource, 'Penguin source changed with theme');
      expect(await evaluate(`getComputedStyle(document.querySelector('[data-penguin-toggle] img')).filter`) === 'none', 'Penguin filter detected');
      expect(await evaluate(`getComputedStyle(document.querySelector('[data-penguin-toggle] img')).mixBlendMode`) === 'normal', 'Penguin blend detected');
    }
  }
  const screenshots = new URL('../docs/refinement/screenshots/', import.meta.url);
  mkdirSync(screenshots, { recursive: true });
  for (const [width, route] of [[375, '/about/'], [768, '/en/research/'], [1024, '/ja/projects/'], [1440, '/articles/']]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await navigate(route);
    for (const theme of ['light', 'dark']) {
      await evaluate(`document.querySelector('[data-theme-select="${theme}"]').click()`);
      expect(await evaluate(`document.documentElement.scrollWidth <= innerWidth`), `Theme overflow at ${width}`);
      const screenshot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      writeFileSync(new URL(`${width}-${theme}.png`, screenshots), Buffer.from(screenshot.data, 'base64'));
    }
  }
  expect(failures.length === 0, failures.join('\n'));
  console.log(`Browser multilingual validation: PASS (${switches} context/query/hash switches, ${responses} HTTP 200 routes, all article translations/fallbacks, blocked storage, filters and three-locale layouts at 320/375/390/768/1024/1440px; theme persistence, keyboard/pointer penguin, original asset colors; no runtime/network errors)`);
} finally {
  socket?.close();
  processHandle.kill();
  await Promise.race([
    new Promise((resolve) => processHandle.once('exit', resolve)),
    delay(2000),
  ]);
  try {
    rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  } catch {
    // Chromium may release a profile lock slightly after the process exits.
  }
}
