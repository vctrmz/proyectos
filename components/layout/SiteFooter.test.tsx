import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SiteFooter from './SiteFooter';

describe('SiteFooter', () => {
  it('es oscuro, con el claim, los enlaces y el aviso legal', () => {
    const { container } = render(<SiteFooter />);
    const foot = container.querySelector('footer')!;
    expect(foot.className).toMatch(/foot/);
    expect(foot.textContent).toMatch(/error operativo cuesta dinero/);
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /Privacidad/ })).toHaveAttribute('href', '/privacidad');
    expect(foot.textContent).toMatch(/Málaga/);
  });
  it('no monta decoración de fondo', () => {
    const { container } = render(<SiteFooter />);
    expect(container.querySelectorAll('canvas')).toHaveLength(0);
  });
});
