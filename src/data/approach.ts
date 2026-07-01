import type { ApproachStep } from '../types';

export const approachSteps: ApproachStep[] = [
  {
    numeral: 'i',
    title: 'Analyze',
    description:
      'I start by understanding how the organization actually works — mapping existing business processes, data, and pain points before changing anything.',
    phase: 'Discovery',
  },
  {
    numeral: 'ii',
    title: 'Configure',
    description:
      'I configure and customize the system to match the way the business needs to run — not the other way around — improving processes along the way.',
    phase: 'Build',
  },
  {
    numeral: 'iii',
    title: 'Train',
    description:
      'I train users hands-on so the team adopts the new system with confidence and owns it day to day.',
    phase: 'Enablement',
  },
  {
    numeral: 'iv',
    title: 'Launch',
    description:
      'I launch the solution and provide ongoing support — staying close after go-live so the system keeps delivering value.',
    phase: 'Go-Live',
  },
];
