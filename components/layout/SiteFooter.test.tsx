import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SiteFooter from './SiteFooter';

describe('SiteFooter', () => {
  it('es oscuro, con el claim, el contacto, las redes y el aviso legal', () => {
    const { container } = render(<SiteFooter />);
    const foot = container.querySelector('footer')!;
    expect(foot.className).toMatch(/foot/);
    expect(foot.textContent).toMatch(/error operativo cuesta dinero/);
    expect(foot.textContent).toMatch(/Ponte en contacto/i);
    expect(screen.getByRole('link', { name: /vctrmz47@gmail.com/ })).toHaveAttribute('href', 'mailto:vctrmz47@gmail.com');
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /Behance/ })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /Sobre mí/ })).toHaveAttribute('href', '/sobre-mi');
    expect(screen.getByRole('link', { name: /Privacidad/ })).toHaveAttribute('href', '/privacidad');
    expect(foot.textContent).toMatch(/Málaga/);
  });
  it('la barra inferior anuncia disponibilidad', () => {
    const { container } = render(<SiteFooter />);
    expect(container.querySelector('footer')!.textContent).toMatch(/Disponible para proyectos/);
    expect(container.querySelectorAll('canvas')).toHaveLength(0);
  });
});
