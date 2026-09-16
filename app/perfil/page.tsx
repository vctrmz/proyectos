import type { Metadata } from 'next';
import Perfil from '@/components/perfil/Perfil';

const description = 'Perfil de Víctor Maza: Product Designer de oficio, nueve años ordenando dominios densos en SaaS B2B e Insurtech. Herramientas, método y casos.';

export const metadata: Metadata = {
  title: 'Sobre mí — Víctor Maza',
  description,
  alternates: { canonical: '/perfil' },
  openGraph: { title: 'Sobre mí — Víctor Maza', description, url: '/perfil' },
};

export default function Page() {
  return <Perfil />;
}
