import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('motion/react', () => import('@/test/motion-mock'));
import UiKit from './UiKit';
import { CASES } from '@/lib/content/cases';
import type { UiKitPiece } from '@/lib/content/cases/types';

const PIECES: UiKitPiece[] = [
  { kind: 'tokens', title: 'Tokens con rol', body: 'Cada token dice para qué sirve y el front elige sin preguntar.', wide: true },
  { kind: 'actions', title: 'Jerarquía de acción', body: 'La que cierra el paso en color de marca, la reversible en contorno.', label: 'Emitir póliza' },
];

describe('UiKit', () => {
  it('pinta las piezas que recibe, cada una con título y descripción', () => {
    render(<UiKit brand="#1f2a5a" pieces={PIECES} />);
    expect(screen.getByRole('list', { name: /kit/i })).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    for (const li of items) {
      expect(li.querySelector('h4')!.textContent!.length).toBeGreaterThan(3);
      expect(li.querySelector('p')!.textContent!.length).toBeGreaterThan(20);
    }
    // la etiqueta del caso manda dentro de la maqueta
    expect(screen.getByText('Emitir póliza')).toBeInTheDocument();
  });
  it('las maquetas son decorativas', () => {
    const { container } = render(<UiKit brand="#1f2a5a" pieces={PIECES} />);
    const mocks = container.querySelectorAll('[data-mock]');
    expect(mocks.length).toBe(2);
    for (const m of mocks) expect(m.getAttribute('aria-hidden')).toBe('true');
  });
  it('cada caso trae su propio kit: ni el mismo ni repetido', () => {
    const kits = CASES.map((c) => c.system.uiKit ?? []);
    for (const k of kits) expect(k.length).toBeGreaterThanOrEqual(3);
    // ninguna combinación de piezas se repite entre casos
    const firmas = kits.map((k) => k.map((p) => p.kind).join('+'));
    expect(new Set(firmas).size).toBe(firmas.length);
    // y ningún título se repite dos veces dentro del mismo caso
    for (const k of kits) expect(new Set(k.map((p) => p.title)).size).toBe(k.length);
  });
});
