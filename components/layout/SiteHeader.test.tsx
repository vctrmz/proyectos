import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
const path = { current: '/' };
vi.mock('next/navigation', () => ({ usePathname: () => path.current }));
import SiteHeader from './SiteHeader';

describe('SiteHeader', () => {
  it('tiene nav con Sobre mí primero, Trabajos y Contactar, y marca la activa', () => {
    path.current = '/es';
    render(<SiteHeader />);
    const nav = screen.getByRole('navigation', { name: /principal/i });
    expect(nav).toBeInTheDocument();
    /* «Sobre mí» es la portada y va primero; «Trabajos», después. */
    const links = within(nav).getAllByRole('link').map((a) => a.textContent);
    expect(links.indexOf('Sobre mí')).toBeLessThan(links.indexOf('Trabajos'));
    expect(screen.getByRole('link', { name: 'Sobre mí' })).toHaveAttribute('href', '/es');
    expect(screen.getByRole('link', { name: 'Trabajos' })).toHaveAttribute('href', '/es/work#trabajo');
    expect(screen.getByRole('link', { name: 'Sobre mí' })).toHaveAttribute('aria-current', 'page');
    /* Contactar ya no lleva a otra parte: abre el modal del formulario. */
    expect(screen.getByRole('button', { name: 'Contactar' })).toHaveAttribute('aria-haspopup', 'dialog');
    expect(screen.getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/es');
  });
});

describe('SiteHeader en Trabajos', () => {
  it('marca Trabajos en el catálogo y mientras se lee un caso', () => {
    for (const p of ['/es/work', '/es/cases/hermes']) {
      path.current = p;
      const { unmount } = render(<SiteHeader />);
      expect(screen.getByRole('link', { name: 'Trabajos' })).toHaveAttribute('aria-current', 'page');
      expect(screen.getByRole('link', { name: 'Sobre mí' })).not.toHaveAttribute('aria-current');
      unmount();
    }
  });
});
