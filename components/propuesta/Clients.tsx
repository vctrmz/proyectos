'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import s from './Clients.module.css';

/* Clientes seleccionados, ordenados por sector: una rejilla de logos y, al
   lado, lo que hice para el que esté seleccionado. Elegir un cliente mueve la
   selección de Figma hasta él (es una animación de layout compartida) y
   cambia el panel. Es un grupo de botones con aria-pressed, y el panel es
   una región viva: con teclado y lector de pantalla funciona igual.

   Solo clientes con contenido propio en la web; los textos salen de los
   casos, de los sectores y del CV. */
type Client = {
  id: string; name: string; logo?: string; sector: string; years: string; role: string;
  body: string; areas: string[]; href: string; cta: string; external?: boolean;
};

const CLIENTS: Client[] = [
  { id: 'hermes', name: 'Atrinium · HERMES', logo: '/assets/logos/hermes.webp', sector: 'Insurtech', years: '2022 – 2026', role: 'Único Product Designer del holding',
    body: 'SaaS asegurador multi-tenant vendido a compañías con lógicas incompatibles: 165 pantallas en 8 áreas, 12 idiomas y 347 permisos sobre un único núcleo y un único design system, sin una versión distinta por cliente.',
    areas: ['Comercial', 'Suscripción', 'Pólizas y recibos', 'Siniestros', 'Facturación', 'Dirección'], href: '/es/cases/hermes', cta: 'Leer el caso' },
  { id: 'ayax', name: 'Ayax Suscripción de Riesgos', logo: '/assets/logos/ayax.webp', sector: 'Insurtech', years: '2024 – 2026', role: 'Product Designer único: sistema, interfaz, captación y marca',
    body: 'De folleto corporativo a plataforma de captación bilingüe para una agencia que suscribe por delegación de Lloyd’s: tres audiencias opuestas, seis ramos y ni una sola cotización online.',
    areas: ['Corredores', 'Asegurados', 'Mercado Lloyd’s'], href: '/es/cases/ayax', cta: 'Leer el caso' },
  { id: 'flesip', name: 'Flesip', logo: '/assets/logos/flesip.webp', sector: 'Facturación y ERP', years: '2024 – 2025', role: 'Producto completo: app, web y portal',
    body: 'Facturación electrónica para autónomos y pymes: configuración que trabaja sola, factura rápida con estado intermedio y VeriFactu comprensible. El camino que cumple la norma, también el más corto.',
    areas: ['Autónomos y pymes', 'Impuestos y VeriFactu', 'Bancos y cobros', 'Asesorías'], href: '/es/cases/flesip', cta: 'Leer el caso' },
  { id: 'montsaint', name: 'Montsaint', logo: '/assets/logos/montsaint.webp', sector: 'E-commerce', years: '2023 – 2025', role: 'Tienda, landing de partners y dirección de arte',
    body: 'Gafas de bio-acetato que se venden al cliente final y se distribuyen en más de 700 ópticas: dos webs, dos ritmos de decisión y una dirección de arte que sostiene las dos.',
    areas: ['Cliente final', 'Red de ópticas', 'Marca y fotografía'], href: '/es/cases/montsaint', cta: 'Leer el caso' },
  { id: 'mercantil', name: 'Mercantil Banco Panamá', logo: '/assets/logos/mercantil.webp', sector: 'Banca', years: '2021 – 2022', role: 'Product Designer de Darien Technology, en entorno regulado',
    body: 'Banca digital para cinco ofertas y cinco audiencias: pagos digitales, Tadelanto y Next Gen, del deck comercial al flujo en banca en línea, con onboarding y autenticación en entorno regulado.',
    areas: ['Producto', 'Negocio', 'Comercial', 'Comercios'], href: '/es/cases/mercantil', cta: 'Leer el caso' },
  { id: 'mony', name: 'Mony', logo: '/assets/logos/mony-wordmark.webp', sector: 'Banca', years: '2021', role: 'Product Designer, solo: móvil, web y guía de estilo',
    body: 'Pedir dinero con un enlace dentro de la app Mony: quien pide lo hace en cuatro pasos y quien paga, con tarjeta desde el enlace. Diseñé las dos caras y la guía de estilo con la que se presentó a negocio.',
    areas: ['Quien pide', 'Quien paga', 'Negocio'], href: '/es/cases/pidemony', cta: 'Leer el caso' },
  { id: 'taksio', name: 'Taksio', sector: 'Transporte', years: '2017 – 2019', role: 'UX/UI Designer',
    body: 'Plataforma de movilidad multimodal desde cero: primero el design system, después los flujos de pasajero y conductor y los dashboards de operación.',
    areas: ['Pasajeros', 'Conductores', 'Operación'], href: 'https://www.behance.net/gallery/81635187/Taksio-website', cta: 'Ver en Behance', external: true },
];

export default function Clients() {
  const [id, setId] = useState(CLIENTS[0].id);
  const c = CLIENTS.find((x) => x.id === id)!;
  return (
    <div className={s.wrap}>
      <LayoutGroup>
        <div className={s.grid} role="group" aria-label="Clientes">
          {CLIENTS.map((x) => {
            const on = x.id === id;
            return (
              <button key={x.id} type="button" className={`${s.tile} ${on ? s.on : ''}`} aria-pressed={on} aria-controls="client-panel" onClick={() => setId(x.id)}>
                {x.logo ? <img src={x.logo} alt="" className={s.logo} /> : <span className={s.word}>{x.name}</span>}
                <span className="visually-hidden">{x.name}</span>
                <span className={s.sector}>{x.sector}</span>
                {on && (
                  <motion.span layoutId="client-sel" className={s.sel} aria-hidden="true" transition={{ type: 'spring', stiffness: 420, damping: 34 }}>
                    <i className={`${s.h} ${s.tl}`} /><i className={`${s.h} ${s.tr}`} /><i className={`${s.h} ${s.bl}`} /><i className={`${s.h} ${s.br}`} />
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div id="client-panel" className={s.panel} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={c.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <p className={s.meta}>{c.sector} · {c.years}</p>
            <h3 className={s.name}>{c.name}</h3>
            <p className={s.role}>{c.role}</p>
            <p className={s.body}>{c.body}</p>
            <p className={s.areasLabel}>Para quién diseñé</p>
            <ul className={s.areas}>{c.areas.map((a) => <li key={a}>{a}</li>)}</ul>
            {c.external
              ? <a href={c.href} target="_blank" rel="noopener" className={s.link}>{c.cta} <span aria-hidden="true">↗</span></a>
              : <Link href={c.href} className={s.link}>{c.cta} <span aria-hidden="true">→</span></Link>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
