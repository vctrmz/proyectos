import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(''), usePathname: () => '/' }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
vi.mock('next/font/google', () => ({ Geist: () => ({ variable: 'geist' }) }));
import { ContactProvider } from './ContactDialog';
import ContactButton from './ContactButton';
import { SITE } from '@/lib/content/site';
import Closing from '@/components/home/Closing';
import AboutPage from '@/components/about/AboutPage';
import SiteFooter from '@/components/layout/SiteFooter';
import RootShell from '@/components/layout/RootShell';

/* jsdom tiene <dialog> pero no showModal() ni close(): se imitan con el
   atributo `open` y el evento `close`, que es lo que hace el navegador. */
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
});

const montar = () => render(<ContactProvider><ContactButton /></ContactProvider>);
const dialogo = (c: HTMLElement) => c.querySelector('dialog')!;

describe('modal de contacto', () => {
  it('«Contactar» abre el modal con las tres vías: copiar el correo, LinkedIn y el formulario', () => {
    const { container } = montar();
    expect(dialogo(container)).not.toHaveAttribute('open');
    fireEvent.click(screen.getByRole('button', { name: 'Contactar' }));
    const d = dialogo(container);
    expect(d).toHaveAttribute('open');
    expect(d).toHaveAccessibleName('Escríbeme');
    expect(within(d).getByRole('button', { name: 'Copiar mi correo' })).toBeInTheDocument();
    expect(within(d).getByRole('link', { name: /Escríbeme en LinkedIn/ })).toHaveAttribute('href', SITE.linkedin);
    expect(within(d).getByLabelText('Tu nombre')).toBeInTheDocument();
    expect(within(d).getByLabelText('Tu correo')).toBeInTheDocument();
    expect(within(d).getByRole('button', { name: 'Enviar mensaje' })).toBeInTheDocument();
    /* Primera capa de información junto al formulario, en el mínimo que pide
       el art. 11.2 de la LOPDGDD: quién, para qué y que hay derechos. */
    for (const x of ['Víctor Maza', 'solo para responderte', 'acceder', 'borrarlos']) expect(d.textContent, x).toContain(x);
    expect(within(d).getByRole('link', { name: 'política de privacidad' })).toBeInTheDocument();
  });

  it('se cierra con la X y con un clic en el velo, no al soltar fuera una selección', () => {
    const { container } = montar();
    const abrir = screen.getByRole('button', { name: 'Contactar' });
    fireEvent.click(abrir);
    fireEvent.click(within(dialogo(container)).getByRole('button', { name: /cerrar/i }));
    expect(dialogo(container)).not.toHaveAttribute('open');

    fireEvent.click(abrir);
    const d = dialogo(container);
    // empieza en un campo y suelta en el velo: el modal sigue abierto
    fireEvent.pointerDown(within(d).getByLabelText('Tu nombre'));
    fireEvent.click(d);
    expect(d).toHaveAttribute('open');
    // empieza y acaba en el velo: se cierra
    fireEvent.pointerDown(d);
    fireEvent.click(d);
    expect(d).not.toHaveAttribute('open');
  });

  /* El correo no se escribe en ninguna parte: ni a la vista, ni en un mailto,
     ni en los datos estructurados. Solo lo copia quien lo pide desde el modal.
     La política de privacidad sí lo lleva, porque la ley lo exige. */
  it('el correo no está escrito en la web', () => {
    const paginas = [
      renderToString(<RootShell locale="es"><p>x</p></RootShell>),
      renderToString(<Closing />),
      renderToString(<SiteFooter />),
      renderToString(<AboutPage />),
    ];
    for (const html of paginas) expect(html).not.toMatch(/vctrmz47/);
  });

  it('el formulario ya no está a la vista en la página', () => {
    const { unmount } = render(<Closing />);
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByRole('button', { name: 'Contactar' })).toHaveAttribute('aria-haspopup', 'dialog');
    unmount();
    render(<AboutPage />);
    const contacto = document.querySelector('#contacto') as HTMLElement;
    expect(within(contacto).queryByRole('textbox')).toBeNull();
    expect(within(contacto).getByRole('button', { name: 'Contactar' })).toBeInTheDocument();
  });
});
