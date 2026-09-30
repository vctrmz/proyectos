import type { CompetencyGroup } from '@/lib/content/competencies';

/* Las mismas nueve competencias que en español, en inglés. Mismo orden y misma
   numeración. */
export const EN_COMPETENCIES: CompetencyGroup[] = [
  {
    n: '01',
    name: 'Product strategy and design',
    items: [
      { id: '1.1', title: 'Complex B2B SaaS experiences', body: 'Environments with business rules, multiple roles, critical flows and high information density.' },
      { id: '1.2', title: 'Information architecture and flows', body: 'Simplifying complex processes to improve comprehension, efficiency and task completion.' },
      { id: '1.3', title: 'Accessible and inclusive design', body: 'Practical application of WCAG 2.1 and 2.2 in components, content, contrast, focus, keyboard navigation and error states.' },
    ],
  },
  {
    n: '02',
    name: 'Leadership and influence',
    items: [
      { id: '2.1', title: 'Strategic communication', body: 'Presenting proposals, design rationale and findings to align Product, Engineering, Product Owners and stakeholders.' },
      { id: '2.2', title: 'Autonomy and adaptability', body: 'Ownership of initiatives from exploration to implementation, in dynamic and highly ambiguous contexts.' },
    ],
  },
  {
    n: '03',
    name: 'Design systems and quality',
    items: [
      { id: '3.1', title: 'Systems thinking', body: 'Creating, evolving and maintaining design systems for complex digital platforms.' },
      { id: '3.2', title: 'System governance', body: 'Principles, foundations, tokens, components, patterns, documentation, contribution and adoption across teams.' },
    ],
  },
  {
    n: '04',
    name: 'Technical collaboration and delivery',
    items: [
      { id: '4.1', title: 'Close collaboration with engineering', body: 'Clear specifications, structured handoff, implementation review and questions resolved together to preserve design intent.' },
      { id: '4.2', title: 'Front-end applied to design', body: 'Components, responsive behaviour, design tokens and implementation limits in React, TypeScript and Chakra UI environments.' },
    ],
  },
];
