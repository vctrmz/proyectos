import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import AboutPage from '@/components/about/AboutPage';
import type { Locale } from '@/lib/i18n/config';

const META = {
  es: { title: 'Sobre mí — Víctor Maza', description: 'Product Designer en remoto. Informático de formación, nueve años en producto B2B: qué he estudiado, cómo trabajo y con qué criterio decido.' },
  en: { title: 'About — Víctor Maza', description: 'Product Designer working remotely. Computer scientist by training, nine years in B2B products: what I studied, how I work and how I decide.' },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.es;
  return pageMetadata(m.title, m.description, `/${locale}/about`, { es: '/es/about', en: '/en/about' });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <AboutPage locale={locale} />;
}
