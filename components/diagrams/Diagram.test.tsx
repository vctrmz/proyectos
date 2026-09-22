import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('motion/react', () => import('@/test/motion-mock'));
import Diagram from './Diagram';

const IDS = ['clients-to-system', 'areas-map', 'before-after', 'state-machine', 'template-slots', 'grid-12-4-1', 'system-cycle', 'timeline'] as const;

describe('Diagram', () => {
  it.each(IDS)('%s es una figura con svg accesible', (id) => {
    render(<Diagram id={id} caption="cap" />);
    const img = screen.getByRole('img');
    expect(img.tagName.toLowerCase()).toBe('svg');
    expect(img.getAttribute('aria-label')!.length).toBeGreaterThan(15);
    expect(screen.getByText('cap')).toBeInTheDocument();
  });
  it('before-after enseña 60 y 14', () => {
    render(<Diagram id="before-after" />);
    expect(screen.getByRole('img').textContent).toMatch(/60/);
    expect(screen.getByRole('img').textContent).toMatch(/14/);
  });
});
