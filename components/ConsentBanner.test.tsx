import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ConsentBanner from './ConsentBanner';
import { CONSENT_KEY } from '@/lib/consent';

vi.mock('next/link', () => ({ default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => <a href={href} {...rest}>{children}</a> }));

beforeEach(() => { vi.useFakeTimers(); document.head.innerHTML = ''; });
afterEach(() => vi.useRealTimers());

describe('ConsentBanner', () => {
  it('sin decisión aparece a los 400 ms con enlace a privacidad', () => {
    render(<ConsentBanner />);
    expect(screen.queryByRole('dialog')).toBeNull();
    act(() => { vi.advanceTimersByTime(450); });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Más información' })).toHaveAttribute('href', '/es/privacy');
    const texto = screen.getByRole('dialog').textContent ?? '';
    /* Lo que el aviso promete tiene que ser lo que el consentimiento enciende:
       si se añade una herramienta sin nombrarla aquí, este test cae. */
    for (const h of ['Google Analytics', 'Microsoft Clarity', 'Hotjar', 'Plerdy', 'HubSpot']) {
      expect(texto, h).toContain(h);
    }
  });
  it('aceptar guarda granted y arranca la analítica', () => {
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(450); });
    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(localStorage.getItem(CONSENT_KEY)).toMatch(/^granted\|\d+$/);
    expect(document.getElementById('ga-gtag-loader')).not.toBeNull();
  });
  it('rechazar guarda denied y no pide nada', () => {
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(450); });
    fireEvent.click(screen.getByRole('button', { name: 'Rechazar' }));
    expect(localStorage.getItem(CONSENT_KEY)).toMatch(/^denied\|\d+$/);
    expect(document.head.querySelectorAll('script')).toHaveLength(0);
  });
  it('con granted previo arranca sin banner', () => {
    localStorage.setItem(CONSENT_KEY, `granted|${Date.now()}`);
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(2500); });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.getElementById('ga-gtag-loader')).not.toBeNull();
  });
  /* Guía de cookies de la AEPD: aceptar y rechazar en la misma capa y con el
     mismo peso. Un botón relleno al lado de uno de borde empuja a aceptar. */
  it('aceptar y rechazar tienen el mismo aspecto', () => {
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(450); });
    const a = screen.getByRole('button', { name: 'Aceptar' });
    const r = screen.getByRole('button', { name: 'Rechazar' });
    expect(a.className).toBe(r.className);
  });
  it('con denied previo no hay banner ni scripts', () => {
    localStorage.setItem(CONSENT_KEY, `denied|${Date.now()}`);
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(2500); });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.head.querySelectorAll('script')).toHaveLength(0);
  });
});
