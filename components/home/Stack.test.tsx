import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Stack from './Stack';

describe('Stack', () => {
  it('enseña dos grupos con nombre y enlaza al código de esta web', () => {
    render(<Stack />);
    expect(screen.getByRole('heading', { level: 2, name: 'Stack' })).toBeInTheDocument();
    const design = screen.getByRole('list', { name: 'Diseño y sistemas' });
    const code = screen.getByRole('list', { name: 'Código y entrega' });
    expect(within(design).getByText('Design tokens')).toBeInTheDocument();
    for (const t of ['React', 'Next.js', 'TypeScript']) expect(within(code).getByText(t)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /código en GitHub/ })).toHaveAttribute('href', 'https://github.com/vctrmz/proyectos');
  });
  it('en inglés traduce los grupos y el enlace', () => {
    render(<Stack locale="en" />);
    expect(screen.getByRole('list', { name: 'Design and systems' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Code and delivery' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /code on GitHub/ })).toBeInTheDocument();
  });
  it('no presume de herramientas sin evidencia', () => {
    const { container } = render(<Stack />);
    for (const bad of ['Style Dictionary', 'Storybook']) expect(container.textContent).not.toContain(bad);
  });
});
