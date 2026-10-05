'use client';
import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import s from './TransitionTabs.module.css';

/* Pestañas con transición entre paneles. motion-primitives solo trae el
   panel animado (LICENSE-motion-primitives.md); aquí va con sus pestañas,
   que es como se usa: ARIA de tabs, flechas, Inicio y Fin.

   El panel entra desde el lado hacia el que avanzas, para que se lea el
   sentido. Con movimiento reducido, MotionConfig de la web deja solo el
   fundido. */
export type Tab = { id: string; label: string; content: React.ReactNode };

export default function TransitionTabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const base = useId();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const ir = (n: number, foco = false) => {
    const k = (n + tabs.length) % tabs.length;
    setDir(k >= i ? 1 : -1);
    setI(k);
    if (foco) refs.current[k]?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    const mapa: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in mapa)) return;
    e.preventDefault();
    ir(mapa[e.key], true);
  };
  return (
    <div className={s.wrap}>
      <div role="tablist" aria-label={label} className={s.list} onKeyDown={onKey}>
        {tabs.map((t, k) => (
          <button key={t.id} ref={(el) => { refs.current[k] = el; }} type="button" role="tab" id={`${base}-t-${t.id}`}
            aria-selected={i === k} aria-controls={`${base}-p`} tabIndex={i === k ? 0 : -1}
            className={i === k ? `${s.tab} ${s.on}` : s.tab} onClick={() => ir(k)}>
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${base}-p`} aria-labelledby={`${base}-t-${tabs[i].id}`} className={s.panel} tabIndex={0}>
        <AnimatePresence initial={false} mode="popLayout" custom={dir}>
          <motion.div key={tabs[i].id} custom={dir}
            variants={{ enter: (d: number) => ({ opacity: 0, x: 24 * d }), center: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: -24 * d }) }}
            initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
            {tabs[i].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
