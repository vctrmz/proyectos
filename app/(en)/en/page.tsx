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
import Closing from '@/components/home/Closing';
import { getUi } from '@/lib/i18n/ui';

export const metadata: Metadata = pageMetadata(
  'Víctor Maza — Product Designer, B2B SaaS and Insurtech',
  'I turn business rules into products that reach production. Nine years in insurance SaaS, ERP and banking. Case studies on HERMES and design systems.',
  '/en',
  { es: '/', en: '/en' }
);

export default function Page() {
  const ui = getUi('en');
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero locale="en" />
        <div className="container"><FactStrip facts={ui.home.facts} /></div>
        <Sectores locale="en" />
        <LogoMarquee locale="en" />
        <Manifesto />
        <section id="work" className="container section" aria-labelledby="work-title">
          <SectionHeader id="work-title" kicker={ui.home.workKicker} title={ui.home.workTitle} />
          <Suspense><Catalog /></Suspense>
        </section>
        <Closing locale="en" />
      </main>
      <SiteFooter locale="en" />
    </>
  );
}
