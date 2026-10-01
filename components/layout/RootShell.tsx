import { ViewTransition } from 'react';
import { Geist } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SkipLink from '@/components/layout/SkipLink';
import ConsentBanner from '@/components/ConsentBanner';
import MotionProvider from '@/components/motion/MotionProvider';
import SmoothScroll from '@/components/motion/SmoothScroll';
import JsonLd from '@/components/seo/JsonLd';
import { ContactProvider } from '@/components/contact/ContactDialog';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';
import type { Locale } from '@/lib/i18n/config';
import { SITE } from '@/lib/content/site';

const geist = Geist({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-geist', display: 'swap' });

/* El chasis único de los dos idiomas. Hay un solo layout raíz —el de
   [locale]— para que cambiar de lengua sea una navegación de React y no una
   recarga del documento; el idioma entra por prop y se declara en el <html>,
   que es lo que leen buscadores y lectores de pantalla. */
export default function RootShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={geist.variable}>
      {/* Las extensiones del navegador escriben atributos en el <body> antes de
          que React hidrate (inmaintabuse, grammarly y compañía) y eso levanta
          un aviso de hidratación que no es nuestro. Aquí no ponemos ningún
          atributo dinámico en el <body>, así que silenciar este nivel no tapa
          nada propio: el aviso sigue activo en todo lo que hay dentro. */}
      <body suppressHydrationWarning>
        <noscript><style>{`[data-reveal],svg[role=img] g{opacity:1 !important;transform:none !important}`}</style></noscript>
        <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Person', name: SITE.name, jobTitle: 'Product Designer', knowsAbout: ['Product design', 'Design systems', 'Design tokens', 'B2B SaaS', 'Insurtech', 'WCAG accessibility', 'React'], url: SITE.url, sameAs: [SITE.linkedin, SITE.github, SITE.behance] }} />
        <LocaleProvider locale={locale}>
          <SkipLink locale={locale} />
          <ContactProvider>
            <MotionProvider><ViewTransition>{children}</ViewTransition></MotionProvider>
          </ContactProvider>
          <SmoothScroll />
          <ConsentBanner />
        </LocaleProvider>
        {/* Core Web Vitals de visitantes reales, medidos por ruta. Va fuera del
            consentimiento a propósito: no pone cookies ni identificador, y
            manda los datos al propio dominio, así que también mide a quien
            rechaza la analítica —que es justo la mitad del tráfico que más
            interesa cuando lo que se vigila es el rendimiento. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
