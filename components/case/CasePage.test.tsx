import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
vi.mock('next/navigation', () => ({ usePathname: () => '/es/cases/hermes', useSearchParams: () => new URLSearchParams('') }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
import CasePage from './CasePage';
import { getCase } from '@/lib/content/cases';

describe('CasePage', () => {
  it('sigue la plantilla: h1, secciones en orden, resultado honesto y siguiente caso', () => {
    render(<CasePage c={getCase('hermes')!} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('HERMES');
    // cada sección del documento lleva su número delante; se compara la etiqueta
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent!.replace(/^\d+/, ''));
    expect(h2).toEqual(expect.arrayContaining(['Problema', 'Complejidad', 'Decisiones', 'Sistema', 'Diseño', 'Implementación', 'Resultado', 'Aprendizajes']));
    expect(h2.indexOf('Problema')).toBeLessThan(h2.indexOf('Decisiones'));
    expect(h2.indexOf('Decisiones')).toBeLessThan(h2.indexOf('Resultado'));
    expect(screen.getByText('Dato no disponible')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Siguiente caso/ })).toHaveAttribute('href', '/es/cases/flesip');
    expect(screen.getByRole('link', { name: /← Trabajo/ })).toHaveAttribute('href', '/es#trabajo');
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
  it('pinta un CodeDemo cuando el caso lo trae', () => {
    render(<CasePage c={getCase('hermes')!} />);
    expect(screen.getByText(/ejemplo ilustrativo/i)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /kit/i })).toBeInTheDocument();
  });
});
