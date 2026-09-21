import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import SkipLink from '@/components/layout/SkipLink';
import ConsentBanner from '@/components/ConsentBanner';
import MotionProvider from '@/components/motion/MotionProvider';
import SmoothScroll from '@/components/motion/SmoothScroll';

const geist = Geist({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-geist', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://proyectos-theta-hazel.vercel.app'),
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.variable}>
      <body>
        <SkipLink />
        <MotionProvider>{children}</MotionProvider>
        <SmoothScroll />
        <ConsentBanner />
      </body>
    </html>
  );
}
