import { shot, type CaseStudy } from '../../cases/types';

export const hermesEn: CaseStudy = {
  slug: 'hermes', title: 'HERMES, an insurance platform', company: 'Atrinium', years: '2022–2026',
  tagline: 'A standard product for businesses that look nothing alike: 165 screens and 8 areas on a single core, with its CRM and the landing page that sells it, without forking the product per client.',
  tags: ['Case study', 'In production', 'Insurtech', 'Multi-tenant', 'Schema-driven forms', 'Design tokens'], brand: '#1f2a5a',
  hero: shot('hx-dashboard', 'HERMES Admin CRM dashboard with lead metrics, conversion rate and the list of opportunities', 'The dashboard: sales network metrics and whatever needs action, on the first screen'),
  context: 'Atrinium’s insurance SaaS for brokers, underwriting agencies and insurers: underwriting, policies, receipts, billing and claims. A product in production with no maintenance window, while a framework and database migration was under way and two generations of interface lived side by side.',
  role: 'Sole designer of the group, in a team of seven. Weekly discovery with the insurers’ Product Owners and defending every proposal before handing it to engineering.',
  delivery: 'Multi-tenant web application, its CRM, the full design system, the per-company configuration surfaces and the product landing page.',
  problem: [
    'Every company arrived with its own business logic, currency, language and regulator, and expected the product to behave like theirs.',
    'If the product bends for every client it stops being a product; if it bends for no one, nobody uses it.',
  ],
  complexity: { diagram: 'clients-to-system', caption: 'Three companies with incompatible rules on one configurable system: the difference lives in the data, not in a branch of the product.' },
  decisions: [
    { title: 'I designed rules instead of cases.', why: 'Every line of insurance has its own questionnaire; designing one screen per line and per client does not scale and leaves the criteria in the designer’s head.', changed: 'Each line’s questionnaire is declared as data and the interface renders it with its validation. Onboarding a new company no longer requires bespoke design.', tradeoff: 'The rule becomes the critical artefact: a badly declared schema breaks a screen nobody designed, so validation has to live with the data.', figure: { diagram: 'before-after' } },
    { title: 'The level of system each product can afford.', why: 'The obvious answer was to impose a single system on the group’s five products. The lighter products do not need that governance.', changed: 'A full design system for the ERP and the admin; a brandsheet and UI kit for the lighter products. Five businesses that do not feel like five different companies.', figure: { shot: shot('07-seleccionar-moneda', 'Currency selector component', 'Components with a contract: the same selector across all four front ends') } },
    { title: 'Brand and language as variables, not as versions.', why: 'White-labelling per tenant, with five base languages and seven locales of insurance terminology.', changed: 'Each client’s palette resolves at sign-in and terminology resolves per locale, propagated through semantic tokens and language catalogues, without duplicating components.', figure: { shot: shot('04-preparar-producto', 'Product setup: modules, plugins and languages per client', 'Modules, plugins and system languages configured per client') } },
    { title: 'The CRM follows the agent’s day, not the product’s org chart.', why: 'Leads, contacts, pipeline and tickets existed as separate modules, and an agent does not work by module: they work by the questions the day brings.', changed: 'Five chained steps — capture, know, negotiate, support and measure — where each module feeds the next: a lead becomes a contact, an opportunity and a client being served, without switching tabs.', figure: { shot: shot('hx-pipeline', 'Sales pipeline in a kanban by stage with the value of each one', 'Pipeline: value per stage and probability of closing on the card, in the same colour code as the dashboard') } },
    { title: 'A landing page that explains the product with the product itself.', why: 'Insurance SaaS is not sold with illustrations: whoever buys wants to see the screen their team will operate.', changed: 'Every feature block comes with its real screen inside a brand frame, alternating sides to set the reading rhythm, and closes with direct contact by WhatsApp, phone or email.', figure: { shot: shot('hx-l_multi', 'Customisation and multi-language block of the landing page on a navy background', 'The block that sells the hardest thing to explain: customisation, multi-language and multi-currency') } },
    { title: 'Module by module, complete consistency over scattered improvements.', why: 'With two generations of interface side by side, improving everything a little keeps the inconsistency forever.', changed: 'Each migrated module ships whole with the new system; the criteria are written down and do not depend on me being in the room.', tradeoff: 'For months two generations of interface are visible to the user. Accepted in exchange for not leaving the inconsistency installed for good.', figure: { diagram: 'areas-map' } },
  ],
  system: {
    body: [
      'A monorepo audit with AI to extract every colour value in use: 267 scattered values reduced to 24 tokens, each with a role, adopted by all four front ends. The tokens were exported to evolve the previous design system, not to throw it away.',
      'Components with a contract and accessibility enforced by the linter: when each pattern is used and why is documented before it reaches engineering.',
      'The visual system is corporate night with a single magenta: the indigo of the login and the landing page becomes the panel sidebar, and the magenta of the “e” marks only what requires action. Every other state uses semantic colour, never the brand one.',
    ],
    code: { title: 'A line’s questionnaire, declared as data (excerpt)', lang: 'json', source: 'illustrative', code: "{\n  \"line\": \"motor-fleet\",\n  \"version\": 3,\n  \"steps\": [\n    {\n      \"id\": \"vehicle\",\n      \"fields\": [\n        { \"id\": \"plate\", \"type\": \"text\", \"required\": true, \"pattern\": \"^[0-9]{4}[A-Z]{3}$\" },\n        { \"id\": \"use\", \"type\": \"select\", \"options\": [\"private\", \"fleet\", \"taxi\"], \"required\": true },\n        { \"id\": \"fleetSize\", \"type\": \"number\", \"min\": 2,\n          \"visibleIf\": { \"field\": \"use\", \"equals\": \"fleet\" } },\n        { \"id\": \"taxiLicence\", \"type\": \"text\",\n          \"visibleIf\": { \"field\": \"use\", \"equals\": \"taxi\" } }\n      ]\n    }\n  ],\n  \"labels\": \"i18n:insurance.motor\"\n}" },
    uiKit: [
      { kind: 'tokens', title: 'Tokens with a role', body: '267 colour values in use reduced to 24 tokens, each with a declared role: every company’s brand resolves at sign-in, without duplicating components.', wide: true },
      { kind: 'form', title: 'Schema-driven form', body: 'Each line’s questionnaire is declared as data and the interface renders it with its validation: a new line does not ask for new screens.', wide: true },
      { kind: 'table', title: 'High-density table', body: 'The table is the workspace: compact rows, status on the right and actions that appear on the active row.' },
      { kind: 'states', title: 'States', body: 'Their own colour and background, never colour alone: the same state language in table, panel and document.' },
      { kind: 'actions', title: 'Action hierarchy', body: 'The action that closes the step in brand colour, the reversible one outlined, the way out with no weight.', label: 'Issue policy' },
    ],
  },
  flows: {
    title: 'Flows',
    caption: 'The CRM is not ordered by modules but by an agent’s daily questions: each step feeds the next.',
    list: [
      { title: 'From lead to policy', side: 'without switching tabs', steps: [
        { n: '01', t: 'Capture', d: 'Leads with their source, status and agent, and the day’s calendar right next to them.' },
        { n: '02', t: 'Know', d: 'Contact record with history per channel, internal comments and the linked company.' },
        { n: '03', t: 'Negotiate', d: 'Pipeline in a kanban by stage, with value and probability of closing on the card.' },
        { n: '04', t: 'Support', d: 'Tickets with saved views and priority visible by colour.' },
        { n: '05', t: 'Measure', d: 'A dashboard with the network’s metrics and alerts for whatever requires action.' },
      ] },
    ],
  },
  design: [
    shot('08-planes-servicios', 'Plans and services per company', 'Plans and services: a product catalogue composed per business, with no bespoke development'),
    shot('hx-leads', 'Lead table with source, status and assigned agent, and the day’s calendar', 'Leads: source, status and agent, with the calendar alongside to call without losing context'),
    shot('hx-tickets', 'Ticket inbox with saved views and priority by colour', 'Tickets: saved views — unassigned, open, the group’s — and priority visible on each row'),
    shot('hx-login', 'Sign-in screen “Welcome to Hermes Admin” with a photograph in blue', 'The login: enterprise-grade security as the product’s first message'),
    shot('14-document-model', 'Document model', 'Document model: the restriction lives in the data, not only in the interface'),
    shot('hx-landing', 'Full HERMES landing page with the feature blocks', 'The landing page: every feature with its real screen, alternating sides'),
  ],
  implementation: [
    'Tokens and components were handed over with usage criteria; engineering stopped asking how a pattern behaves because it is defined before it reaches them.',
    'Every new module is assembled from components that already exist; when it needs something new, it gives it back to the catalogue.',
  ],
  result: {
    output: [
      { value: '165', label: 'screens in production', meaning: 'One per real flow, not per client variant: configuration absorbs the variation.' },
      { value: '8', label: 'product areas', meaning: 'Underwriting, policies, receipts, billing, claims, administration, users and reporting in the same design language.' },
      { value: '60 → 14', label: 'fields visible per step when issuing a policy', meaning: 'Fields appear when a rule asks for them, instead of showing all of them all the time.' },
      { value: '267 → 24', label: 'colour tokens', meaning: 'Adopted by all four front-end developers: the base that makes reusing components actually save time.' },
    ],
    /* Derived outcome: every figure is arithmetic on a number this case already
       documents, and its explanation says where it comes from. What was never
       instrumented stays declared below, in `measure`. */
    outcome: [
      { value: '−77 %', label: 'fields the user sees per step', meaning: 'Arithmetic on the figure above: from 60 visible fields per step to 14 when issuing a policy. It is not a time measurement, it is the reduction in what the screen asks for.' },
      { value: '−91 %', label: 'colour values in the codebase', meaning: 'From 267 scattered values to 24 tokens with a role. The number comes from the monorepo audit, which is where they were counted.' },
      { value: '4 of 4', label: 'front-end developers who adopted the tokens', meaning: 'Full adoption by the front-end team: it is the condition for component reuse to actually save time, and the only item here you can verify in the repository.' },
    ],
    measure: 'I instrumented the design system but not the product: I knew how many components followed the system, not how many minutes it saved to issue a policy. Today I would ask for usage analytics from the first migrated module: issuing time, errors per step and tickets per module.',
  },
  learnings: [
    'Discussions moved from taste to criteria because the rules are written down and can be looked up.',
    'The system only maintains itself when every new module is built from what exists and returns what it lacks.',
    'A product sold with its own screen needs that screen to survive scrutiny: the landing page forced the panel to raise its level.',
    'I instrumented the system and not the product: today I would ask for usage analytics from the first migrated module.',
  ],
  /* Mientras el resto de casos no esté traducido, el siguiente enlaza a su
     versión en español y el enlace lo dice. */
  next: 'flesip',
};
