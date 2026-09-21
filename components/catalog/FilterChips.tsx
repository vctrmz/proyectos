'use client';
import { useRef } from 'react';
import { FILTERS, type FilterId } from '@/lib/content/projects';
import Chip from '@/components/ui/Chip';
import s from './catalog.module.css';

export default function FilterChips({ value, counts, onChange }: { value: FilterId; counts: Record<FilterId, number>; onChange: (f: FilterId) => void }) {
  const group = useRef<HTMLDivElement>(null);
  const onKey = (e: React.KeyboardEvent) => {
    const i = FILTERS.findIndex((f) => f.id === value);
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const idx = (i + d + FILTERS.length) % FILTERS.length;
    onChange(FILTERS[idx].id);
    group.current?.querySelectorAll<HTMLButtonElement>('[role=radio]')[idx]?.focus();
  };
  return (
    <div ref={group} role="radiogroup" aria-label="Filtrar proyectos" className={s.chips} onKeyDown={onKey}>
      {FILTERS.map((f) => <Chip key={f.id} checked={f.id === value} count={counts[f.id]} onSelect={() => onChange(f.id)}>{f.label}</Chip>)}
    </div>
  );
}
