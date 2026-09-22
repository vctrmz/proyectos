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
