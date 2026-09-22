import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StarfieldButton from './StarfieldButton';

describe('StarfieldButton', () => {
  it('el enlace real es el que navega y recibe el foco', () => {
    render(<StarfieldButton label="Contactar" href="/#contacto" />);
    const a = screen.getByRole('link', { name: 'Contactar' });
    expect(a).toHaveAttribute('href', '/#contacto');
  });
  it('el efecto es decorativo: oculto para lectores y sin capturar el puntero', () => {
    const { container } = render(<StarfieldButton label="Contactar" href="/#contacto" />);
    const el = container.querySelector('starfield-button');
    if (el) {
      expect(el.closest('[aria-hidden="true"]')).not.toBeNull();
      expect(el.getAttribute('label')).toBe('Contactar');
      expect(el.getAttribute('fill')).toBe('#121317');
      expect(el.getAttribute('accent')).toBe('#8bde5f');
    }
    expect(container.querySelectorAll('a')).toHaveLength(1);
  });
  it('los externos abren en pestaña nueva con noopener', () => {
    render(<StarfieldButton label="LinkedIn" href="https://x.y" external />);
    const a = screen.getByRole('link', { name: /LinkedIn/ });
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener');
  });
});
