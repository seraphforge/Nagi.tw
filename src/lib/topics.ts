import type { ArticleGroup } from './articles';

// These folder-based URLs predate editorial categories and remain available for old links.
export const topicOrder = ['research', 'projects', 'engineering', 'security', 'ctf', 'personal'] as const;
export type Topic = typeof topicOrder[number];
export const topicInfo: Record<Topic, { title: string; description: string }> = {
  research: { title: 'Research', description: '研究、實驗、醫療、AI 與跨領域探索' },
  projects: { title: 'Projects', description: '實際做過的系統、Hackathon 與 Prototype' },
  engineering: { title: 'Engineering', description: 'Linux、Hardware、Embedded 與 Infrastructure' },
  security: { title: 'Security', description: '安全分析、攻防與安全工程' },
  ctf: { title: 'CTF', description: '競賽紀錄與 Challenge Writeups' },
  personal: { title: 'Personal', description: '成長、想法、故事與反思' },
};

const aliases: Record<string, string> = {
  '資安': 'Cybersecurity', '醫療資安': 'Medical Cybersecurity', 'Medical Security': 'Medical Cybersecurity', '零信任': 'Zero Trust',
  'OT 資安': 'OT Security', '比賽': 'Competition', '成長': 'Growth', '選擇': 'Choices',
  '高中生活': 'High School Life', '2026 資安大會': '2026 Cybersecurity Conference',
};
export const topicTitle = (tag: string) => aliases[tag] ?? tag;
export const topicSlug = (tag: string) => topicTitle(tag).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
export function detailedTopics(groups: ArticleGroup[]) {
  const topics = new Map<string, { slug: string; title: string; groups: ArticleGroup[] }>();
  for (const group of groups) {
    for (const tag of new Set(group.availableLanguages.flatMap((language) => group.variants[language]!.data.tags))) {
      const slug = topicSlug(tag);
      const topic = topics.get(slug) ?? { slug, title: topicTitle(tag), groups: [] };
      if (!topic.groups.includes(group)) topic.groups.push(group);
      topics.set(slug, topic);
    }
  }
  return [...topics.values()].sort((a, b) => a.title.localeCompare(b.title, 'zh-TW'));
}

export function visibleTopics(groups: ArticleGroup[]) {
  const definitions = [
    { slug: 'security', title: 'Security', match: /security|資安|ctf|malware|soc|wireshark/i },
    { slug: 'ai', title: 'AI', match: /\bai\b|agent|人工智慧/i },
    { slug: 'embedded', title: 'Embedded', match: /raspberry|embedded|hardware|frc|robot/i },
    { slug: 'medical', title: 'Medical', match: /medical|health|醫療|医療/i },
    { slug: 'systems', title: 'Systems', match: /linux|homelab|windows|system|系統/i },
    { slug: 'life', title: 'Life', match: /personal|reflection|life|成長|近況|選擇|生活|growth/i },
    { slug: 'research', title: 'Research', match: /research|研究|edge ai|醫療資安/i },
    { slug: 'activities', title: 'Activities', match: /conference|competition|frc|ctf|hackathon|比賽|大會|研討會/i },
  ];
  return definitions.map(({ slug, title, match }) => ({ slug, title, groups: groups.filter(group =>
    group.availableLanguages.some(language => match.test([group.variants[language]!.data.title, ...group.variants[language]!.data.tags].join(' '))) || group.category === slug || group.topic === slug
  ) })).filter(topic => topic.groups.length > 0);
}
