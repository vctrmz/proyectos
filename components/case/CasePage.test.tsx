import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('next/navigation', () => ({ usePathname: () => '/casos/hermes', useSearchParams: () => new URLSearchParams('') }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
import CasePage from './CasePage';
import { getCase } from '@/lib/content/cases';

describe('CasePage', () => {
  it('sigue la plantilla: h1, secciones en orden, resultado honesto y siguiente caso', () => {
    render(<CasePage c={getCase('hermes')!} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('HERMES');
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2).toEqual(expect.arrayContaining(['Problema', 'Complejidad', 'Decisiones', 'Sistema', 'Diseño', 'Implementación', 'Resultado', 'Aprendizajes']));
    expect(h2.indexOf('Problema')).toBeLessThan(h2.indexOf('Decisiones'));
    expect(h2.indexOf('Decisiones')).toBeLessThan(h2.indexOf('Resultado'));
    expect(screen.getByText('Dato no disponible')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Siguiente caso/ })).toHaveAttribute('href', '/casos/suscripcion');
    expect(screen.getByRole('link', { name: /← Trabajo/ })).toHaveAttribute('href', '/#trabajo');
  });
  it('pinta un CodeDemo cuando el caso lo trae', () => {
    render(<CasePage c={getCase('hermes')!} />);
    expect(screen.getByText(/ejemplo ilustrativo/i)).toBeInTheDocument();
  });
});
