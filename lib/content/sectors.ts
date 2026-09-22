export interface SectorItem { n: string; name: string; company: string; years: string; body: string; href: string; cta: string; external?: boolean }
/* Los cinco sectores del recorrido, con el enlace más útil en cada uno: el
   caso si existe, el producto si está en línea, o el filtro del catálogo. */
export const SECTORS: SectorItem[] = [
  { n: '01', name: 'Insurtech', company: 'HERMES · Atrinium', years: '2022 – 2026', body: 'Suscripción, contratación y facturación de seguros. Estados, permisos y documentos legales que condicionan cada pantalla.', href: '/casos/hermes', cta: 'Ver el caso' },
  { n: '02', name: 'Facturación y ERP', company: 'Flesip', years: '2024 – 2025', body: 'Facturación electrónica para pymes: hacer que el camino que cumple la norma sea también el más corto.', href: 'https://flesip.com/', cta: 'Ver el producto', external: true },
  { n: '03', name: 'E-commerce', company: 'Montsaint', years: '2023 – 2025', body: 'Catálogo y checkout de marca: ficha de producto, tallas y pago sin fricción innecesaria.', href: 'https://montsaint.es/', cta: 'Ver el producto', external: true },
  { n: '04', name: 'Banca', company: 'Mercantil Panamá', years: '2020 – 2022', body: 'Pasivos, activos y tarjeta Next Gem, más la app Mony: onboarding y autenticación reforzada en entorno regulado.', href: '/?f=banca#trabajo', cta: 'Ver en el catálogo' },
  { n: '05', name: 'Transporte', company: 'Taksio', years: '2017 – 2019', body: 'Plataforma multimodal desde cero: design system primero, flujos de conductor y pasajero después.', href: '/?f=transporte#trabajo', cta: 'Ver en el catálogo' },
];
