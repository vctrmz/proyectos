import Link from 'next/link';
import { SITE } from '@/lib/content/site';
import s from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer className={s.foot}>
      <div className={`container ${s.inner}`}>
        <div className={s.top}>
          <p className={s.claim}>Diseño producto B2B donde un error operativo cuesta dinero.</p>
          <ul className={s.links}>
            <li><a href={SITE.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a></li>
            <li><a href={SITE.behance} target="_blank" rel="noopener">Behance ↗</a></li>
            <li><a href={SITE.instagram} target="_blank" rel="noopener">Instagram ↗</a></li>
            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          </ul>
        </div>
        <div className={s.meta}>
          <span className={s.dot}><span aria-hidden="true" />Disponible para proyectos</span>
          <span>© 2026 Víctor Maza · {SITE.city}, España · Trabajo en remoto</span>
          <span><Link href="/privacidad">Privacidad</Link> · <Link href="/privacidad#cookies">Cookies</Link></span>
        </div>
      </div>
    </footer>
  );
}
