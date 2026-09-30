import Link from 'next/link';
import StarfieldButton from '@/components/ui/StarfieldButton';
import { SITE } from '@/lib/content/site';
import { DEFAULT_LOCALE, ROUTES, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import s from './SiteFooter.module.css';

/* Tres bloques arriba —claim, contacto y redes— y una barra azul abajo con la
   disponibilidad y el legal. El contacto vive aquí: es el único sitio de la
   web con botones. */
export default function SiteFooter({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ui = getUi(locale);
  const r = ROUTES[locale];
  return (
    <footer className={s.foot}>
      <div className={`container ${s.inner}`}>
        {/* Firma, no discurso: el claim va una sola vez, en el manifiesto de la home. */}
        <p className={s.claim}><strong>{SITE.name}</strong>{ui.footer.role}</p>
        <div className={s.contact}>
          <p className={s.kicker}>{ui.footer.contact}</p>
          <div className={s.ctas}>
            <StarfieldButton label={SITE.email} href={`mailto:${SITE.email}`} />
            <StarfieldButton label="LinkedIn" href={SITE.linkedin} external />
          </div>
        </div>
        <ul className={s.links}>
          <li><a href={SITE.github} target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a></li>
          <li><a href={SITE.behance} target="_blank" rel="noopener">Behance <span aria-hidden="true">↗</span></a></li>
          <li><Link href={r.about}>{ui.nav.about}</Link></li>
        </ul>
      </div>
      <div className={s.bar}>
        <div className={`container ${s.barInner}`}>
          <span className={s.dot}><span aria-hidden="true" />{ui.footer.available}</span>
          <span className={s.legal}>{ui.footer.legal} {SITE.name} · {SITE.city}, {locale === 'es' ? 'España' : 'Spain'} · {ui.footer.remote} · <Link href={r.privacy}>{ui.footer.privacy}</Link> · <Link href={r.cookies}>{ui.footer.cookies}</Link></span>
        </div>
      </div>
    </footer>
  );
}
