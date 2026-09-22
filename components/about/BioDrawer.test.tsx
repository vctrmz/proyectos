import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
vi.mock('motion/react', () => import('@/test/motion-mock'));
import BioDrawer from './BioDrawer';

describe('BioDrawer', () => {
  it('el CTA abre un drawer accesible con el recorrido completo, Esc lo cierra y devuelve el foco', async () => {
    render(<BioDrawer />);
    const cta = screen.getByRole('button', { name: /recorrido completo/i });
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.click(cta);
    const dialog = screen.getByRole('dialog', { name: /recorrido/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.textContent).toMatch(/Informático de formación, Product Designer de oficio/);
    expect(dialog.textContent).toMatch(/Me interesan los flujos completos/);
    expect(dialog.querySelectorAll('strong').length).toBeGreaterThan(10);
    expect(document.activeElement).not.toBe(cta);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(cta);
  });
});
