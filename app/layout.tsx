import type { Metadata } from 'next';
import Script from 'next/script';
import { Montserrat, Bebas_Neue } from 'next/font/google';
import 'remixicon/fonts/remixicon.css';
import './globals.css';
import Nav from '@/components/Nav';
import ConsentBanner from '@/components/ConsentBanner';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-montserrat', display: 'swap' });
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://proyectos-theta-hazel.vercel.app'),
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${bebas.variable}`}>
      <body>
        <Nav />
        {children}
        <ConsentBanner />
        <Script src="/effects/starfield-button.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
