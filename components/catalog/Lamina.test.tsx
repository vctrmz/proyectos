import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PROJECTS } from '@/lib/content/projects';
import Lamina, { hasLamina } from './Lamina';

describe('láminas del catálogo', () => {
  it('cada proyecto del catálogo tiene la suya', () => {
    expect(PROJECTS.filter((p) => !hasLamina(p.slug)).map((p) => p.slug)).toEqual([]);
  });

  it('son decorativas: el lector de pantalla oye el título de la tarjeta, no el dibujo', () => {
    const { container } = render(<Lamina slug="flesip" locale="es" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('hablan el idioma de la página', () => {
    const es = render(<Lamina slug="flesip" locale="es" />).container.textContent;
    const en = render(<Lamina slug="flesip" locale="en" />).container.textContent;
    expect(es).toMatch(/Pendiente/);
    expect(en).toMatch(/Pending/);
    expect(en).not.toMatch(/Pendiente/);
  });

  it('las cifras salen de los casos', () => {
    const t = (slug: string) => render(<Lamina slug={slug} locale="es" />).container.textContent;
    expect(t('design-system')).toMatch(/267 → 24/);
    expect(t('suscripcion')).toMatch(/13 → 5 semanas/);
    expect(t('mercantil')).toMatch(/5 de 9 resueltos/);
    expect(t('hermes')).toMatch(/165 pantallas · 8 áreas/);
  });

  it('un proyecto sin lámina no pinta nada', () => {
    const { container } = render(<Lamina slug="no-existe" locale="es" />);
    expect(container).toBeEmptyDOMElement();
  });
});
