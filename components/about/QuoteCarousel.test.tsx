import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuoteCarousel from './QuoteCarousel';

describe('QuoteCarousel', () => {
  it('abre con la cita de Nielsen y sigue con una idea por libro', () => {
    const { container } = render(<QuoteCarousel />);
    expect(container.querySelectorAll('figure')).toHaveLength(7);
    expect(container.querySelector('cite')?.textContent).toBe('Jakob Nielsen');
    expect(screen.getAllByRole('button', { name: /^Ir a la/ })).toHaveLength(7);
  });
  it('las flechas avanzan, retroceden y dan la vuelta', () => {
    const { container } = render(<QuoteCarousel />);
    const on = () => container.querySelector('figure[data-on="true"]')!.getAttribute('aria-label');
    expect(on()).toBe('1 de 7');
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(on()).toBe('2 de 7');
    expect(container.querySelector('figure[data-on="true"]')!.textContent).toMatch(/The Design of Everyday Things/);
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(on()).toBe('7 de 7');
  });
  it('los puntos llevan a su diapositiva y marcan la actual', () => {
    render(<QuoteCarousel />);
    fireEvent.click(screen.getByRole('button', { name: 'Ir a la 6' }));
    expect(screen.getByRole('button', { name: 'Ir a la 6' })).toHaveAttribute('aria-current', 'true');
  });
  it('se puede pausar y reanudar (WCAG 2.2.2)', () => {
    render(<QuoteCarousel />);
    const btn = screen.getByRole('button', { name: 'Pausar' });
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: 'Reanudar' })).toHaveAttribute('aria-pressed', 'true');
  });
});
