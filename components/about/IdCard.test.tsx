import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IdCard from './IdCard';

/* El arrastre solo existe con ratón y pantalla ancha: en móvil la tarjeta
   tapa casi todo el ancho y, si capturase el dedo, no se podría hacer scroll. */
const pantalla = (arrastre: boolean) =>
  vi.spyOn(window, 'matchMedia').mockImplementation((q: string) => ({ matches: arrastre, media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false }) as MediaQueryList);

const captura = vi.fn();
Object.assign(HTMLElement.prototype, { setPointerCapture: captura, releasePointerCapture() {} });
afterEach(() => { vi.restoreAllMocks(); captura.mockClear(); });

const tarjeta = () => screen.getByText('Víctor Maza', { selector: 'p' }).closest('div[class]')!.parentElement!;

describe('tarjeta de acreditación', () => {
  it('en escritorio invita a arrastrarla y captura el puntero', () => {
    pantalla(true);
    render(<IdCard />);
    expect(screen.getByText('Arrastra la tarjeta')).toBeInTheDocument();
    fireEvent.pointerDown(tarjeta(), { pointerId: 1, clientX: 10 });
    expect(captura).toHaveBeenCalledWith(1);
  });

  it('en móvil no se arrastra: el dedo hace scroll', () => {
    pantalla(false);
    render(<IdCard />);
    expect(screen.queryByText('Arrastra la tarjeta')).toBeNull();
    fireEvent.pointerDown(tarjeta(), { pointerId: 1, clientX: 10 });
    expect(captura).not.toHaveBeenCalled();
  });

  it('el contenido sigue siendo texto legible', () => {
    pantalla(false);
    render(<IdCard locale="en" />);
    expect(screen.getByText('Product Designer')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });
});
