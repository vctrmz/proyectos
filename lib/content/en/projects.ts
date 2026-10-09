/* Título y resumen de cada pieza del catálogo en inglés. Todo lo demás
   —logo, captura, color de marca, sector— es el mismo dato en los dos
   idiomas, así que no se duplica. */
export const EN_PROJECTS: Record<string, { title: string; company?: string; summary: string }> = {
  ayax: {
    title: 'Teaching a category nobody knows',
    summary: 'From corporate brochure to a bilingual lead engine for an agency underwriting on behalf of Lloyd’s: three opposing audiences, six lines of business and not a single online quote.',
  },
  hermes: {
    title: 'HERMES, an insurance platform',
    summary: 'Insurance SaaS sold to companies with incompatible business logic: 165 screens and 8 areas on a single core, with its CRM and the landing page that sells it.',
  },
  flesip: {
    title: 'Invoicing should be the dullest thing in your week',
    summary: 'Invoicing app for freelancers and small firms: settings that do the work later, a quick invoice with an intermediate state, VeriFactu made understandable and the accountant’s portal.',
  },
  montsaint: {
    title: 'One brand, two businesses',
    summary: 'Bio-acetate sunglasses sold direct and distributed through 700+ opticians: two sites, two decision speeds and one art direction holding both together.',
  },
  mercantil: {
    title: 'Making a financial product clear the first time',
    summary: 'Five offers and five audiences that do not speak alike: digital payments, Mony, Tadelanto and Next Gen, from the sales deck to the online banking flow — including the audit of my own prototype.',
  },
  suscripcion: {
    title: 'Client onboarding module',
    summary: 'Three months of manual work in spreadsheets turned into a module in production in five weeks, modelled as a three-phase state machine.',
  },
  'editor-propuesta': {
    title: 'Proposal editor built on TipTap',
    summary: 'The client proposal was being written outside the product. A template with slots, variables typed with @ and optional clauses as blocks, auditable while you write.',
  },
  'vista-360': {
    title: 'Client 360 view',
    summary: 'Twelve compositions explored and four finalists so anyone on the team understands a client in ten seconds, with the reasons for each discard written down.',
  },
  pidemony: {
    title: 'Asking for money with a link',
    summary: 'Pidemony, inside the mony app: the requester asks in four steps and the payer pays by card from a link. I designed both sides and the style guide it was pitched to the business with; it was approved and shipped.',
  },
  'design-system': {
    title: 'Design system: 267 → 24 tokens',
    summary: 'Monorepo audit: 267 colour values reduced to 24 tokens, each with a role, adopted by all four front-end developers. The system feeds the module and the module gives components back.',
  },
  taksio: {
    title: 'Multimodal mobility platform',
    summary: 'A platform from scratch: design system first, driver and passenger flows after.',
  },
};

export const EN_FILTERS: Record<string, string> = {
  todo: 'All', casos: 'Case studies', produccion: 'In production', 'design-system': 'Design system',
  insurtech: 'Insurtech', erp: 'ERP', banca: 'Banking', ecommerce: 'E-commerce', transporte: 'Mobility',
};

export const EN_SECTOR_LABEL: Record<string, string> = {
  insurtech: 'Insurtech', erp: 'ERP', banca: 'Banking', ecommerce: 'E-commerce', transporte: 'Mobility', multi: 'Multi-product',
};

export const EN_TYPE_LABEL: Record<string, string> = {
  case: 'Case study', product: 'Product', 'design-system': 'Design system', landing: 'Landing page',
};

export const EN_TAGS: Record<string, string> = {
  'Caso de estudio': 'Case study', 'En producción': 'In production', Insurtech: 'Insurtech', ERP: 'ERP',
  Banca: 'Banking', 'E-commerce': 'E-commerce', 'Marca y sistema': 'Brand and system', 'App y web': 'App and web',
  'Marca y arte': 'Brand and art direction', 'Research y UX': 'Research and UX', 'Multi-tenant': 'Multi-tenant',
  'SaaS multi-tenant': 'Multi-tenant SaaS', Sistema: 'System',
  'Formularios por esquema': 'Schema-driven forms', 'Design tokens': 'Design tokens', 'Design tokens (JSON)': 'Design tokens (JSON)',
  'Tokens multi-marca': 'Multi-brand tokens', 'Design system': 'Design system', 'Multi-producto': 'Multi-product',
  'Next.js': 'Next.js', Accesibilidad: 'Accessibility',
};
