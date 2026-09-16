import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const path = { current: '/' };
vi.mock('next/navigation', () => ({ usePathname: () => path.current }));

import Nav from './Nav';

describe('Nav', () => {
  it('enlaza a / y /perfil y marca la activa', () => {
    render(<Nav />);
    const inicio = screen.getAllByRole('link', { name: /^inicio$/i }).find((l) => l.classList.contains('nav-link'))!;
    const perfil = screen.getByRole('link', { name: /sobre mí/i });
    expect(inicio).toHaveAttribute('href', '/');
    expect(perfil).toHaveAttribute('href', '/perfil');
    expect(inicio).toHaveClass('is-active');
    expect(perfil).not.toHaveClass('is-active');
    expect(document.querySelector('starfield-button')).not.toBeNull();
  });
  it('en privacidad no pinta el botón de contacto', () => {
    path.current = '/privacidad';
    render(<Nav />);
    expect(document.querySelector('starfield-button')).toBeNull();
    path.current = '/';
  });
});
