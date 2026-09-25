import type { CompetencyGroup } from '@/lib/content/competencies';

/* Las mismas veintidós competencias del portfolio anterior, en inglés. Mismo
   orden y misma numeración que en español. */
export const EN_COMPETENCIES: CompetencyGroup[] = [
  {
    n: '01',
    name: 'Product strategy and design',
    items: [
      { id: '1.1', title: 'End-to-end product design', body: 'Problem definition, research, information architecture, user flows, prototyping, validation, delivery and iteration after launch.' },
      { id: '1.2', title: 'Product and business thinking', body: 'Turning user needs and business goals into solutions that are viable, scalable and aligned with the strategy.' },
      { id: '1.3', title: 'Evidence-based design', body: 'Product analytics, user feedback, usability testing and hypotheses to prioritise and back decisions.' },
      { id: '1.4', title: 'Complex B2B SaaS experiences', body: 'Environments with business rules, multiple roles, critical flows and high information density.' },
      { id: '1.5', title: 'Information architecture and flows', body: 'Simplifying complex processes to improve comprehension, efficiency and task completion.' },
      { id: '1.6', title: 'Accessible and inclusive design', body: 'Practical application of WCAG 2.1 and 2.2 in components, content, contrast, focus, keyboard navigation and error states.' },
    ],
  },
  {
    n: '02',
    name: 'Leadership and influence',
    items: [
      { id: '2.1', title: 'Strategic communication', body: 'Presenting proposals, design rationale and findings to align Product, Engineering, Product Owners and stakeholders.' },
      { id: '2.2', title: 'Facilitating product work', body: 'Workshops, co-creation sessions, design critiques, flow definition and decisions made as a group.' },
      { id: '2.3', title: 'Cross-functional influence', body: 'Balancing user experience, business goals, roadmap priorities and technical constraints.' },
      { id: '2.4', title: 'Product and design advocacy', body: 'Explaining the value proposition and the design decisions to internal teams, clients or external audiences.' },
      { id: '2.5', title: 'Knowledge management', body: 'Documentation, guides, onboarding and working standards that give the team autonomy and consistency.' },
      { id: '2.6', title: 'Autonomy and adaptability', body: 'Ownership of initiatives from exploration to implementation, in dynamic and highly ambiguous contexts.' },
    ],
  },
  {
    n: '03',
    name: 'Design systems and quality',
    items: [
      { id: '3.1', title: 'Systems thinking', body: 'Creating, evolving and maintaining design systems for complex digital platforms.' },
      { id: '3.2', title: 'System governance', body: 'Principles, foundations, tokens, components, patterns, documentation, contribution and adoption across teams.' },
      { id: '3.3', title: 'Scalable interfaces', body: 'UI that is consistent, responsive, accessible and ready for multiple use cases, states and devices.' },
      { id: '3.4', title: 'Experience quality', body: 'Interaction, visual hierarchy, microcopy, empty states, errors, loading, feedback and edge cases.' },
      { id: '3.5', title: 'Brand and product coherence', body: 'Visual identity, tone and brand principles applied to the product, alongside Brand and Marketing.' },
    ],
  },
  {
    n: '04',
    name: 'Technical collaboration and delivery',
    items: [
      { id: '4.1', title: 'Close collaboration with engineering', body: 'Clear specifications, structured handoff, implementation review and questions resolved together to preserve design intent.' },
      { id: '4.2', title: 'Front-end applied to design', body: 'Components, responsive behaviour, design tokens and implementation limits in React, TypeScript and Chakra UI environments.' },
      { id: '4.3', title: 'Design for technical feasibility', body: 'Solutions that balance UX/UI quality, development effort, maintenance and scalability.' },
      { id: '4.4', title: 'Agile work and delivery', body: 'Scrum and Kanban with Jira: priorities, refinement and tracking of initiatives.' },
      { id: '4.5', title: 'Design and documentation tooling', body: 'Figma, prototyping, component libraries, pattern documentation and handoff with technical teams.' },
    ],
  },
];
