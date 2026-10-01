import type { Locale } from '../i18n/routes';
export type ExperienceCategory = 'competitions' | 'training' | 'conferences' | 'leadership';
export interface ExperienceEntry { id: string; year?: string; article?: string; category: ExperienceCategory; copy: Record<Locale, { name: string; role: string }> }
export const additionalExperience: ExperienceEntry[] = [
 { id: 'new-taipei-hackathon', article: 'first-hackathon-in-university', category: 'competitions', copy: {
 zh: { name: '新北市城市黑客松', role: '組隊開發教保機構風險監測平台與資料爬蟲。' },
 en: { name: 'New Taipei City Hackathon', role: 'Formed a team; built a childcare risk monitoring platform and data crawler.' },
 ja: { name: '新北市シティハッカソン', role: 'チームを組み、保育施設リスク監視プラットフォームとデータ収集を開発。' } } },
 { id: 'tatung-workshop', article: 'ctf-meets-malware-analysis-windows', category: 'training', copy: {
 zh: { name: '大同大學資訊安全研習', role: '惡意程式分析、網路攻防與連線行為實作。' },
 en: { name: 'Tatung University Information Security Workshop', role: 'Malware analysis and network attack/defense practice.' },
 ja: { name: '大同大学 情報セキュリティ研修', role: 'マルウェア解析とネットワーク攻防の実習。' } } },
 // Recovered from nagi.tw/src/data/experience.ts (source: source/_data/experience.json)
 { id: 'hpc-ai-summer-camp', year: '2026', category: 'training', copy: {
 zh: { name: 'HPC AI 暑期培訓營', role: '國立清華大學主辦，高效能運算與 AI 技術培訓。' },
 en: { name: 'HPC AI Summer Camp', role: 'HPC and AI training hosted by National Tsing Hua University.' },
 ja: { name: 'HPC AI サマーキャンプ', role: '国立清華大学主催、HPC・AI 技術の研修。' } } },
 { id: 'ai-cybersec-workshop', year: '2026', category: 'training', copy: {
 zh: { name: 'AI × 資安工作坊系列：AI for Good', role: '探索 AI 在資安與公益場域的應用。' },
 en: { name: 'AI × Cybersecurity Workshop Series: AI for Good', role: 'Exploring AI applications in security and public-interest contexts.' },
 ja: { name: 'AI × サイバーセキュリティ・ワークショップシリーズ：AI for Good', role: 'セキュリティと公益分野における AI 活用の探究。' } } },
 { id: 'ais3-myfirstctf-2026', year: '2026', category: 'competitions', copy: {
 zh: { name: 'AIS3 MyFirstCTF 2026', role: '資安初學者 CTF 競賽。' },
 en: { name: 'AIS3 MyFirstCTF 2026', role: 'Entry-level cybersecurity CTF competition.' },
 ja: { name: 'AIS3 MyFirstCTF 2026', role: '初学者向けサイバーセキュリティ CTF 大会。' } } },
 { id: 'first-tech-challenge', year: '2026', category: 'competitions', copy: {
 zh: { name: 'FIRST Tech Challenge', role: '機器人工程競賽。' },
 en: { name: 'FIRST Tech Challenge', role: 'Robotics engineering competition.' },
 ja: { name: 'FIRST Tech Challenge', role: 'ロボット工学の競技大会。' } } },
 { id: 'apcs-summer-camp', year: '2025', category: 'training', copy: {
 zh: { name: 'APCS 模擬測驗團隊暑期營隊', role: '程式設計能力鑑定準備培訓。' },
 en: { name: 'APCS Mock Test Team Summer Camp', role: 'Competitive programming preparation training.' },
 ja: { name: 'APCS 模擬テストチーム・サマーキャンプ', role: '競技プログラミングの準備研修。' } } },
 { id: 'hitcon-2025', year: '2025', category: 'conferences', copy: {
 zh: { name: 'HITCON Conference 2025', role: '臺灣資安社群年度旗艦研討會。' },
 en: { name: 'HITCON Conference 2025', role: 'Annual flagship security conference of the Taiwanese security community.' },
 ja: { name: 'HITCON Conference 2025', role: '台湾セキュリティコミュニティの年次フラッグシップカンファレンス。' } } },
 { id: 'coscup-2025', year: '2025', category: 'conferences', copy: {
 zh: { name: 'COSCUP 2025', role: '臺灣開源社群年度研討會。' },
 en: { name: 'COSCUP 2025', role: 'Annual open-source community conference in Taiwan.' },
 ja: { name: 'COSCUP 2025', role: '台湾のオープンソースコミュニティの年次カンファレンス。' } } },
];
