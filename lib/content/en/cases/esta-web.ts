import { estaWeb } from '../../cases/esta-web';
import { shot, type CaseStudy } from '../../cases/types';

/* Same structure as the Spanish case: images, code, kit and order come from
   there; only the words change. */
export const estaWebEn: CaseStudy = {
  ...estaWeb,
  title: 'This site, from system to code', company: 'Personal project',
  tagline: 'A portfolio treated as a product: tokens, components, typed content and tests that block any figure nobody measured. The design is mine; the implementation was directed with AI and reviewed task by task.',
  tags: ['Case study', 'In production', 'Design tokens', 'Next.js', 'Accessibility'],
  hero: shot('web-home', 'Home page of this site with the headline, the CV link and the facts strip', 'The home page: who, what and the proof, before the first scroll'),
  context: 'The previous site was HTML with 203 inline styles, no landmarks, ten controls that ignored the keyboard and case studies inside a modal that broke on first visit. I wanted the portfolio to prove what it claims: system, rules and delivery.',
  role: 'Design, system, content and technical direction. I wrote the specs and plans, directed the implementation with Claude Code and reviewed every task before it was committed.',
  delivery: 'Next.js 16 with the App Router, CSS tokens, sixteen interface primitives, case studies as typed data, two languages in the URL, analytics only after consent, and a suite of automated tests and audits.',
  problem: [
    'A portfolio that says “I take it to production” without showing how loses the claim in the first technical interview.',
    'The easy way out was a flashy template; the useful one was to build it like a product: a system, written decisions and tests.',
  ],
  complexity: { diagram: 'spec-to-prod', caption: 'Every step leaves a document the next one consumes, and the review before each commit is never delegated.' },
  decisions: [
    { title: 'Write the spec and the plan before asking for a single line of code.', why: 'With AI, generating is cheap; fixing something nobody decided is expensive.', changed: 'Every redesign has a dated spec and plan in the repository, with what was decided and what was discarded. AI implements small tasks and each one goes through my review before it is committed.', tradeoff: 'More time before anything shows on screen, in exchange for not undoing work later.' },
    { title: 'Tokens in :root and a test that guards them.', why: 'A system that relies on discipline decays by the third iteration.', changed: 'Colour, type, spacing and radii live as CSS variables. A test fails if retired greys or old fonts come back.' },
    { title: 'Content is typed data, and tests defend its honesty.', why: 'In a portfolio the risk is not a bug: it is a figure you cannot defend in an interview.', changed: 'Every case study is a TypeScript object of identical shape. Tests fail if an outcome does not explain its source or if a business metric nobody measured sneaks in.' },
    { title: 'Motion behind a switch, accessibility measured.', why: 'Animation helps read the journey, but it cannot be required to understand it.', changed: 'All motion turns off under prefers-reduced-motion and scroll effects also on touch pointers. axe runs on every route and viewport: zero A/AA violations.' },
    { title: 'Language lives in the URL and no published link breaks.', why: 'Links to the case studies were already circulating on LinkedIn and by email.', changed: 'Spanish under /es and English under /en, permanent redirects from the old routes, and a switch that knows which page of the other language to open.' },
  ],
  system: {
    ...estaWeb.system,
    body: ['The primitives —button, chip, figure, disclosure, metric…— consume the same tokens, and case studies have no styles of their own: the template is built from the content. Adding a case study means writing data, not layout.'],
    code: { ...estaWeb.system.code!, title: 'System tokens (excerpt from app/globals.css)' },
    uiKit: [
      { kind: 'tokens', title: 'Tokens named by purpose', body: 'Three ink levels, surface, accent and focus: the interface picks by purpose, never by colour.', wide: true },
      { kind: 'scale', title: 'Three radii', body: 'Media, card and pill. Anything outside the scale is not used.' },
      { kind: 'actions', title: 'One weighted action per view', body: 'A single solid button per screen; everything else is outline or text.', label: 'Read the case' },
    ],
  },
  design: [
    shot('web-home', 'Home page of the site', 'Home: headline, CV and facts before the first scroll'),
    shot('web-case', 'Case page with the numbered index on the left', 'Case template: the index is built from the content'),
  ],
  implementation: [
    'Every change goes through the same chain: spec, task plan, implementation with Claude Code, my review, tests and an axe audit before publishing.',
    'The repository is public: commit history, plans and audits included.',
  ],
  result: {
    output: [
      { value: '0', label: 'axe A/AA violations', meaning: 'Across the nine audited combinations: home, case and about at 1280, 768 and 375 px.' },
      { value: '0.91 s', label: 'desktop LCP', meaning: 'Measured cold on the production build; before, 1.26 s plus a 1.6 s loader.' },
      { value: '100+', label: 'automated tests', meaning: 'Components, content and tokens, including the ones that block unexplained figures.' },
    ],
    outcome: 'unavailable',
    measure: 'Which case studies get opened from the home page, how much of each is read and how many visits end in an email or a CV download: the Clarity funnel is still to be configured.',
  },
  learnings: [
    'With AI the edge is not writing faster, but knowing what to ask for and recognising when what comes back is not good enough.',
    'A test that protects the honesty of the content is worth as much as one that protects the code.',
  ],
};
