import type { Metadata } from 'next';

const SITE = 'Víctor Maza';
const OG_IMAGE = { url: '/assets/og.png', width: 1200, height: 630 };

/* Next fusiona `metadata` por clave de primer nivel: un `openGraph` de página
   pisa el del layout entero, así que cada página compone el suyo completo. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: SITE, title, description, url: path, images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title, description },
  };
}
