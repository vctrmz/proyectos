'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/i18n/config';
import { useLocale, useUi } from '@/lib/i18n/LocaleContext';
import LangSwitch from './LangSwitch';
import StarfieldButton from '@/components/ui/StarfieldButton';
import { useScrollDirection } from '@/lib/motion/useScrollDirection';
import s from './SiteHeader.module.css';

export default function SiteHeader() {
  const path = usePathname();
  const dir = useScrollDirection();
  const locale = useLocale();
  const ui = useUi();
  const r = ROUTES[locale];
  const nav = [{ href: r.work, label: ui.nav.work }, { href: r.about, label: ui.nav.about }];
  const isActive = (href: string) => (href.includes('#') ? path === r.home : path === href);
  return (
    <header className={`${s.header} ${dir === 'down' ? s.hidden : ''}`}>
      <div className={`container ${s.bar}`}>
        <Link href={r.home} className={s.brand} aria-label={`${locale === 'es' ? 'Inicio' : 'Home'} — Víctor Maza`}><span className={s.mark} aria-hidden="true">VM</span><span>Víctor Maza</span></Link>
        <nav aria-label={locale === 'es' ? 'Principal' : 'Main'}>
          <ul className={s.links}>
            {nav.map((n) => <li key={n.href}><Link href={n.href} className={s.link} aria-current={isActive(n.href) ? 'page' : undefined}>{n.label}</Link></li>)}
            <li><LangSwitch /></li>
            <li><StarfieldButton label={ui.nav.contact} href={`${r.home === '/' ? '' : r.home}/#contacto`.replace('//', '/')} /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
