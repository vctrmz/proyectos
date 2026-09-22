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

describe('BioDrawer · forma de trabajo', () => {
  it('el drawer bloquea Lenis, su cuerpo hace scroll propio y trae la infografía del proceso', async () => {
    const { setLenis } = await import('@/lib/motion/lenisStore');
    const lenis = { stop: vi.fn(), start: vi.fn() };
    setLenis(lenis);
    render(<BioDrawer />);
    await userEvent.click(screen.getByRole('button', { name: /recorrido completo/i }));
    expect(lenis.stop).toHaveBeenCalledOnce();
    const dialog = screen.getByRole('dialog');
    expect(dialog.querySelector('[data-lenis-prevent]')).not.toBeNull();
    expect(screen.getByRole('heading', { name: /forma de trabajo/i })).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(5);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('tab', { name: /Estrategia/ }));
    expect(screen.getByRole('tabpanel').textContent).toMatch(/benchmark e investigación a fondo/);
    expect(screen.getByRole('tabpanel').querySelectorAll('strong').length).toBeGreaterThan(0);
    expect(screen.getByText(/60 · 30 · 10/)).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(lenis.start).toHaveBeenCalledOnce();
    setLenis(null);
  });
});
