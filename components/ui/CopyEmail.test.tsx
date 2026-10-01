import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';
import CopyEmail from './CopyEmail';

const pon = (escribir: () => Promise<void>) => {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn(escribir) }, configurable: true });
};
const monta = (locale: 'es' | 'en' = 'es') =>
  render(<LocaleProvider locale={locale}><CopyEmail /></LocaleProvider>);

beforeEach(() => { vi.useRealTimers(); });

describe('CopyEmail', () => {
  it('copia la dirección y lo avisa', async () => {
    let copiado = '';
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn(async (t: string) => { copiado = t; }) }, configurable: true,
    });
    monta();
    await userEvent.click(screen.getByRole('button', { name: 'Copiar mi correo' }));
    expect(copiado).toBe('vctrmz47@gmail.com');
    expect(await screen.findByRole('button', { name: 'Correo copiado' })).toBeInTheDocument();
  });
  /* El aviso se anuncia solo: quien no ve el cambio de icono lo oye. */
  it('el aviso es una región viva', async () => {
    pon(async () => {});
    const { container } = monta();
    await userEvent.click(screen.getByRole('button', { name: 'Copiar mi correo' }));
    expect(container.querySelector('[aria-live="polite"]')!.textContent).toBe('Correo copiado');
  });
  /* El correo no se escribe en la página: ni a la vista ni en el HTML, que es
     de donde lo recogen los robots de spam. */
  it('la dirección no está en la página mientras no hace falta', () => {
    pon(async () => {});
    const { container } = monta();
    expect(container.innerHTML).not.toMatch(/vctrmz47/);
  });
  /* Si el portapapeles falla —permiso denegado, contexto no seguro— se dice y
     se enseña la dirección para copiarla a mano. */
  it('si el portapapeles falla, lo dice y enseña la dirección', async () => {
    pon(async () => { throw new Error('denegado'); });
    const { container } = monta();
    await userEvent.click(screen.getByRole('button', { name: 'Copiar mi correo' }));
    const aviso = container.querySelector('[aria-live="polite"]')!;
    expect(aviso.textContent).toMatch(/No se pudo copiar/);
    expect(aviso.textContent).toMatch(/vctrmz47@gmail\.com/);
  });
  it('en inglés va en inglés', async () => {
    pon(async () => {});
    monta('en');
    await userEvent.click(screen.getByRole('button', { name: 'Copy my email' }));
    expect(await screen.findByRole('button', { name: 'Email copied' })).toBeInTheDocument();
  });
});
