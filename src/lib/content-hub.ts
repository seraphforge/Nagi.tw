import type { Locale } from '../i18n/routes';
import { additionalExperience, type ExperienceCategory } from './experience';

export type HubSection = 'competitions' | 'learning' | 'teaching';
export const hubSections: HubSection[] = ['competitions', 'learning', 'teaching'];

export const hubLabels: Record<Locale, Record<HubSection, { title: string; description: string }>> = {
  zh: {
    competitions: { title: '參賽歷程', description: '不只留下結果，也留下組隊、開發與重新思考的過程。' },
    learning: { title: '研習紀錄', description: '參加過的研習、工作坊與技術交流，以及真正學到的事。' },
    teaching: { title: '教學分享', description: '從助教、社課到技術分享，記錄準備與教學中的收穫。' },
  },
  en: {
    competitions: { title: 'Competitions', description: 'The teams, projects and lessons beyond the final results.' },
    learning: { title: 'Learning', description: 'Workshops, training and technical community experiences.' },
    teaching: { title: 'Teaching', description: 'What I learned from mentoring, preparing classes and sharing ideas.' },
  },
  ja: {
    competitions: { title: '大会・コンテスト', description: '結果だけでなく、チームと開発の過程も記録します。' },
    learning: { title: '研修・学び', description: '研修やワークショップ、技術交流で学んだこと。' },
    teaching: { title: '教えること', description: 'TA や講義、知識を共有した経験の記録。' },
  },
};

export interface HubEntry {
  id: string;
  year?: string;
  article?: string;
  section: HubSection;
  name: string;
  role: string;
}

export function getHubEntries(locale: Locale): HubEntry[] {
  const entries = additionalExperience
    .filter((entry) => entry.category !== 'leadership')
    .map((entry) => ({
      id: entry.id,
      year: entry.year,
      article: entry.article,
      section: (entry.category === 'competitions' ? 'competitions' : 'learning') as HubSection,
      name: entry.copy[locale].name,
      role: entry.copy[locale].role,
    }));
  // These were previously embedded in the Experience view.
  const fixed: { id: string; year: string; article: string; section: HubSection; name: Record<Locale, string>; role: Record<Locale, string> }[] = [
    { id: 'frc-engineering-team', year: '2026', article: 'frc-engineering-team', section: 'competitions', name: { zh: 'FRC 季後賽', en: 'FRC Off-season Competition', ja: 'FRC オフシーズン大会' }, role: { zh: '帶隊、賽前維修與團隊協作', en: 'Team leadership, repairs and collaboration', ja: 'チームの指揮、整備、連携' } },
    { id: 'infosec-taiwan-2026', year: '2026', article: 'infosec-taiwan-2026-student-industry-gap', section: 'learning', name: { zh: 'InfoSec Taiwan 2026', en: 'InfoSec Taiwan 2026', ja: 'InfoSec Taiwan 2026' }, role: { zh: '參訪與產業觀察', en: 'Conference visit and industry observations', ja: 'カンファレンス訪問と業界観察' } },
    { id: '2026-security-conference', year: '2026', article: '2026-security-conference', section: 'learning', name: { zh: '2026 資安大會', en: '2026 Cybersecurity Conference', ja: '2026 サイバーセキュリティカンファレンス' }, role: { zh: '參訪與跨領域探索', en: 'Attending and exploring cross-domain ideas', ja: '参加と分野横断の探究' } },
  ];
  const unique = new Map<string, HubEntry>();
  for (const item of [...fixed.map((event) => ({ id: event.id, year: event.year, article: event.article, section: event.section, name: event.name[locale], role: event.role[locale] })), ...entries]) unique.set(item.id, item);
  return [...unique.values()].sort((a, b) => (b.year ?? '').localeCompare(a.year ?? ''));
}
