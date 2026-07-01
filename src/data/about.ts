import type { AsideRow, StatItem } from '../types';

export const stats: StatItem[] = [
  { value: '12', suffix: '+', label: 'Years in practice' },
  { value: '40', suffix: '+', label: 'Engagements delivered' },
  { value: '9', label: 'Countries served' },
  { value: '$120', suffix: 'm', label: 'In budgets stewarded' },
];

export const currentlyRows: AsideRow[] = [
  { left: 'Based in', right: 'Mogadishu, SO' },
  { left: 'Education', right: 'BBA · Dip. Health Mgmt' },
  { left: 'Focus', right: 'ERP · Healthcare · Finance' },
  { left: 'Languages', right: 'EN · SO · AR' },
];

export const sectorRows: AsideRow[] = [
  { left: 'Healthcare & Hospitals', right: '—' },
  { left: 'Commercial & Trade', right: '—' },
  { left: 'Non-Profit & NGO', right: '—' },
  { left: 'Finance & Operations', right: '—' },
];
