export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Finding = {
  id: string; category: 'web' | 'iot'; severity: Severity;
  platform: string; reviewDate: string; discoveryDate?: string;
  plannedDisclosureDate?: string; status: 'reviewed' | 'disclosed';
  url?: string;
};
// Only public-safe metadata. Never commit undisclosed PoCs, target details or private reports.
export const findings: Finding[] = [
  { id: 'ZD-2026-01297', category: 'web', severity: 'low',
    platform: 'HITCON ZeroDay', reviewDate: '2026-10-26',
    plannedDisclosureDate: '2026-12-21', status: 'reviewed',
    url: 'https://zeroday.hitcon.org/vulnerability/ZD-2026-01297' }
];
