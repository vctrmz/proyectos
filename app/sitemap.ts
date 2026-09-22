import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content/site';
import { CASE_SLUGS } from '@/lib/content/cases';
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, priority: 1 },
    { url: `${SITE.url}/sobre-mi`, lastModified: now, priority: 0.8 },
    { url: `${SITE.url}/privacidad`, lastModified: now, priority: 0.2 },
    ...CASE_SLUGS.map((s) => ({ url: `${SITE.url}/casos/${s}`, lastModified: now, priority: 0.9 })),
  ];
}
