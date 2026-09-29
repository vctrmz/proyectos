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
    expect(screen.getByRole('link', { name: /Ver el caso HERMES/ })).toHaveAttribute('href', '/es/cases/hermes');
    expect(screen.getByRole('link', { name: /Contactar/ })).toHaveAttribute('href', '#contacto');
    expect(screen.getByText(/Insurtech/)).toBeInTheDocument();
    expect(screen.queryByText(/Disponible desde/)).toBeNull();
  });
  it('el hero declara design systems y la implementación en React', () => {
    render(<Hero />);
    expect(screen.getByText(/Product Designer · Design Systems · B2B SaaS e Insurtech/)).toBeInTheDocument();
    expect(screen.getByText(/revis\w+ la implementación en React/)).toBeInTheDocument();
  });
  it('el hero en inglés dice lo mismo', () => {
    render(<Hero locale="en" />);
    expect(screen.getByText(/Product Designer · Design Systems · B2B SaaS and Insurtech/)).toBeInTheDocument();
  });
  it('el hero presenta a la persona, LinkedIn y GitHub', () => {
    render(<Hero />);
    expect(screen.getByText(/Víctor Maza/)).toBeInTheDocument();
    for (const n of ['LinkedIn', 'GitHub']) expect(screen.getByRole('link', { name: new RegExp(n) })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/vctrmz');
    expect(screen.queryByRole('link', { name: /Instagram/ })).toBeNull();
    expect(screen.getByRole('link', { name: /Descargar CV/ })).toHaveAttribute('href', '/victor-maza-cv.pdf');
  });
  it('sectores: cinco con años y enlace', () => {
    render(<Sectores />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(items[0].textContent).toMatch(/Insurtech/);
    expect(items[0].textContent).toMatch(/2022/);
    // descripciones de una línea
    for (const li of items) { const body = li.querySelector('[class*="body"]')!; expect(body.textContent!.length, body.textContent!).toBeLessThanOrEqual(95); }
    expect(screen.getByRole('link', { name: /Ver el caso/ })).toHaveAttribute('href', '/es/cases/hermes');
  });
  it('el manifiesto está completo en el HTML (sin depender de JS)', () => {
    const { container } = render(<Manifesto />);
    // GlitchText duplica cada palabra (texto real + capa decorativa): se compara el texto real
    const text = [...container.querySelectorAll('[data-real]')].map((n) => n.textContent).join(' ');
    expect(text).toContain('un error operativo cuesta dinero');
    expect(text).toContain('reglas escalables en lugar de resolver casos uno a uno');
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
  it('el cierre pregunta por el producto complejo y abre las competencias', () => {
    render(<Closing />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(/producto complejo/i);
    // las cuatro filas son botones de acordeón: la primera abierta, el resto cerradas
    const rows = screen.getAllByRole('button', { expanded: false });
    expect(rows.length).toBe(3);
    const first = screen.getByRole('button', { expanded: true });
    expect(first.textContent).toMatch(/Estrategia y diseño de producto/);
    expect(first.textContent).toMatch(/06 competencias/);
    expect(screen.getByText(/Diseño de producto end-to-end/)).toBeInTheDocument();
    expect(screen.getByText(/Disponible ahora · roles Senior o Lead de Product Design/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /vctrmz47@gmail.com/ })).toHaveAttribute('href', 'mailto:vctrmz47@gmail.com');
    expect(screen.getByRole('link', { name: /Descargar CV/ })).toBeInTheDocument();
  });
});
