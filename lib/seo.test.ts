import { describe, it, expect } from 'vitest';
import { pageMetadata } from './seo';

describe('pageMetadata', () => {
  it('compone openGraph, twitter y canonical completos para la ruta dada', () => {
    const metadata = pageMetadata('T', 'D', '/perfil');
    const openGraph = metadata.openGraph as { images: { url: string }[]; siteName: string; type: string; url: string };
    expect(openGraph.images[0].url).toBe('/assets/og.png');
    expect(openGraph.siteName).toBe('Víctor Maza');
    expect(openGraph.type).toBe('website');
    expect(openGraph.url).toBe('/perfil');
    expect(metadata.alternates).toEqual({ canonical: '/perfil' });
    expect(metadata.twitter).toEqual({ card: 'summary_large_image', title: 'T', description: 'D' });
  });
});
