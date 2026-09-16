import type { Metadata } from 'next';
import Home from '@/components/home/Home';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata(
  'Víctor Maza — Product Designer (UX/UI)',
  'Diseño producto complejo desde Málaga. Nueve años en SaaS B2B e Insurtech: ordeno dominios densos y construyo design systems con reglas de decisión.',
  '/'
);

export default function Page() {
  return <Home />;
}
