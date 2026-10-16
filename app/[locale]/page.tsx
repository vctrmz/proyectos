import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Portada from '@/components/portada/Portada';
import type { Locale } from '@/lib/i18n/config';

const META = {
  es: {
    title: 'Víctor Maza — Senior Product Designer · Design Systems, B2B SaaS e Insurtech',
    description: 'Convierto reglas de negocio en tokens, componentes y producto que llega a producción. Más de ocho años en SaaS asegurador, ERP y banca. Casos de HERMES, design systems y el código de esta web.',
  },
  en: {
    title: 'Víctor Maza — Senior Product Designer · Design Systems, B2B SaaS and Insurtech',
    description: 'I turn business rules into tokens, components and products that reach production. Eight-plus years in insurance SaaS, ERP and banking. Case studies on HERMES, design systems and the code behind this site.',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.es;
  return pageMetadata(m.title, m.description, `/${locale}`, { es: '/es', en: '/en' });
}

/* La portada v2 (components/portada/Portada) en los dos idiomas. La v1 se
   guardó en la rama portada-v1. */
export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <SiteHeader />
      <main id="contenido"><Portada locale={locale} /></main>
      <SiteFooter locale={locale} />
    </>
  );
}
