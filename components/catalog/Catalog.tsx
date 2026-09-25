'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, LayoutGroup } from 'motion/react';
import { matches, FILTERS, parseFilter, type FilterId } from '@/lib/content/projects';
import { projectsIn } from '@/lib/content/en';
import { useLocale, useUi } from '@/lib/i18n/LocaleContext';
import FilterChips from './FilterChips';
import ProjectCard from './ProjectCard';
import s from './catalog.module.css';

/* El filtro vive en la URL (?f=) para poder compartirlo; replaceState evita
   añadir historial por cada chip. */
export default function Catalog({ initialFilter }: { initialFilter?: FilterId }) {
  const params = useSearchParams();
  const locale = useLocale();
  const ui = useUi();
  const [filter, setFilter] = useState<FilterId>(initialFilter ?? parseFilter(params.get('f')));
  /* Los proyectos se resuelven en el idioma activo y se filtran igual: el
     filtro mira el dato (tipo, estado, sector), no el texto. */
  const all = projectsIn(locale);
  const counts = Object.fromEntries(FILTERS.map((f) => [f.id, all.filter((p) => matches(p, f.id)).length])) as Record<FilterId, number>;
  const items = all.filter((p) => matches(p, filter));
  const change = (f: FilterId) => {
    setFilter(f);
    const url = f === 'todo' ? window.location.pathname : `${window.location.pathname}?f=${f}`;
    window.history.replaceState(null, '', url + (window.location.hash || ''));
  };
  return (
    <div>
      <FilterChips value={filter} counts={counts} onChange={change} />
      <p role="status" aria-live="polite" className={s.status}>{ui.catalog.count(items.length)}</p>
      <LayoutGroup>
        <ul className={s.grid}>
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </AnimatePresence>
        </ul>
      </LayoutGroup>
    </div>
  );
}
