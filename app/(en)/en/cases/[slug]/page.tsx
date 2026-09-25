import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EN_CASE_SLUGS, getCaseIn } from '@/lib/content/en';
import { pageMetadata } from '@/lib/seo';
import CasePage from '@/components/case/CasePage';

/* Solo se generan los casos que existen en inglés: una página a medio traducir
   es peor que no tenerla. */
export const dynamicParams = false;
export async function generateStaticParams() { return EN_CASE_SLUGS.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCaseIn('en', (await params).slug);
  if (!c) return {};
  return pageMetadata(`${c.title} · ${c.company} — Víctor Maza`, c.tagline, `/en/cases/${c.slug}`, { es: `/casos/${c.slug}`, en: `/en/cases/${c.slug}` });
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCaseIn('en', (await params).slug);
  if (!c) notFound();
  return <CasePage c={c} locale="en" />;
}
