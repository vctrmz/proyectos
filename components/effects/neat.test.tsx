import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RollText, Words, Lines } from './neat';

describe('RollText', () => {
  it('apila dos copias del texto', () => {
    const { container } = render(<a href="#x"><RollText>Inicio</RollText></a>);
    const copies = container.querySelectorAll('.roll-inner > span');
    expect(copies).toHaveLength(2);
    expect(copies[0]).toHaveTextContent('Inicio');
    expect(copies[1]).toHaveTextContent('Inicio');
  });
});

describe('Words', () => {
  it('parte solo los nodos de texto y conserva los hijos con marcado', () => {
    const { container } = render(<Words>Producto <span className="bebas">en producción</span></Words>);
    const words = container.querySelectorAll('.w');
    expect(words).toHaveLength(2);
    expect(words[0]).toHaveTextContent('Producto');
    expect(words[1].querySelector('.bebas')).toHaveTextContent('en producción');
  });
});

describe('Lines', () => {
  it('pinta una máscara por línea', () => {
    render(<Lines lines={['Diseño sistemas,', 'no pantallas']} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Diseño sistemas,no pantallas');
    expect(document.querySelectorAll('[data-line-inner]')).toHaveLength(2);
  });
});
