import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import { sectorsIn } from '@/lib/content/en';
import { getUi } from '@/lib/i18n/ui';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import s from './Sectores.module.css';

/* Los sectores dicen dónde y, además, para quién: un CRM o un back office
   tiene tantos usuarios como áreas, y eso es lo que el recruiter necesita
   saber que ya he resuelto. La entradilla va junto al título, a su derecha
   en escritorio; cada tarjeta lista sus áreas. */
export default function Sectores({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ui = getUi(locale);
  const sectors = sectorsIn(locale);
  return (
    <section id="sectores" className={`container ${s.wrap}`} aria-labelledby="sectores-title">
      <SectionHeader id="sectores-title" kicker={ui.home.sectorsKicker} title={ui.home.sectorsTitle} action={<p className={s.lead}>{ui.home.sectorsLead}</p>} />
      <ul className={s.grid}>
        {sectors.map((x) => (
          <li key={x.n} className={s.card}>
            <span className={s.n}>{x.n} · {x.years}</span>
            <div><p className={s.name}>{x.name}</p><p className={s.meta}>{x.company}</p></div>
            <p className={s.body}>{x.body}</p>
            <div className={s.who}>
              <p className={s.whoLabel} id={`areas-${x.n}`}>{ui.home.sectorsAreas}</p>
              <ul className={s.areas} aria-labelledby={`areas-${x.n}`}>
                {x.areas.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
            {x.external
              ? <a href={x.href} target="_blank" rel="noopener" className={s.link}>{x.cta} ↗</a>
              : <Link href={x.href} className={s.link}>{x.cta} →</Link>}
          </li>
        ))}
      </ul>
    </section>
  );
}
