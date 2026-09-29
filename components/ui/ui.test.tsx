import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';
import Chip from './Chip';
import TwoToneHeading from './TwoToneHeading';
import Metric from './Metric';
import CodeDemo from './CodeDemo';

describe('Button', () => {
  it('es un enlace con href y un botón sin él', () => {
    render(<><Button href="/x">Ir</Button><Button onClick={() => {}}>Hacer</Button></>);
    expect(screen.getByRole('link', { name: 'Ir' })).toHaveAttribute('href', '/x');
    expect(screen.getByRole('button', { name: 'Hacer' })).toHaveAttribute('type', 'button');
  });
  it('los externos abren en pestaña nueva con noopener y marcan ↗', () => {
    render(<Button href="https://x.y" external>Ver</Button>);
    const a = screen.getByRole('link', { name: /Ver/ });
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener');
    expect(a.textContent).toContain('↗');
  });
});

describe('Chip', () => {
  it('es un radio con estado y contador', async () => {
    const onSelect = vi.fn();
    render(<Chip checked={false} count={4} onSelect={onSelect}>Insurtech</Chip>);
    const r = screen.getByRole('radio', { name: /Insurtech/ });
    expect(r).toHaveAttribute('aria-checked', 'false');
    expect(r.textContent).toContain('4');
    await userEvent.click(r);
    expect(onSelect).toHaveBeenCalledOnce();
  });
});

describe('TwoToneHeading', () => {
  it('pinta dos líneas en el nivel pedido', () => {
    render(<TwoToneHeading as="h1" lines={['Uno', 'Dos']} />);
    const h = screen.getByRole('heading', { level: 1 });
    expect(h).toHaveClass('two-tone');
    expect(h.children).toHaveLength(3); // span, br, span
    expect(h.textContent).toContain('Uno');
    expect(h.textContent).toContain('Dos');
  });
});

describe('Metric', () => {
  it('muestra cifra, etiqueta y significado', () => {
    render(<Metric value="165" label="pantallas" meaning="una por flujo" />);
    expect(screen.getByText('165')).toBeInTheDocument();
    expect(screen.getByText('una por flujo')).toBeInTheDocument();
  });
});

describe('CodeDemo', () => {
  it('etiqueta el código como ejemplo ilustrativo', () => {
    render(<CodeDemo title="Demo" lang="json" code={'{ "a": 1 }'} />);
    expect(screen.getByText(/ejemplo ilustrativo/i)).toBeInTheDocument();
    expect(screen.getByText('{ "a": 1 }')).toBeInTheDocument();
  });
  it('marca el código real del repositorio y enlaza al archivo', () => {
    render(<CodeDemo title="Tokens" lang="css" code=":root {}" source="repo" href="https://github.com/vctrmz/proyectos/blob/main/app/globals.css" />);
    expect(screen.getByText(/extracto del repositorio/)).toBeInTheDocument();
    expect(screen.queryByText(/ilustrativo/)).toBeNull();
    expect(screen.getByRole('link', { name: /Ver el archivo en GitHub/ })).toHaveAttribute('target', '_blank');
  });
  it('en inglés la etiqueta va en inglés', () => {
    render(<CodeDemo title="Demo" lang="json" code="{}" locale="en" />);
    expect(screen.getByText(/illustrative example/)).toBeInTheDocument();
  });
});
