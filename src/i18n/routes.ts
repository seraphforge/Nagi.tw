import { withBase } from '../lib/urls';
export const locales = ['zh', 'en', 'ja'] as const;
export type Locale = typeof locales[number];
export const languageTags = { zh: 'zh-Hant', en: 'en', ja: 'ja' } as const;
export function routeContext(pathname: string): { locale: Locale; route: string } {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = base && (pathname === base || pathname.startsWith(`${base}/`)) ? pathname.slice(base.length) : pathname;
  const parts = path.replace(/^\/+|\/+$/g, '').split('/');
  const locale: Locale = parts[0] === 'en' || parts[0] === 'ja' ? parts.shift() as Locale : 'zh';
  const route = parts.filter(Boolean).join('/');
  return { locale, route: route ? `/${route}/` : '/' };
}
/** Input is an unprefixed site route; queries and fragments remain intact. */
export function localeUrl(locale: Locale, route = '/'): string {
  return withBase(`${locale === 'zh' ? '' : `/${locale}`}/${route.replace(/^\/+/, '')}`);
}
export const articleUrl = (locale: Locale, slug: string) => localeUrl(locale, `/articles/${slug}/`);
