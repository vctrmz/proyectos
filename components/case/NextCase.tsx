import Link from 'next/link';
import ContactButton from '@/components/contact/ContactButton';
import { CASE_SLUGS, getCase } from '@/lib/content/cases';
import { getCaseIn } from '@/lib/content/en';
import { getProject } from '@/lib/content/projects';
import { DEFAULT_LOCALE, ROUTES, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import BrandMark from './BrandMark';
import s from './case.module.css';

/* El siguiente caso se resuelve en el idioma activo; si en inglés no existe
   ese caso, se enlaza el que sí está traducido. Lo usan el botón de arriba y
   la tarjeta del final, así que los dos llevan siempre al mismo sitio. */
export function resolveNext(slug: string, locale: Locale) {
  const translated = getCaseIn(locale, slug);
  const n = translated ?? getCase(slug)!;
  const href = translated ? ROUTES[locale].caseOf(n.slug) : ROUTES.es.caseOf(n.slug);
  const note = !translated && locale === 'en' ? ' (in Spanish)' : '';
  return { n, href, note };
}

/* Todos los casos en el orden del catálogo, resueltos igual que el siguiente:
   es la secuencia que recorre el dock. */
export const caseSequence = (locale: Locale) => CASE_SLUGS.map((slug) => {
  const { n, href, note } = resolveNext(slug, locale);
  return { slug, title: n.title + note, href };
});

export default function NextCase({ slug, locale = DEFAULT_LOCALE }: { slug: string; locale?: Locale }) {
  const { n, href, note } = resolveNext(slug, locale);
  const ui = getUi(locale);
  return (
    <div className={s.next} data-case-end>
      <Link href={href} className={s.nextCard} aria-label={`${ui.case.nextLabel}: ${n.title}`}>
        <BrandMark p={getProject(n.slug)!} size="lg" />
        <span className={s.nextText}>
          <span className={s.nextKicker}>{ui.case.next}{note}</span>
          <span className={s.nextTitle}>{n.title}</span>
          <span className={s.nextCompany}>{n.company}</span>
        </span>
        <span className={s.nextArrow} aria-hidden="true">→</span>
      </Link>
      <ContactButton />
    </div>
  );
}
