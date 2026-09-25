import { aboutIn } from '@/lib/content/en';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import s from './about.module.css';
export default function CityChips({ country, only, locale = DEFAULT_LOCALE }: { country: 'ES' | 'VE'; only?: 'current' | 'past'; locale?: Locale }) {
  const ABOUT = aboutIn(locale);
  const list = ABOUT.cities.filter((c) => c.country === country && (only === 'current' ? c.current : only === 'past' ? !c.current : true));
  return <>{list.map((c) => <span key={c.name} className={`${s.chip} ${c.current ? s.chipNow : ''}`}>{c.name}{c.years ? <small> {locale === 'en' ? c.years.replace('ahora', 'now') : c.years}</small> : null}</span>)}</>;
}
