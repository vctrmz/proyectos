import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(window.location.search), usePathname: () => '/' }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
import Catalog from './Catalog';

beforeEach(() => { window.history.replaceState(null, '', '/'); });

describe('Catalog', () => {
  it('muestra los 12 proyectos y Todo marcado por defecto', () => {
    render(<Catalog />);
    expect(screen.getAllByRole('listitem')).toHaveLength(12);
    expect(screen.getByRole('radio', { name: /^Todo/ })).toHaveAttribute('aria-checked', 'true');
  });
  it('filtra al pulsar un chip, anuncia el recuento y escribe ?f=', async () => {
    render(<Catalog />);
    await userEvent.click(screen.getByRole('radio', { name: /Banca/ }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('status')).toHaveTextContent('2 proyectos');
    expect(window.location.search).toBe('?f=banca');
    await userEvent.click(screen.getByRole('radio', { name: /^Todo/ }));
    expect(window.location.search).toBe('');
  });
  it('las cards con caso enlazan a /casos/<slug> y todas llevan su lámina, sin capturas', () => {
    render(<Catalog />);
    const items = screen.getAllByRole('listitem');
    expect(within(items[0]).getByRole('link', { name: /Ver caso/ })).toHaveAttribute('href', '/es/cases/ayax');
    const flesip = items.find((li) => li.textContent?.includes('Flesip'))!;
    expect(within(flesip).getByRole('link', { name: /Ver caso/ })).toHaveAttribute('href', '/es/cases/flesip');
    const taksio = items.find((li) => li.textContent?.includes('Taksio'))!;
    expect(within(taksio).queryByRole('img')).toBeNull();
    expect(within(taksio).getByTestId('lamina')).toBeInTheDocument();
    expect(screen.getAllByTestId('lamina')).toHaveLength(12);
  });
  it('lee ?f= de la URL al montar y cae a todo si es desconocido', () => {
    window.history.replaceState(null, '', '/?f=erp');
    const { unmount } = render(<Catalog />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    unmount();
    window.history.replaceState(null, '', '/?f=nada');
    render(<Catalog />);
    expect(screen.getAllByRole('listitem')).toHaveLength(12);
  });
  it('las flechas del teclado cambian el filtro dentro del radiogroup', async () => {
    render(<Catalog />);
    screen.getByRole('radio', { name: /^Todo/ }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: /Casos de estudio/ })).toHaveAttribute('aria-checked', 'true');
  });
});
