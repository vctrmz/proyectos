import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Hero from '@/components/home/Hero';
import TypeHero from '@/components/propuesta/TypeHero';
import FeaturedCase from '@/components/propuesta/FeaturedCase';
import Thesis from '@/components/propuesta/Thesis';
import GlyphTitle from '@/components/propuesta/GlyphTitle';
import CaseIndex from '@/components/propuesta/CaseIndex';
import AboutCv from '@/components/propuesta/AboutCv';
import Areas from '@/components/propuesta/Areas';
import ContactBig from '@/components/propuesta/ContactBig';
import { ROUTES, type Locale } from '@/lib/i18n/config';
import s from '@/components/propuesta/propuesta.module.css';

/* Propuesta de portada, v4. Vive aparte y no se indexa.

   Arriba, el hero actual tal cual (es el que retiene). El colapso 267 → 24
   se guardó para el caso HERMES (components/case/TokenCollapse).
   Después, adaptado de tigranz.com: un hero tipográfico que abre la banda de
   HERMES, títulos de sección con glifos, el trabajo con barra verde al pasar,
   Sobre mí sacado del CV, algunas áreas en las que he trabajado con lo que
   resolví en cada una
   y un contacto a tamaño cartel. El CV descargable se queda en Sobre mí. */
export const metadata: Metadata = { title: 'Propuesta de portada', robots: { index: false, follow: false } };

export default async function Propuesta({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero locale={locale} />

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

        <section id="areas" className={`container ${s.section}`} aria-labelledby="areas-title">
          <div className={s.head}>
            <GlyphTitle text="áreas" icon="cursor" at={2} id="areas-title" />
            <p className={s.headLead}>Algunas de las áreas en las que he trabajado. Elige una para ver qué resolví.</p>
          </div>
          <Areas />
          <p className={s.notice}>
            Propuesta de rediseño, no indexada. <Link href={ROUTES.es.home}>Comparar con la portada actual →</Link>
          </p>
        </section>

        <ContactBig />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
