import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
vi.mock('motion/react', () => import('@/test/motion-mock'));
import BioDrawer from './BioDrawer';

describe('BioDrawer', () => {
  it('el CTA abre un drawer accesible con el recorrido completo, Esc lo cierra y devuelve el foco', async () => {
    render(<BioDrawer />);
    const cta = screen.getByRole('button', { name: /mi forma de trabajar/i });
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.click(cta);
    /* El cajón se titula por lo que cuenta, no «El detalle». */
    const dialog = screen.getByRole('dialog', { name: /cómo trabajo, de los requisitos a producción/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    /* El cajón se llama «Mi forma de trabajar»: cuenta el método, no el
       catálogo de productos —eso vive en los casos y en la portada—. */
    /* Cómo me preparo —requisitos y lo que ya existe— y cómo adapto el método. */
    expect(dialog.textContent).toMatch(/Analizo los requisitos/);
    expect(dialog.textContent).toMatch(/reviso lo que ya tenemos/);
    expect(dialog.textContent).toMatch(/no uso todas sus herramientas en cada proyecto/);
    expect(dialog.textContent).toMatch(/explicar en lenguaje de negocio/);
    for (const fuera of ['Cinco productos, un solo lenguaje', '267 valores de color', 'Informático de formación', 'Único diseñador de un holding']) {
      expect(dialog.textContent, fuera).not.toMatch(new RegExp(fuera, 'i'));
    }
    /* Dos párrafos de entrada y el detalle en la infografía: el cajón se ojea,
       no se scrollea. */
    expect(dialog.querySelectorAll('.bio p').length).toBeLessThanOrEqual(2);
    expect(dialog.querySelectorAll('strong').length).toBeGreaterThan(5);
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
    await userEvent.click(screen.getByRole('button', { name: /mi forma de trabajar/i }));
    expect(lenis.stop).toHaveBeenCalledOnce();
    const dialog = screen.getByRole('dialog');
    expect(dialog.querySelector('[data-lenis-prevent]')).not.toBeNull();
    expect(screen.getByRole('heading', { name: /el proceso/i })).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    /* Dos pasos de preparación y cuatro de design thinking. */
    expect(tabs.map((x) => x.textContent?.replace(/^\d+/, ''))).toEqual(['Analizar', 'Reutilizar', 'Investigar', 'Definir', 'Diseñar', 'Validar']);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('tab', { name: /Investigar/ }));
    const panel = screen.getByRole('tabpanel');
    expect(panel.textContent).toMatch(/qué se sabe ya/);
    expect(panel.querySelectorAll('strong').length).toBeGreaterThan(0);
    /* Cada paso trae su lista de lo concreto: es lo que evita el párrafo largo. */
    expect(panel.querySelectorAll('ul li').length).toBe(3);
    expect(panel.textContent).toMatch(/sin interrumpirle/);
    expect(screen.getByText(/60 · 30 · 10/)).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(lenis.start).toHaveBeenCalledOnce();
    setLenis(null);
  });
});
