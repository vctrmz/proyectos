import Link from 'next/link';
import ContactButton from '@/components/contact/ContactButton';
import { getCase } from '@/lib/content/cases';
import { getCaseIn } from '@/lib/content/en';
import { DEFAULT_LOCALE, ROUTES, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import s from './case.module.css';

/* El siguiente caso se resuelve en el idioma activo; si en inglés no existe
   ese caso, se enlaza el que sí está traducido. */
export default function NextCase({ slug, locale = DEFAULT_LOCALE }: { slug: string; locale?: Locale }) {
  const translated = getCaseIn(locale, slug);
  const n = translated ?? getCase(slug)!;
  const href = translated ? ROUTES[locale].caseOf(n.slug) : ROUTES.es.caseOf(n.slug);
  const ui = getUi(locale);
  return (
    <div className={s.next}>
      <Link href={href} className={s.nextLink} aria-label={`${ui.case.nextLabel}: ${n.title}`}><span>{ui.case.next}{!translated && locale === 'en' ? ' (in Spanish)' : ''}</span><span>{n.title} →</span></Link>
      <ContactButton />
    </div>
  );
}
