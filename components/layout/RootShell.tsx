import { ViewTransition } from 'react';
import { Geist } from 'next/font/google';
import SkipLink from '@/components/layout/SkipLink';
import ConsentBanner from '@/components/ConsentBanner';
import MotionProvider from '@/components/motion/MotionProvider';
import SmoothScroll from '@/components/motion/SmoothScroll';
import JsonLd from '@/components/seo/JsonLd';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';
import type { Locale } from '@/lib/i18n/config';
import { SITE } from '@/lib/content/site';

const geist = Geist({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-geist', display: 'swap' });

/* El chasis de las dos raíces —español e inglés—. Cada idioma tiene su propio
   layout raíz para poder declarar lang en el <html>, que es lo que leen
   buscadores y lectores de pantalla; todo lo demás se comparte aquí. */
export default function RootShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={geist.variable}>
      <body>
        <noscript><style>{`[data-reveal],svg[role=img] g{opacity:1 !important;transform:none !important}`}</style></noscript>
        <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Person', name: SITE.name, jobTitle: 'Product Designer', url: SITE.url, email: SITE.email, address: { '@type': 'PostalAddress', addressLocality: 'Málaga', addressCountry: 'ES' }, sameAs: [SITE.linkedin, SITE.behance] }} />
        <LocaleProvider locale={locale}>
          <SkipLink locale={locale} />
          <MotionProvider><ViewTransition>{children}</ViewTransition></MotionProvider>
          <SmoothScroll />
          <ConsentBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}
