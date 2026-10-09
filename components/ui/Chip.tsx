import s from './Chip.module.css';
type Props = { checked: boolean; count?: number; onSelect: () => void; children: React.ReactNode; tone?: 'light' | 'night' };
/* En la banda oscura el chip marcado lleva una marca dibujada además del
   relleno: el estado no depende solo del color. */
export default function Chip({ checked, count, onSelect, children, tone = 'light' }: Props) {
  return (
    <button type="button" role="radio" aria-checked={checked} tabIndex={checked ? 0 : -1} onClick={onSelect} className={`${s.chip} ${tone === 'night' ? s.night : ''}`}>
      {tone === 'night' && checked && <svg className={s.check} viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8.5l3.2 3.2L13 5" /></svg>}
      {children}{typeof count === 'number' && <span className={s.count}>{count}</span>}
    </button>
  );
}
