import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CasoModal from './CasoModal';
import { WORKS } from '@/lib/data';

describe('CasoModal', () => {
  it('cerrado no pinta nada', () => {
    const { container } = render(<CasoModal index={null} onClose={() => {}} onOpen={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
  it('abierto muestra el caso, sus capturas y el siguiente', () => {
    const onOpen = vi.fn();
    render(<CasoModal index={0} onClose={() => {}} onOpen={onOpen} />);
    expect(screen.getByRole('heading', { level: 3, name: WORKS[0].title })).toBeInTheDocument();
    const thumbs = screen.getAllByRole('button', { name: /^Captura \d de 6/ });
    expect(thumbs).toHaveLength(6);
    expect(thumbs[0]).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(thumbs[2]);
    expect(thumbs[2]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(WORKS[0].gallery[2][1])).toBeInTheDocument();
    fireEvent.click(screen.getByText(WORKS[1].title + ' →'));
    expect(onOpen).toHaveBeenCalledWith(1);
  });
  it('el último caso enlaza al primero', () => {
    const onOpen = vi.fn();
    render(<CasoModal index={1} onClose={() => {}} onOpen={onOpen} />);
    fireEvent.click(screen.getByText(WORKS[0].title + ' →'));
    expect(onOpen).toHaveBeenCalledWith(0);
  });
  it('el aspa cierra', () => {
    const onClose = vi.fn();
    render(<CasoModal index={0} onClose={onClose} onOpen={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalled();
  });
});
