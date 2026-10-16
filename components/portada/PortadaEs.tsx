import Hero from '@/components/home/Hero';
import TypeHero from './TypeHero';
import FeaturedCase from './FeaturedCase';
import Thesis from './Thesis';
import GlyphTitle from './GlyphTitle';
import CaseIndex from './CaseIndex';
import AboutCv from './AboutCv';
import Areas from './Areas';
import ContactBig from './ContactBig';
import s from './portada.module.css';

/* La portada en español, v2 (publicada el 2026-10-16). La v1 se guardó en la
   rama portada-v1 de GitHub y sigue sirviendo /en hasta que esta se traduzca.

   Arriba, el hero de siempre (es el que retiene). Después, adaptado de
   tigranz.com: un hero tipográfico que abre la banda de HERMES, la tesis, los
   títulos de sección con glitch e icono, el trabajo con barra verde al pasar,
   Sobre mí sacado del CV, algunas áreas en las que he trabajado con lo que
   resolví en cada una y un contacto a tamaño cartel. El CV descargable se
   queda en Sobre mí; el colapso 267 → 24 se guardó para el caso HERMES
   (components/case/TokenCollapse). */
export default function PortadaEs() {
  return (
    <>
      <Hero locale="es" />

      <TypeHero />
      <FeaturedCase />

      <Thesis />

      <section id="trabajo" className={`container ${s.section}`} aria-labelledby="work-title">
        <div className={s.head}>
          <GlyphTitle text="trabajo" icon="sparkle" at={6} id="work-title" />
          <p className={s.headLead}>Productos enteros y decisiones concretas dentro de HERMES. Todo llegó a producción.</p>
        </div>
        <CaseIndex />
      </section>

      <section id="sobre-mi" className={`container ${s.section}`} aria-labelledby="about-title">
        <div className={s.head}><GlyphTitle text="sobre mí" icon="pen" at={1} id="about-title" /></div>
        <AboutCv />
      </section>

      <section id="areas" className={`container ${s.section} ${s.last}`} aria-labelledby="areas-title">
        <div className={s.head}>
          <GlyphTitle text="áreas" icon="cursor" at={2} id="areas-title" />
          <p className={s.headLead}>Algunas de las áreas en las que he trabajado. Elige una para ver qué resolví.</p>
        </div>
        <Areas />
      </section>

      <ContactBig />
    </>
  );
}
