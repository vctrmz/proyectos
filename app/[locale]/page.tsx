import type { Metadata } from 'next';
import { Suspense } from 'react';
import { pageMetadata } from '@/lib/seo';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Hero from '@/components/home/Hero';
import Sectores from '@/components/home/Sectores';
import Stack from '@/components/home/Stack';
import FactStrip from '@/components/ui/FactStrip';
import LogoMarquee from '@/components/home/LogoMarquee';
import Manifesto from '@/components/home/Manifesto';
import SectionHeader from '@/components/ui/SectionHeader';
import Catalog from '@/components/catalog/Catalog';
import band from '@/components/catalog/catalog.module.css';
import Closing from '@/components/home/Closing';
import { getUi } from '@/lib/i18n/ui';
import type { Locale } from '@/lib/i18n/config';

const META = {
  es: {
    title: 'Víctor Maza — Senior Product Designer · Design Systems, B2B SaaS e Insurtech',
    description: 'Convierto reglas de negocio en tokens, componentes y producto que llega a producción. Nueve años en SaaS asegurador, ERP y banca. Casos de HERMES, design systems y el código de esta web.',
  },
  en: {
    title: 'Víctor Maza — Senior Product Designer · Design Systems, B2B SaaS and Insurtech',
    description: 'I turn business rules into tokens, components and products that reach production. Nine years in insurance SaaS, ERP and banking. Case studies on HERMES, design systems and the code behind this site.',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.es;
  return pageMetadata(m.title, m.description, `/${locale}`, { es: '/es', en: '/en' });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const ui = getUi(locale);
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero locale={locale} />
        <div className="container"><FactStrip facts={ui.home.facts} /><Stack locale={locale} /></div>
        <Sectores locale={locale} />
        <LogoMarquee locale={locale} />
        <Manifesto />
        <section id="trabajo" className={`section ${band.band}`} aria-labelledby="trabajo-title">
          <div className={`container ${band.inner}`}>
            <SectionHeader id="trabajo-title" kicker={ui.home.workKicker} title={ui.home.workTitle} />
            <Suspense><Catalog /></Suspense>
          </div>
        </section>
        <Closing locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
