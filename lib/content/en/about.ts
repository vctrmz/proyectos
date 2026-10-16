import { ABOUT } from '@/lib/content/about';

/* «Sobre mí» en inglés. Lo que no es texto —ciudades, años, enlaces, grupos de
   herramientas— se hereda del dato en español para no tener dos fuentes de
   verdad. Las negritas se marcan con *asteriscos*, igual que en español. */
export const ABOUT_EN: typeof ABOUT = {
  ...ABOUT,
  intro: [
    'I’m Víctor, a Senior Product Designer.',
    'Eight-plus years designing B2B SaaS in regulated domains: insurance, banking, invoicing and mobility.',
  ],
  education: [
    { degree: '5-year university degree in Computer Science', school: 'Universidad de Oriente', place: 'Cumaná, Venezuela', years: '2017' },
  ],
  ikigai: {
    tech: 'Computer scientist by training: I know how what I design gets built, and I respect how the framework thinks.',
    design: 'Product Designer by trade: eight-plus years in B2B SaaS, from discovery to production.',
    business: 'Business rules, discovery with Product Owners and impact measured with surveys and usage data.',
    center: 'Product design',
  },
  companies: ABOUT.companies.map((c) => ({
    ...c,
    href: c.href.replace('/es', '/en'),
    body: {
      atrinium: 'I led design, as the only designer, for a group with five products, from discovery to production. The main one, HERMES: a multi-tenant, white-label SaaS platform for insurers, reinsurers, MGAs and brokers, with dashboards for the Admin module, which runs the platform, and for each company’s Tenant module. Around it, the Linikit dashboard, Flesip, Ayax Suscripción and the Montsaint e-commerce site: five products, one design system. I also designed the support system —help videos, tutorials and FAQs— and freed up 36% of my design time in eight months, measured with qualitative and quantitative surveys, to analyse real usage with Microsoft Clarity and bring two or three alternatives per initiative instead of one.',
      mercantil: 'Web and mobile digital banking for more than 100k active users, working remotely as a designer for Darien Technology, the consultancy behind the project. I led the experience and interface design on top of the bank’s system and designed executive dashboards for real-time transaction metrics: operational efficiency improved by 28%, measured with an eight-question survey of the team. Nothing went to development untested: unmoderated tests with Maze, my own interviews and high-fidelity prototypes reviewed with the React engineers.',
      taksio: 'A multimodal mobility platform in Caracas: design system and operational flows for driver and passenger, built from scratch.',
    }[c.id] ?? c.body,
  })),
  vision: {
    title: 'I design systems, not screens.',
    paragraphs: [
      'My computer science background is there to *think the product in systems, in structure and in how it will actually be built*, and to take it down to code when it is needed. *I model the domain before the screen*, *define states, rules and edge cases*, and close with a *handoff the team can build without interpreting anything*.',
      'I work with *validated patterns and usability criteria*, not inventions, and respect how things are really built in *React, Chakra UI or Tailwind*. This site is an example: the design is mine and *I directed the implementation with AI down to the detail*. Generating is the easy part; what I bring is *knowing what to ask for and recognising when what comes back is not good enough*.',
      'I care about *complete flows, not isolated screens*. *Systems that make the next design and the next build cost less than the last one.*',
    ],
  },
  /* En ingles va la formulacion documentada de Nielsen —la del articulo de
     NN/g— y no una retraduccion del castellano: si alguien la busca, la
     encuentra tal cual. */
  quote: {
    ...ABOUT.quote,
    text: 'Pay attention to what users do, not what they say.',
    role: 'Usability expert',
    org: 'Co-founder of Nielsen Norman Group',
  },
  skills: [
    'Information architecture and critical flows in regulated domains',
    'Design systems with governance and usage criteria',
    'Multi-tenant products and white-labelling',
    'Forms and business rules declared as data',
    'WCAG 2.2 accessibility as an entry requirement',
    'Discovery and defending proposals to Product Owners',
    'Supported handoff and technical dialogue with engineering',
    'Impact measured with qualitative and quantitative surveys',
    'Dashboards and data visualisation for each role',
    'AI in the process, knowing where it helps and where it fails',
  ],
  bio: [
    'Before drawing anything I prepare. *I analyse the requirements* with whoever asks for them until the real problem is separated from the solution they already have in mind, and *I review what we already have*: design system components, similar flows and decisions taken before. *What already works gets reused*; redesigning what exists costs time and breaks the consistency of the product.',
    'Then I follow a *design thinking* process, but *I do not use all of its tools on every project*: how much I research and how many rounds I go through *depends on the deadline, the urgency and the risk*. A new feature in a regulated domain calls for proper research; an urgent fix, a fast prototype on what exists. What does not change is that *every decision can be explained in business language*, because a design you cannot defend does not get approved.',
  ],
  process: {
    intro: 'Six steps: *two to prepare and four of design thinking*. The order holds; what changes is *how long each one takes and which tools I use*, depending on the deadline, the urgency and how mature the product is.',
    steps: [
      { id: 'analizar', name: 'Analyse', body: 'I start with the *requirements*: the brief, who decides and what limits there are on deadline, regulation and technology. They almost always arrive with a screen in their head; my job is *to separate the real problem from the solution they already have in mind*.',
        does: ['Brief and interviews with the client and Product Owners', 'Limits on deadline, regulation and technology', 'Writing in one sentence what to solve, and for whom'] },
      { id: 'reutilizar', name: 'Reuse', body: 'Before proposing anything new *I review what we already have*: design system components and patterns, similar flows inside the product and decisions that were taken before. *What works gets reused*, what falls short gets extended, and only what is truly missing is designed from scratch.',
        does: ['An inventory of design system components and patterns', 'Similar flows the product already solves', 'What gets reused, what gets extended and what is missing'] },
      { id: 'investigar', name: 'Research', body: 'Then I look at *what is already known* about the problem: the usage data the company has and never reads, the complaints that repeat, and what others have published about the same thing. *When I am not given access to users*, I make up for it by watching how they work and leaning on studies already measured.',
        does: ['Usage data and feedback the company already has', 'Studies, articles and references from the sector', 'Watching someone do their job, without interrupting'] },
      { id: 'definir', name: 'Define', body: 'I bring everything onto *a single canvas* and reduce it to a few decisions with the reasoning written down. From there comes the map: *which states exist, which rules govern and what happens in the odd cases*, before drawing a single screen.',
        does: ['One canvas with what I learned and what I still do not know', 'The decisions and what was discarded, in writing', 'The map of states and rules, before the interface'] },
      { id: 'disenar', name: 'Design', body: 'I bring *two or three comparable alternatives* rather than a single proposal: comparing helps people decide and moves the conversation away from taste. Everything is assembled from system pieces, so *what gets approved can already be built*.',
        does: ['Two or three alternatives, each with its upside and its cost', 'A clickable prototype to see it working', 'Design system pieces, not loose drawings'] },
      { id: 'validar', name: 'Validate', body: 'I test *with few people and early*: five are enough to see where it jams. Then I follow the implementation and *measure the impact from two sources*: qualitative and quantitative surveys, and usage data, because *what people say and what they do do not match*.',
        does: ['A test with five people on the prototype', 'Reviewing the implementation until it ships whole', 'Surveys and usage data afterwards: impact gets measured'] },
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
