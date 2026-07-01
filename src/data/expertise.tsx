import type { Skill } from '../types';

export const expertise: Skill[] = [
  {
    index: 'i.',
    number: '01 / 03',
    titleLeft: 'Healthcare',
    titleRight: '& Hospitals',
    description:
      'Hospital systems and operations built for clinical and financial reality.',
    capabilitiesTitle: 'Capabilities',
    capabilities: [
      'Hospital Management Systems (HMS)',
      'Clinical and patient workflows',
      'Medical finance and cost accounting',
      'Hospital operations and digital transformation',
    ],
    kpisTitle: 'Outcomes',
    kpis: [
      'Operational efficiency',
      'Financial control',
      'Data accuracy',
      'Faster reporting',
    ],
    tags: ['HMS', 'Clinical', 'Cost'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="24" cy="24" r="18" />
        <path d="M24 14 L24 34 M14 24 L34 24" />
      </svg>
    ),
  },
  {
    index: 'ii.',
    number: '02 / 03',
    titleLeft: 'Commercial',
    titleRight: '& Non-Profit',
    description:
      'Operations for trading, distribution, logistics, and NGO organizations.',
    capabilitiesTitle: 'Capabilities',
    capabilities: [
      'Trading and distribution businesses',
      'Logistics and supply chain operations',
      'NGO financial and operational processes',
      'Business process improvement',
    ],
    kpisTitle: 'Outcomes',
    kpis: [
      'Process efficiency',
      'Supply chain visibility',
      'Donor & operational reporting',
      'Cost control',
    ],
    tags: ['Trade', 'Logistics', 'NGO'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="6" y="10" width="22" height="5" />
        <rect x="10" y="20" width="28" height="5" />
        <rect x="6" y="30" width="18" height="5" />
        <circle cx="40" cy="40" r="4" />
      </svg>
    ),
  },
  {
    index: 'iii.',
    number: '03 / 03',
    titleLeft: 'Finance',
    titleRight: '& Reporting',
    description:
      'Executive-level financial management, reporting, and insight for decision-making.',
    capabilitiesTitle: 'Capabilities',
    capabilities: [
      'Financial modeling',
      'IFRS-compliant financial reporting',
      'Budgeting and forecasting',
      'Executive dashboards and business reporting',
    ],
    kpisTitle: 'Outcomes',
    kpis: [
      'Financial visibility',
      'Budget accuracy',
      'IFRS compliance',
      'Better decisions',
    ],
    tags: ['IFRS', 'FP&A', 'Reporting'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M6 38 L18 26 L26 32 L42 14" />
        <path d="M30 14 L42 14 L42 24" />
        <line x1="6" y1="42" x2="42" y2="42" />
      </svg>
    ),
  },
];
