import type { Skill } from '../types';

export const skills: Skill[] = [
  {
    index: 'i.',
    number: '01 / 04',
    titleLeft: 'Financial',
    titleRight: 'Management',
    description:
      'From management accounting through capital strategy — installing the controls, reporting, and discipline that let leaders make decisions with confidence.',
    capabilities: [
      'Revenue cycle optimization',
      'Patient billing and revenue assurance',
      'Departmental profitability analysis',
      'Hospital budgeting and forecasting',
      'Cash flow management',
      'Financial statement preparation',
      'Executive and board reporting',
      'Operational workflow design',
      'Inventory and pharmaceutical control systems',
    ],
    kpis: [
      'Revenue Growth',
      'Gross Margin',
      'Departmental Profitability',
      'Inventory Turnover',
      'Accounts Receivable Aging',
      'Patient Revenue Metrics',
    ],
    tags: ['IFRS', 'FP&A', 'Controls'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M6 38 L18 26 L26 32 L42 14" />
        <path d="M30 14 L42 14 L42 24" />
        <line x1="6" y1="42" x2="42" y2="42" />
      </svg>
    ),
  },
  {
    index: 'ii.',
    number: '02 / 04',
    titleLeft: 'Project',
    titleRight: 'Management',
    description:
      'I work alongside leadership teams to implement sustainable solutions that improve operational efficiency and support long-term growth.',
    capabilitiesTitle: 'Core Responsibilities',
    capabilities: [
      'Plan and oversee projects from kickoff to delivery',
      'Define scope, timelines, budgets, and milestones',
      'Coordinate between teams, clients, and stakeholders',
      'Track progress and resolve blockers in real time',
      'Manage risks before they become problems',
    ],
    kpisTitle: 'Experience Areas',
    kpis: [
      'ERP and system implementation projects',
      'Healthcare and hospital operations rollouts',
      'Financial systems setup and process redesign',
      'NGO and donor-funded project coordination',
      'SME digital transformation initiatives',
    ],
    tags: ['PMP', 'Prince2', 'Scrum'],
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
    number: '03 / 04',
    titleLeft: 'ERP Strategy &',
    titleRight: 'Digital Transformation',
    description:
      'Technology should support business objectives — not dictate them.',
    capabilitiesTitle: 'ERP Expertise',
    capabilities: [
      'Odoo ERP Implementation',
      'Next ERP Implementation',
      'ERP Requirements Analysis',
      'Business Process Mapping',
      'Workflow Optimization',
      'User Training',
    ],
    kpisTitle: 'Functional Areas',
    kpis: [
      'Finance & Accounting',
      'Procurement',
      'Inventory',
      'Sales & CRM',
      'Human Resources',
      'Payroll',
      'Asset Management',
      'Healthcare Operations',
    ],
    tags: ['SAP', 'Oracle', 'Dynamics', 'Odoo'],
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
    index: 'iv.',
    number: '04 / 04',
    titleLeft: 'Enterprise',
    titleRight: 'Advisory',
    description:
      'Pipeline that converts, partnerships that hold. Building the commercial architecture — market positioning, GTM, channel design — that translates opportunity into durable revenue.',
    capabilitiesTitle: 'Industries I Serve',
    capabilities: [
      'Hospitals and Healthcare Organizations',
      'Trading Companies',
      'Distribution Businesses',
      'Logistics Companies',
      'NGOs and Development Agencies',
      'Professional Service Firms',
      'Multi-Branch Enterprises',
    ],
    kpisTitle: 'Focus Areas',
    kpis: [
      'Financial Management',
      'ERP Strategy',
      'Internal Controls',
      'Process Optimization',
      'Digital Transformation',
      'Performance Reporting',
    ],
    tags: ['GTM', 'B2B', 'CRM'],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="24" cy="24" r="18" />
        <circle cx="24" cy="24" r="10" />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
        <line x1="24" y1="6" x2="24" y2="2" />
        <line x1="42" y1="24" x2="46" y2="24" />
      </svg>
    ),
  },
];
