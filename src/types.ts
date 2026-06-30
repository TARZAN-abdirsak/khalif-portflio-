import type { ReactNode } from 'react';

export interface Skill {
  index: 'i.' | 'ii.' | 'iii.' | 'iv.';
  number: string;
  titleLeft: string;
  titleRight: string;
  description: string;
  capabilities: string[];
  capabilitiesTitle?: string;
  kpis: string[];
  kpisTitle?: string;
  tags: string[];
  icon: ReactNode;
}

export interface ApproachStep {
  numeral: string;
  title: string;
  description: string;
  phase: string;
}

export interface Engagement {
  year: string;
  title: string;
  client: string;
  tag: string;
}

export interface StatItem {
  value: string;
  suffix?: string;
  label: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company?: string;
  rating: number; // 1–5
  message: string;
  image?: string; // data URL (optional avatar)
  date: string; // ISO
}

export interface AsideRow {
  left: string;
  right: string;
}
