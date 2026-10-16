import { SITE } from '@/lib/content/site';
import { SOCIAL_ICON } from '@/components/ui/socialIcons';
import { SOCIAL } from '@/components/home/Hero';
import { getUi } from '@/lib/i18n/ui';
import type { Locale } from '@/lib/i18n/config';
import s from '@/components/home/Hero.module.css';

/* El nombre con sus tres puertas (LinkedIn, Behance, Figma), tal cual está en
   la portada actual: mismas clases y mismos enlaces, solo que aquí abre un
   hero alineado a la izquierda. */
export default function HeroId({ locale }: { locale: Locale }) {
  const ui = getUi(locale);
  return (
    <div className={s.id}>
      <p className={s.name}>{SITE.name}</p>
      <ul className={s.social} aria-label={ui.about.socialLabel}>
        {SOCIAL.map((x) => (
          <li key={x.name}>
            <a href={x.href} target="_blank" rel="noopener" aria-label={`${x.name} ${locale === 'es' ? '(abre en pestaña nueva)' : '(opens in a new tab)'}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={SOCIAL_ICON[x.name]} /></svg>
              <span className={s.tip} aria-hidden="true">{x.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
