import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import { SECTORS } from '@/lib/content/sectors';
import s from './Sectores.module.css';

export default function Sectores() {
  return (
    <section id="sectores" className={`container ${s.wrap}`} aria-labelledby="sectores-title">
      <SectionHeader id="sectores-title" kicker="Recorrido" title={['Cinco sectores,', 'el mismo tipo de problema.']} />
      <ul className={s.grid}>
        {SECTORS.map((x) => (
          <li key={x.n} className={s.card}>
            <span className={s.n}>{x.n} · {x.years}</span>
            <div><p className={s.name}>{x.name}</p><p className={s.meta}>{x.company}</p></div>
            <p className={s.body}>{x.body}</p>
            {x.external
              ? <a href={x.href} target="_blank" rel="noopener" className={s.link}>{x.cta} ↗</a>
              : <Link href={x.href} className={s.link}>{x.cta} →</Link>}
          </li>
        ))}
      </ul>
    </section>
  );
}
