import { describe, it, expect } from 'vitest';
import robots from './robots';
import sitemap from './sitemap';

describe('seo', () => {
  it('robots permite todo y apunta al sitemap', () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(r.sitemap).toBe('https://proyectos-theta-hazel.vercel.app/sitemap.xml');
  });
  it('sitemap lista las dos lenguas: el español completo y el inglés que existe', () => {
    const urls = sitemap().map((u) => u.url);
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/');
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/sobre-mi');
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/casos/hermes');
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/casos/ayax');
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/en');
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/en/about');
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/en/cases/hermes');
    // 12 en español + 3 páginas en inglés + un caso traducido
    expect(urls).toHaveLength(16);
    // ningún caso sin traducir se lista en inglés
    expect(urls).not.toContain('https://proyectos-theta-hazel.vercel.app/en/cases/flesip');
  });
});
