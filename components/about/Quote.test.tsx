import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Quote from './Quote';

describe('Quote', () => {
  it('es una cita atribuida, no un párrafo suelto', () => {
    const { container } = render(<Quote />);
    expect(container.querySelector('blockquote')).not.toBeNull();
    /* <cite> es lo que convierte la firma en atribución para un lector de
       pantalla: sin él, «Jakob Nielsen» es texto decorativo. */
    expect(container.querySelector('cite')?.textContent).toBe('Jakob Nielsen');
    expect(screen.getByText('Lo que los usuarios dicen y lo que hacen es diferente')).toBeInTheDocument();
    expect(screen.getByText('Co-fundador de Nielsen Norman Group')).toBeInTheDocument();
  });
  /* Las comillas y el punto final los pone el CSS, porque en español el punto
     va detrás del cierre. Si el dato los trajera saldría «…diferente.».». */
  it('lo pintado no lleva comillas ni punto: los pone el CSS', () => {
    const { container } = render(<Quote />);
    const p = container.querySelector('blockquote p')!.textContent!;
    expect(p.startsWith('«') || p.startsWith('"')).toBe(false);
    expect(p.endsWith('.')).toBe(false);
  });
  it('en inglés usa la formulación documentada de Nielsen', () => {
    render(<Quote locale="en" />);
    expect(screen.getByText('Pay attention to what users do, not what they say')).toBeInTheDocument();
    expect(screen.getByText('Usability expert')).toBeInTheDocument();
  });
  /* El monograma ocupa el sitio del retrato y es decorativo: el nombre ya va
     escrito al lado, así que no debe anunciarse dos veces. */
  it('el monograma es decorativo', () => {
    const { container } = render(<Quote />);
    const mono = container.querySelector('[aria-hidden="true"]');
    expect(mono?.textContent).toBe('JN');
  });
});
