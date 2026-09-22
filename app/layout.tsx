import type { Metadata } from 'next';
import { ViewTransition } from 'react';
import { Geist } from 'next/font/google';
import './globals.css';
import SkipLink from '@/components/layout/SkipLink';
import ConsentBanner from '@/components/ConsentBanner';
import MotionProvider from '@/components/motion/MotionProvider';
import SmoothScroll from '@/components/motion/SmoothScroll';
import JsonLd from '@/components/seo/JsonLd';
import { SITE } from '@/lib/content/site';

const geist = Geist({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-geist', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://proyectos-theta-hazel.vercel.app'),
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.variable}>
      <body>
        <noscript><style>{`[data-reveal],svg[role=img] g{opacity:1 !important;transform:none !important}`}</style></noscript>
        <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Person', name: SITE.name, jobTitle: 'Product Designer', url: SITE.url, email: SITE.email, address: { '@type': 'PostalAddress', addressLocality: 'Málaga', addressCountry: 'ES' }, sameAs: [SITE.linkedin, SITE.behance] }} />
        <SkipLink />
        <MotionProvider><ViewTransition>{children}</ViewTransition></MotionProvider>
        <SmoothScroll />
        <ConsentBanner />
      </body>
    </html>
  );
}
