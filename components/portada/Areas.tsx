'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Icon, type IconName } from './icons';
import s from './Areas.module.css';

/* Algunas áreas en las que he trabajado: una ficha por sector, con su icono
   y sus años, y al lado lo que resolví en el que esté seleccionado. Sin
   nombres de cliente: el sector, el problema y para quién diseñé. Elegir un
   área la rellena del índigo de los filtros del catálogo y cambia el panel. Es un grupo de botones con aria-pressed y
   el panel es una región viva: con teclado y lector de pantalla funciona
   igual. Los textos salen de los casos, de los sectores y del CV. */
type Area = {
  id: string; name: string; icon: IconName; years: string;
  body: string; areas: string[]; href: string; cta: string; external?: boolean;
};

const AREAS: Area[] = [
  { id: 'insurtech', name: 'Insurtech', icon: 'shield', years: '2022 – 2026',
    body: 'Un SaaS asegurador para compañías con lógicas incompatibles: 165 pantallas en 8 áreas, 12 idiomas y 347 permisos sobre un único núcleo y un único design system, sin una versión distinta por cliente.',
    areas: ['Comercial', 'Suscripción', 'Pólizas y recibos', 'Siniestros', 'Facturación', 'Dirección'], href: '/es/cases/hermes', cta: 'Leer el caso' },
  { id: 'erp', name: 'Facturación y ERP', icon: 'bill', years: '2024 – 2025',
    body: 'Facturación electrónica para autónomos y pymes: una configuración que trabaja sola, factura rápida con estado intermedio y VeriFactu comprensible. El camino que cumple la norma, también el más corto.',
    areas: ['Autónomos y pymes', 'Impuestos y VeriFactu', 'Bancos y cobros', 'Asesorías'], href: '/es/cases/flesip', cta: 'Leer el caso' },
  { id: 'ecommerce', name: 'E-commerce', icon: 'bag', years: '2023 – 2025',
    body: 'Una tienda para el cliente final y una web para más de 700 ópticas sobre la misma colección: dos ritmos de decisión y una dirección de arte que sostiene los dos.',
    areas: ['Cliente final', 'Red de ópticas', 'Marca y fotografía'], href: '/es/cases/montsaint', cta: 'Leer el caso' },
  { id: 'banca', name: 'Banca digital', icon: 'bank', years: '2021 – 2022',
    body: 'Pagos digitales, adelanto de nómina, hipotecas y pedir dinero con un enlace, del deck comercial al flujo en banca en línea, con onboarding y autenticación reforzada en entorno regulado.',
    areas: ['Producto', 'Negocio', 'Comercial', 'Comercios'], href: '/es/cases/mercantil', cta: 'Leer el caso' },
  { id: 'movilidad', name: 'Movilidad', icon: 'steering', years: '2017 – 2019',
    body: 'Una plataforma multimodal desde cero: primero el design system, después los flujos de pasajero y conductor y los paneles de operación.',
    areas: ['Pasajeros', 'Conductores', 'Operación'], href: 'https://www.behance.net/gallery/81635187/Taksio-website', cta: 'Ver en Behance', external: true },
];

export default function Areas() {
  const [id, setId] = useState(AREAS[0].id);
  const a = AREAS.find((x) => x.id === id)!;
  return (
    <div className={s.wrap}>
      <div className={s.grid} role="group" aria-label="Áreas">
          {AREAS.map((x) => {
            const on = x.id === id;
            return (
              <button key={x.id} type="button" className={`${s.tile} ${on ? s.on : ''}`} aria-pressed={on} aria-controls="area-panel" onClick={() => setId(x.id)}>
                <Icon name={x.icon} className={s.icon} />
                <span className={s.name}>{x.name}</span>
                <span className={s.years}>{x.years}</span>
              </button>
            );
          })}
      </div>

      <div id="area-panel" className={s.panel} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={a.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <p className={s.meta}>{a.years}</p>
            <h3 className={s.title}>{a.name}</h3>
            <p className={s.body}>{a.body}</p>
            <p className={s.areasLabel}>Para quién diseñé</p>
            <ul className={s.areas}>{a.areas.map((x) => <li key={x}>{x}</li>)}</ul>
            {a.external
              ? <a href={a.href} target="_blank" rel="noopener" className={s.link}>{a.cta} <span aria-hidden="true">↗</span></a>
              : <Link href={a.href} className={s.link}>{a.cta} <span aria-hidden="true">→</span></Link>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
