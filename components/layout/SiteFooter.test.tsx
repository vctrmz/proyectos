import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SiteFooter from './SiteFooter';

describe('SiteFooter', () => {
  it('es oscuro, muestra el nombre en grande y los enlaces', () => {
    const { container } = render(<SiteFooter />);
    const foot = container.querySelector('footer')!;
    expect(foot.className).toMatch(/foot/);
    expect(screen.getByText('Víctor Maza')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /Privacidad/ })).toHaveAttribute('href', '/privacidad');
    expect(foot.textContent).toMatch(/Málaga/);
  });
  it('las manos son decorativas', () => {
    const { container } = render(<SiteFooter />);
    for (const c of container.querySelectorAll('canvas')) expect(c.getAttribute('aria-hidden')).toBe('true');
  });
});
