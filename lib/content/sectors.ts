export interface SectorItem { n: string; name: string; company: string; years: string; body: string; areas: string[]; href: string; cta: string; external?: boolean }
/* Los cinco sectores del recorrido, con el enlace más útil en cada uno: el
   caso si existe, el producto si está en línea, o el filtro del catálogo.
   `areas` son los equipos o usuarios para los que diseñé en cada uno, y salen
   de los casos: las áreas de HERMES, el flujo autónomo → asesoría de Flesip,
   la cadena producto → negocio → comercial de Mercantil. */
export const SECTORS: SectorItem[] = [
  { n: '01', name: 'Insurtech', company: 'HERMES · Atrinium', years: '2022 – 2026', body: 'CRM y back office para corredurías y aseguradoras, con reglas que condicionan cada pantalla.', areas: ['Comercial', 'Suscripción', 'Pólizas y recibos', 'Siniestros', 'Facturación', 'Dirección'], href: '/es/cases/hermes', cta: 'Ver el caso' },
  { n: '02', name: 'Facturación y ERP', company: 'Flesip', years: '2024 – 2025', body: 'Facturación electrónica para pymes: el camino que cumple la norma, también el más corto.', areas: ['Autónomos y pymes', 'Impuestos y VeriFactu', 'Bancos y cobros', 'Asesorías'], href: 'https://flesip.com/', cta: 'Ver el producto', external: true },
  { n: '03', name: 'E-commerce', company: 'Montsaint', years: '2023 – 2025', body: 'Una tienda para el cliente final y una web para más de 700 ópticas, sobre la misma colección.', areas: ['Cliente final', 'Red de ópticas', 'Marca y fotografía'], href: 'https://montsaint.es/', cta: 'Ver el producto', external: true },
  { n: '04', name: 'Banca', company: 'Mercantil Panamá', years: '2021 – 2022', body: 'Banca y app Mony: onboarding y autenticación reforzada en entorno regulado.', areas: ['Producto', 'Negocio', 'Comercial', 'Comercios'], href: '/es?f=banca#trabajo', cta: 'Ver en el catálogo' },
  { n: '05', name: 'Transporte', company: 'Taksio', years: '2017 – 2019', body: 'Plataforma multimodal desde cero: design system primero, flujos después.', areas: ['Conductores', 'Pasajeros', 'Operación'], href: '/es?f=transporte#trabajo', cta: 'Ver en el catálogo' },
];
