import Kicker from '@/components/ui/Kicker';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import Button from '@/components/ui/Button';
import StarfieldButton from '@/components/ui/StarfieldButton';
import { SITE } from '@/lib/content/site';
import { SOCIAL_ICON, type SocialName } from '@/components/ui/socialIcons';
import { getUi } from '@/lib/i18n/ui';
import { ROUTES, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import HeroField from './HeroField';
import s from './Hero.module.css';

const SOCIAL: { name: SocialName; href: string }[] = [
  { name: 'LinkedIn', href: SITE.linkedin },
  { name: 'GitHub', href: SITE.github },
];

export default function Hero({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ui = getUi(locale);
  const r = ROUTES[locale];
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <HeroField />
      <div className={s.veil} aria-hidden="true" />
      <div className={s.inner}>
        <p className={s.name}><span className={s.mark} aria-hidden="true">VM</span>{SITE.name}</p>
        <Kicker>{ui.home.kicker} · {SITE.city}</Kicker>
        <TwoToneHeading as="h1" id="hero-title" size="display" lines={ui.home.heroLines} />
        <p className={s.sub}>{ui.home.heroSub}</p>
        <div className={s.ctas}>
          <StarfieldButton label={locale === 'es' ? 'Ver el caso HERMES' : 'Read the HERMES case'} href={r.caseOf('hermes')} size="lg" />
          <Button href="#contacto" variant="outline" size="lg">{ui.nav.contact}</Button>
        </div>
        <ul className={s.social} aria-label={ui.about.socialLabel}>
          {SOCIAL.map((x) => <li key={x.name}><a href={x.href} target="_blank" rel="noopener" aria-label={`${x.name} ${locale === 'es' ? '(abre en pestaña nueva)' : '(opens in a new tab)'}`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={SOCIAL_ICON[x.name]} /></svg></a></li>)}
        </ul>
      </div>
    </section>
  );
}
