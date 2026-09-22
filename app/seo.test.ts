import { describe, it, expect } from 'vitest';
import robots from './robots';
import sitemap from './sitemap';

describe('seo', () => {
  it('robots permite todo y apunta al sitemap', () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(r.sitemap).toBe('https://proyectos-theta-hazel.vercel.app/sitemap.xml');
  });
  it('sitemap incluye portada, sobre mí, privacidad y los cinco casos', () => {
    const urls = sitemap().map((u) => u.url);
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/');
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/sobre-mi');
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/casos/hermes');
    expect(urls).toHaveLength(8);
  });
});
