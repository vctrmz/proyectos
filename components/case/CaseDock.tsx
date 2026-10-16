'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import s from './casedock.module.css';

export type DockItem = { slug: string; title: string; href: string };
type Labels = { label: string; back: string; prev: string; next: string; /* Plantilla con {i} y {n}: una función no cruza del servidor al cliente. */
  of: string };

const CHEVRON_L = 'M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z';
const CHEVRON_R = 'M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z';
const pad = (n: number) => String(n).padStart(2, '0');

/* Dock de proyectos: una isla fija abajo para volver al trabajo o moverse
   entre casos sin subir ni bajar. Solo aparece cuando hace falta —cuando los
   botones de arriba ya no se ven y antes de llegar a la tarjeta del final y al
   pie—, así nunca hay dos controles iguales en pantalla. Mientras está oculto
   es inert: no recibe foco ni lo anuncia el lector de pantalla. */
export default function CaseDock({ items, current, backHref, labels }: { items: DockItem[]; current: number; backHref: string; labels: Labels }) {
  const [shown, setShown] = useState(false);
  const n = items.length;
  const prev = items[(current - 1 + n) % n];
  const next = items[(current + 1) % n];

  useEffect(() => {
    const targets = [...document.querySelectorAll('[data-case-top], [data-case-end], footer')];
    if (!targets.length || !('IntersectionObserver' in window)) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
      setShown(visible.size === 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <nav className={s.dock} data-shown={shown} aria-label={labels.label} inert={!shown}>
      <Link href={backHref} className={s.back} aria-label={labels.back}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
        <span className={s.backText}>{labels.back}</span>
      </Link>
      <span className={s.sep} aria-hidden="true" />
      <Link href={prev.href} className={s.arrow} aria-label={`${labels.prev}: ${prev.title}`} data-tip={prev.title}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={CHEVRON_L} /></svg>
      </Link>
      <ol className={s.dots}>
        {items.map((it, i) => (
          <li key={it.slug}>
            <Link href={it.href} className={s.dot} aria-current={i === current ? 'page' : undefined} aria-label={`${labels.of.replace('{i}', String(i + 1)).replace('{n}', String(n))}: ${it.title}`} data-tip={it.title}>
              <span />
            </Link>
          </li>
        ))}
      </ol>
      <span className={s.count} aria-hidden="true"><b>{pad(current + 1)}</b>/{pad(n)}</span>
      <Link href={next.href} className={s.arrow} aria-label={`${labels.next}: ${next.title}`} data-tip={next.title}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={CHEVRON_R} /></svg>
      </Link>
    </nav>
  );
}
