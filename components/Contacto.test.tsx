import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Contacto from './Contacto';

vi.mock('next/link', () => ({ default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => <a href={href} {...rest}>{children}</a> }));

describe('Contacto', () => {
  it('en la portada enlaza al perfil; en el perfil, a la portada', () => {
    const { unmount } = render(<Contacto variant="home" />);
    expect(screen.getByRole('link', { name: 'Perfil ↗' })).toHaveAttribute('href', '/perfil');
    unmount();
    render(<Contacto variant="perfil" />);
    expect(screen.getByRole('link', { name: 'Portada ↗' })).toHaveAttribute('href', '/');
  });
  it('copiar correo muestra la confirmación 1,8 s', async () => {
    vi.useFakeTimers();
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    render(<Contacto variant="home" />);
    const msg = screen.getByText('Correo copiado');
    expect(msg.style.opacity).toBe('0');
    await act(async () => { fireEvent.click(screen.getByTitle('Copiar correo')); await Promise.resolve(); await Promise.resolve(); });
    expect(msg.style.opacity).toBe('1');
    act(() => { vi.advanceTimersByTime(1850); });
    expect(msg.style.opacity).toBe('0');
    vi.useRealTimers();
  });
});
