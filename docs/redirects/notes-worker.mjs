// Review-only Cloudflare Worker module. No deployment configuration is included.
// Later bind ONLY notes.nagi.tw, never nagi.tw or *.nagi.tw.
import { notesRedirects } from './notes-routes.mjs';

export default {
  fetch(request) {
    const source = new URL(request.url);
    if (source.hostname !== 'notes.nagi.tw') return new Response('Not found', { status: 404 });
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    const path = source.pathname.replace(/%[0-9a-f]{2}/gi, part => part.toUpperCase());
    const destination = Object.hasOwn(notesRedirects, path) ? notesRedirects[path] : undefined;
    if (!destination) {
      return new Response(request.method === 'HEAD' ? null : 'Not found', {
        status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }
    const target = new URL(destination);
    target.search = source.search;
    return new Response(null, { status: 301, headers: { Location: target.href } });
  },
};
