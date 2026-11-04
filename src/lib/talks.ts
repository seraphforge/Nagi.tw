import type { Locale } from '../i18n/routes';

export type TalkStatus = 'selected' | 'upcoming' | 'completed';

export interface Talk {
  id: string;
  year: string;
  status: TalkStatus;
  copy: Record<Locale, { event: string; title: string; summary: string }>;
  slides?: string;
  recording?: string;
}

export const talks: Talk[] = [
  {
    id: 'local-ai-party-2026',
    year: '2026',
    status: 'selected',
    copy: {
      zh: {
        event: 'Local AI 玩家開箱派對',
        title: '一個大一資安開發者，從 0 打造一個 AI Agent',
        summary: '入選精選講者。預計分享本地 AI Agent 的實作歷程，包括系統架構、技術選擇、開發挑戰，以及資訊安全角度的思考。',
      },
      en: {
        event: 'Local AI Party',
        title: 'Building an AI Agent from Scratch as a First-Year Cybersecurity Developer',
        summary: 'Selected as a featured speaker. The planned talk covers local AI agent architecture, technology choices, development challenges and security considerations.',
      },
      ja: {
        event: 'Local AI プレイヤー交流会',
        title: '大学1年生のセキュリティ開発者が AI Agent をゼロから作るまで',
        summary: '注目講演者として選出。ローカル AI Agent の構成、技術選定、開発中の課題とセキュリティの視点を紹介する予定です。',
      },
    },
  },
];

export const talkStatusLabels: Record<Locale, Record<TalkStatus, string>> = {
  zh: { selected: '精選講者入選', upcoming: '即將演講', completed: '已完成' },
  en: { selected: 'Selected speaker', upcoming: 'Upcoming', completed: 'Completed' },
  ja: { selected: '注目講演者に選出', upcoming: '講演予定', completed: '講演終了' },
};

export const talksCopy: Record<Locale, { title: string; description: string; session: string; materials: string }> = {
  zh: { title: '公開演講', description: '記錄技術社群演講、公開分享與交流的歷程。', session: '分享主題', materials: '簡報與活動紀錄整理完成後公開。' },
  en: { title: 'Talks', description: 'Public talks, technical community presentations and exchanges.', session: 'Talk topic', materials: 'Slides and event notes will be shared when ready.' },
  ja: { title: '公開講演', description: '技術コミュニティでの講演や公開発表、交流の記録。', session: '講演テーマ', materials: 'スライドとイベント記録は準備ができ次第公開します。' },
};
