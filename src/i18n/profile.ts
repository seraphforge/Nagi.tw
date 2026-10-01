import type { Locale } from './routes';
const zh = {
  home: '首頁', research: '研究', projects: '專案',
  intro: '我是 Hong Xin-Fu / Nagi。這裡整理我在資安、系統實作與研究探索之間累積的問題、作品和經驗。',
  currently: '目前關注', current: '從醫療現場的需求出發，探索離線 AI、邊緣運算與系統權限的界線。',
  asOf: '依最新公開近況：2026-09-04', featuredResearch: '研究選輯', featuredProjects: '專案選輯', experience: '經歷預覽',
  researchIntro: '從公開紀錄整理的研究問題與探索方向。', projectsIntro: '有實作紀錄的專案；依公開紀錄標示範圍與進度。',
  question: '問題與範圍', status: '公開紀錄中的狀態', evidence: '相關文章與依據', more: '查看完整內容 →',
  healthcare: { title: '醫療資安與臨床需求', area: '醫療資訊安全', question: '如何先理解臨床流程，再判斷生命徵象資料驗證真正需要解決的問題？', status: '需求探索與反思；文章記錄與護理師討論後對原先構想的修正。' },
  edge: { title: '離線 AI 與權限邊界', area: 'Edge AI · 系統安全', question: '斷網或敏感資料無法離開設備時，AI 如何運作？可操作系統的 Agent 應有多少權限？', status: '探索中；2026-09-04 的近況記錄正在研究離線 AI 與硬體限制。' },
};
type Profile = typeof zh;
const en: Profile = {
  home: 'Home', research: 'Research', projects: 'Projects',
  intro: 'I’m Hong Xin-Fu / Nagi. This is a record of my questions, practical work, and experiences across security, systems, and research.',
  currently: 'Currently', current: 'Exploring offline AI, edge computing, and system permission boundaries, starting with the needs of healthcare settings.',
  asOf: 'Latest public update: 2026-09-04', featuredResearch: 'Featured Research', featuredProjects: 'Featured Projects', experience: 'Experience preview',
  researchIntro: 'Research questions and directions grounded in public notes.', projectsIntro: 'Projects with documented implementation work. Public records establish their scope and progress.',
  question: 'Question / scope', status: 'Documented status', evidence: 'Related article / evidence', more: 'Explore →',
  healthcare: { title: 'Healthcare security and clinical needs', area: 'Healthcare information security', question: 'How can understanding clinical workflows guide which vital-sign data validation problems actually need solving?', status: 'Requirements exploration and reflection; the article records revising an initial idea after a discussion with a nurse.' },
  edge: { title: 'Offline AI and permission boundaries', area: 'Edge AI · Systems security', question: 'How can AI operate when connectivity is lost or sensitive data must stay on-device? What permissions should a system-operating agent have?', status: 'Exploratory work; the September 4, 2026 update describes investigating offline AI and hardware constraints.' },
};
const ja: Profile = {
  home: 'ホーム', research: '研究', projects: 'プロジェクト',
  intro: 'Hong Xin-Fu / Nagi です。セキュリティ、システムの実装、研究の探究を通じて得た問い、制作、経験を記録しています。',
  currently: '現在の関心', current: '医療現場のニーズを起点に、オフライン AI、エッジコンピューティング、システム権限の境界を探究しています。',
  asOf: '最新の公開近況：2026-09-04', featuredResearch: '研究ピックアップ', featuredProjects: 'プロジェクトピックアップ', experience: '活動記録から',
  researchIntro: '公開した記録に基づく研究の問いと探究の方向性。', projectsIntro: '実装の記録があるプロジェクトです。公開記録に基づいて範囲と進捗を示します。',
  question: '問い・範囲', status: '公開記録での状況', evidence: '関連記事・根拠', more: '詳しく見る →',
  healthcare: { title: '医療セキュリティと臨床のニーズ', area: '医療情報セキュリティ', question: '臨床の流れを理解したうえで、バイタルデータの検証が本当に必要な場面をどう見極めるか？', status: 'ニーズの探究と振り返り。看護師との対話を通じて、当初の構想を見直した記録です。' },
  edge: { title: 'オフライン AI と権限の境界', area: 'Edge AI · システムセキュリティ', question: '通信が途絶えたり機密データを端末外に出せない場合、AI はどう動作するか？システムを操作する Agent にどこまで権限を与えるか？', status: '探究段階。2026-09-04 の近況ではオフライン AI とハードウェアの制約を調べています。' },
};
export const profile: Record<Locale, Profile> = { zh, en, ja };
