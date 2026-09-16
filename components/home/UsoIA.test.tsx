import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UsoIA from './UsoIA';
import { USE_CASES } from '@/lib/data';

describe('UsoIA', () => {
  it('muestra el primer caso con el primer paso abierto y cambia de pestaña', () => {
    render(<UsoIA />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(USE_CASES[0].title);
    const cards = document.querySelectorAll('.step-card');
    expect(cards[0]).toHaveClass('is-open');
    expect(cards[1]).not.toHaveClass('is-open');
    fireEvent.click(cards[1]);
    expect(cards[1]).toHaveClass('is-open');
    expect(cards[0]).not.toHaveClass('is-open');
    fireEvent.click(cards[1]);
    expect(cards[1]).not.toHaveClass('is-open');
    fireEvent.click(screen.getByText(USE_CASES[1].tab));
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(USE_CASES[1].title);
    expect(document.querySelectorAll('.step-card')[0]).toHaveClass('is-open');
  });
});
