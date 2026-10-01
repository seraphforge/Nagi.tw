/** Feed errors are diagnostic; unrelated static pages must still build. */
export async function resilientFeed(generate, warn = console.warn) {
  try {
    return await generate();
  } catch (error) {
    warn(`[rss] Feed generation failed; emitted an empty fallback feed. ${error}`);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Nagi.tw</title><link>https://nagi.tw/</link><description>Feed temporarily unavailable.</description></channel></rss>', {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    });
  }
}
