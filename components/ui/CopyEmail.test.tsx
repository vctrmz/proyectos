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
    await userEvent.click(screen.getByRole('button', { name: /Copiar el correo/ }));
    expect(copiado).toBe('vctrmz47@gmail.com');
    expect(await screen.findByText('Correo copiado')).toBeInTheDocument();
  });
  /* El aviso se anuncia solo: quien no ve el cambio de icono lo oye. */
  it('el aviso es una región viva', async () => {
    pon(async () => {});
    const { container } = monta();
    expect(container.querySelector('[aria-live="polite"]')).not.toBeNull();
  });
  /* Si el portapapeles falla —permiso denegado, contexto no seguro— se dice,
     en lugar de enseñar «copiado» sobre algo que no se copió. */
  it('si el portapapeles falla, lo dice', async () => {
    pon(async () => { throw new Error('denegado'); });
    monta();
    await userEvent.click(screen.getByRole('button', { name: /Copiar el correo/ }));
    expect(await screen.findByText('No se pudo copiar')).toBeInTheDocument();
  });
  it('en inglés el aviso va en inglés', async () => {
    pon(async () => {});
    monta('en');
    await userEvent.click(screen.getByRole('button', { name: /Copy the email address/ }));
    expect(await screen.findByText('Email copied')).toBeInTheDocument();
  });
  /* La etiqueta lleva la dirección: un icono solo no dice qué se copia. */
  it('la etiqueta accesible nombra la dirección', () => {
    pon(async () => {});
    monta();
    expect(screen.getByRole('button', { name: /vctrmz47@gmail\.com/ })).toBeInTheDocument();
  });
});
