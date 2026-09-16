import type { Metadata } from 'next';
import Home from '@/components/home/Home';

const description = 'Diseño producto complejo desde Málaga. Nueve años en SaaS B2B e Insurtech: ordeno dominios densos y construyo design systems con reglas de decisión.';

export const metadata: Metadata = {
  title: 'Víctor Maza — Product Designer (UX/UI)',
  description,
  alternates: { canonical: '/' },
  openGraph: { title: 'Víctor Maza — Product Designer (UX/UI)', description, url: '/' },
};

export default function Page() {
  return <Home />;
}
