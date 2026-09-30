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
    { degree: '5-year university degree in Computer Science', school: 'Universidad de Oriente', place: 'Cumaná, Venezuela', years: '2017' },
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
      mercantil: 'Digital banking in a regulated market, working remotely from Spain as a designer for Darien Technology, the consultancy behind the project. The system already existed and my job was to apply it with judgement and validate every screen before development: unmoderated tests with Maze, my own interviews and sessions with Marketing for the transactional emails. Nothing went to development untested.',
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
    'Research by indirect observation when there is no access to users',
  ],
  bio: [
    'I work the same way on an insurance ERP as on an online shop: *first understand the business, then organise what I understood, and only then draw*. Skip the first two steps and you get something pretty that solves nothing.',
    'The method adapts to the ground. When the feature is new, *I research properly before proposing*; when the path is already built, *I prototype fast on what exists*. What does not change is that *every decision can be explained in business language*, because a design you cannot defend does not get approved.',
  ],
  process: {
    intro: 'Five steps, always in the same order. What changes is *how long each one takes*, depending on how mature the product is.',
    steps: [
      { id: 'entender', name: 'Understand', body: 'I start with the *client brief* and with separating the real problem from the solution they already have in mind. They almost always arrive with a screen in their head; my job is to find out what actually hurts.',
        does: ['Brief and interviews with the client and product owners', 'Listening to the people on support and on sales', 'Writing in one sentence what to solve, and for whom'] },
      { id: 'investigar', name: 'Research', body: 'Before inventing anything I look at *what is already known*: the usage data the company has and never reads, the complaints that repeat, and what others have published about the same problem. *When I am not given access to users*, I make up for it by watching how they work and leaning on studies already measured.',
        does: ['Usage data and feedback the company already has', 'Studies, articles and references from the sector', 'Watching someone do their job, without interrupting'] },
      { id: 'ordenar', name: 'Organise', body: 'I bring everything onto *a single canvas* and reduce it to a few decisions with the reasoning written down. From there comes the map: *which states exist, which rules govern and what happens in the odd cases*, before drawing a single screen.',
        does: ['One canvas with what I learned and what I still do not know', 'The decisions and what was discarded, in writing', 'The map of states and rules, before the interface'] },
      { id: 'disenar', name: 'Design', body: 'I bring *two or three comparable alternatives* rather than a single proposal: comparing helps people decide and moves the conversation away from taste. Everything is assembled from system pieces, so *what gets approved can already be built*.',
        does: ['Two or three alternatives, each with its upside and its cost', 'A clickable prototype to see it working', 'Design system pieces, not loose drawings'] },
      { id: 'comprobar', name: 'Check', body: 'I test *with few people and early*: five are enough to see where it jams. Then I follow the implementation and go back to the data, because *what people say and what they do do not match*.',
        does: ['A test with five people on the prototype', 'Reviewing the implementation until it ships whole', 'Usage data afterwards, not just opinions before'] },
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
