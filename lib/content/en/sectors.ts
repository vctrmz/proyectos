/* Los cinco sectores en inglés, indexados por el mismo `n` del dato en
   español: el orden, los años y los enlaces no se duplican. */
export const EN_SECTORS: Record<string, { name: string; company: string; body: string; cta: string; href?: string }> = {
  '01': { name: 'Insurtech', company: 'HERMES · Atrinium', body: 'Underwriting, policies and insurance billing, with rules that condition every screen.', cta: 'Read the case', href: '/en/cases/hermes' },
  '02': { name: 'Invoicing and ERP', company: 'Flesip', body: 'Electronic invoicing for small firms: the path that meets the law is also the shortest one.', cta: 'See the product' },
  '03': { name: 'E-commerce', company: 'Montsaint', body: 'Brand catalogue and checkout, with no unnecessary friction.', cta: 'See the product' },
  '04': { name: 'Banking', company: 'Mercantil Panamá', body: 'Online banking and the Mony app: onboarding and strong authentication in a regulated market.', cta: 'See it in the catalogue', href: '/en?f=banca#trabajo' },
  '05': { name: 'Mobility', company: 'Taksio', body: 'A multimodal platform from scratch: design system first, flows after.', cta: 'See it in the catalogue', href: '/en?f=transporte#trabajo' },
};
