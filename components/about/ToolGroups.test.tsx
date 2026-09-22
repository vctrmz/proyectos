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
  it('cada chip queda marcado para el efecto de proximidad', () => {
    const { container } = render(<ToolGroups />);
    const chips = container.querySelectorAll('[data-tool]');
    expect(chips.length).toBeGreaterThanOrEqual(20);
  });
});
