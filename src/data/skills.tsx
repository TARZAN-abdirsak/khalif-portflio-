import type { Skill } from '../types';

export const skills: Skill[] = [
  {
    index: 'i.',
    number: '01 / 04',
    titleLeft: 'ERP',
    titleRight: 'Systems',
    description:
      'Implementing ERP platforms that fit how the business actually runs — configured, adopted, and supported end to end.',
    capabilitiesTitle: 'What I Deliver',
    capabilities: [
      'Odoo implementation and support',
      'ERP Next implementation',
      'Functional configuration',
      'Business process improvement',
      'User training and system support',
    ],
    kpisTitle: 'Functional Areas',
    kpis: [
      'Finance & Accounting',
      'Procurement',
      'Inventory',
      'Sales & CRM',
      'Human Resources & Payroll',
      'Asset Management',
    ],
    tags: ['Odoo', 'ERPNext', 'Config'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="6" y="6" width="14" height="14" />
        <rect x="28" y="6" width="14" height="14" />
        <rect x="17" y="28" width="14" height="14" />
        <line x1="13" y1="20" x2="24" y2="28" />
        <line x1="35" y1="20" x2="24" y2="28" />
      </svg>
    ),
  },
  {
    index: 'ii.',
    number: '02 / 04',
    titleLeft: 'Hospital',
    titleRight: 'Digitization',
    description:
      'Bringing hospitals online — patient workflows, diagnostics, and revenue — with systems built for clinical and financial reality.',
    capabilitiesTitle: 'What I Deliver',
    capabilities: [
      'Hospital Management System (HMS) implementation',
      'Medical diagnostic package setup',
      'Revenue cycle management',
      'Hospital chart of accounts design',
    ],
    kpisTitle: 'Focus Areas',
    kpis: [
      'Clinical & patient workflows',
      'Medical finance & cost accounting',
      'Hospital operations',
      'Digital transformation',
    ],
    tags: ['HMS', 'Revenue', 'Clinical'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="24" cy="24" r="18" />
        <path d="M24 15 L24 33 M15 24 L33 24" />
      </svg>
    ),
  },
  {
    index: 'iii.',
    number: '03 / 04',
    titleLeft: 'Data',
    titleRight: 'Analytics',
    description:
      'Turning business data into practical insight — dashboards and reporting that make decisions clear.',
    capabilitiesTitle: 'What I Deliver',
    capabilities: [
      'Microsoft Excel dashboards',
      'Power BI dashboards',
      'Financial and operational reporting',
      'Business performance analysis',
    ],
    kpisTitle: 'Finance & Reporting',
    kpis: [
      'Financial modeling',
      'IFRS-compliant reporting',
      'Budgeting & forecasting',
      'Executive dashboards',
    ],
    tags: ['Power BI', 'Excel', 'IFRS'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M6 38 L18 26 L26 32 L42 14" />
        <path d="M30 14 L42 14 L42 24" />
        <line x1="6" y1="42" x2="42" y2="42" />
      </svg>
    ),
  },
  {
    index: 'iv.',
    number: '04 / 04',
    titleLeft: 'Operations',
    titleRight: 'Management',
    description:
      'Coordinating teams, procurement, and stakeholders so operations run smoothly — and keep improving.',
    capabilitiesTitle: 'What I Deliver',
    capabilities: [
      'Team coordination',
      'Procurement process management',
      'Stakeholder communication',
      'Operational planning and improvement',
    ],
    kpisTitle: 'Sectors Served',
    kpis: [
      'Healthcare',
      'Trading & distribution',
      'Logistics & supply chain',
      'NGO & non-profit',
    ],
    tags: ['Ops', 'Procurement', 'Planning'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="6" y="10" width="22" height="5" />
        <rect x="10" y="20" width="28" height="5" />
        <rect x="6" y="30" width="18" height="5" />
        <circle cx="40" cy="40" r="4" />
      </svg>
    ),
  },
];
