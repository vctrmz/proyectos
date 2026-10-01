import Link from 'next/link';
import Button from '@/components/ui/Button';
import ContactButton from '@/components/contact/ContactButton';
import { SITE } from '@/lib/content/site';
import { DEFAULT_LOCALE, ROUTES, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import s from './SiteFooter.module.css';

/* Tres bloques arriba —claim, contacto y redes— y una barra azul abajo con la
   disponibilidad y el legal. El contacto repite el del cierre para quien llega
   al final: «Contactar» y LinkedIn. El correo no se escribe: se copia desde
   el modal. */
export default function SiteFooter({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ui = getUi(locale);
  const r = ROUTES[locale];
  return (
    /* `foot` también como clase global: el botón de LinkedIn la busca para
       pintarse en claro sobre el fondo oscuro. */
    <footer className={`foot ${s.foot}`}>
      <div className={`container ${s.inner}`}>
        {/* Firma, no discurso: el claim va una sola vez, en el manifiesto de la home. */}
        <p className={s.claim}><strong>{SITE.name}</strong>{ui.footer.role}</p>
        <div className={s.contact}>
          <p className={s.kicker}>{ui.footer.contact}</p>
          <div className={s.ctas}>
            <ContactButton />
            <Button href={SITE.linkedin} external variant="outline">LinkedIn</Button>
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
          <span className={s.legal}>{ui.footer.legal} {SITE.name} · {ui.footer.remote} · <Link href={r.privacy}>{ui.footer.privacy}</Link> · <Link href={r.cookies}>{ui.footer.cookies}</Link></span>
        </div>
      </div>
    </footer>
  );
}
