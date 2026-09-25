import type { Metadata } from 'next';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import PrivacyEs from '@/components/legal/PrivacyEs';
import PrivacyEn from '@/components/legal/PrivacyEn';
import type { Locale } from '@/lib/i18n/config';

const META = {
  es: { title: 'Privacidad y cookies — Víctor Maza', description: 'Qué datos recoge esta web, con qué herramientas, para qué, y cómo cambiar tu decisión sobre las cookies.' },
  en: { title: 'Privacy and cookies — Víctor Maza', description: 'What this site collects, with which tools, what for, and how to change your mind about cookies.' },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.es;
  return { ...m, robots: { index: false, follow: true }, alternates: { canonical: `/${locale}/privacy`, languages: { es: '/es/privacy', en: '/en/privacy', 'x-default': '/es/privacy' } } };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <SiteHeader />
      {locale === 'en' ? <PrivacyEn /> : <PrivacyEs />}
      <SiteFooter locale={locale} />
    </>
  );
}
