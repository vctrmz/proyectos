import { shot, inGroup, type CaseStudy } from '../../cases/types';

export const hermesEn: CaseStudy = {
  slug: 'hermes', title: 'HERMES, an insurance platform', company: 'Atrinium', years: '2022–2026',
  tagline: 'A standard product for businesses that look nothing alike: 165 screens and 8 areas on a single core, with its CRM, client subscription, the certificate editor and the landing page that sells it, without forking the product per client.',
  tags: ['Case study', 'In production', 'Insurtech', 'Multi-tenant', 'Schema-driven forms', 'Design tokens'], brand: '#1f2a5a',
  hero: shot('hx-dashboard', 'HERMES Admin CRM dashboard with lead metrics, conversion rate and the list of opportunities', 'The dashboard: sales network metrics and whatever needs action, on the first screen'),
  context: 'Atrinium’s insurance SaaS for brokers, underwriting agencies and insurers: underwriting, policies, receipts, billing and claims. A product in production with no maintenance window, while a framework and database migration was under way and two generations of interface lived side by side.',
  role: 'Sole designer of the group, in a team of seven. Weekly sessions with the insurers’ Product Owners to answer questions, clarify ideas, present proposals, validate the logic of each process and refine the copy before handing it to engineering.',
  delivery: 'Multi-tenant web application, its CRM, the full design system, the per-company configuration surfaces and the product landing page.',
  problem: [
    'Every company arrived with its own business logic, currency, language and regulator, and expected the product to behave like theirs.',
    'If the product bends for every client it stops being a product; if it bends for no one, nobody uses it.',
  ],
  complexity: { diagram: 'clients-to-system', caption: 'Three companies with incompatible rules on one configurable system: the difference lives in the data, not in a branch of the product.' },
  decisions: [
    { title: 'I designed rules instead of cases.', why: 'Every line of insurance has its own questionnaire; designing one screen per line and per client does not scale and leaves the criteria in the designer’s head.', changed: 'Each line’s questionnaire is declared as data and the interface renders it with its validation. Onboarding a new company no longer requires bespoke design.', tradeoff: 'The rule becomes the critical artefact: a badly declared schema breaks a screen nobody designed, so validation has to live with the data.', figure: { diagram: 'before-after' } },
    { title: 'Brand and language as variables, not as versions.', why: 'White-labelling per tenant, with five base languages and seven locales of insurance terminology.', changed: 'Each client’s palette resolves at sign-in and terminology resolves per locale, propagated through semantic tokens and language catalogues, without duplicating components.', figure: { shot: shot('04-preparar-producto', 'Product setup: modules, plugins and languages per client', 'Modules, plugins and system languages configured per client') } },
    { title: 'Module by module, complete consistency over scattered improvements.', why: 'With two generations of interface side by side, improving everything a little keeps the inconsistency forever.', changed: 'Each migrated module ships whole with the new system; the criteria are written down and do not depend on me being in the room.', tradeoff: 'For months two generations of interface are visible to the user. Accepted in exchange for not leaving the inconsistency installed for good.', figure: { diagram: 'areas-map' } },
    { title: 'Subscription: a state machine, not a wizard.', why: 'Twenty linear steps force every role down the same path.', changed: 'Three phases (qualification, negotiation, closed), each with its own audiences, permissions and exit criteria. The whole interface rests on the component system consolidated before starting.', figure: { shot: shot('03-metodo-de-pago', 'Payment method with a checklist of blockers', 'Payment method: SEPA, tax details and schedule, with a checklist of what blocks signing') } },
    { title: 'Certificates: what is fixed stays out of the editor.', why: 'Header, logo and footer belong to the legal document and the tenant’s brand; if they can be touched, someone will touch them.', changed: 'The editor only opens the body of the certificate. The template is chosen by certificate type and the rest of the A4 arrives locked.', figure: { shot: shot('ep-plantilla-nueva', 'Surety certificate in A4 with the new style', 'The certificate template: the legal structure is untouched, only the body changes') } },
    { title: 'Client 360: twelve explorations before deciding.', why: 'The three-alternatives method falls short when the cost of getting it wrong is a screen used a hundred times a day.', changed: 'Twelve compositions reduced to four comparable directions.', figure: { diagram: 'grid-12-4-1' } },
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
    ...inGroup('Platform', [
      shot('08-planes-servicios', 'Plans and services per company', 'Plans and services: a product catalogue composed per business, with no bespoke development'),
      shot('hx-leads', 'Lead table with source, status and assigned agent, and the day’s calendar', 'Leads: source, status and agent, with the calendar alongside to call without losing context'),
      shot('hx-tickets', 'Ticket inbox with saved views and priority by colour', 'Tickets: saved views (unassigned, open, the group’s) and priority visible on each row'),
      shot('hx-login', 'Sign-in screen “Welcome to Hermes Admin” with a photograph in blue', 'The login: enterprise-grade security as the product’s first message'),
      shot('14-document-model', 'Document model', 'Document model: the restriction lives in the data, not only in the interface'),
      shot('hx-landing', 'Full HERMES landing page with the feature blocks', 'The landing page: every feature with its real screen, alternating sides'),
    ]),
    ...inGroup('Subscription', [
      shot('01-datos-del-contacto', 'Contact details', 'Phase 1 · Qualification: main contact, client profile and a live company summary'),
      shot('04-preparar-producto', 'Prepare product', 'Prepare product: modules, plugins and system languages per client'),
      shot('19-reservar-agenda', 'Book a meeting', 'Book a meeting: both sides’ availability in the same view'),
      shot('20-drawer-contrato', 'Contract detail in a side panel', 'Contract in a side panel: context is not lost while reviewing'),
    ]),
    ...inGroup('Certificates', [
      shot('ep-editor-vacio', 'Empty document model editor with the chosen certificate template', 'Starting point: pick the template and type, or press / to insert'),
      shot('ep-comandos', 'Command menu over the certificate text', 'Commands with /: global style, document style and system data (people, brokers, insurer, tables and charts)'),
      shot('ep-certificados', 'Certificates step inside the endorsement, with editor and preview', 'Certificates as one more step of the endorsement, with the preview one click away'),
      shot('ep-variables', 'Certificate text in production with system variables', 'In production: the text carries system variables (${…}) that are filled in on issue'),
      shot('ep-plantilla-original', 'Original surety certificate template in A4', 'Original surety certificate template (personal data hidden)'),
      shot('ep-plantilla-nueva', 'Certificate template with the new style in A4', 'The same template in the new style: brand header and recognisable links (personal data hidden)'),
      shot('ep-resumen', 'Opportunity summary with the Certificate block between coverages and vehicle data', 'Opportunity summary: the certificate type is one more block, editable like the rest'),
      shot('ep-poliza', 'Issued policy with the list of generated documents', 'Issued policy: the certificate is generated alongside the conditions and the coverage summary'),
      shot('ep-pdf', 'PDF viewer with the generated surety certificate', 'Certificate PDF preview before downloading or printing (personal data hidden)'),
    ]),
    ...inGroup('Client 360', [
      shot('11-resumen-comercial', 'Client commercial summary', 'Commercial summary: persistent identity, risk and activity before the history'),
      shot('17-agenda-reuniones', 'Meeting agenda', 'The client’s meeting agenda'),
      shot('15-notas-comite', 'Committee notes', 'Committee notes linked to the client'),
    ]),
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
      { value: '60 → 14', label: 'visible fields per step when issuing a policy', meaning: 'Forms and rules became data, so each step only shows the fields that belong to it. It describes how much the screen asks for, not task time or errors, which were not measured.' },
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
