import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
vi.mock('next/navigation', () => ({ usePathname: () => '/es/cases/design-system', useSearchParams: () => new URLSearchParams('') }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
import CasePage from '../CasePage';
import { CASES, getCase } from '@/lib/content/cases';

const ds = getCase('design-system')!;
const shots = ds.storyboard!.acts.flatMap((a) => a.shots);

describe('Storyboard del caso', () => {
  it('sustituye al documento: sin índice de secciones, con ficha, mapa y actos en orden', () => {
    render(<CasePage c={ds} />);
    expect(screen.queryByRole('navigation', { name: /Índice del caso/i })).toBeNull();
    const slate = screen.getByLabelText('Ficha del caso');
    expect(within(slate).getByText('Planos').nextSibling!.textContent).toBe(String(shots.length));
    const actos = screen.getAllByRole('heading', { level: 2 }).filter((h) => h.id.startsWith('act-'));
    expect(actos.map((h) => h.textContent)).toEqual(ds.storyboard!.acts.map((a, i) => `Acto ${['I', 'II', 'III', 'IV', 'V'][i]}: ${a.title}`));
  });

  it('un panel por plano, numerado, y cada plano con decisión trae su porqué y lo que cambió', () => {
    const { container } = render(<CasePage c={ds} />);
    const panels = container.querySelectorAll('article[id^="p-"]');
    expect(panels).toHaveLength(shots.length);
    shots.forEach((x, i) => {
      const p = panels[i] as HTMLElement;
      expect(p.id).toBe(`p-${String(i + 1).padStart(2, '0')}`);
      // el título del panel es su primer h3: las piezas vivas traen los suyos dentro
      expect(p.querySelector('h3')!.textContent).toContain(x.title);
      if (x.decision != null) {
        const d = ds.decisions[x.decision];
        expect(within(p).getByRole('heading', { level: 4, name: d.title })).toBeInTheDocument();
        expect(within(p).getByText(d.why)).toBeInTheDocument();
        expect(within(p).getByText(d.changed)).toBeInTheDocument();
      }
    });
  });

  it('el mapa y la tira enlazan con planos que existen', () => {
    const { container } = render(<CasePage c={ds} />);
    const map = screen.getByRole('region', { name: 'El caso, plano a plano' });
    const strip = screen.getByRole('navigation', { name: 'Progreso del storyboard' });
    for (const scope of [map, strip]) {
      const links = within(scope).getAllByRole('link');
      expect(links).toHaveLength(shots.length);
      for (const a of links) expect(container.querySelector(a.getAttribute('href')!)).not.toBeNull();
    }
  });

  it('cierra con el resultado honesto y los aprendizajes del caso', () => {
    render(<CasePage c={ds} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Resultado' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Qué mediría hoy/ })).toBeInTheDocument();
    for (const l of ds.learnings) expect(screen.getByText(l)).toBeInTheDocument();
  });

  it('cada fotograma dibujado tiene texto alternativo', () => {
    render(<CasePage c={ds} />);
    for (const x of shots) if ('draw' in x.frame) expect(screen.getByRole('img', { name: x.frame.alt })).toBeInTheDocument();
  });
});

/* Reglas de contenido para cualquier caso que traiga storyboard. */
describe('Contenido del storyboard', () => {
  for (const c of CASES.filter((k) => k.storyboard)) {
    it(`${c.slug}: decisiones válidas, cada una contada una vez, y el último plano sin puente`, () => {
      const all = c.storyboard!.acts.flatMap((a) => a.shots);
      const used = all.filter((x) => x.decision != null).map((x) => x.decision!);
      for (const i of used) expect(c.decisions[i], `decisión ${i}`).toBeDefined();
      expect(new Set(used).size).toBe(used.length);
      expect(used.sort()).toEqual(c.decisions.map((_, i) => i));
      expect(all.at(-1)!.bridge).toBeUndefined();
      for (const x of all.slice(0, -1)) expect(x.bridge, x.title).toBeTruthy();
      for (const a of c.storyboard!.acts) expect(a.shots.length).toBeGreaterThan(0);
    });
    it(`${c.slug}: sin rayas largas en el texto`, () => {
      const text = JSON.stringify(c.storyboard);
      expect(text).not.toMatch(/—/);
    });
  }
});
