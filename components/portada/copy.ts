import type { Locale } from '@/lib/i18n/config';
import type { IconName } from './icons';

/* Todo el texto de la portada v2 en los dos idiomas. Los componentes lo
   reciben por props: así los de cliente no cargan los casos traducidos para
   resolver un enlace, eso lo hace la portada en el servidor. */
export type AreaCopy = { id: string; name: string; icon: IconName; years: string; body: string; users: string[]; flows: string[]; limits: string; slug?: string; href?: string; cta: string };
export type JobCopy = { role: string; where: string; years: string; note: string };

const ES = {
  band: ['Víctor Maza', 'Senior Product Designer', 'Design systems', 'B2B y B2C SaaS', 'Insurtech', 'España (CET) · remoto'],
  featured: {
    title: 'HERMES, plataforma aseguradora',
    meta: 'Caso principal · Atrinium · 2022–2026',
    lead: 'HERMES se vende a aseguradoras con lógicas incompatibles. En lugar de bifurcar el producto por cliente, modelé un único núcleo configurable: la variación la absorbe la configuración, no la pantalla.',
    metrics: [{ value: '165', label: 'pantallas en producción' }, { value: '8', label: 'áreas sobre un núcleo' }, { value: '4', label: 'años como único diseñador' }],
    cta: 'Leer el caso HERMES',
    alt: 'Listado de contratos de un cliente en HERMES Admin, con filtros por estado, firmantes y fechas',
  },
  thesis: { label: 'Cómo trabajo', text: 'Diseño producto B2B donde un error operativo cuesta dinero: defino flujos, estados y criterios claros, y los trabajo con Producto e Ingeniería hasta la implementación.' },
  kinds: { ayax: 'Web y marca', flesip: 'App de facturación', montsaint: 'E-commerce y web de partners', mercantil: 'Banca digital', pidemony: 'Producto de pagos' } as Record<string, string>,
  work: { title: 'trabajos', at: 6, lead: 'Productos enteros y decisiones concretas dentro de HERMES. Todo llegó a producción.', inSpanish: '' },
  about: {
    title: 'sobre mí', at: 1,
    lead: 'Llevo más de ocho años diseñando producto digital B2B y B2C SaaS de punta a punta, del discovery a producción, en dominios regulados como seguros y banca.',
    p2: 'Durante cuatro años fui el único diseñador, y el responsable del diseño, de un holding con cinco productos. Su núcleo es un SaaS multi-tenant en 12 idiomas y con la marca de cada cliente, sostenido por un único design system.',
    p3: ['Construyo design systems', 'con reglas de uso y criterios de decisión, no solo librerías de componentes. Uso IA a diario', 'para prototipar, sintetizar research e implementar, y como informático de formación reviso la implementación en React', '. Esta web es un proyecto Next.js con tests y código público.'],
    more: 'Más sobre mí y el CV',
    jobs: [
      { role: 'Senior Product Designer', where: 'Atrinium · Málaga', years: '2022 – 2026', note: 'Único diseñador y responsable del diseño de los productos del holding: HERMES, la plataforma SaaS aseguradora, Flesip y Montsaint.' },
      { role: 'UI / Product Designer', where: 'Darien Technology · Panamá, en remoto', years: '2021 – 2022', note: 'Banca digital para Mercantil Banco Panamá, con más de 100k usuarios activos: pagos, Mony, Tadelanto, hipotecas y préstamos, validados con pruebas de usabilidad en Maze.' },
      { role: 'UX/UI Designer y freelance', where: 'Taksio y clientes internacionales', years: '2017 – 2021', note: 'Design system y flujos de una plataforma de movilidad; fintech, banca y logística como freelance.' },
    ] as JobCopy[],
    degree: { role: 'Titulación en Informática', where: 'Universidad de Oriente · 5 años' },
  },
  areas: {
    title: 'áreas', at: 2,
    lead: 'Algunas de las áreas en las que he trabajado. Elige una para ver qué resolví.',
    group: 'Áreas', users: 'Usuarios', flows: 'Flujos', limits: 'Restricciones',
    items: [
      { id: 'insurtech', name: 'Insurtech', icon: 'shield', years: '2022 – 2026', slug: 'hermes', cta: 'Leer el caso',
        body: 'Un SaaS asegurador para compañías con lógicas incompatibles: 165 pantallas en 8 áreas, 12 idiomas y 347 permisos sobre un único núcleo y un único design system, sin una versión distinta por cliente.',
        users: ['Equipos de las compañías cliente', 'Administración de la plataforma'], flows: ['Suscripción', 'Pólizas y recibos', 'Siniestros', 'Facturación', 'Reporting'], limits: 'Permisos, marca y configuración distintos por compañía.' },
      { id: 'erp', name: 'Facturación y ERP', icon: 'bill', years: '2024 – 2025', slug: 'flesip', cta: 'Leer el caso',
        body: 'Facturación electrónica para autónomos y pymes: una configuración que trabaja sola, factura rápida con estado intermedio y VeriFactu comprensible. El camino que cumple la norma, también el más corto.',
        users: ['Autónomos y pymes', 'Asesorías', 'Quien recibe la factura'], flows: ['Configuración', 'Factura rápida', 'Cobros', 'Envío a la asesoría'], limits: 'Normativa fiscal (VeriFactu) y datos que solo tiene el cliente.' },
      { id: 'ecommerce', name: 'E-commerce', icon: 'bag', years: '2023 – 2025', slug: 'montsaint', cta: 'Leer el caso',
        body: 'Una tienda para el cliente final y una web para más de 700 ópticas sobre la misma colección: dos ritmos de decisión y una dirección de arte que sostiene los dos.',
        users: ['Cliente final', 'Ópticas de la red'], flows: ['Compra en la tienda', 'Alta como partner'], limits: 'Una sola colección y una sola marca para dos ritmos de compra.' },
      { id: 'banca', name: 'Banca digital', icon: 'bank', years: '2021 – 2022', slug: 'mercantil', cta: 'Leer el caso',
        body: 'Pagos digitales, adelanto de nómina, hipotecas y pedir dinero con un enlace, del deck comercial al flujo en banca en línea, con onboarding y autenticación reforzada en entorno regulado.',
        users: ['Clientes de banca', 'Comercios', 'Estudiantes'], flows: ['Pagos digitales', 'Adelanto de nómina', 'Hipotecas', 'Pedir dinero con un enlace'], limits: 'Entorno regulado: onboarding y autenticación reforzada.' },
      { id: 'movilidad', name: 'Movilidad', icon: 'steering', years: '2017 – 2019', href: 'https://www.behance.net/gallery/81635187/Taksio-website', cta: 'Ver en Behance',
        body: 'Una plataforma multimodal desde cero: primero el design system, después los flujos de pasajero y conductor y los paneles de operación.',
        users: ['Pasajeros', 'Conductores', 'Equipo de operación'], flows: ['Viaje del pasajero', 'App del conductor', 'Paneles de operación'], limits: 'Una plataforma multimodal construida desde cero.' },
    ] as AreaCopy[],
  },
  contact: {
    title: 'contacto', at: 1,
    line1: '¿Hablamos?', copy: 'Copia mi correo.', done: 'Copiado.',
    hint: 'Un clic y lo tienes en el portapapeles.', hintDone: 'Ya lo tienes en el portapapeles.', hintError: 'No pude copiarlo: ahí lo tienes para copiarlo a mano.',
    available: 'Disponible ahora · roles Senior o Lead de Product Design · en remoto desde España (CET)',
  },
};

const EN: typeof ES = {
  band: ['Víctor Maza', 'Senior Product Designer', 'Design systems', 'B2B and B2C SaaS', 'Insurtech', 'Spain (CET) · remote'],
  featured: {
    title: 'HERMES, an insurance platform',
    meta: 'Lead case · Atrinium · 2022–2026',
    lead: 'HERMES is sold to insurers whose rules contradict each other. Instead of forking the product for each client, I modelled one configurable core: configuration absorbs the variation, not the screen.',
    metrics: [{ value: '165', label: 'screens in production' }, { value: '8', label: 'areas on one core' }, { value: '4', label: 'years as the sole designer' }],
    cta: 'Read the HERMES case',
    alt: 'A client’s contract list in HERMES Admin, filtered by status, signers and dates',
  },
  thesis: { label: 'How I work', text: 'I design B2B products where an operational mistake costs money: I define clear flows, states and criteria, and work them through with Product and Engineering until they ship.' },
  kinds: { ayax: 'Website and brand', flesip: 'Invoicing app', montsaint: 'E-commerce and partner site', mercantil: 'Digital banking', pidemony: 'Payments product' },
  work: { title: 'works', at: 1, lead: 'Whole products and specific decisions inside HERMES. All of it shipped to production.', inSpanish: 'in Spanish' },
  about: {
    title: 'about', at: 2,
    lead: 'I have spent eight-plus years designing B2B and B2C SaaS products end to end, from discovery to production, in regulated domains such as insurance and banking.',
    p2: 'For four years I was the sole designer, and the one responsible for design, at a holding company with five products. Its core is a multi-tenant SaaS in 12 languages, branded for each client and held together by a single design system.',
    p3: ['I build design systems', 'with usage rules and decision criteria, not just component libraries. I use AI every day', 'to prototype, synthesise research and implement, and as a computer scientist by training I review the React implementation', '. This site is a Next.js project with tests and public code.'],
    more: 'More about me and my CV',
    jobs: [
      { role: 'Senior Product Designer', where: 'Atrinium · Málaga', years: '2022 – 2026', note: 'Sole designer, responsible for design across the holding’s products: HERMES, the insurance SaaS platform, Flesip and Montsaint.' },
      { role: 'UI / Product Designer', where: 'Darien Technology · Panama, remote', years: '2021 – 2022', note: 'Digital banking for Mercantil Banco Panamá, with 100k+ active users: payments, Mony, Tadelanto, mortgages and loans, validated with usability tests in Maze.' },
      { role: 'UX/UI Designer and freelance', where: 'Taksio and international clients', years: '2017 – 2021', note: 'Design system and flows for a mobility platform; fintech, banking and logistics as a freelancer.' },
    ],
    degree: { role: 'Degree in Computer Science', where: 'Universidad de Oriente · 5 years' },
  },
  areas: {
    title: 'areas', at: 2,
    lead: 'Some of the areas I have worked in. Pick one to see what I solved.',
    group: 'Areas', users: 'Users', flows: 'Flows', limits: 'Constraints',
    items: [
      { id: 'insurtech', name: 'Insurtech', icon: 'shield', years: '2022 – 2026', slug: 'hermes', cta: 'Read the case',
        body: 'An insurance SaaS for carriers with incompatible rules: 165 screens across 8 areas, 12 languages and 347 permissions on one core and one design system, with no separate version per client.',
        users: ['Teams at client companies', 'Platform administration'], flows: ['Underwriting', 'Policies and receipts', 'Claims', 'Billing', 'Reporting'], limits: 'Different permissions, branding and configuration per company.' },
      { id: 'erp', name: 'Invoicing and ERP', icon: 'bill', years: '2024 – 2025', slug: 'flesip', cta: 'Read the case',
        body: 'E-invoicing for freelancers and small businesses: setup that works on its own, quick invoices with a draft state and VeriFactu made understandable. The compliant path is also the shortest one.',
        users: ['Freelancers and SMEs', 'Accountants', 'Whoever receives the invoice'], flows: ['Setup', 'Quick invoice', 'Payments', 'Sending to the accountant'], limits: 'Tax rules (VeriFactu) and data only the customer has.' },
      { id: 'ecommerce', name: 'E-commerce', icon: 'bag', years: '2023 – 2025', slug: 'montsaint', cta: 'Read the case',
        body: 'A shop for end customers and a site for 700+ opticians built on the same collection: two decision rhythms and one art direction that holds both.',
        users: ['End customers', 'Opticians in the network'], flows: ['Buying in the shop', 'Signing up as a partner'], limits: 'One collection and one brand for two buying rhythms.' },
      { id: 'banca', name: 'Digital banking', icon: 'bank', years: '2021 – 2022', slug: 'mercantil', cta: 'Read the case',
        body: 'Digital payments, salary advances, mortgages and asking for money with a link, from the sales deck to the online-banking flow, with onboarding and strong authentication in a regulated environment.',
        users: ['Bank customers', 'Merchants', 'Students'], flows: ['Digital payments', 'Salary advance', 'Mortgages', 'Asking for money with a link'], limits: 'Regulated environment: onboarding and strong authentication.' },
      { id: 'movilidad', name: 'Mobility', icon: 'steering', years: '2017 – 2019', href: 'https://www.behance.net/gallery/81635187/Taksio-website', cta: 'See it on Behance',
        body: 'A multimodal platform from scratch: the design system first, then the rider and driver flows and the operations dashboards.',
        users: ['Riders', 'Drivers', 'Operations team'], flows: ['Rider journey', 'Driver app', 'Operations dashboards'], limits: 'A multimodal platform built from scratch.' },
    ],
  },
  contact: {
    title: 'contact', at: 1,
    line1: 'Shall we talk?', copy: 'Copy my email.', done: 'Copied.',
    hint: 'One click and it’s on your clipboard.', hintDone: 'It’s on your clipboard.', hintError: 'I couldn’t copy it: here it is to copy by hand.',
    available: 'Available now · Senior or Lead Product Design roles · remote from Spain (CET)',
  },
};

export type PortadaCopy = typeof ES;
export const portadaCopy = (locale: Locale): PortadaCopy => (locale === 'en' ? EN : ES);
