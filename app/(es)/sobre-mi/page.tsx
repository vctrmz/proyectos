import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import AboutPage from '@/components/about/AboutPage';
export const metadata: Metadata = pageMetadata('Sobre mí — Víctor Maza', 'Product Designer en Málaga. Informático de formación, nueve años en producto B2B: dónde he vivido, qué he estudiado y cómo trabajo.', '/sobre-mi', { es: '/sobre-mi', en: '/en/about' });
export default function Page() { return <AboutPage />; }
