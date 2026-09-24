export type ProjectType = 'case' | 'product' | 'design-system' | 'landing';
export type Sector = 'insurtech' | 'erp' | 'banca' | 'ecommerce' | 'transporte' | 'multi' | null;
export interface Project {
  slug: string; title: string; company: string; years: string;
  type: ProjectType; status: 'production'; sector: Sector;
  brand: string; image: { src: string; alt: string } | null; logo: string;
  summary: string; hasCase: boolean; url?: string;
}

const shot = (name: string, alt: string) => ({ src: `/assets/shots/${name}.webp`, alt });

/* El orden es la jerarquía del catálogo: primero los cinco proyectos
   completos —producto, marca y comunicación—, después los módulos de HERMES
   que profundizan en una decisión concreta. */
export const PROJECTS: Project[] = [
  { slug: 'ayax', title: 'Enseñar una categoría que nadie conoce', company: 'Ayax Suscripción de Riesgos', years: '2024–2026', type: 'case', status: 'production', sector: 'insurtech', brand: '#000A29', logo: '/assets/logos/ayax.webp', hasCase: true, url: 'https://ayaxsuscripcion.com/',
    image: shot('ayax-x_hero', 'Portada de Ayax con el titular «Agencia de suscripción de seguros» y el sello de Lloyd’s'),
    summary: 'De folleto corporativo a plataforma de captación bilingüe para una agencia que suscribe por delegación de Lloyd’s: tres audiencias opuestas, seis ramos y ni una sola cotización online.' },
  { slug: 'hermes', title: 'HERMES, plataforma aseguradora', company: 'Atrinium', years: '2022–2026', type: 'case', status: 'production', sector: 'insurtech', brand: '#1f2a5a', logo: '/assets/logos/hermes.webp', hasCase: true,
    image: shot('hx-dashboard', 'Dashboard CRM de HERMES Admin con indicadores de leads y oportunidades'),
    summary: 'SaaS asegurador vendido a compañías con lógicas incompatibles: 165 pantallas y 8 áreas sobre un único núcleo, con su CRM y la landing que lo vende.' },
  { slug: 'flesip', title: 'Facturar debería ser lo más aburrido de tu semana', company: 'Flesip · Atrinium', years: '2024–2025', type: 'case', status: 'production', sector: 'erp', brand: '#1F2B9C', logo: '/assets/logos/flesip.webp', hasCase: true, url: 'https://flesip.com/',
    image: shot('flesip-fx_ingresos', 'Listado de ingresos de Flesip con facturas pendientes y completadas'),
    summary: 'App de facturación para autónomos y pymes: configuración que trabaja sola, factura rápida con estado intermedio, VeriFactu comprensible y el portal de la asesoría.' },
  { slug: 'montsaint', title: 'Una marca con dos negocios', company: 'Montsaint', years: '2023–2025', type: 'case', status: 'production', sector: 'ecommerce', brand: '#1F6F6B', logo: '/assets/logos/montsaint.webp', hasCase: true, url: 'https://montsaint.es/',
    image: shot('ms-desktop', 'Home de la tienda Montsaint en escritorio'),
    summary: 'Gafas de bio-acetato que se venden al cliente final y se distribuyen en más de 700 ópticas: dos webs, dos ritmos de decisión y una dirección de arte que sostiene las dos.' },
  { slug: 'mercantil', title: 'Que un producto financiero se entienda a la primera', company: 'Mercantil Banco Panamá', years: '2020–2022', type: 'case', status: 'production', sector: 'banca', brand: '#0B3A6B', logo: '/assets/logos/mercantil.webp', hasCase: true,
    image: shot('mb-pay_01', 'Portada del deck «Soluciones de pago digitales para tu negocio»'),
    summary: 'Cinco ofertas y cinco audiencias que no hablan igual: pagos digitales, Mony, Tadelanto y Next Gen, del deck comercial al flujo en banca en línea, con la auditoría de mi propio prototipo.' },
  { slug: 'suscripcion', title: 'Módulo de suscripción de cliente', company: 'HERMES Admin', years: '2025', type: 'case', status: 'production', sector: 'insurtech', brand: '#24346e', logo: '/assets/logos/hermes.webp', hasCase: true,
    image: shot('01-datos-del-contacto', 'Fase de cualificación: contacto principal y perfil del cliente'),
    summary: 'Tres meses de proceso manual en Excel convertidos en un módulo en producción en cinco semanas, modelado como máquina de estados de tres fases.' },
  { slug: 'editor-propuesta', title: 'Editor de propuesta con TipTap', company: 'HERMES Admin', years: '2025', type: 'case', status: 'production', sector: 'insurtech', brand: '#2b3f85', logo: '/assets/logos/hermes.webp', hasCase: true,
    image: shot('12-editor-variables', 'Editor de propuesta con variables insertadas con @'),
    summary: 'La propuesta al cliente se preparaba fuera del producto. Plantilla con huecos, variables con @ y cláusulas opcionales como bloques, auditable mientras se escribe.' },
  { slug: 'vista-360', title: 'Vista 360 del cliente', company: 'Atrinium', years: '2026', type: 'case', status: 'production', sector: 'insurtech', brand: '#1b2a4a', logo: '/assets/logos/hermes.webp', hasCase: true,
    image: shot('11-resumen-comercial', 'Resumen comercial del cliente en una sola vista'),
    summary: 'Doce composiciones exploradas y cuatro finalistas para que cualquiera del equipo entienda a un cliente en diez segundos, con el criterio de descarte por escrito.' },
  { slug: 'design-system', title: 'Design system: 267 → 24 tokens', company: 'Atrinium', years: '2024', type: 'design-system', status: 'production', sector: 'multi', brand: '#15181f', logo: '/assets/logos/hermes.webp', hasCase: true,
    image: shot('07-seleccionar-moneda', 'Componente de selección de moneda del design system de HERMES'),
    summary: 'Auditoría del monorepo: 267 valores de color reducidos a 24 tokens con un rol cada uno, adoptados por los cuatro front. El sistema alimenta el módulo y el módulo devuelve componentes.' },
  { slug: 'taksio', title: 'Plataforma de movilidad', company: 'Taksio', years: '2017–2019', type: 'product', status: 'production', sector: 'transporte', brand: '#1d3557', logo: '/assets/logos/hermes.webp', hasCase: false, image: null,
    summary: 'Plataforma multimodal desde cero: design system primero, flujos de conductor y pasajero después.' },
];

export type FilterId = 'todo' | 'casos' | 'produccion' | 'design-system' | 'insurtech' | 'erp' | 'banca' | 'ecommerce' | 'transporte' | 'landing';
export const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'todo', label: 'Todo' }, { id: 'casos', label: 'Casos de estudio' }, { id: 'produccion', label: 'En producción' },
  { id: 'design-system', label: 'Design system' }, { id: 'insurtech', label: 'Insurtech' }, { id: 'erp', label: 'ERP' },
  { id: 'banca', label: 'Banca' }, { id: 'ecommerce', label: 'E-commerce' }, { id: 'transporte', label: 'Transporte' },
];
export const SECTOR_LABEL: Record<Exclude<Sector, null>, string> = { insurtech: 'Insurtech', erp: 'ERP', banca: 'Banca', ecommerce: 'E-commerce', transporte: 'Transporte', multi: 'Multi-producto' };
const TYPE_LABEL: Record<ProjectType, string> = { case: 'Caso de estudio', product: 'Producto', 'design-system': 'Design system', landing: 'Landing' };

export function parseFilter(v: string | null | undefined): FilterId {
  return FILTERS.some((f) => f.id === v) ? (v as FilterId) : 'todo';
}
export function matches(p: Project, f: FilterId): boolean {
  switch (f) {
    case 'todo': return true;
    case 'casos': return p.hasCase;
    case 'produccion': return p.status === 'production';
    case 'design-system': return p.type === 'design-system';
    case 'landing': return p.type === 'landing';
    default: return p.sector === f;
  }
}
export function filterProjects(f: FilterId): Project[] { return PROJECTS.filter((p) => matches(p, f)); }
export function filterCounts(): Record<FilterId, number> {
  return Object.fromEntries(FILTERS.map((f) => [f.id, filterProjects(f.id).length])) as Record<FilterId, number>;
}
export function projectTags(p: Project): string[] {
  const t = [TYPE_LABEL[p.type], 'En producción'];
  if (p.sector && p.sector !== 'multi') t.push(SECTOR_LABEL[p.sector]);
  return t;
}
export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
