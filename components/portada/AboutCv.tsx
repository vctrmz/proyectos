import Link from 'next/link';
import { stackIn } from '@/lib/content/en';
import type { Locale } from '@/lib/i18n/config';
import st from '@/components/home/Stack.module.css';
import { ROUTES } from '@/lib/i18n/config';
import { portadaCopy } from './copy';
import { Rise, Part } from './Rise';
import { Icon } from './icons';
import s from './AboutCv.module.css';

/* Sobre mí en la portada, sacado del CV (scripts/cv/cv-es.html): el perfil
   en primera persona, la experiencia y la formación. Como en tigranz.com,
   unos pocos iconos en línea marcan las ideas clave (sistema, código, IA),
   en un solo color y decorativos. El CV descargable se queda en la página
   Sobre mí, a la que enlaza.

   Debajo, el stack de la portada con su mismo estilo, pero más corto: sin
   Vitest · axe, con GitHub en lugar de «Git y pull requests» y sin la nota
   del repositorio. */
export default function AboutCv({ locale }: { locale: Locale }) {
  const t = portadaCopy(locale).about;
  const STACK = stackIn(locale);
  const STACK_GROUPS = STACK.groups.map((g) => ({
    name: g.name,
    items: g.items.filter((x) => x !== 'Vitest · axe').map((x) => (x === t.gitItem ? 'GitHub' : x)),
  }));
  return (
    <div className={s.grid}>
      <Rise className={s.copy}>
        <Part as="p" className={s.lead}>{t.lead}</Part>
        <Part as="p">{t.p2}</Part>
        <Part as="p">
          {t.p3[0]} <Icon name="stack" className={s.ico} /> {t.p3[1]} <Icon name="sparkleLine" className={s.ico} /> {t.p3[2]} <Icon name="code" className={s.ico} />{t.p3[3]}
        </Part>
        <Part>
          <Link href={ROUTES[locale].about} className={s.more}>{t.more} <span aria-hidden="true">→</span></Link>
        </Part>
      </Rise>

      <Rise as="ul" className={s.jobs}>
        {t.jobs.map((j) => (
          <Part as="li" key={j.role} className={s.job}>
            <p className={s.years}>{j.years}</p>
            <div>
              <p className={s.role}>{j.role}</p>
              <p className={s.where}>{j.where}</p>
              <p className={s.note}>{j.note}</p>
            </div>
          </Part>
        ))}
        <Part as="li" className={s.job}>
          <p className={s.years}>2017</p>
          <div>
            <p className={s.role}>{t.degree.role}</p>
            <p className={s.where}>{t.degree.where}</p>
          </div>
        </Part>
      </Rise>

      <section className={`${st.stack} ${s.stack}`} aria-labelledby="about-stack">
        <h3 id="about-stack" className={st.title}>{STACK.title}</h3>
        <div className={st.groups}>
          {STACK_GROUPS.map((g, i) => (
            <div key={g.name}>
              <h4 id={`about-stack-${i}`} className={st.name}>{g.name}</h4>
              <ul className={st.items} aria-labelledby={`about-stack-${i}`}>{g.items.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
