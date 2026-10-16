import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Portada from '@/components/portada/Portada';
import type { Locale } from '@/lib/i18n/config';

const META = {
  es: {
    title: 'Trabajos | Víctor Maza, Senior Product Designer',
    description: 'Casos de producto B2B y B2C: HERMES, design systems, banca y movilidad. Convierto reglas de negocio en tokens, componentes y producto que llega a producción.',
  },
  en: {
    title: 'Works | Víctor Maza, Senior Product Designer',
    description: 'B2B and B2C product case studies: HERMES, design systems, banking and mobility. I turn business rules into tokens, components and products that reach production.',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.es;
  return pageMetadata(m.title, m.description, `/${locale}/work`, { es: '/es/work', en: '/en/work' });
}

/* Trabajos: la antigua portada (components/portada/Portada) en los dos
   idiomas. Desde el 2026-10-16 la portada del sitio es «Sobre mí» y el
   catálogo vive aquí, como segunda sección. La v1 se guardó en la rama
   portada-v1. */
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
