'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, LOCALE_LABEL, altPath, localeOf, type Locale } from '@/lib/i18n/config';
import { EN_CASE_SLUGS } from '@/lib/content/en';
import s from './LangSwitch.module.css';

/* Banderas dibujadas en SVG y no con emoji: en Windows los emoji de bandera
   no tienen glifo y se ven como «ES» y «GB» en letras. Cada bandera lleva su
   texto al lado, porque una bandera sola no es una etiqueta de idioma
   accesible. */
function Flag({ locale }: { locale: Locale }) {
  if (locale === 'es') return (
    <svg viewBox="0 0 24 16" className={s.flag} role="img" aria-hidden="true" focusable="false">
      <rect width="24" height="16" fill="#C60B1E" />
      <rect y="4" width="24" height="8" fill="#FFC400" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 16" className={s.flag} role="img" aria-hidden="true" focusable="false">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#fff" strokeWidth="3.4" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.8" />
      <path d="M12 0 V16 M0 8 H24" stroke="#fff" strokeWidth="5.4" />
      <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}

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
            <Flag locale={l} /><span className={s.code}>{label.short}</span>
          </span>
        );
        return (
          <Link key={l} href={href} hrefLang={l} className={`${s.item} ${active ? s.on : ''}`} aria-current={active ? 'true' : undefined} aria-label={label.aria}>
            <Flag locale={l} /><span className={s.code}>{label.short}</span>
          </Link>
        );
      })}
    </div>
  );
}
