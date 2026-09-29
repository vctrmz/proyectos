import { describe, it, expect } from 'vitest';
import { generateStaticParams, generateMetadata } from './[locale]/cases/[slug]/page';

describe('/[locale]/cases/[slug]', () => {
  it('genera los diez casos en español y los traducidos en inglés', async () => {
    const params = generateStaticParams();
    expect(params.filter((p) => p.locale === 'es').map((p) => p.slug)).toEqual(['ayax', 'hermes', 'flesip', 'montsaint', 'mercantil', 'suscripcion', 'editor-propuesta', 'vista-360', 'design-system', 'esta-web']);
    expect(params.filter((p) => p.locale === 'en').map((p) => p.slug)).toEqual(['hermes', 'esta-web']);
  });
  it('metadata por caso con canonical', async () => {
    const m = await generateMetadata({ params: Promise.resolve({ locale: 'es' as const, slug: 'hermes' }) });
    expect(String(m.title)).toContain('HERMES');
    expect(m.alternates?.canonical).toBe('/es/cases/hermes');
  });
});
