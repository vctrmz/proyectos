import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('motion/react', () => import('@/test/motion-mock'));
import UiKit from './UiKit';

describe('UiKit', () => {
  it('es una rejilla de piezas del sistema, cada una con título y descripción', () => {
    render(<UiKit brand="#1f2a5a" />);
    const region = screen.getByRole('list', { name: /kit/i });
    const items = screen.getAllByRole('listitem');
    expect(region).toBeInTheDocument();
    expect(items).toHaveLength(5);
    for (const li of items) {
      expect(li.querySelector('h4')!.textContent!.length).toBeGreaterThan(3);
      expect(li.querySelector('p')!.textContent!.length).toBeGreaterThan(20);
    }
    expect(screen.getByText(/Estados/)).toBeInTheDocument();
    expect(screen.getByText(/Tabla/)).toBeInTheDocument();
  });
  it('las maquetas son decorativas', () => {
    const { container } = render(<UiKit brand="#1f2a5a" />);
    const mocks = container.querySelectorAll('[data-mock]');
    expect(mocks.length).toBe(5);
    for (const m of mocks) expect(m.getAttribute('aria-hidden')).toBe('true');
  });
});
