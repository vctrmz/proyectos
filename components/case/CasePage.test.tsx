import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
vi.mock('next/navigation', () => ({ usePathname: () => '/es/cases/hermes', useSearchParams: () => new URLSearchParams('') }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
import CasePage from './CasePage';
import { getCase } from '@/lib/content/cases';
import { getCaseIn } from '@/lib/content/en';

describe('CasePage', () => {
  it('sigue la plantilla: h1, secciones en orden, resultado honesto y siguiente caso', () => {
    render(<CasePage c={getCase('hermes')!} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('HERMES');
    // cada sección del documento lleva su número delante; se compara la etiqueta
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent!.replace(/^\d+/, ''));
    expect(h2).toEqual(expect.arrayContaining(['Problema', 'Complejidad', 'Decisiones', 'Sistema', 'Diseño', 'Implementación', 'Resultado', 'Aprendizajes']));
    expect(h2.indexOf('Problema')).toBeLessThan(h2.indexOf('Decisiones'));
    expect(h2.indexOf('Decisiones')).toBeLessThan(h2.indexOf('Resultado'));
    /* El resultado sigue siendo honesto: las cifras de outcome traen su
       explicación y la sección de qué mediría hoy no desaparece. */
    expect(screen.getByRole('heading', { level: 3, name: 'Outcome' })).toBeInTheDocument();
    expect(screen.getByText(/4 de 4/)).toBeInTheDocument();
    expect(screen.getByText(/Adopción completa del equipo de front/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Qué mediría hoy/ })).toBeInTheDocument();
    /* Tres salidas al siguiente caso —el botón de arriba, el dock y la
       tarjeta del final— y las tres llevan al mismo sitio. */
    const siguientes = screen.getAllByRole('link', { name: /Siguiente caso/ });
    expect(siguientes).toHaveLength(3);
    for (const a of siguientes) expect(a).toHaveAttribute('href', '/es/cases/flesip');
    expect(screen.getByRole('link', { name: /← Trabajo/ })).toHaveAttribute('href', '/es/work#trabajo');
  });
  it('el dock recorre todos los casos en orden y marca el actual', () => {
    render(<CasePage c={getCase('hermes')!} />);
    const dock = screen.getByRole('navigation', { name: 'Proyectos' });
    const puntos = within(dock).getAllByRole('link', { name: /^Caso \d+ de 9/ });
    expect(puntos).toHaveLength(9);
    expect(within(dock).getByRole('link', { current: 'page' })).toHaveAttribute('href', '/es/cases/hermes');
    expect(within(dock).getByRole('link', { name: /Caso anterior/ })).toHaveAttribute('href', '/es/cases/ayax');
    expect(within(dock).getByRole('link', { name: 'Trabajos' })).toHaveAttribute('href', '/es/work#trabajo');
  });
  it('trae el índice del caso con una entrada por sección', () => {
    render(<CasePage c={getCase('hermes')!} />);
    const nav = screen.getByRole('navigation', { name: /Índice del caso/i });
    const entradas = within(nav).getAllByRole('listitem');
    const secciones = screen.getAllByRole('heading', { level: 2 }).filter((h) => h.id.startsWith('c-'));
    expect(entradas).toHaveLength(secciones.length);
    expect(within(nav).getByRole('link', { name: /Problema/ })).toHaveAttribute('href', '#c-problema');
  });
  it('enseña los flujos y las contrapartidas cuando el caso los trae', () => {
    render(<CasePage c={getCase('hermes')!} />);
    expect(screen.getByText(/Del lead a la póliza/)).toBeInTheDocument();
    expect(screen.getAllByText(/Contrapartida asumida/).length).toBeGreaterThanOrEqual(1);
  });
  it('cuenta la entrega del sistema en lugar del JSON y el kit', () => {
    render(<CasePage c={getCase('hermes')!} />);
    expect(screen.getByRole('heading', { level: 3, name: /Del Figma al código/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Foundations en JSON' })).toBeInTheDocument();
    expect(screen.queryByText(/ejemplo ilustrativo/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('list', { name: /kit/i })).not.toBeInTheDocument();
  });
  it('un caso en inglés lleva el footer en inglés', () => {
    const { container } = render(<CasePage c={getCaseIn('en', 'hermes')!} locale="en" />);
    expect(container.querySelector('footer')!.textContent).toMatch(/Get in touch/);
  });
});
