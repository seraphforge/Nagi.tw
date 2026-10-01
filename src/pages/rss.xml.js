import { withBase } from '../lib/urls';
import rss from '@astrojs/rss';
import { resilientFeed } from '../lib/rss.mjs';
import { getPublicArticleGroups } from '../lib/articles';
export async function GET(context) {
  return resilientFeed(async () => {
  const items = (await getPublicArticleGroups()).flatMap((group) => group.availableLanguages.map((language) => group.variants[language])).map((article) => ({
    title: article.data.title,
    description: article.data.description ?? '',
    pubDate: article.data.date,
    link: article.href,
    categories: [article.category, ...article.data.tags],
  }));
  return rss({ title: 'Nagi.tw', description: 'Hong Xin-Fu / Nagi — Security · Systems · Research. Articles and notes.', site: new URL(withBase('/'), context.site), items });
  });
}
