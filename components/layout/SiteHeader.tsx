'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/lib/content/site';
import StarfieldButton from '@/components/ui/StarfieldButton';
import { useScrollDirection } from '@/lib/motion/useScrollDirection';
import s from './SiteHeader.module.css';

export default function SiteHeader() {
  const path = usePathname();
  const dir = useScrollDirection();
  const isActive = (href: string) => (href.startsWith('/#') ? path === '/' : path === href);
  return (
    <header className={`${s.header} ${dir === 'down' ? s.hidden : ''}`}>
      <div className={`container ${s.bar}`}>
        <Link href="/" className={s.brand} aria-label="Inicio — Víctor Maza"><span className={s.mark} aria-hidden="true">VM</span><span>Víctor Maza</span></Link>
        <nav aria-label="Principal">
          <ul className={s.links}>
            {NAV.map((n) => <li key={n.href}><Link href={n.href} className={s.link} aria-current={isActive(n.href) ? 'page' : undefined}>{n.label}</Link></li>)}
            <li><StarfieldButton label="Contactar" href="/#contacto" /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
