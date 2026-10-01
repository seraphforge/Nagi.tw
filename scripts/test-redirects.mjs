import assert from 'node:assert/strict';
import worker from '../docs/redirects/notes-worker.mjs';
import { notesRedirects } from '../docs/redirects/notes-routes.mjs';
for (const [path, destination] of Object.entries(notesRedirects)) {
  for (const protocol of ['http:', 'https:']) {
    for (const method of ['GET', 'HEAD']) {
      const result = worker.fetch(new Request(`${protocol}//notes.nagi.tw${path}?q=a%2Fb&tag=x&tag=y`, { method }));
      assert.equal(result.status, 301);
      assert.equal(result.headers.get('location'), `${destination}?q=a%2Fb&tag=x&tag=y`);
    }
  }
}
for (const path of ['/missing/', '/articles/missing.en.html', '/articles/from-nihscsed-to-control-team/', '/zh/unknown/', '/assets/images/missing.png', '/topics/ai/unknown/', '/en/articles/from-nihscsed-to-control-team/']) {
  const response = worker.fetch(new Request(`https://notes.nagi.tw${path}`));
  assert.equal(response.status, 404, path);
  assert.equal(response.headers.get('location'), null);
}
assert.equal(worker.fetch(new Request('https://nagi.tw/')).status, 404);
assert.equal(worker.fetch(new Request('https://notes.nagi.tw/', { method: 'POST' })).status, 405);
console.log(`Inactive Notes Worker: PASS (${Object.keys(notesRedirects).length} exact paths, HTTP/HTTPS, GET/HEAD, query retention, unknown/unpublished 404)`);
