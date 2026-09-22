import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CASE_SLUGS, getCase } from '@/lib/content/cases';
import { pageMetadata } from '@/lib/seo';
import CasePage from '@/components/case/CasePage';

export const dynamicParams = false;
export async function generateStaticParams() { return CASE_SLUGS.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCase((await params).slug);
  if (!c) return {};
  return pageMetadata(`${c.title} · ${c.company} — Víctor Maza`, c.tagline, `/casos/${c.slug}`);
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCase((await params).slug);
  if (!c) notFound();
  return <CasePage c={c} />;
}
