export interface SectorItem { n: string; name: string; company: string; years: string; body: string; href: string; cta: string; external?: boolean }
/* Los cinco sectores del recorrido, con el enlace más útil en cada uno: el
   caso si existe, el producto si está en línea, o el filtro del catálogo. */
export const SECTORS: SectorItem[] = [
  { n: '01', name: 'Insurtech', company: 'HERMES · Atrinium', years: '2022 – 2026', body: 'Suscripción, pólizas y facturación de seguros, con reglas que condicionan cada pantalla.', href: '/es/cases/hermes', cta: 'Ver el caso' },
  { n: '02', name: 'Facturación y ERP', company: 'Flesip', years: '2024 – 2025', body: 'Facturación electrónica para pymes: el camino que cumple la norma, también el más corto.', href: 'https://flesip.com/', cta: 'Ver el producto', external: true },
  { n: '03', name: 'E-commerce', company: 'Montsaint', years: '2023 – 2025', body: 'Catálogo y checkout de marca, sin fricción innecesaria.', href: 'https://montsaint.es/', cta: 'Ver el producto', external: true },
  { n: '04', name: 'Banca', company: 'Mercantil Panamá', years: '2021 – 2022', body: 'Banca y app Mony: onboarding y autenticación reforzada en entorno regulado.', href: '/es?f=banca#trabajo', cta: 'Ver en el catálogo' },
  { n: '05', name: 'Transporte', company: 'Taksio', years: '2017 – 2019', body: 'Plataforma multimodal desde cero: design system primero, flujos después.', href: '/es?f=transporte#trabajo', cta: 'Ver en el catálogo' },
];
