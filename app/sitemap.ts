import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content/site';
import { CASE_SLUGS } from '@/lib/content/cases';
import { EN_CASE_SLUGS } from '@/lib/content/en';

/* Las dos lenguas en el mismo sitemap: el español completo y el inglés con
   las páginas que existen de verdad. Un caso sin traducir no se lista. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/es`, lastModified: now, priority: 1 },
    { url: `${SITE.url}/es/about`, lastModified: now, priority: 0.8 },
    { url: `${SITE.url}/es/privacy`, lastModified: now, priority: 0.2 },
    ...CASE_SLUGS.map((s) => ({ url: `${SITE.url}/es/cases/${s}`, lastModified: now, priority: 0.9 })),
    { url: `${SITE.url}/en`, lastModified: now, priority: 0.9 },
    { url: `${SITE.url}/en/about`, lastModified: now, priority: 0.7 },
    { url: `${SITE.url}/en/privacy`, lastModified: now, priority: 0.2 },
    ...EN_CASE_SLUGS.map((s) => ({ url: `${SITE.url}/en/cases/${s}`, lastModified: now, priority: 0.8 })),
  ];
}
