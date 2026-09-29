import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SiteFooter from './SiteFooter';

describe('SiteFooter', () => {
  it('es oscuro, con la firma, el contacto, las redes y el aviso legal', () => {
    const { container } = render(<SiteFooter />);
    const foot = container.querySelector('footer')!;
    expect(foot.className).toMatch(/foot/);
    expect(foot.textContent).toMatch(/Víctor Maza/);
    expect(foot.textContent).toMatch(/Product Designer · Design Systems · B2B SaaS e Insurtech/);
    expect(foot.textContent).toMatch(/Ponte en contacto/i);
    expect(screen.getByRole('link', { name: /vctrmz47@gmail.com/ })).toHaveAttribute('href', 'mailto:vctrmz47@gmail.com');
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /Behance/ })).toHaveAttribute('target', '_blank');
    // el perfil de Víctor es mazdesignr; mazdesign es otro estudio
    expect(screen.getByRole('link', { name: /Behance/ })).toHaveAttribute('href', 'https://www.behance.net/mazdesignr');
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/vctrmz');
    expect(screen.queryByRole('link', { name: /Instagram/ })).toBeNull();
    expect(screen.getByRole('link', { name: /Descargar CV/ })).toHaveAttribute('href', '/victor-maza-cv.pdf');
    expect(screen.getByRole('link', { name: /Sobre mí/ })).toHaveAttribute('href', '/es/about');
    expect(screen.getByRole('link', { name: /Privacidad/ })).toHaveAttribute('href', '/es/privacy');
    expect(foot.textContent).toMatch(/Málaga/);
  });
  it('la barra inferior anuncia disponibilidad', () => {
    const { container } = render(<SiteFooter />);
    expect(container.querySelector('footer')!.textContent).toMatch(/Disponible ahora · Senior \/ Lead · remoto/);
    expect(container.querySelectorAll('canvas')).toHaveLength(0);
  });
});
