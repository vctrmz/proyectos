import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(window.location.search), usePathname: () => '/' }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
import Catalog from './Catalog';

beforeEach(() => { window.history.replaceState(null, '', '/'); });

describe('Catalog', () => {
  it('muestra los 10 proyectos y Todo marcado por defecto', () => {
    render(<Catalog />);
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
    expect(screen.getByRole('radio', { name: /^Todo/ })).toHaveAttribute('aria-checked', 'true');
  });
  it('filtra al pulsar un chip, anuncia el recuento y escribe ?f=', async () => {
    render(<Catalog />);
    await userEvent.click(screen.getByRole('radio', { name: /Banca/ }));
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('1 proyecto');
    expect(window.location.search).toBe('?f=banca');
    await userEvent.click(screen.getByRole('radio', { name: /^Todo/ }));
    expect(window.location.search).toBe('');
  });
  it('las cards con caso enlazan a /casos/<slug>; las externas abren fuera; sin captura pintan un tile de marca', () => {
    render(<Catalog />);
    const items = screen.getAllByRole('listitem');
    expect(within(items[0]).getByRole('link', { name: /Ver caso/ })).toHaveAttribute('href', '/casos/hermes');
    const ayax = items.find((li) => li.textContent?.includes('Ayax'))!;
    expect(within(ayax).getByRole('link')).toHaveAttribute('target', '_blank');
    const merc = items.find((li) => li.textContent?.includes('Mercantil'))!;
    expect(within(merc).queryByRole('img')).toBeNull();
    expect(within(merc).getByTestId('brand-tile')).toBeInTheDocument();
  });
  it('lee ?f= de la URL al montar y cae a todo si es desconocido', () => {
    window.history.replaceState(null, '', '/?f=erp');
    const { unmount } = render(<Catalog />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    unmount();
    window.history.replaceState(null, '', '/?f=nada');
    render(<Catalog />);
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
  });
  it('las flechas del teclado cambian el filtro dentro del radiogroup', async () => {
    render(<Catalog />);
    screen.getByRole('radio', { name: /^Todo/ }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: /Casos de estudio/ })).toHaveAttribute('aria-checked', 'true');
  });
});
