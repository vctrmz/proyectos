import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(''), usePathname: () => '/' }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
import Hero from './Hero';
import Manifesto from './Manifesto';
import LogoMarquee from './LogoMarquee';
import Closing from './Closing';

describe('portada', () => {
  it('el hero responde quién, qué y para quién con dos CTA', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toMatch(/reglas de negocio/i);
    expect(h1.textContent).toMatch(/producción/i);
    expect(screen.getByRole('link', { name: /Ver el caso HERMES/ })).toHaveAttribute('href', '/casos/hermes');
    expect(screen.getByRole('link', { name: /Contactar/ })).toHaveAttribute('href', '#contacto');
    expect(screen.getByText(/Insurtech/)).toBeInTheDocument();
  });
  it('el manifiesto está completo en el HTML (sin depender de JS)', () => {
    const { container } = render(<Manifesto />);
    const text = container.textContent!.replace(/ /g, ' ');
    expect(text).toContain('Diseñé reglas en lugar de casos');
    expect(text).toContain('un error operativo cuesta dinero');
  });
  it('los logos son monocromos, discretos y accesibles', () => {
    render(<LogoMarquee />);
    const list = screen.getByRole('list', { name: /empresas/i });
    expect(list.querySelectorAll('img').length).toBeGreaterThanOrEqual(8);
    expect(list.querySelector('img')).toHaveAttribute('alt');
  });
  it('el cierre pregunta por el producto complejo y ofrece contacto', () => {
    render(<Closing />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(/producto complejo/i);
    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('target', '_blank');
  });
});
