import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import AboutPage from '@/components/about/AboutPage';
import type { Locale } from '@/lib/i18n/config';

/* La portada es «Sobre mí» (decidido el 2026-10-16): quien entra conoce
   primero a la persona y, después, el trabajo. /[locale]/about redirige aquí
   para que los enlaces ya compartidos sigan funcionando. */
const META = {
  es: {
    title: 'Víctor Maza | Senior Product Designer · Design Systems, B2B y B2C SaaS e Insurtech',
    description: 'Senior Product Designer en remoto desde España. Informático de formación y más de ocho años en producto B2B y B2C: SaaS asegurador, ERP y banca. Cómo trabajo, con qué criterio decido y mi CV.',
  },
  en: {
    title: 'Víctor Maza | Senior Product Designer · Design Systems, B2B and B2C SaaS and Insurtech',
    description: 'Senior Product Designer working remotely from Spain. Computer scientist by training with eight-plus years in B2B and B2C products: insurance SaaS, ERP and banking. How I work, how I decide and my CV.',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.es;
  return pageMetadata(m.title, m.description, `/${locale}`, { es: '/es', en: '/en' });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <AboutPage locale={locale} />;
}
