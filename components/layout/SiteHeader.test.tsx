import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
const path = { current: '/' };
vi.mock('next/navigation', () => ({ usePathname: () => path.current }));
import SiteHeader from './SiteHeader';

describe('SiteHeader', () => {
  it('tiene nav con Trabajo, Sobre mí y Contactar, y marca la activa', () => {
    path.current = '/es/about';
    render(<SiteHeader />);
    const nav = screen.getByRole('navigation', { name: /principal/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Trabajo' })).toHaveAttribute('href', '/es#trabajo');
    expect(screen.getByRole('link', { name: 'Sobre mí' })).toHaveAttribute('aria-current', 'page');
    /* Contactar ya no lleva a otra parte: abre el modal del formulario. */
    expect(screen.getByRole('button', { name: 'Contactar' })).toHaveAttribute('aria-haspopup', 'dialog');
    expect(screen.getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/es');
  });
});
