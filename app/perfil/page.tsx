import type { Metadata } from 'next';
import Perfil from '@/components/perfil/Perfil';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata(
  'Sobre mí — Víctor Maza',
  'Perfil de Víctor Maza: Product Designer de oficio, nueve años ordenando dominios densos en SaaS B2B e Insurtech. Herramientas, método y casos.',
  '/perfil'
);

export default function Page() {
  return <Perfil />;
}
