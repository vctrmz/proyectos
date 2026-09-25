'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import { COMPETENCIES } from '@/lib/content/competencies';
import { EN_COMPETENCIES } from '@/lib/content/en/competencies';
import { useLocale, useUi } from '@/lib/i18n/LocaleContext';
import s from './competencies.module.css';

/* Las filas entran escalonadas con el scroll, todas desde abajo y alineadas:
   el desfase es de tiempo, no de posición. */
function useStairs(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || !scrollEffectsAllowed()) return;
    const rows = el.querySelectorAll<HTMLElement>('[data-row]');
    if (!rows.length) return;
    const tween = gsap.fromTo(rows,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 40%', scrub: 0.5 } });
    return () => { tween?.scrollTrigger?.kill(); tween?.kill(); ScrollTrigger.refresh(); };
  }, [root]);
}

/* Cada grupo abre una rejilla de competencias en etiqueta corta: el titular de
   cada una, numerado. La frase larga vive en el CV y en la entrevista; aquí lo
   que importa es que se lea de un vistazo. */
export default function Competencies() {
  const locale = useLocale();
  const ui = useUi();
  const GROUPS = locale === 'en' ? EN_COMPETENCIES : COMPETENCIES;
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(GROUPS[0].name);
  useStairs(root);
  const total = GROUPS.reduce((n, g) => n + g.items.length, 0);
  return (
    <div ref={root} className={s.stack}>
      <p className={s.lead}>{ui.home.competencies} <span aria-hidden="true">({total})</span></p>
      {GROUPS.map((g) => {
        const isOpen = open === g.name;
        const panelId = `comp-${g.n}`;
        return (
          <div key={g.name} data-row className={`${s.row} ${isOpen ? s.isOpen : ''}`}>
            <h3 className={s.head}>
              <button type="button" className={s.btn} aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(isOpen ? null : g.name)}>
                <span className={s.n} aria-hidden="true">{g.n}</span>
                <span className={s.name}>{g.name}</span>
                <span className={s.count}>{String(g.items.length).padStart(2, '0')} {ui.home.competenciesUnit}</span>
                <span className={s.sign} aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            <div id={panelId} className={s.panel} hidden={!isOpen}>
              <ul className={s.items}>
                {g.items.map((c) => (
                  <li key={c.id} className={s.item}>
                    <span className={s.num} aria-hidden="true">{c.id}</span>
                    <span className={s.label}>{c.title}</span>
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
