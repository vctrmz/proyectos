import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Button from '@/components/ui/Button';
import ContactButton from '@/components/contact/ContactButton';
import LogoMarquee from '@/components/home/LogoMarquee';
import Sectores from '@/components/home/Sectores';
import Stack from '@/components/home/Stack';
import Starfield from '@/components/home/Starfield';
import { Rise, Part } from '@/components/propuesta/Rise';
import HeroId from '@/components/propuesta/HeroId';
import TokenCollapse from '@/components/propuesta/TokenCollapse';
import FeaturedCase from '@/components/propuesta/FeaturedCase';
import Thesis from '@/components/propuesta/Thesis';
import CaseIndex from '@/components/propuesta/CaseIndex';
import { SITE } from '@/lib/content/site';
import { ROUTES, type Locale } from '@/lib/i18n/config';
import s from '@/components/propuesta/propuesta.module.css';

/* Propuesta de portada, v2: la mezcla de la portada actual y la propuesta de
   la crítica con taste-skill (2026-10-16). Vive aparte y no se indexa.

   De la propuesta: el hero a la izquierda con el colapso 267 → 24, HERMES
   con producto real, la tesis una sola vez, el índice de casos y un cierre
   que es una acción.
   De la portada actual: el nombre con LinkedIn, Behance y Figma, los logos de
   empresas, los cinco sectores por dentro, el stack con el enlace al
   repositorio y el campo de estrellas del cierre.
   El CV se queda en Sobre mí. */
export const metadata: Metadata = { title: 'Propuesta de portada', robots: { index: false, follow: false } };

export default async function Propuesta({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (locale !== 'es') notFound();
  return (
    <>
      <SiteHeader />
      <main id="contenido" className={s.page}>
        <p className={`container ${s.notice}`}>
          Propuesta de rediseño, no indexada. <Link href={ROUTES.es.home}>Comparar con la portada actual →</Link>
        </p>

        <section className={`container ${s.hero}`} aria-labelledby="hero-title">
          <Rise immediate className={s.heroCopy}>
            <Part className={s.idRow}><HeroId locale={locale} /></Part>
            <Part as="h1" id="hero-title" className={s.h1}>
              <span>Diseño producto B2B complejo</span> <span className={s.tone}>y lo llevo a producción.</span>
            </Part>
            <Part as="p" className={s.sub}>
              Senior Product Designer. Nueve años en SaaS asegurador, ERP y banca; los cuatro últimos,
              único diseñador de un holding de cinco productos.
            </Part>
            <Part className={s.ctas}>
              <Button href={ROUTES.es.caseOf('hermes')} size="lg">Ver el caso HERMES</Button>
              <ContactButton size="lg" />
            </Part>
          </Rise>
          <div className={s.stage}>
            <TokenCollapse />
          </div>
        </section>

        <LogoMarquee locale={locale} />

        <FeaturedCase />

        <Thesis />

        <Sectores locale={locale} />

        <section className={`container ${s.work}`} aria-labelledby="work-title">
          <Rise className={s.workHead}>
            <Part as="h2" id="work-title" className={s.h2}>Más trabajo en producción</Part>
            <Part as="p" className={s.workLead}>Casos completos y módulos de HERMES, todos en producción.</Part>
          </Rise>
          <CaseIndex />
          <div className={s.stack}><Stack locale={locale} /></div>
        </section>

        <section className={`container ${s.closing}`} aria-labelledby="closing-title">
          <Rise className={`inset ${s.closingInner}`}>
            <Starfield />
            <Part as="h2" id="closing-title" className={s.closingTitle}>
              <span>¿Buscas un Senior o Lead</span> <span className={s.toneDark}>de Product Design?</span>
            </Part>
            <Part as="p" className={s.available}><span className={s.dot} aria-hidden="true" />Disponible ahora, en remoto.</Part>
            <Part className={s.ctas}>
              <ContactButton size="lg" />
              <Button href={SITE.linkedin} external variant="outline" size="lg">LinkedIn</Button>
            </Part>
          </Rise>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
