import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
vi.mock('motion/react', () => import('@/test/motion-mock'));
import ToolGroups from './ToolGroups';

describe('ToolGroups', () => {
  it('agrupa las herramientas por categoría con su título', () => {
    render(<ToolGroups />);
    const groups = screen.getAllByRole('list');
    expect(groups.length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText(/Diseño y prototipado/)).toBeInTheDocument();
    expect(screen.getByText(/Investigación y validación/)).toBeInTheDocument();
    expect(screen.getByText(/Inteligencia artificial/)).toBeInTheDocument();
    const design = screen.getByRole('list', { name: /Diseño y prototipado/ });
    expect(within(design).getByText(/Figma/)).toBeInTheDocument();
    /* Lo que solo conozco por los productos en los que trabajé va aparte, no
       mezclado con el código que escribo. */
    const code = screen.getByRole('list', { name: /^Código$/ });
    expect(within(code).queryByText('Tailwind')).toBeNull();
    expect(within(screen.getByRole('list', { name: /Con las que he colaborado/ })).getByText('Tailwind')).toBeInTheDocument();
  });
  it('cada chip queda marcado para el efecto de proximidad', () => {
    const { container } = render(<ToolGroups />);
    const chips = container.querySelectorAll('[data-tool]');
    expect(chips.length).toBeGreaterThanOrEqual(20);
  });
});
