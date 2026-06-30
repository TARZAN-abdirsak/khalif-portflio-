import type { Testimonial } from '../types';

/** Seed testimonials shown before any visitor feedback is added. */
export const seedTestimonials: Testimonial[] = [
  {
    id: 'seed-1',
    name: 'Amina Yusuf',
    title: 'Group CFO',
    company: 'Horn Logistics',
    rating: 5,
    message:
      'Khalif rebuilt our close process and stood up the PMO in eight weeks. We went from chasing numbers to trusting them. The handover was complete — the team owns it now.',
    date: '2024-11-02',
  },
  {
    id: 'seed-2',
    name: 'Daniel Okoth',
    title: 'Managing Director',
    company: 'Meridian Fintech',
    rating: 5,
    message:
      'Calm, structured, and relentlessly practical. He sat inside the work, not above it. Our controls finally match the scale of the business.',
    date: '2023-07-19',
  },
  {
    id: 'seed-3',
    name: 'Sara Mohamed',
    title: 'Programme Director',
    rating: 4,
    message:
      'Brought order to a donor portfolio that was drifting. Clear cadence, honest reporting, no theatre. Exactly the discipline we needed.',
    date: '2022-09-30',
  },
];
