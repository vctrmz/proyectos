import type { Metadata } from 'next';
import Script from 'next/script';
import { Montserrat, Bebas_Neue } from 'next/font/google';
import 'remixicon/fonts/remixicon.css';
import './globals.css';
import Nav from '@/components/Nav';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-montserrat', display: 'swap' });
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://proyectos-theta-hazel.vercel.app'),
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', siteName: 'Víctor Maza', images: [{ url: '/assets/og.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${bebas.variable}`}>
      <body>
        <Nav />
        {children}
        <Script src="/effects/starfield-button.js" strategy="afterInteractive" />
        <Script src="/effects/cursor-ring-field.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
