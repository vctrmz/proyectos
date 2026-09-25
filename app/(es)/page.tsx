import type { Metadata } from 'next';
import { Suspense } from 'react';
import { pageMetadata } from '@/lib/seo';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Hero from '@/components/home/Hero';
import Sectores from '@/components/home/Sectores';
import FactStrip from '@/components/ui/FactStrip';
import LogoMarquee from '@/components/home/LogoMarquee';
import Manifesto from '@/components/home/Manifesto';
import SectionHeader from '@/components/ui/SectionHeader';
import Catalog from '@/components/catalog/Catalog';
import { getUi } from '@/lib/i18n/ui';
import Closing from '@/components/home/Closing';

export const metadata: Metadata = pageMetadata(
  'Víctor Maza — Product Designer B2B SaaS e Insurtech',
  'Convierto reglas de negocio en producto que llega a producción. Nueve años en SaaS asegurador, ERP y banca. Casos de estudio de HERMES y design systems.',
  '/',
  { es: '/', en: '/en' }
);

export default function Page() {
  const ui = getUi('es');
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero locale="es" />
        <div className="container"><FactStrip facts={ui.home.facts} /></div>
        <Sectores locale="es" />
        <LogoMarquee locale="es" />
        <Manifesto />
        <section id="trabajo" className="container section" aria-labelledby="trabajo-title">
          <SectionHeader id="trabajo-title" kicker={ui.home.workKicker} title={ui.home.workTitle} />
          <Suspense><Catalog /></Suspense>
        </section>
        <Closing locale="es" />
      </main>
      <SiteFooter locale="es" />
    </>
  );
}
