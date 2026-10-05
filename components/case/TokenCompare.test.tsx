import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import TokenCompare from './TokenCompare';
import { getCase } from '@/lib/content/cases';

describe('TokenCompare', () => {
  it('enseña los mismos valores por apariencia y por intención, fila a fila', () => {
    const t = getCase('design-system')!.system.tokens!;
    render(<TokenCompare t={t} />);
    const [apariencia, intencion] = screen.getAllByRole('table');
    expect(within(apariencia).getByText('Por apariencia')).toBeInTheDocument();
    expect(within(intencion).getByText('Por intención')).toBeInTheDocument();
    // una fila por propiedad en cada tabla, con la misma propiedad delante
    for (const r of t.rows) {
      expect(within(apariencia).getByRole('rowheader', { name: r.use })).toBeInTheDocument();
      expect(within(intencion).getByRole('rowheader', { name: r.use })).toBeInTheDocument();
      expect(within(apariencia).getByText(r.question)).toBeInTheDocument();
      expect(within(intencion).getByText(r.after)).toBeInTheDocument();
    }
    // la equivalencia se lee, no solo se ve: «equivale a #2f5bea»
    expect(intencion.textContent).toMatch(/equivale a #2f5bea/);
  });
});
