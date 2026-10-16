import Button from '@/components/ui/Button';
import type { Locale } from '@/lib/i18n/config';
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

   El stack ya no va aquí: vive en Herramientas, en la página Sobre mí. */
export default function AboutCv({ locale }: { locale: Locale }) {
  const t = portadaCopy(locale).about;
  return (
    <div className={s.grid}>
      <Rise className={s.copy}>
        <Part as="p" className={s.lead}>{t.lead}</Part>
        <Part as="p">{t.p2}</Part>
        <Part as="p">
          {t.p3[0]} <Icon name="stack" className={s.ico} /> {t.p3[1]} <Icon name="sparkleLine" className={s.ico} /> {t.p3[2]} <Icon name="code" className={s.ico} />{t.p3[3]}
        </Part>
        <Part>
          <Button href={ROUTES[locale].about} variant="outline" size="lg" className={s.more}>{t.more} <span aria-hidden="true">→</span></Button>
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

    </div>
  );
}
