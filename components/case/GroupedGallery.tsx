'use client';
import { useState } from 'react';
import DesignGallery, { type GalleryShot } from './DesignGallery';
import s from './designgallery.module.css';

type Labels = { open: string; close: string; prev: string; next: string; of: string; all: string; filter: string };

/* La galería de un caso que junta varios módulos (HERMES: plataforma,
   suscripción, certificados y cliente 360). Encima, un filtro por módulo con
   el recuento de pantallas; debajo, la galería de siempre con lo filtrado.
   Si las pantallas no traen grupo, es la galería tal cual. */
export default function GroupedGallery({ items, labels }: { items: (GalleryShot & { group?: string })[]; labels: Labels }) {
  const groups = [...new Set(items.map((x) => x.group).filter((g): g is string => !!g))];
  const [pick, setPick] = useState<string | null>(null);
  if (groups.length < 2) return <DesignGallery items={items} labels={labels} />;
  const shown = pick ? items.filter((x) => x.group === pick) : items;
  const opts: (string | null)[] = [null, ...groups];
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = opts[(opts.indexOf(pick) + d + opts.length) % opts.length];
    setPick(n);
    (e.currentTarget.querySelector(`[data-opt="${n ?? ''}"]`) as HTMLElement | null)?.focus();
  };
  return (
    <div className={s.grouped}>
      <div role="radiogroup" aria-label={labels.filter} className={s.chips} onKeyDown={onKey}>
        {opts.map((g) => {
          const on = pick === g;
          const count = g ? items.filter((x) => x.group === g).length : items.length;
          return (
            <button key={g ?? 'all'} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} data-opt={g ?? ''} className={s.chip} onClick={() => setPick(g)}>
              {g ?? labels.all}<span className={s.count}>{count}</span>
            </button>
          );
        })}
      </div>
      {/* La clave reinicia la galería al cambiar de módulo: filas y visor se
          recalculan con las pantallas nuevas. */}
      <DesignGallery key={pick ?? 'all'} items={shown} labels={labels} />
    </div>
  );
}
