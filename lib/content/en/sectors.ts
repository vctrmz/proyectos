/* Los cinco sectores en inglés, indexados por el mismo `n` del dato en
   español: el orden, los años y los enlaces no se duplican. */
export const EN_SECTORS: Record<string, { name: string; company: string; body: string; areas: string[]; cta: string; href?: string }> = {
  '01': { name: 'Insurtech', company: 'HERMES · Atrinium', body: 'CRM and back office for brokers and insurers, with rules that condition every screen.', areas: ['Sales', 'Underwriting', 'Policies and premiums', 'Claims', 'Billing', 'Management'], cta: 'Read the case', href: '/en/cases/hermes' },
  '02': { name: 'Invoicing and ERP', company: 'Flesip', body: 'Electronic invoicing for small firms: the path that meets the law is also the shortest one.', areas: ['Freelancers and SMEs', 'Tax and VeriFactu', 'Banks and payments', 'Accountants'], cta: 'See the product' },
  '03': { name: 'E-commerce', company: 'Montsaint', body: 'A store for shoppers and a site for more than 700 opticians, on the same collection.', areas: ['Shoppers', 'Optician network', 'Brand and photography'], cta: 'See the product' },
  '04': { name: 'Banking', company: 'Mercantil Panamá', body: 'Online banking and the Mony app: onboarding and strong authentication in a regulated market.', areas: ['Product', 'Business', 'Sales', 'Merchants'], cta: 'See it in the catalogue', href: '/en?f=banca#trabajo' },
  '05': { name: 'Mobility', company: 'Taksio', body: 'A multimodal platform from scratch: design system first, flows after.', areas: ['Drivers', 'Passengers', 'Operations'], cta: 'See it in the catalogue', href: '/en?f=transporte#trabajo' },
};
