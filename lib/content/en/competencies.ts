import type { CompetencyGroup } from '@/lib/content/competencies';

/* Las mismas trece competencias que en español, en inglés. Mismo orden y misma
   numeración. */
export const EN_COMPETENCIES: CompetencyGroup[] = [
  {
    n: '01',
    name: 'Product strategy and design',
    items: [
      { id: '1.1', title: 'Complex B2B SaaS experiences', body: 'Environments with business rules, multiple roles, critical flows and high information density.' },
      { id: '1.2', title: 'Information architecture and flows', body: 'Simplifying complex processes to improve comprehension, efficiency and task completion.' },
      { id: '1.3', title: 'Accessible and inclusive design', body: 'Practical application of WCAG 2.1 and 2.2 in components, content, contrast, focus, keyboard navigation and error states.' },
      { id: '1.4', title: 'Dashboards and data visualisation', body: 'One view for the people who run the platform and another for each client, with the metrics that help people decide, not just look.' },
    ],
  },
  {
    n: '02',
    name: 'Leadership and influence',
    items: [
      { id: '2.1', title: 'Strategic communication', body: 'Presenting proposals, design rationale and findings to align Product, Engineering, Product Owners and stakeholders.' },
      { id: '2.2', title: 'Autonomy and adaptability', body: 'Ownership of initiatives from exploration to implementation, in dynamic and highly ambiguous contexts.' },
      { id: '2.3', title: 'Measured impact', body: 'Qualitative and quantitative surveys and usage data to measure each initiative and compare two or three alternatives with the client.' },
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
  {
    n: '05',
    name: 'AI applied to design',
    items: [
      { id: '5.1', title: 'AI in the design process', body: 'Interactive prototyping, exploring alternatives, research synthesis and documenting flows, knowing where LLMs help and where they fail.' },
      { id: '5.2', title: 'AI-directed implementation', body: 'Foundations in Figma and React front-end directed with Claude. This site is the case: Next.js, tests and public code.' },
    ],
  },
];
