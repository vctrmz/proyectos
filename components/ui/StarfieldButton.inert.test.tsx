import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
vi.mock('@/lib/motion/prefs', () => ({ motionAllowed: () => true, scrollEffectsAllowed: () => true, isCoarsePointer: () => false }));
import StarfieldButton from './StarfieldButton';

describe('StarfieldButton con efecto', () => {
  it('la capa decorativa es inerte: el foco no puede caer dentro de aria-hidden', () => {
    const { container } = render(<StarfieldButton label="Contactar" href="/#contacto" />);
    const fx = container.querySelector('starfield-button')!.closest('[aria-hidden="true"]')!;
    expect(fx.hasAttribute('inert')).toBe(true);
  });
});
