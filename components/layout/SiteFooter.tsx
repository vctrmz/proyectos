import Link from 'next/link';
import { SITE } from '@/lib/content/site';
import s from './SiteFooter.module.css';
export default function SiteFooter() {
  return (
    <footer className={s.foot}>
      <div className={`container ${s.row}`}>
        <p>© 2026 {SITE.name} · {SITE.city}, España · Trabajo en remoto</p>
        <ul className={s.links}>
          <li><a href={SITE.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a></li>
          <li><a href={SITE.behance} target="_blank" rel="noopener">Behance ↗</a></li>
          <li><Link href="/privacidad">Privacidad</Link></li>
          <li><Link href="/privacidad#cookies">Cookies</Link></li>
        </ul>
      </div>
    </footer>
  );
}
