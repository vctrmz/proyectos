import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import GlitchText from './GlitchText';

afterEach(() => vi.useRealTimers());

describe('GlitchText', () => {
  it('el texto real queda accesible y la capa animada es decorativa', () => {
    const { container } = render(<GlitchText text="Diseñé reglas en lugar de casos." />);
    const sr = container.querySelector('[data-real]')!;
    expect(sr.textContent).toBe('Diseñé reglas en lugar de casos.');
    const fx = container.querySelector('[aria-hidden="true"]');
    expect(fx).not.toBeNull();
    expect(fx!.textContent).toBe('Diseñé reglas en lugar de casos.');
  });
  it('al pasar el cursor mezcla caracteres sin cambiar la longitud, y al salir restaura', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout', 'clearTimeout'] });
    const text = 'Diseño producto B2B donde un error operativo cuesta dinero.';
    const { container } = render(<GlitchText text={text} />);
    const fx = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    const host = container.firstElementChild as HTMLElement;
    host.getBoundingClientRect = () => ({ left: 0, width: 590, top: 0, height: 20, right: 590, bottom: 20, x: 0, y: 0, toJSON: () => ({}) });
    act(() => { fireEvent.pointerEnter(host, { clientX: 100, clientY: 10 }); });
    act(() => { vi.advanceTimersByTime(200); });
    expect(fx.textContent).toHaveLength(text.length);
    expect(fx.textContent).not.toBe(text);
    act(() => { fireEvent.pointerLeave(host); });
    act(() => { vi.advanceTimersByTime(1400); });
    expect(fx.textContent).toBe(text);
  });
});
