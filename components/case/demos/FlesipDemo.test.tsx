import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
vi.mock('motion/react', () => import('@/test/motion-mock'));
import FlesipDemo from './FlesipDemo';

afterEach(() => { vi.useRealTimers(); });

describe('demo de la factura rápida', () => {
  it('del importe a procesada: emite, imprime pendiente, el pasajero completa y llega a Ingresos', () => {
    vi.useFakeTimers();
    render(<FlesipDemo />);
    expect(screen.getByText('24,50 €')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Emitir factura' }));
    expect(screen.getByRole('heading', { name: 'Factura emitida' })).toBeInTheDocument();
    // hasta que no sale el ticket, el pasajero no tiene QR que escanear
    const escanear = screen.getByRole('button', { name: /pasajero escanea/ });
    expect(escanear).toBeDisabled();
    act(() => { vi.advanceTimersByTime(3400); });
    expect(screen.getByText('Ticket impreso')).toBeInTheDocument();
    expect(screen.getByText('ESTADO: PENDIENTE')).toBeInTheDocument();
    fireEvent.click(escanear);
    fireEvent.change(screen.getByLabelText('Nombre o razón social'), { target: { value: 'Laura Gómez' } });
    fireEvent.change(screen.getByLabelText('NIF / CIF'), { target: { value: '12345678Z' } });
    fireEvent.click(screen.getByRole('button', { name: 'Completar factura' }));
    expect(screen.getByRole('heading', { name: 'Ingresos' })).toBeInTheDocument();
    expect(screen.getByText('Laura Gómez')).toBeInTheDocument();
  });

  it('el teclado escribe el importe y el IVA del transporte es el 10 %', () => {
    render(<FlesipDemo />);
    fireEvent.click(screen.getByRole('button', { name: 'Borrar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Borrar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Borrar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Borrar' }));
    expect(screen.getByRole('button', { name: 'Emitir factura' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '00' }));
    expect(screen.getByText('11,00 €')).toBeInTheDocument();
    expect(screen.getByText(/base 10,00 €/)).toBeInTheDocument();
  });
});
