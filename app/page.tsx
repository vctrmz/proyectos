import type { Metadata } from 'next';
import { Suspense } from 'react';
import { pageMetadata } from '@/lib/seo';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Hero from '@/components/home/Hero';
import HeroInset from '@/components/home/HeroInset';
import FactStrip from '@/components/ui/FactStrip';
import LogoMarquee from '@/components/home/LogoMarquee';
import Manifesto from '@/components/home/Manifesto';
import SectionHeader from '@/components/ui/SectionHeader';
import Catalog from '@/components/catalog/Catalog';
import Closing from '@/components/home/Closing';

export const metadata: Metadata = pageMetadata(
  'Víctor Maza — Product Designer B2B SaaS e Insurtech',
  'Convierto reglas de negocio en producto que llega a producción. Nueve años en SaaS asegurador, ERP y banca. Casos de estudio de HERMES y design systems.',
  '/'
);

const FACTS = [
  { value: '165', label: 'pantallas en producción' }, { value: '8', label: 'áreas de producto' },
  { value: '5', label: 'productos, un lenguaje' }, { value: '2022–2026', label: 'único diseñador del holding' },
];

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <HeroInset />
        <div className="container"><FactStrip facts={FACTS} /></div>
        <LogoMarquee />
        <Manifesto />
        <section id="trabajo" className="container section" aria-labelledby="trabajo-title">
          <SectionHeader id="trabajo-title" kicker="Trabajo" title={['Casos y productos', 'en producción.']} />
          <Suspense><Catalog /></Suspense>
        </section>
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
