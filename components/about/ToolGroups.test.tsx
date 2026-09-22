import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
vi.mock('motion/react', () => import('@/test/motion-mock'));
import ToolGroups from './ToolGroups';

describe('ToolGroups', () => {
  it('agrupa las herramientas por categoría con su título', () => {
    render(<ToolGroups />);
    const groups = screen.getAllByRole('list');
    expect(groups.length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText(/Diseño y multimedia/)).toBeInTheDocument();
    expect(screen.getByText(/Desarrollo y despliegue/)).toBeInTheDocument();
    expect(screen.getByText(/Inteligencia artificial/)).toBeInTheDocument();
    const design = screen.getByRole('list', { name: /Diseño y multimedia/ });
    expect(within(design).getByText(/Figma/)).toBeInTheDocument();
  });
  it('el primer grupo, Diseño y multimedia, se muestra destacado como galería', () => {
    const { container } = render(<ToolGroups />);
    const featured = container.querySelector('[data-featured]')!;
    expect(featured).not.toBeNull();
    expect(featured.textContent).toMatch(/Diseño y multimedia/);
    const tiles = featured.querySelectorAll('[data-tile]');
    expect(tiles.length).toBeGreaterThanOrEqual(6);
    // cada mosaico lleva un glifo decorativo y el nombre legible
    for (const tile of tiles) {
      const glyph = tile.querySelector('svg')!;
      expect(glyph).not.toBeNull();
      expect(glyph.getAttribute('aria-hidden')).toBe('true');
      expect(glyph.querySelectorAll('path, rect, circle').length).toBeGreaterThanOrEqual(2);
      expect(tile.textContent!.trim().length).toBeGreaterThan(2);
    }
  });
  it('cada chip queda marcado para el efecto de proximidad', () => {
    const { container } = render(<ToolGroups />);
    const chips = container.querySelectorAll('[data-tool]');
    expect(chips.length).toBeGreaterThanOrEqual(15);
  });
});
