import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LabPrimitivos from '@/components/primitives/LabPrimitivos';

/* Laboratorio de primitivos: para ver los componentes adaptados de
   motion-primitives antes de usarlos en un caso. Existe en local y en las
   versiones de prueba de Vercel; en producción es un 404, y en ningún sitio
   se indexa ni entra en el sitemap. */
export const metadata: Metadata = { title: 'Laboratorio — Víctor Maza', robots: { index: false, follow: false } };

export default function Page() {
  if (process.env.VERCEL_ENV === 'production') notFound();
  return <LabPrimitivos />;
}
