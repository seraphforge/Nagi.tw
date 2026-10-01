import { ui } from './ui';
import { routeContext } from './routes';
import type { Locale } from './routes';
export function pageI18n(url: URL) {
  const { locale, route } = routeContext(url.pathname);
  return { locale, route, t: ui[locale] };
}
export const formatDate = (date: Date, locale: Locale) => new Intl.DateTimeFormat(locale === 'zh' ? 'zh-TW' : locale, { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' }).format(date);
