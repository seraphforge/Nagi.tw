import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const removed = JSON.parse(readFileSync(new URL('../docs/refinement/removed-articles.json', import.meta.url), 'utf8'));
assert.deepEqual(removed.sort(), ['articles/personal/why-i-still-use-codex.ja.md', 'articles/personal/why-i-still-use-codex.md']);
const manifest = JSON.parse(readFileSync(new URL('../docs/content-preservation.json', import.meta.url), 'utf8')).filter(item => !removed.includes(item.path));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
const current = ['articles', 'public/assets/images'].flatMap(dir => walk(join(root, dir))).map(file => relative(root, file).replaceAll('\\', '/')).sort();
assert.deepEqual(current, manifest.map(item => item.path).sort(), 'Existing article/asset inventory changed');
for (const { path, sha256 } of manifest) {
  assert.equal(createHash('sha256').update(readFileSync(join(root, path))).digest('hex'), sha256, `Changed content: ${path}`);
}
console.log(`Migration preservation: PASS (${manifest.length} article/image files byte-identical to pre-migration snapshot)`);
