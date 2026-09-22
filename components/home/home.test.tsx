import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(''), usePathname: () => '/' }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
import Hero from './Hero';
import Manifesto from './Manifesto';
import LogoMarquee from './LogoMarquee';
import Closing from './Closing';
import Sectores from './Sectores';

describe('portada', () => {
  it('el hero responde quién, qué y para quién con dos CTA', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toMatch(/producto B2B complejo/i);
    expect(h1.textContent).toMatch(/producción/i);
    expect(screen.getByRole('link', { name: /Ver el caso HERMES/ })).toHaveAttribute('href', '/casos/hermes');
    expect(screen.getByRole('link', { name: /Contactar/ })).toHaveAttribute('href', '#contacto');
    expect(screen.getByText(/Insurtech/)).toBeInTheDocument();
    expect(screen.queryByText(/Disponible desde/)).toBeNull();
  });
  it('el hero presenta a la persona y sus redes', () => {
    render(<Hero />);
    expect(screen.getByText(/Víctor Maza/)).toBeInTheDocument();
    for (const n of ['LinkedIn', 'Behance', 'Instagram']) expect(screen.getByRole('link', { name: new RegExp(n) })).toHaveAttribute('target', '_blank');
  });
  it('sectores: cinco con años y enlace', () => {
    render(<Sectores />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(items[0].textContent).toMatch(/Insurtech/);
    expect(items[0].textContent).toMatch(/2022/);
    // descripciones de una línea
    for (const li of items) { const body = li.querySelector('[class*="body"]')!; expect(body.textContent!.length, body.textContent!).toBeLessThanOrEqual(95); }
    expect(screen.getByRole('link', { name: /Ver el caso/ })).toHaveAttribute('href', '/casos/hermes');
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
    const imgs = list.querySelectorAll('img');
    expect(imgs.length).toBeGreaterThanOrEqual(8);
    expect(imgs[0]).toHaveAttribute('alt');
    // solo logos: ningún nombre visible junto a la imagen
    expect(list.textContent!.trim()).toBe('');
  });
  it('el cierre pregunta por el producto complejo y ofrece contacto', () => {
    render(<Closing />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(/producto complejo/i);
    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('target', '_blank');
  });
});
