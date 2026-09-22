import { ABOUT } from '@/lib/content/about';
import s from './about.module.css';
export default function CityChips({ country, only }: { country: 'ES' | 'VE'; only?: 'current' | 'past' }) {
  const list = ABOUT.cities.filter((c) => c.country === country && (only === 'current' ? c.current : only === 'past' ? !c.current : true));
  return <>{list.map((c) => <span key={c.name} className={`${s.chip} ${c.current ? s.chipNow : ''}`}>{c.name}{c.years ? <small> {c.years}</small> : null}</span>)}</>;
}
