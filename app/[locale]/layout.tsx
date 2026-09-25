import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RootShell from '@/components/layout/RootShell';
import { LOCALES, type Locale } from '@/lib/i18n/config';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://proyectos-theta-hazel.vercel.app'),
  icons: { icon: '/favicon.svg' },
};

/* Un único layout raíz con el idioma como parámetro: así cambiar de idioma es
   una transición de cliente —sin recarga— y el <html lang> sigue siendo
   correcto en el HTML servido. Dos raíces distintas obligaban al navegador a
   recargar el documento entero al cambiar de lengua. */
export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  return <RootShell locale={locale as Locale}>{children}</RootShell>;
}
