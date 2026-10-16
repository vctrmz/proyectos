'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion/prefs';
import PixelRun from './PixelRun';
import s from './casedock.module.css';

export type DockItem = { slug: string; title: string; href: string };
type Labels = { label: string; back: string; prev: string; next: string; /* Plantilla con {i} y {n}: una función no cruza del servidor al cliente. */
  of: string };

const CHEVRON_L = 'M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z';
const CHEVRON_R = 'M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z';
const pad = (n: number) => String(n).padStart(2, '0');

/* Dock de proyectos: una isla fija abajo para volver al trabajo o moverse
   entre casos sin subir ni bajar. Está siempre a la vista desde que se entra
   en el caso.

   Al pasar de caso desde el dock, la dirección se guarda un instante en
   sessionStorage y la página nueva la lee al montar: el chico del T-rex
   cruza el dock persiguiendo a los fantasmas en ese sentido (PixelRun). */
const RUN_KEY = 'vm-dock-run';
export default function CaseDock({ items, current, backHref, labels }: { items: DockItem[]; current: number; backHref: string; labels: Labels }) {
  const [run, setRun] = useState<{ dir: 'left' | 'right'; id: number } | null>(null);
  const n = items.length;
  const prev = items[(current - 1 + n) % n];
  const next = items[(current + 1) % n];

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RUN_KEY);
      if (!raw) return;
      sessionStorage.removeItem(RUN_KEY);
      const { dir, t } = JSON.parse(raw) as { dir: 'left' | 'right'; t: number };
      if (Date.now() - t < 5000 && !prefersReducedMotion()) setRun({ dir, id: t });
    } catch { /* sin storage no hay carrera, y no pasa nada */ }
  }, [current]);

  const mark = (dir: 'left' | 'right') => () => {
    try { sessionStorage.setItem(RUN_KEY, JSON.stringify({ dir, t: Date.now() })); } catch { /* idem */ }
  };

  return (
    <nav className={s.dock} data-shown="true" aria-label={labels.label}>
      {run && <PixelRun key={run.id} dir={run.dir} onDone={() => setRun(null)} />}
      <Link href={backHref} className={s.back} aria-label={labels.back}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
        <span className={s.backText}>{labels.back}</span>
      </Link>
      <span className={s.sep} aria-hidden="true" />
      <Link href={prev.href} className={s.arrow} aria-label={`${labels.prev}: ${prev.title}`} data-tip={prev.title} onClick={mark('left')}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={CHEVRON_L} /></svg>
      </Link>
      <ol className={s.dots}>
        {items.map((it, i) => (
          <li key={it.slug}>
            <Link href={it.href} className={s.dot} onClick={mark(i < current ? 'left' : 'right')} aria-current={i === current ? 'page' : undefined} aria-label={`${labels.of.replace('{i}', String(i + 1)).replace('{n}', String(n))}: ${it.title}`} data-tip={it.title}>
              <span />
            </Link>
          </li>
        ))}
      </ol>
      <span className={s.count} aria-hidden="true"><b>{pad(current + 1)}</b>/{pad(n)}</span>
      <Link href={next.href} className={s.arrow} aria-label={`${labels.next}: ${next.title}`} data-tip={next.title} onClick={mark('right')}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={CHEVRON_R} /></svg>
      </Link>
    </nav>
  );
}
