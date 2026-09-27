import { describe, it, expect } from 'vitest';
import robots from './robots';
import sitemap from './sitemap';
import { SITE } from '@/lib/content/site';

/* El dominio se lee de SITE, no se repite: si cambia el dominio, el test sigue
   comprobando lo que importa —qué rutas entran y cuántas— en lugar de romperse
   por una cadena copiada. */
const U = SITE.url;

describe('seo', () => {
  it('robots permite todo y apunta al sitemap', () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(r.sitemap).toBe(`${U}/sitemap.xml`);
  });
  it('sitemap lista las dos lenguas: el español completo y el inglés que existe', () => {
    const urls = sitemap().map((u) => u.url);
    expect(urls).toContain(`${U}/es`);
    expect(urls).toContain(`${U}/es/about`);
    expect(urls).toContain(`${U}/es/cases/hermes`);
    expect(urls).toContain(`${U}/es/cases/ayax`);
    expect(urls).toContain(`${U}/en`);
    expect(urls).toContain(`${U}/en/about`);
    expect(urls).toContain(`${U}/en/cases/hermes`);
    // 12 en español + 3 páginas en inglés + un caso traducido
    expect(urls).toHaveLength(16);
    // ningún caso sin traducir se lista en inglés
    expect(urls).not.toContain(`${U}/en/cases/flesip`);
  });
});
