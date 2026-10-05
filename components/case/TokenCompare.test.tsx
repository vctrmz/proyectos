import { describe, it, expect } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TokenCompare from './TokenCompare';
import { getCase } from '@/lib/content/cases';

describe('TokenCompare', () => {
  it('una tabla que cambia de nombre: de apariencia a intención con el interruptor', async () => {
    const t = getCase('design-system')!.system.tokens!;
    const u = userEvent.setup();
    render(<TokenCompare t={t} />);
    const tabla = screen.getByRole('table');
    // empieza por apariencia: el valor suelto y la pregunta que deja abierta
    expect(screen.getByRole('button', { name: 'Por apariencia' })).toHaveAttribute('aria-pressed', 'true');
    for (const r of t.rows) {
      expect(within(tabla).getByRole('rowheader', { name: r.use })).toBeInTheDocument();
      expect(within(tabla).getByText(r.question)).toBeInTheDocument();
    }
    await u.click(screen.getByRole('button', { name: 'Por intención' }));
    expect(screen.getByRole('button', { name: 'Por intención' })).toHaveAttribute('aria-pressed', 'true');
    // por intención: el token con rol y la equivalencia, legible también por lector de pantalla
    await waitFor(() => { for (const r of t.rows) expect(within(tabla).getByText(r.after)).toBeInTheDocument(); });
    expect(tabla.textContent).toMatch(/equivale a #2f5bea/);
    expect(within(tabla).getByText('Por intención', { selector: 'caption' })).toBeInTheDocument();
  });
});
