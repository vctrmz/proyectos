'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, LOCALE_LABEL, altPath, localeOf, type Locale } from '@/lib/i18n/config';
import { EN_CASE_SLUGS } from '@/lib/content/en';
import Flag from '@/components/ui/Flag';
import s from './LangSwitch.module.css';

export default function LangSwitch() {
  const pathname = usePathname() ?? '/';
  const current = localeOf(pathname);
  const hasEnCase = (slug: string) => EN_CASE_SLUGS.includes(slug);
  return (
    <div className={s.wrap} role="group" aria-label={current === 'es' ? 'Idioma' : 'Language'}>
      {LOCALES.map((l) => {
        const href = altPath(pathname, l, hasEnCase);
        const active = l === current;
        const label = LOCALE_LABEL[l];
        /* Sin equivalente traducido no se enlaza: se deja visible y desactivado
           en lugar de mandar a una página que no existe en ese idioma. */
        if (!href) return (
          <span key={l} className={`${s.item} ${s.off}`} aria-disabled="true" title={current === 'es' ? 'Esta página todavía no está en inglés' : 'This page is not translated yet'}>
            <Flag locale={l} className={s.flag} /><span className={s.code}>{label.short}</span>
          </span>
        );
        return (
          <Link key={l} href={href} hrefLang={l} className={`${s.item} ${active ? s.on : ''}`} aria-current={active ? 'true' : undefined} aria-label={label.aria}>
            <Flag locale={l} className={s.flag} /><span className={s.code}>{label.short}</span>
          </Link>
        );
      })}
    </div>
  );
}
