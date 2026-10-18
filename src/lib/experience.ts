import type { Locale } from '../i18n/routes';
export type ExperienceCategory = 'competitions' | 'training' | 'conferences' | 'leadership';
export interface ExperienceEntry { id: string; year?: string; article?: string; category: ExperienceCategory; copy: Record<Locale, { name: string; role: string }> }
export const additionalExperience: ExperienceEntry[] = [
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
 { id: 'ais3-myfirstctf-2026', year: '2026', category: 'competitions', copy: {
 zh: { name: 'AIS3 MyFirstCTF 2026', role: '有參賽' },
 en: { name: 'AIS3 MyFirstCTF 2026', role: 'Participated' },
 ja: { name: 'AIS3 MyFirstCTF 2026', role: '参加' } } },
 { id: 'ais3-eof-2026', year: '2026', category: 'competitions', copy: {
 zh: { name: 'AIS3 EOF CTF 2026', role: '有參賽' },
 en: { name: 'AIS3 EOF CTF 2026', role: 'Participated' },
 ja: { name: 'AIS3 EOF CTF 2026', role: '参加' } } },
 { id: 'broncoctf-2026', year: '2026', category: 'competitions', copy: {
 zh: { name: 'BroncoCTF 2026', role: '完賽、取得證書' },
 en: { name: 'BroncoCTF 2026', role: 'Completed; certificate earned' },
 ja: { name: 'BroncoCTF 2026', role: '完走・修了証取得' } } },
 { id: 'junior-crypt-ctf-2026', year: '2026', category: 'competitions', copy: {
 zh: { name: 'Junior Crypt CTF 2026', role: '團隊參賽，第 147 名' },
 en: { name: 'Junior Crypt CTF 2026', role: 'Team participation; 147th place' },
 ja: { name: 'Junior Crypt CTF 2026', role: 'チーム参加・147位' } } },
 { id: 'grodno-ctf-2026', year: '2026', category: 'competitions', copy: {
 zh: { name: 'Grodno::CTF 2026', role: '有參賽' },
 en: { name: 'Grodno::CTF 2026', role: 'Participated' },
 ja: { name: 'Grodno::CTF 2026', role: '参加' } } },
 { id: 'first-tech-challenge', year: '2026', category: 'competitions', copy: {
 zh: { name: 'FIRST Tech Challenge（FTC）', role: '高雄市政府工程啟發獎' },
 en: { name: 'FIRST Tech Challenge (FTC)', role: 'Kaohsiung City Government Engineering Inspiration Award' },
 ja: { name: 'FIRST Tech Challenge（FTC）', role: '高雄市政府エンジニアリング・インスピレーション賞' } } },
 { id: 'first-robotics-competition', year: '2026', category: 'competitions', copy: {
 zh: { name: 'FIRST Robotics Competition（FRC）', role: '評審團獎（Judges\' Award）' },
 en: { name: 'FIRST Robotics Competition (FRC)', role: 'Judges\' Award' },
 ja: { name: 'FIRST Robotics Competition（FRC）', role: '審査員賞（Judges\' Award）' } } },
 { id: 'new-taipei-hackathon', year: '2026', article: 'first-hackathon-in-university', category: 'competitions', copy: {
 zh: { name: '新北市 AI 智慧城市黑客松', role: '入圍決賽' },
 en: { name: 'New Taipei City AI Smart City Hackathon', role: 'Finalist' },
 ja: { name: '新北市 AI スマートシティ・ハッカソン', role: '決勝進出' } } },
 { id: 'ai-life-innovation', year: '2026', category: 'competitions', copy: {
 zh: { name: 'AI 與資訊生活應用創新競賽', role: '佳作' },
 en: { name: 'AI and Information Life Applications Innovation Competition', role: 'Honorable Mention' },
 ja: { name: 'AI・情報生活応用イノベーションコンテスト', role: '佳作' } } },
 { id: 'ilan-programming-ai', year: '2026', category: 'competitions', copy: {
 zh: { name: '國立宜蘭大學程式設計暨資訊及 AI 應用競賽', role: '入圍決賽、佳作' },
 en: { name: 'National Ilan University Programming, Information and AI Applications Competition', role: 'Finalist; Honorable Mention' },
 ja: { name: '国立宜蘭大学 プログラミング・情報・AI 応用コンテスト', role: '決勝進出・佳作' } } },
 { id: 'ironman-creativity', year: '2026', category: 'competitions', copy: {
 zh: { name: '智慧鐵人創意競賽', role: '有參賽' },
 en: { name: 'Intelligent Ironman Creativity Competition', role: 'Participated' },
 ja: { name: 'インテリジェント・アイアンマン創造力コンテスト', role: '参加' } } },
 { id: 'it-services-innovation-30', year: '2025', category: 'competitions', copy: {
 zh: { name: '第 30 屆大專校院資訊應用服務創新競賽', role: '大專組佳作，另有作品入圍決賽' },
 en: { name: '30th Collegiate Information Application Service Innovation Competition', role: 'Collegiate Honorable Mention; another project reached the finals' },
 ja: { name: '第30回 大学情報応用サービス・イノベーションコンテスト', role: '大学部門佳作、別作品が決勝進出' } } },
 { id: 'daydream-hackathon', year: '2025', category: 'competitions', copy: {
 zh: { name: 'Daydream 遊戲開發黑客松', role: '佳作' },
 en: { name: 'Daydream Game Development Hackathon', role: 'Honorable Mention' },
 ja: { name: 'Daydream ゲーム開発ハッカソン', role: '佳作' } } },
 { id: 'northern-security-hackathon', year: '2025', category: 'competitions', copy: {
 zh: { name: '北區高中職程式安全黑客松', role: '挖蛋專家獎' },
 en: { name: 'Northern Taiwan High School Programming Security Hackathon', role: 'Egg-Hunting Expert Award' },
 ja: { name: '北部高校プログラミング・セキュリティハッカソン', role: 'エッグハンティング・エキスパート賞' } } },
 { id: 'cyber-shield', year: '2025', category: 'competitions', copy: {
 zh: { name: '資安金盾獎', role: '有參賽' },
 en: { name: 'Cybersecurity Golden Shield Award', role: 'Participated' },
 ja: { name: 'サイバーセキュリティ金盾賞', role: '参加' } } },
 { id: 'youth-volunteer-competition', year: '2025', category: 'competitions', copy: {
 zh: { name: '教育部青年志工行動競賽', role: '佳作（教育部獎狀）、團隊隊員' },
 en: { name: 'Ministry of Education Youth Volunteer Action Competition', role: 'Honorable Mention (Ministry of Education certificate); team member' },
 ja: { name: '教育部 青年ボランティア活動コンテスト', role: '佳作（教育部表彰状）・チームメンバー' } } },
 { id: 'future-medical-design', year: '2025', category: 'competitions', copy: {
 zh: { name: '未來醫療設計黑客松', role: '有參賽' },
 en: { name: 'Future Healthcare Design Hackathon', role: 'Participated' },
 ja: { name: '未来医療デザイン・ハッカソン', role: '参加' } } },
 { id: 'isteam-powertech', year: '2024', category: 'competitions', copy: {
 zh: { name: 'iSTEAM PowerTech 青少年科技創作競賽', role: '全國佳作' },
 en: { name: 'iSTEAM PowerTech Youth Technology Creation Competition', role: 'National Honorable Mention' },
 ja: { name: 'iSTEAM PowerTech 青少年テクノロジー創作コンテスト', role: '全国佳作' } } },
 { id: 'technical-creativity', year: '2024', category: 'competitions', copy: {
 zh: { name: '全國技術型高中團隊技術創造力培訓與競賽', role: '有參賽' },
 en: { name: 'National Technical High School Team Creativity Training and Competition', role: 'Participated' },
 ja: { name: '全国技術高校チーム技術創造力研修・コンテスト', role: '参加' } } },
];
