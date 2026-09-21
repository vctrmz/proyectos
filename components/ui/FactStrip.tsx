import s from './FactStrip.module.css';
export default function FactStrip({ facts }: { facts: { value: string; label: string }[] }) {
  return <dl className={s.strip}>{facts.map((f) => <div key={f.label}><dt className={s.v}>{f.value}</dt><dd className={s.l}>{f.label}</dd></div>)}</dl>;
}
