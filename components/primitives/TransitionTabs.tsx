'use client';
import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import s from './TransitionTabs.module.css';

/* Pestañas con transición entre paneles. motion-primitives solo trae el
   panel animado (LICENSE-motion-primitives.md); aquí va con sus pestañas,
   que es como se usa: ARIA de tabs, flechas, Inicio y Fin.

   Dos movimientos: la pastilla de la pestaña activa se desliza hasta la
   nueva (layoutId), y el panel entra desde el lado hacia el que avanzas,
   desenfocado y algo más pequeño, hasta quedar nítido. Con movimiento
   reducido, MotionConfig de la web deja solo el fundido. */
export type Tab = { id: string; label: string; content: React.ReactNode };

export default function TransitionTabs({ tabs, label, tone = 'light' }: { tabs: Tab[]; label: string; tone?: 'light' | 'dark' }) {
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
    <div className={`${s.wrap} ${tone === 'dark' ? s.dark : ''}`}>
      <div role="tablist" aria-label={label} className={s.list} onKeyDown={onKey}>
        {tabs.map((t, k) => (
          <button key={t.id} ref={(el) => { refs.current[k] = el; }} type="button" role="tab" id={`${base}-t-${t.id}`}
            aria-selected={i === k} aria-controls={`${base}-p`} tabIndex={i === k ? 0 : -1}
            className={i === k ? `${s.tab} ${s.on}` : s.tab} onClick={() => ir(k)}>
            {i === k && <motion.span layoutId={`${base}-pill`} className={s.pill} transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
            <span className={s.text}>{t.label}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${base}-p`} aria-labelledby={`${base}-t-${tabs[i].id}`} className={s.panel} tabIndex={0}>
        <AnimatePresence initial={false} mode="popLayout" custom={dir}>
          <motion.div key={tabs[i].id} custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: 48 * d, scale: 0.96, filter: 'blur(8px)' }),
              center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
              exit: (d: number) => ({ opacity: 0, x: -48 * d, scale: 0.96, filter: 'blur(8px)' }),
            }}
            initial="enter" animate="center" exit="exit" transition={{ type: 'spring', bounce: 0, duration: 0.55 }}>
            {tabs[i].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
