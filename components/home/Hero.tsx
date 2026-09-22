import Kicker from '@/components/ui/Kicker';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import Button from '@/components/ui/Button';
import Reveal from '@/components/motion/Reveal';
import { SITE } from '@/lib/content/site';
import s from './Hero.module.css';

export default function Hero() {
  return (
    <section className={`container ${s.hero}`} aria-labelledby="hero-title">
      <Reveal className={s.inner}>
        <Kicker>Product Designer · B2B SaaS · Insurtech</Kicker>
        <TwoToneHeading as="h1" id="hero-title" size="display" lines={['Convierto reglas de negocio', 'en producto que llega a producción.']} />
        <p className={s.sub}>Nueve años diseñando SaaS asegurador, ERP y banca para compañías que no se parecen entre sí. Entiendo el dominio, lo modelo como reglas y componentes, y acompaño la implementación hasta que el diseño llega entero.</p>
        <p className={s.meta}>{SITE.city} · {SITE.available}</p>
        <div className={s.ctas}>
          <Button href="/casos/hermes" size="lg">Ver el caso HERMES</Button>
          <Button href="#contacto" variant="outline" size="lg">Contactar</Button>
        </div>
      </Reveal>
    </section>
  );
}
