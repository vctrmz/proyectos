import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
vi.mock('motion/react', () => import('@/test/motion-mock'));
import DesignGallery from './DesignGallery';

const items = [
  { src: '/assets/shots/a.webp', alt: 'Pantalla A', caption: 'Leads con agenda', width: 1600, height: 1000 },
  { src: '/assets/shots/b.webp', alt: 'Pantalla B', caption: 'Tickets por prioridad', width: 1600, height: 1000 },
  { src: '/assets/shots/c.webp', alt: 'Pantalla C', caption: 'Login', width: 390, height: 844 },
];
const labels = { open: 'Ampliar', close: 'Cerrar', prev: 'Imagen anterior', next: 'Imagen siguiente', of: '{i} de {n}' };

describe('galería de diseño', () => {
  it('una celda por captura; el visor abre la elegida entera y con su pie', () => {
    render(<DesignGallery items={items} labels={labels} />);
    const celdas = screen.getAllByRole('button', { name: /^Ampliar:/ });
    expect(celdas).toHaveLength(3);
    fireEvent.click(celdas[1]);
    const visor = screen.getByRole('dialog', { name: 'Tickets por prioridad' });
    expect(visor).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Pantalla B' })).toBeInTheDocument();
    expect(screen.getByText('2 de 3')).toBeInTheDocument();
  });

  it('se recorre con flechas, da la vuelta y Esc devuelve el foco a la celda', () => {
    render(<DesignGallery items={items} labels={labels} />);
    const celdas = screen.getAllByRole('button', { name: /^Ampliar:/ });
    fireEvent.click(celdas[2]);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(screen.getByRole('dialog', { name: 'Leads con agenda' })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(screen.getByRole('dialog', { name: 'Login' })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(celdas[2]);
  });

  it('el dock salta a cualquier captura y marca la actual', () => {
    render(<DesignGallery items={items} labels={labels} />);
    fireEvent.click(screen.getAllByRole('button', { name: /^Ampliar:/ })[0]);
    fireEvent.click(screen.getByRole('button', { name: /^3 de 3: Login/ }));
    expect(screen.getByRole('dialog', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^3 de 3: Login/ })).toHaveAttribute('aria-current', 'true');
  });
});
