import { ABOUT } from '@/lib/content/about';

/* «Sobre mí» en inglés. Lo que no es texto —ciudades, años, enlaces, grupos de
   herramientas— se hereda del dato en español para no tener dos fuentes de
   verdad. Las negritas se marcan con *asteriscos*, igual que en español. */
export const ABOUT_EN: typeof ABOUT = {
  ...ABOUT,
  intro: [
    'I’m Víctor, a Product Designer.',
    'Nine years in dense B2B products: insurance SaaS, digital banking and mobility.',
  ],
  education: [
    { degree: 'BSc in Computer Science', school: 'Universidad de Oriente', place: 'Cumaná, Venezuela', years: '2006–2017' },
  ],
  ikigai: {
    tech: 'Computer scientist by training: I know how what I design gets built, and I respect how the framework thinks.',
    design: 'Product Designer by trade: nine years in dense B2B products, from architecture to handoff.',
    business: 'Business rules, discovery with Product Owners and decisions defended in business language.',
    center: 'Product design',
  },
  companies: ABOUT.companies.map((c) => ({
    ...c,
    href: c.href.replace('/es', '/en'),
    body: {
      atrinium: 'Sole designer of a group with five products. The main one, HERMES: a multi-tenant SaaS ERP for insurers, reinsurers, MGAs and brokers, with the admin module that governs the whole group. Around it, electronic invoicing, a 360 policy system, user and permission management and an e-commerce line. Five products, one design language.',
      mercantil: 'Digital banking in a regulated market. The system already existed and my job was to apply it with judgement and validate every screen before development: unmoderated tests with Maze, my own interviews and sessions with Marketing for the transactional emails. Nothing went to development untested.',
      taksio: 'A multimodal mobility platform in Caracas: design system and operational flows for driver and passenger, built from scratch.',
    }[c.id] ?? c.body,
  })),
  vision: {
    title: 'I design systems, not screens.',
    paragraphs: [
      'My computer science background is not there to write production code: it is there to *think the product in systems, in structure and in how it will actually be built*. *I model the domain before the screen*, *define states, rules and edge cases*, and close with a *handoff the team can build without interpreting anything*.',
      'I work with *validated patterns and usability criteria*, not inventions, and respect how things are really built in *React, Chakra UI or Tailwind*. This site is an example: the design is mine and *I directed the implementation with AI down to the detail*. Generating is the easy part; what I bring is *knowing what to ask for and recognising when what comes back is not good enough*.',
      'I care about *complete flows, not isolated screens*. *Systems that make the next design and the next build cost less than the last one.*',
    ],
  },
  skills: [
    'Information architecture and critical flows in regulated domains',
    'Design systems with governance and usage criteria',
    'Multi-tenant products and white-labelling',
    'Forms and business rules declared as data',
    'WCAG 2.2 accessibility as an entry requirement',
    'Discovery and defending proposals to Product Owners',
    'Supported handoff and technical dialogue with engineering',
    'Research by indirect observation when there is no access to users',
  ],
  bio: [
    'A *group with five products and a single designer*: the insurance ERP and its admin with a *full design system*; the lighter products with a *brandsheet and UI kit*, just enough to hold coherence without governance they do not need.',
    'Around the core: *electronic invoicing* with two opposing audiences (the advisor who invoices daily and needs speed; the client who logs in once a month and needs context), a *360 policy system*, the *user and permission management* that crosses all five products and an *e-commerce* line. *Five products, one design language.*',
    'The starting point was a *monorepo audit*: *267 colour values reduced to 24 tokens*, each with a role, *adopted by all four front-end developers*. Without that shared base, reusing components across products saves nothing.',
    'This is *dense B2B product*: high-density tables, multi-step wizards, schema-generated forms, white-labelling per tenant and business rules that change with the contract. *None of that is solved screen by screen.*',
  ],
  process: {
    intro: 'My process is *iterative and adapts to the maturity of the product*.',
    steps: [
      { id: 'discovery', name: 'Discovery', body: 'I start with *discovery with Product Owners and stakeholders* to separate the real problem from the solution they already have in mind.' },
      { id: 'estrategia', name: 'Strategy', body: 'The strategy changes with the case: *benchmarking and deep research* when the feature is new, *fast prototyping on the design system* when the ground is already built.' },
      { id: 'arquitectura', name: 'Architecture', body: 'I design the *architecture of the solution before drawing screens*: I model the domain, the states and the rules before the interface.' },
      { id: 'validacion', name: 'Validation', body: '*I validate in short cycles* and explain it in *business language*, because a design you cannot defend does not get approved.' },
      { id: 'handoff', name: 'Handoff', body: 'I close with a *handoff the team can build without interpreting anything*: states, rules, edge cases and existing components.' },
    ],
    principles: [
      { name: 'KISS', body: 'The *simplest solution that solves the whole case*: in a dense product every extra element is cognitive load and maintenance debt.' },
      { name: 'Mobile first', body: 'It forces you to *prioritise the essential* before you have space; scaling up to desktop is an extension, not a redesign.' },
      { name: '60 · 30 · 10', body: 'The *dominant neutral* carries the reading, the *secondary* structures surfaces and the *accent* is reserved for action: what matters stands out without more saturation.', bar: [60, 30, 10] as [number, number, number] },
    ],
    outro: 'Above the method, what I look for is *to create atmosphere*: that every screen, every state and every word make *the brand breathe the same air* from one end of the product to the other.',
  },
  toolGroups: [
    { name: 'Design and multimedia', items: ABOUT.toolGroups[0].items },
    { name: 'Development and deployment', items: ABOUT.toolGroups[1].items },
    { name: 'Analytics and behaviour', items: ABOUT.toolGroups[2].items },
    ...ABOUT.toolGroups.slice(3).map((g, i) => ({ name: ['Artificial intelligence', 'Messaging and email'][i] ?? g.name, items: g.items })),
  ],
};
