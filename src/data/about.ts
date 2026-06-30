import type { AsideRow, StatItem } from '../types';

export const stats: StatItem[] = [
  { value: '12', suffix: '+', label: 'Years in practice' },
  { value: '40', suffix: '+', label: 'Engagements delivered' },
  { value: '9', label: 'Countries served' },
  { value: '$120', suffix: 'm', label: 'In budgets stewarded' },
];

export const currentlyRows: AsideRow[] = [
  { left: 'Based in', right: 'Mogadishu, SO' },
  { left: 'Working with', right: 'Regional Logistics PLC' },
  { left: 'Available from', right: 'Q3 · 2026' },
  { left: 'Languages', right: 'EN · SO · AR' },
];

export const sectorRows: AsideRow[] = [
  { left: 'Logistics & Trade', right: '—' },
  { left: 'Financial Services', right: '—' },
  { left: 'Public Sector', right: '—' },
  { left: 'Development & INGO', right: '—' },
];
