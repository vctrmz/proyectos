import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Button from '@/components/ui/Button';
import CvDownload from '@/components/ui/CvDownload';
import ContactButton from '@/components/contact/ContactButton';
import { Rise, Part } from '@/components/propuesta/Rise';
import TokenCollapse from '@/components/propuesta/TokenCollapse';
import FeaturedCase from '@/components/propuesta/FeaturedCase';
import Thesis from '@/components/propuesta/Thesis';
import CaseIndex from '@/components/propuesta/CaseIndex';
import { SITE } from '@/lib/content/site';
import { ROUTES, type Locale } from '@/lib/i18n/config';
import s from '@/components/propuesta/propuesta.module.css';

/* Propuesta de portada, a partir de la crítica con taste-skill (2026-10-16).
   Vive aparte de la portada y no se indexa: es para compararla con /es en
   local, no para publicarla. Usa los tokens, la tipografía y los componentes
   del sistema; lo que cambia es la composición, la jerarquía y el copy:

   - la idea sale del propio trabajo: 267 → 24 es el hero, y se puede tocar;
   - la tesis sale una vez, no tres;
   - HERMES, el caso del botón principal, tiene su banda con producto real;
   - el resto, índice con captura al pasar, no once tarjetas iguales;
   - el cierre es una acción (contactar, CV, LinkedIn), sin el acordeón. */
export const metadata: Metadata = { title: 'Propuesta de portada — Víctor Maza', robots: { index: false, follow: false } };

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
            <Part as="h1" id="hero-title" className={s.h1}>
              <span>Diseño producto B2B complejo</span> <span className={s.tone}>y lo llevo a producción.</span>
            </Part>
            <Part as="p" className={s.sub}>
              Soy Víctor Maza, Senior Product Designer. Nueve años en SaaS asegurador, ERP y banca; los cuatro últimos,
              único diseñador de un holding de cinco productos.
            </Part>
            <Part className={s.ctas}>
              <Button href={ROUTES.es.caseOf('hermes')} size="lg">Ver el caso HERMES</Button>
              <ContactButton size="lg" />
              <CvDownload locale="es" />
            </Part>
          </Rise>
          <div className={s.stage}>
            <TokenCollapse />
          </div>
        </section>

        <FeaturedCase />

        <Thesis />

        <section className={`container ${s.work}`} aria-labelledby="work-title">
          <Rise className={s.workHead}>
            <Part as="h2" id="work-title" className={s.h2}>Más trabajo en producción</Part>
            <Part as="p" className={s.workLead}>Insurtech, ERP, banca, e-commerce y transporte: cinco sectores, el mismo método.</Part>
          </Rise>
          <CaseIndex />
        </section>

        <section className={`container ${s.closing}`} aria-labelledby="closing-title">
          <Rise className={`inset ${s.closingInner}`}>
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
