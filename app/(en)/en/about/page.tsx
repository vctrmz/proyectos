import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import AboutPage from '@/components/about/AboutPage';

export const metadata: Metadata = pageMetadata(
  'About — Víctor Maza',
  'Product Designer based in Málaga. Computer scientist by training, nine years in B2B products: where I have lived, what I studied and how I work.',
  '/en/about',
  { es: '/sobre-mi', en: '/en/about' }
);

export default function Page() { return <AboutPage locale="en" />; }
