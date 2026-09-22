import Link from 'next/link';
import StarfieldButton from '@/components/ui/StarfieldButton';
import { SITE } from '@/lib/content/site';
import s from './SiteFooter.module.css';

/* Tres bloques arriba —claim, contacto y redes— y una barra azul abajo con la
   disponibilidad y el legal. El contacto vive aquí: es el único sitio de la
   web con botones. */
export default function SiteFooter() {
  return (
    <footer className={s.foot}>
      <div className={`container ${s.inner}`}>
        <p className={s.claim}>Diseño producto B2B donde un error operativo cuesta dinero.</p>
        <div className={s.contact}>
          <p className={s.kicker}>Ponte en contacto</p>
          <div className={s.ctas}>
            <StarfieldButton label={SITE.email} href={`mailto:${SITE.email}`} />
            <StarfieldButton label="LinkedIn" href={SITE.linkedin} external />
          </div>
        </div>
        <ul className={s.links}>
          <li><a href={SITE.behance} target="_blank" rel="noopener">Behance <span aria-hidden="true">↗</span></a></li>
          <li><a href={SITE.instagram} target="_blank" rel="noopener">Instagram <span aria-hidden="true">↗</span></a></li>
          <li><Link href="/sobre-mi">Sobre mí</Link></li>
        </ul>
      </div>
      <div className={s.bar}>
        <div className={`container ${s.barInner}`}>
          <span className={s.dot}><span aria-hidden="true" />Disponible para proyectos</span>
          <span className={s.legal}>© 2026 {SITE.name} · {SITE.city}, España · Trabajo en remoto · <Link href="/privacidad">Privacidad</Link> · <Link href="/privacidad#cookies">Cookies</Link></span>
        </div>
      </div>
    </footer>
  );
}
