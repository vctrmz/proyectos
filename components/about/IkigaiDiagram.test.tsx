import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
vi.mock('motion/react', () => import('@/test/motion-mock'));
import IkigaiDiagram from './IkigaiDiagram';

describe('IkigaiDiagram', () => {
  it('tres círculos enfocables con su frase, y el centro dice Product design', async () => {
    render(<IkigaiDiagram />);
    const btns = screen.getAllByRole('button');
    expect(btns.map((b) => b.getAttribute('aria-label'))).toEqual(['design', 'tech', 'business']);
    expect(screen.getByText('Product design')).toBeInTheDocument();
    await userEvent.click(btns[1]);
    expect(screen.getByRole('status')).toHaveTextContent(/Informático de formación/);
    expect(btns[1]).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('IkigaiDiagram · posición de las etiquetas', () => {
  it('cada etiqueta cae dentro de su círculo y fuera de los otros dos', () => {
    const { container } = render(<IkigaiDiagram />);
    const circles = [...container.querySelectorAll('circle[data-ring]')].map((c) => ({
      k: c.closest('[aria-label]')!.getAttribute('aria-label')!,
      cx: Number(c.getAttribute('cx')), cy: Number(c.getAttribute('cy')), r: Number(c.getAttribute('r')),
    }));
    const labels = [...container.querySelectorAll('text')].filter((t) => circles.some((c) => c.k === t.textContent));
    expect(labels).toHaveLength(3);
    for (const t of labels) {
      const x = Number(t.getAttribute('x')), y = Number(t.getAttribute('y'));
      const own = circles.find((c) => c.k === t.textContent)!;
      const d = (c: typeof own) => Math.hypot(x - c.cx, y - c.cy);
      expect(d(own), `${t.textContent} dentro de su círculo`).toBeLessThan(own.r - 20);
      for (const other of circles.filter((c) => c.k !== own.k)) {
        expect(d(other), `${t.textContent} fuera de ${other.k}`).toBeGreaterThan(other.r + 10);
      }
    }
  });
});
