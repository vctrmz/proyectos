'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import { COMPETENCIES } from '@/lib/content/competencies';
import s from './competencies.module.css';

/* Las filas entran escalonadas con el scroll, cada una desde su lado. Es el
   mismo gesto del portfolio anterior: la escalera se arma al bajar. */
function useStairs(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || !scrollEffectsAllowed()) return;
    const rows = el.querySelectorAll<HTMLElement>('[data-row]');
    if (!rows.length) return;
    const tween = gsap.fromTo(rows,
      { opacity: 0, y: 26, xPercent: (i: number) => (i % 2 ? 3 : -3) },
      { opacity: 1, y: 0, xPercent: 0, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 40%', scrub: 0.5 } });
    return () => { tween?.scrollTrigger?.kill(); tween?.kill(); ScrollTrigger.refresh(); };
  }, [root]);
}

export default function Competencies() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(COMPETENCIES[0].name);
  useStairs(root);
  return (
    <div ref={root} className={s.stack}>
      <p className={s.lead}>Competencias clave <span aria-hidden="true">({String(COMPETENCIES.length).padStart(2, '0')})</span></p>
      {COMPETENCIES.map((g, i) => {
        const isOpen = open === g.name;
        const panelId = `comp-${g.n}`;
        return (
          <div key={g.name} data-row className={`${s.row} ${i % 2 ? s.right : s.left} ${isOpen ? s.isOpen : ''}`}>
            <h3 className={s.head}>
              <button type="button" className={s.btn} aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(isOpen ? null : g.name)}>
                <span className={s.name}>{g.name}</span>
                <span className={s.count}>{String(g.items.length).padStart(2, '0')} competencias</span>
                <span className={s.sign} aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            <div id={panelId} className={s.panel} hidden={!isOpen}>
              <ul className={s.items}>
                {g.items.map((c) => (
                  <li key={c.id}>
                    <span className={s.num} aria-hidden="true">{c.id}</span>
                    <span><strong>{c.title}.</strong> {c.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
