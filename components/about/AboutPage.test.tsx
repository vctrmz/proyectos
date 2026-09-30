import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
vi.mock('next/navigation', () => ({ usePathname: () => '/es/about', useSearchParams: () => new URLSearchParams('') }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('sigue la estructura: personal, formación, ikigai, empresas, visión, contacto', () => {
    render(<AboutPage />);
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2).toEqual(expect.arrayContaining(['Personal', 'Formación', 'Ikigai', 'Empresas', 'Herramientas']));
    expect(h2.indexOf('Herramientas')).toBeGreaterThan(h2.findIndex((x) => /Diseño sistemas/.test(x!)));
    expect(screen.getByText(/Universidad de Oriente/)).toBeInTheDocument();
    // la acreditación cuelga en el hero con los datos públicos, sin lugar de nacimiento
    expect(screen.getByText(/Málaga · en remoto/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Víctor Maza' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Diseño sistemas, no pantallas/ })).toBeInTheDocument();
    expect(screen.queryByText(/Lugares/)).toBeNull();
    expect(document.querySelector('#contacto')).not.toBeNull();
    /* Fuera del hero la información personal: ni dónde nació ni dónde ha vivido. */
    expect(screen.queryByText('Nací en Venezuela.')).toBeNull();
    expect(screen.queryByText('Jaén')).toBeNull();
    expect(screen.queryByText(/Antes, en/)).toBeNull();
    // Cumaná sigue en Formación, que es un dato académico
    expect(screen.getByText(/Cumaná, Venezuela/)).toBeInTheDocument();
    expect(screen.getByText(/Universidad de Oriente/).textContent).not.toMatch(/2006/);
    expect(screen.getByRole('button', { name: /ver el detalle/i })).toBeInTheDocument();
    const redes = screen.getByRole('list', { name: /redes/i });
    /* Dos redes: LinkedIn y Behance. GitHub se retiró de la fila de iconos. */
    const enlaces = within(redes).getAllByRole('link');
    expect(enlaces).toHaveLength(2);
    expect(enlaces.map((a) => a.textContent)).toEqual(['LinkedIn ↗', 'Behance ↗']);
    expect(within(redes).getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', 'https://linkedin.com/in/victor-maza47');
  });
  it('las pestañas de empresas son tabs accesibles', () => {
    render(<AboutPage />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tab', { name: /Atrinium/ })).toHaveAttribute('aria-selected', 'true');
  });
  it('el contacto de sobre mí ofrece también el CV', () => {
    const { container } = render(<AboutPage />);
    const contacto = container.querySelector('#contacto') as HTMLElement;
    expect(within(contacto).getByRole('link', { name: /Descargar CV/ })).toHaveAttribute('href', '/victor-maza-cv.pdf');
  });
});
