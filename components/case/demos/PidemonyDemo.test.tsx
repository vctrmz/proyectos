import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
vi.mock('next/font/google', () => ({ Roboto: () => ({ className: 'roboto' }) }));
import PidemonyDemo from './PidemonyDemo';

const app = () => screen.getByRole('region', { name: /App mony/ });
const boton = (nombre: string | RegExp) => within(app()).getByRole('button', { name: nombre });

/* Rellena la solicitud y llega hasta el enlace compartido. */
async function pedir(u: ReturnType<typeof userEvent.setup>, monto = '20') {
  await u.click(boton('Pide tu Mony'));
  await u.type(screen.getByLabelText('¿A quién le deseas pedir?'), 'Helena');
  await u.type(screen.getByLabelText('¿Cuánto le vas a pedir?'), monto);
  await u.type(screen.getByLabelText(/Déjale un mensaje/), 'Gasolina de la quincena');
  await u.click(boton('Siguiente'));
}

describe('demo de Pidemony', () => {
  it('el stepper dice el paso con texto, no solo con color', async () => {
    render(<PidemonyDemo />);
    expect(within(app()).getByText('Paso 1 de 4')).toBeInTheDocument();
    const u = userEvent.setup();
    await pedir(u);
    expect(within(app()).getByText('Paso 2 de 4')).toBeInTheDocument();
  });

  it('no deja seguir con un monto fuera del rango, y dice por qué', async () => {
    render(<PidemonyDemo />);
    const u = userEvent.setup();
    await pedir(u, '3');
    expect(screen.getByLabelText('¿Cuánto le vas a pedir?')).toHaveAttribute('aria-invalid', 'true');
    expect(within(app()).getByText(/tiene que estar entre \$5 y \$2,000/)).toBeInTheDocument();
    expect(within(app()).queryByText('Confirmar tu solicitud')).toBeNull();
  });

  it('recorre la petición: confirmar, aceptar términos y compartir el enlace', async () => {
    render(<PidemonyDemo />);
    const u = userEvent.setup();
    await pedir(u);
    expect(within(app()).getByText('Solicitud de: $20.00')).toBeInTheDocument();
    await u.click(boton('Siguiente'));
    // sin aceptar, «Siguiente» no avanza
    expect(boton('Siguiente')).toHaveAttribute('aria-disabled', 'true');
    await u.click(boton('No acepto'));
    expect(within(app()).getByText(/Sin aceptar los términos/)).toBeInTheDocument();
    await u.click(boton('Acepto'));
    await u.click(boton('Siguiente'));
    expect(within(app()).getByText('¡Solicitud creada!')).toBeInTheDocument();
    expect(app().textContent).toMatch(/Helena, te he solicitado un “Pide Mony” por \$20\.00\. Concepto de: Gasolina de la quincena\./);
  });

  it('quien paga ve quién le pide y cuánto, y la tarjeta no se puede editar', async () => {
    render(<PidemonyDemo />);
    const u = userEvent.setup();
    await pedir(u, '200');
    await u.click(boton('Siguiente'));
    await u.click(boton('Acepto'));
    await u.click(boton('Siguiente'));
    await u.click(boton(/Abrir el enlace como Helena/));
    const web = screen.getByRole('region', { name: /Página de pago/ });
    expect(within(web).getByRole('heading', { name: '¡Hola, Helena!' })).toBeInTheDocument();
    expect(within(web).queryAllByRole('textbox')).toHaveLength(0);
    await u.click(within(web).getByRole('button', { name: 'Pagar $200.00' }));
    expect(within(web).getByRole('dialog', { name: '¡Pago realizado!' })).toBeInTheDocument();
    await u.click(within(web).getByRole('button', { name: 'Volver' }));
    // de vuelta en la app, la petición figura como pagada
    expect(within(app()).getByText('Pagada')).toBeInTheDocument();
  });

  it('el enlace vencido dice qué pasó y qué hacer', async () => {
    render(<PidemonyDemo />);
    const u = userEvent.setup();
    await u.click(screen.getByRole('button', { name: /En la web/ }));
    await u.click(screen.getByRole('button', { name: 'Ver el enlace vencido' }));
    const aviso = screen.getByRole('dialog', { name: '¡Lo sentimos!' });
    expect(aviso.textContent).toMatch(/ya se encuentra vencido/);
    expect(aviso.textContent).toMatch(/pongas en contacto con quien te lo suministró/);
  });
});
