import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TokenCollapse from './TokenCollapse';
import { TOKENS, TOTAL, buildSwatches } from './tokenCollapse.data';

/* Guardado para el caso HERMES: estos tests cuidan de que siga funcionando
   mientras no se usa en ninguna página. */
describe('TokenCollapse', () => {
  it('reparte exactamente los totales de la auditoría: 267 valores sobre 24 tokens', () => {
    expect(TOKENS).toHaveLength(24);
    expect(TOTAL).toBe(267);
    expect(buildSwatches()).toHaveLength(267);
  });

  it('el orden revuelto es estable, así que servidor y cliente pintan lo mismo', () => {
    expect(buildSwatches().map((w) => w.hex)).toEqual(buildSwatches().map((w) => w.hex));
  });

  it('cada token conserva su color de referencia entre sus variantes', () => {
    const hexes = new Set(buildSwatches().map((w) => w.hex));
    for (const t of TOKENS) expect(hexes.has(t.hex)).toBe(true);
  });

  it('el interruptor pasa de la auditoría a los tokens y lo anuncia', () => {
    render(<TokenCollapse />);
    const before = screen.getByRole('button', { name: 'Antes: auditoría' });
    const after = screen.getByRole('button', { name: 'Después: tokens' });
    expect(before).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('img', { name: /267 valores de color sueltos/ })).toBeInTheDocument();
    fireEvent.click(after);
    expect(after).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('img', { name: /agrupados en 24 tokens/ })).toBeInTheDocument();
  });
});
