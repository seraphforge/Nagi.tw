import { getPublicArticleGroups } from '../lib/articles';
import { detailedTopics, visibleTopics, topicInfo, topicOrder } from '../lib/topics';
import { locales } from './routes';

export async function siteRoutes() {
  const groups = await getPublicArticleGroups();
  const topics = detailedTopics(groups).map((topic) => ({ ...topic, legacy: false }));
  for (const slug of topicOrder) {
    const existing = topics.find((topic) => topic.slug === slug);
    if (existing) {
      const merged = groups.filter((group) => group.topic === slug || existing.groups.includes(group));
      existing.legacy = merged.length > existing.groups.length;
      existing.groups = merged;
    } else topics.push({ slug, title: topicInfo[slug].title, groups: groups.filter((group) => group.topic === slug), legacy: true });
  }
  for (const broad of visibleTopics(groups)) {
    const existing = topics.find(topic => topic.slug === broad.slug);
    if (existing) existing.groups = groups.filter(group => broad.groups.includes(group) || existing.groups.includes(group));
    else topics.push({ ...broad, legacy: false });
  }
  const fixed = { '': 'Home', about: 'About', contact: 'Contact', research: 'Research', projects: 'Projects', experience: 'Experience', articles: 'Articles', archive: 'Archive', topics: 'Topics' } as const;
  return locales.flatMap((locale) => {
    const path = (route: string) => [locale === 'zh' ? '' : locale, route].filter(Boolean).join('/') || undefined;
    return [
      ...Object.entries(fixed).map(([route, view]) => ({ params: { path: path(route) }, props: { view, groups } })),
      ...groups.map((group) => ({ params: { path: path(`articles/${group.primary.routeSlug}`) }, props: { view: 'Article', groups, group } })),
      ...topics.map((topic) => ({ params: { path: path(`topics/${topic.slug}`) }, props: { view: 'Topic', groups: topic.groups, topic } })),
    ];
  });
}
