import { SITE } from '@/lib/content/site';
import { stackIn } from '@/lib/content/en';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import s from './Stack.module.css';

/* El stack en dos grupos: con qué diseño y con qué lo llevo a código. Va
   debajo de los hechos porque es lo segundo que busca un lead técnico, y la
   nota enlaza al repositorio: la prueba queda a un clic. Sin JS: es HTML. */
export default function Stack({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const st = stackIn(locale);
  return (
    <section className={s.stack} aria-labelledby="stack-title">
      <h2 id="stack-title" className={s.title}>{st.title}</h2>
      <div className={s.groups}>
        {st.groups.map((g, i) => (
          <div key={g.name}>
            <h3 id={`stack-${i}`} className={s.name}>{g.name}</h3>
            <ul className={s.items} aria-labelledby={`stack-${i}`}>
              {g.items.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className={s.note}>{st.note} <a href={SITE.repo} target="_blank" rel="noopener">{st.link} <span aria-hidden="true">↗</span></a></p>
    </section>
  );
}
