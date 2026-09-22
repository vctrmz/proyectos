import Kicker from '@/components/ui/Kicker';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import Button from '@/components/ui/Button';
import StarfieldButton from '@/components/ui/StarfieldButton';
import { SITE } from '@/lib/content/site';
import HeroField from './HeroField';
import s from './Hero.module.css';

const SOCIAL = [
  { name: 'LinkedIn', href: SITE.linkedin, d: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z' },
  { name: 'Behance', href: SITE.behance, d: 'M9.6 11.3c1.1-.5 1.7-1.4 1.7-2.6 0-2.6-1.9-3.2-4.2-3.2H1v13.1h6.3c2.4 0 4.6-1.1 4.6-3.8 0-1.7-.8-3-2.3-3.5zM3.9 7.7h2.7c1 0 2 .3 2 1.5 0 1.1-.7 1.6-1.8 1.6H3.9V7.7zm3 8.7H3.9v-3.6h3.1c1.2 0 2.1.5 2.1 1.9 0 1.3-1 1.7-2.2 1.7zM19.3 6.1h-5.2V4.9h5.2v1.2zM23 13.2c0-3-1.8-5.3-4.9-5.3-3.1 0-5.1 2.3-5.1 5.3 0 3.1 1.9 5.2 5.1 5.2 2.4 0 4-1.1 4.7-3.4h-2.6c-.3.9-1 1.4-2.1 1.4-1.5 0-2.3-.8-2.4-2.5H23v-.7zm-7.3-1.1c.1-1.3.9-2.2 2.3-2.2 1.3 0 2 .9 2.1 2.2h-4.4z' },
  { name: 'Instagram', href: SITE.instagram, d: 'M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21.9 8.3c-.1-1.5-.4-2.8-1.5-3.9S18 3 16.6 2.9C15 2.8 9 2.8 7.4 2.9 5.9 3 4.6 3.3 3.5 4.4S2.1 6.8 2 8.3c-.1 1.5-.1 6.1 0 7.7.1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.5.1 6.1.1 7.7 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.5.1-6.1 0-7.7zm-2 9.4c-.3.8-1 1.5-1.8 1.8-1.3.5-4.3.4-5.7.4s-4.4.1-5.7-.4c-.8-.3-1.5-1-1.8-1.8-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.7c.3-.8 1-1.5 1.8-1.8 1.3-.5 4.3-.4 5.7-.4s4.4-.1 5.7.4c.8.3 1.5 1 1.8 1.8.5 1.3.4 4.3.4 5.7s.1 4.4-.4 5.7z' },
];

export default function Hero() {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <HeroField />
      <div className={s.veil} aria-hidden="true" />
      <div className={s.inner}>
        <p className={s.name}><span className={s.mark} aria-hidden="true">VM</span>{SITE.name}</p>
        <Kicker>Product Designer · B2B SaaS · Insurtech · {SITE.city}</Kicker>
        <TwoToneHeading as="h1" id="hero-title" size="display" lines={['Diseño producto B2B complejo', 'y lo llevo a producción.']} />
        <p className={s.sub}>Nueve años en SaaS asegurador, ERP y banca, casi siempre como único diseñador. Entiendo el dominio, lo convierto en reglas y componentes, y acompaño la implementación hasta que el diseño llega entero.</p>
        <div className={s.ctas}>
          <StarfieldButton label="Ver el caso HERMES" href="/casos/hermes" size="lg" />
          <Button href="#contacto" variant="outline" size="lg">Contactar</Button>
        </div>
        <ul className={s.social} aria-label="Redes">
          {SOCIAL.map((x) => <li key={x.name}><a href={x.href} target="_blank" rel="noopener" aria-label={`${x.name} (abre en pestaña nueva)`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={x.d} /></svg></a></li>)}
        </ul>
        <p className={s.meta}>{SITE.available}</p>
      </div>
    </section>
  );
}
