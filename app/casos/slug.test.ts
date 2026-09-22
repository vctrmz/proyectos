import { describe, it, expect } from 'vitest';
import { generateStaticParams, generateMetadata } from './[slug]/page';

describe('/casos/[slug]', () => {
  it('genera los cinco slugs', async () => {
    expect((await generateStaticParams()).map((p) => p.slug)).toEqual(['hermes', 'suscripcion', 'editor-propuesta', 'vista-360', 'design-system']);
  });
  it('metadata por caso con canonical', async () => {
    const m = await generateMetadata({ params: Promise.resolve({ slug: 'hermes' }) });
    expect(String(m.title)).toContain('HERMES');
    expect(m.alternates?.canonical).toBe('/casos/hermes');
  });
});
