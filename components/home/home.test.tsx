import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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
    expect(screen.getByRole('button', { name: /Contactar/ })).toHaveAttribute('aria-haspopup', 'dialog');
    expect(screen.getByText(/Insurtech/)).toBeInTheDocument();
    expect(screen.queryByText(/Disponible desde/)).toBeNull();
  });
  it('el hero declara design systems y la implementación en React', () => {
    render(<Hero />);
    expect(screen.getByText(/Senior Product Designer · Design Systems · B2B SaaS e Insurtech/)).toBeInTheDocument();
    expect(screen.getByText(/revis\w+ la implementación en React/)).toBeInTheDocument();
  });
  it('el hero en inglés dice lo mismo', () => {
    render(<Hero locale="en" />);
    expect(screen.getByText(/Senior Product Designer · Design Systems · B2B SaaS and Insurtech/)).toBeInTheDocument();
  });
  it('el hero pone junto al nombre LinkedIn, Behance y Figma, sin monograma', () => {
    const { container } = render(<Hero />);
    expect(screen.getByText('Víctor Maza')).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/\bVM\b/);
    const redes = within(screen.getByRole('list', { name: 'Redes' })).getAllByRole('link');
    expect(redes.map((a) => a.getAttribute('aria-label')?.split(' ')[0])).toEqual(['LinkedIn', 'Behance', 'Figma']);
    for (const a of redes) expect(a).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /Behance/ })).toHaveAttribute('href', 'https://www.behance.net/mazdesignr');
    expect(screen.getByRole('link', { name: /Figma/ }).getAttribute('href')).toMatch(/^https:\/\/www\.figma\.com\/design\/lEPRv8iPrIDwUBKnbWKMdu\//);
    /* El código se enseña en el bloque Stack, con su enlace escrito. */
    for (const n of ['GitHub', 'Instagram']) {
      expect(screen.queryByRole('link', { name: new RegExp(n) }), n).toBeNull();
    }
    /* El CV se movió al hero de Sobre mí: en la portada ya no se repite. */
    expect(screen.queryByText(/Descargar CV/)).toBeNull();
  });
  it('sectores: cinco con años y enlace', () => {
    const { container } = render(<Sectores />);
    const items = Array.from(container.querySelectorAll<HTMLLIElement>('#sectores > ul > li'));
    expect(items).toHaveLength(5);
    expect(items[0].textContent).toMatch(/Insurtech/);
    expect(items[0].textContent).toMatch(/2022/);
    // descripciones de una línea
    for (const li of items) { const body = li.querySelector('[class*="body"]')!; expect(body.textContent!.length, body.textContent!).toBeLessThanOrEqual(95); }
    expect(screen.getByRole('link', { name: /Ver el caso/ })).toHaveAttribute('href', '/es/cases/hermes');
  });
  it('sectores: cada uno dice para quién diseñé, y la entradilla explica por qué importa', () => {
    render(<Sectores />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(/Cinco sectores/);
    expect(screen.getByText(/comercial, operaciones, finanzas y dirección/)).toBeInTheDocument();
    const listas = screen.getAllByRole('list', { name: 'Para quién diseñé' });
    expect(listas).toHaveLength(5);
    expect(listas[0].textContent).toMatch(/Siniestros/);
    for (const l of listas) expect(l.querySelectorAll('li').length).toBeGreaterThanOrEqual(2);
  });
  it('sectores en inglés: título, entradilla y áreas traducidos', () => {
    render(<Sectores locale="en" />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(/Five sectors/);
    const listas = screen.getAllByRole('list', { name: 'Who I designed for' });
    expect(listas[0].textContent).toMatch(/Claims/);
    expect(listas[0].textContent).not.toMatch(/Siniestros/);
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
    expect(first.textContent).toMatch(/03 competencias/);
    expect(screen.getByText(/Experiencias complejas en B2B SaaS/)).toBeInTheDocument();
    expect(screen.getByText(/Disponible ahora · roles Senior o Lead de Product Design/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contactar' })).toHaveAttribute('aria-haspopup', 'dialog');
    expect(screen.queryByText(/Descargar CV/)).toBeNull();
  });
});
