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
export type Area = {
  id: string; name: string; icon: IconName; years: string;
  body: string; areas: string[]; href: string; cta: string; external?: boolean;
};

export default function Areas({ items: AREAS, labels }: { items: Area[]; labels: { group: string; forWhom: string } }) {
  const [id, setId] = useState(AREAS[0].id);
  const a = AREAS.find((x) => x.id === id)!;
  return (
    <div className={s.wrap}>
      <div className={s.grid} role="group" aria-label={labels.group}>
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
            <p className={s.areasLabel}>{labels.forWhom}</p>
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
