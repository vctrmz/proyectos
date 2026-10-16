import Kicker from '@/components/ui/Kicker';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import StarfieldButton from '@/components/ui/StarfieldButton';
import ContactButton from '@/components/contact/ContactButton';
import { SITE } from '@/lib/content/site';
import { SOCIAL_ICON, type SocialName } from '@/components/ui/socialIcons';
import { getUi } from '@/lib/i18n/ui';
import { ROUTES, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import HeroField from './HeroField';
import s from './Hero.module.css';

/* Las tres puertas al trabajo, junto al nombre: LinkedIn para el perfil,
   Behance para los proyectos visuales y Figma para el archivo de trabajo. */
const SOCIAL: { name: SocialName; href: string }[] = [
  { name: 'LinkedIn', href: SITE.linkedin },
  { name: 'Behance', href: SITE.behance },
  { name: 'Figma', href: SITE.figma },
];

export default function Hero({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ui = getUi(locale);
  const r = ROUTES[locale];
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <HeroField />
      <div className={s.veil} aria-hidden="true" />
      <div className={s.inner}>
        {/* El nombre y sus redes en una sola línea: quien llega sabe de quién
            es la web y dónde ver más sin bajar. Cada icono dice su nombre al
            señalarlo; el lector de pantalla lo oye en el aria-label. */}
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
        <Kicker>{ui.home.kicker} · {SITE.base[locale]}</Kicker>
        <TwoToneHeading as="h1" id="hero-title" size="display" lines={ui.home.heroLines} />
        <p className={s.sub}>{ui.home.heroSub}</p>
        <div className={s.ctas}>
          <StarfieldButton label={locale === 'es' ? 'Ver el caso HERMES' : 'Read the HERMES case'} href={r.caseOf('hermes')} size="lg" />
          <ContactButton size="lg" />
        </div>
      </div>
    </section>
  );
}
