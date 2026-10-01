import { articleUrl } from '../i18n/routes';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Topic } from './topics';
import type { Category } from './categories';

export type Language = 'zh' | 'en' | 'ja';
export type Article = CollectionEntry<'articles'> & { topic: Topic; category: Category; language: Language; key: string; routeSlug: string; href: string };
export type ArticleGroup = {
  key: string;
  topic: Topic;
  category: Category;
  variants: Partial<Record<Language, Article>>;
  availableLanguages: Language[];
  primary: Article;
};

export const languageOrder: Language[] = ['zh', 'en', 'ja'];

const suffix = /\.(en|ja)$/;
const fileStem = (id: string) => id.split('/').at(-1)!.replace(/\.(md|mdx)$/, '');
const inferLanguage = (id: string, siteLang?: string): Language => id.match(/\.en(?:\.(md|mdx))?$/) ? 'en' : id.match(/\.ja(?:\.(md|mdx))?$/) ? 'ja' : siteLang?.startsWith('en') ? 'en' : siteLang?.startsWith('ja') ? 'ja' : 'zh';

export function normalize(entry: CollectionEntry<'articles'>): Article {
  const language = inferLanguage(entry.id, entry.data.site_lang);
  const stem = fileStem(entry.id);
  const routeSlug = entry.data.slug ?? stem.replace(suffix, '');
  const key = entry.data.translation_key ?? stem.replace(suffix, '');
  const topic = entry.id.split('/')[0] as Topic;
  const href = articleUrl(language, routeSlug);
  return Object.assign(entry, { topic, category: entry.data.categories[0], language, key, routeSlug, href });
}

export async function getPublicArticles(): Promise<Article[]> {
  const entries = await getCollection('articles', ({ data }) => data.published !== false);
  return entries.map(normalize).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function groupArticles(articles: Article[]): ArticleGroup[] {
  const grouped = new Map<string, Article[]>();
  for (const article of articles) {
    const editions = grouped.get(article.key) ?? [];
    editions.push(article);
    grouped.set(article.key, editions);
  }

  return [...grouped.entries()].map(([key, editions]) => {
    const variants: Partial<Record<Language, Article>> = {};
    for (const article of editions) {
      if (variants[article.language]) throw new Error(`Duplicate ${article.language} edition: ${key}`);
      if (article.category !== editions[0].category) throw new Error(`Inconsistent translation category: ${key}`);
      variants[article.language] = article;
    }
    const availableLanguages = languageOrder.filter((language) => Boolean(variants[language]));
    const primary = variants.zh ?? variants.en ?? variants.ja!;
    for (const edition of editions) {
      edition.routeSlug = primary.routeSlug;
      edition.href = articleUrl(edition.language, primary.routeSlug);
    }
    return { key, topic: primary.topic, category: primary.category, variants, availableLanguages, primary };
  });
}

export async function getPublicArticleGroups(): Promise<ArticleGroup[]> {
  return groupArticles(await getPublicArticles());
}

export function selectArticleLanguage(group: ArticleGroup, requested: Language): Article {
  return group.variants[requested] ?? group.variants.zh ?? group.variants.en ?? group.variants.ja!;
}

export const languageLabel: Record<Language, string> = { zh: '中文', en: 'EN', ja: '日本語' };
export const formatDate = (date: Date, lang: Language = 'zh') => new Intl.DateTimeFormat(lang === 'zh' ? 'zh-TW' : lang, { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
