import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ConsentBanner from './ConsentBanner';
import { CONSENT_KEY } from '@/lib/consent';
import { LOADER_KEY } from '@/lib/loader';

vi.mock('next/link', () => ({ default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => <a href={href} {...rest}>{children}</a> }));

beforeEach(() => { vi.useFakeTimers(); document.head.innerHTML = ''; });
afterEach(() => vi.useRealTimers());

describe('ConsentBanner', () => {
  it('sin decisión y sin loader, aparece a los 2 s', () => {
    render(<ConsentBanner />);
    expect(screen.queryByRole('dialog')).toBeNull();
    act(() => { vi.advanceTimersByTime(2100); });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Más información' })).toHaveAttribute('href', '/privacidad');
  });
  it('si el loader ya se vio, aparece a los 400 ms', () => {
    sessionStorage.setItem(LOADER_KEY, '1');
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(450); });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('aceptar guarda granted y arranca la analítica', () => {
    sessionStorage.setItem(LOADER_KEY, '1');
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(450); });
    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(localStorage.getItem(CONSENT_KEY)).toBe('granted');
    expect(document.getElementById('ga-gtag-loader')).not.toBeNull();
    expect(document.getElementById('hs-script-loader')).not.toBeNull();
  });
  it('rechazar guarda denied y no pide nada', () => {
    sessionStorage.setItem(LOADER_KEY, '1');
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(450); });
    fireEvent.click(screen.getByRole('button', { name: 'Rechazar' }));
    expect(localStorage.getItem(CONSENT_KEY)).toBe('denied');
    expect(document.head.querySelectorAll('script')).toHaveLength(0);
  });
  it('con granted previo arranca sin banner', () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(2500); });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.getElementById('ga-gtag-loader')).not.toBeNull();
  });
  it('con denied previo no hay banner ni scripts', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(2500); });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.head.querySelectorAll('script')).toHaveLength(0);
  });
});
