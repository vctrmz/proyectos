'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, LayoutGroup } from 'motion/react';
import { filterProjects, filterCounts, parseFilter, type FilterId } from '@/lib/content/projects';
import FilterChips from './FilterChips';
import ProjectCard from './ProjectCard';
import s from './catalog.module.css';

/* El filtro vive en la URL (?f=) para poder compartirlo; replaceState evita
   añadir historial por cada chip. */
export default function Catalog({ initialFilter }: { initialFilter?: FilterId }) {
  const params = useSearchParams();
  const [filter, setFilter] = useState<FilterId>(initialFilter ?? parseFilter(params.get('f')));
  const counts = filterCounts();
  const items = filterProjects(filter);
  const change = (f: FilterId) => {
    setFilter(f);
    const url = f === 'todo' ? window.location.pathname : `${window.location.pathname}?f=${f}`;
    window.history.replaceState(null, '', url + (window.location.hash || ''));
  };
  return (
    <div>
      <FilterChips value={filter} counts={counts} onChange={change} />
      <p role="status" aria-live="polite" className={s.status}>{items.length} {items.length === 1 ? 'proyecto' : 'proyectos'}</p>
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
