import s from './Chip.module.css';
type Props = { checked: boolean; count?: number; onSelect: () => void; children: React.ReactNode };
export default function Chip({ checked, count, onSelect, children }: Props) {
  return (
    <button type="button" role="radio" aria-checked={checked} tabIndex={checked ? 0 : -1} onClick={onSelect} className={s.chip}>
      {children}{typeof count === 'number' && <span className={s.count}>{count}</span>}
    </button>
  );
}
