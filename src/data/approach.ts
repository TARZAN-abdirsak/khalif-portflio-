import type { ApproachStep } from '../types';

export const approachSteps: ApproachStep[] = [
  {
    numeral: 'i',
    title: ' Assesment',
    description:
      "Two weeks of structured listening. Interviews, data review, and a materials audit to map what's actually happening — not what the org chart says is happening.",
    phase: 'Week 1 – 2',
  },
  {
    numeral: 'ii',
    title: 'Design',
    description:
      'A written diagnosis, a recommended path, and a costed plan. No PowerPoint theatre — a memo a board can act on, with tradeoffs named honestly.',
    phase: 'Week 3 – 4',
  },
  {
    numeral: 'iii',
    title: 'Deliver',
    description:
      'Hands on the work. Standing up the PMO, leading the ERP rollout, building the financial close, or running the GTM motion alongside your team — whatever the engagement requires.',
    phase: 'Month 2 – 9',
  },
  {
    numeral: 'iv',
    title: 'Hand off',
    description:
      'Documentation, capability transfer, and a 90-day support window. The goal is that your team owns it — confidently, not anxiously — when I leave.',
    phase: 'Closing',
  },
];
