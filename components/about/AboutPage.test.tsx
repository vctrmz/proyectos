import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
vi.mock('next/navigation', () => ({ usePathname: () => '/sobre-mi', useSearchParams: () => new URLSearchParams('') }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('sigue la estructura: personal, formación, ikigai, empresas, visión, contacto', () => {
    render(<AboutPage />);
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2).toEqual(expect.arrayContaining(['Personal', 'Formación', 'Ikigai', 'Empresas']));
    expect(screen.getByText(/Universidad de Oriente/)).toBeInTheDocument();
    expect(screen.getByText('Málaga')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Diseño sistemas, no pantallas/ })).toBeInTheDocument();
    expect(screen.queryByText(/Lugares/)).toBeNull();
    expect(document.querySelector('#contacto')).not.toBeNull();
    expect(screen.getByText('Nací en Venezuela.')).toBeInTheDocument();
    expect(screen.queryByText('Cumaná')).toBeNull();
    expect(screen.getByRole('button', { name: /ver el detalle/i })).toBeInTheDocument();
    const redes = screen.getByRole('list', { name: /redes/i });
    expect(within(redes).getAllByRole('link')).toHaveLength(3);
    expect(within(redes).getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', 'https://linkedin.com/in/victor-maza47');
  });
  it('las pestañas de empresas son tabs accesibles', () => {
    render(<AboutPage />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tab', { name: /Atrinium/ })).toHaveAttribute('aria-selected', 'true');
  });
});
