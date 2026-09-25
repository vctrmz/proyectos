import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CASE_SLUGS } from '@/lib/content/cases';
import { EN_CASE_SLUGS, getCaseIn } from '@/lib/content/en';
import { pageMetadata } from '@/lib/seo';
import CasePage from '@/components/case/CasePage';
import type { Locale } from '@/lib/i18n/config';

/* En español existen los nueve casos; en inglés, los que están traducidos. */
export const dynamicParams = false;
export function generateStaticParams() {
  return [
    ...CASE_SLUGS.map((slug) => ({ locale: 'es', slug })),
    ...EN_CASE_SLUGS.map((slug) => ({ locale: 'en', slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = getCaseIn(locale, slug);
  if (!c) return {};
  const alt = EN_CASE_SLUGS.includes(slug) ? { es: `/es/cases/${slug}`, en: `/en/cases/${slug}` } : undefined;
  return pageMetadata(`${c.title} · ${c.company} — Víctor Maza`, c.tagline, `/${locale}/cases/${slug}`, alt);
}

export default async function Page({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const c = getCaseIn(locale, slug);
  if (!c) notFound();
  return <CasePage c={c} locale={locale} />;
}
