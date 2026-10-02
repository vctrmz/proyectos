import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
vi.mock('next/navigation', () => ({ usePathname: () => '/es/about', useSearchParams: () => new URLSearchParams('') }));
vi.mock('motion/react', () => import('@/test/motion-mock'));
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('sigue la estructura: personal, formación, ikigai, empresas y visión', () => {
    render(<AboutPage />);
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2).toEqual(expect.arrayContaining(['Personal', 'Formación', 'Ikigai', 'Empresas', 'Herramientas']));
    expect(h2.indexOf('Herramientas')).toBeGreaterThan(h2.findIndex((x) => /Diseño sistemas/.test(x!)));
    expect(screen.getByText(/Universidad de Oriente/)).toBeInTheDocument();
    /* La acreditación cuelga en el hero con los datos públicos. Sin ciudad:
       el posicionamiento es remoto, así que ni nacimiento ni provincia. */
    expect(screen.getByText('En remoto')).toBeInTheDocument();
    /* La tarjeta se queda con el oficio y el modo de trabajo. Ni ciudad ni
       sector: «Insurtech» sigue en el rol del pie y la línea de tiempo sigue
       diciendo dónde estaba cada empresa —Caracas, Panamá, Málaga—, que es un
       dato del trabajo y lo que hace que el recorrido se lea internacional. */
    const datos = screen.getByText('B2B SaaS').closest('dl')!;
    expect(datos.textContent).not.toMatch(/Málaga/);
    expect(datos.textContent).not.toMatch(/Insurtech/);
    expect(screen.getByRole('img', { name: 'Víctor Maza' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Diseño sistemas, no pantallas/ })).toBeInTheDocument();
    expect(screen.queryByText(/Lugares/)).toBeNull();
    /* El contacto no se repite al final: el pie, justo debajo, ya lo trae. */
    expect(document.querySelector('#contacto')).toBeNull();
    /* Fuera del hero la información personal: ni dónde nació ni dónde ha vivido. */
    expect(screen.queryByText('Nací en Venezuela.')).toBeNull();
    expect(screen.queryByText('Jaén')).toBeNull();
    expect(screen.queryByText(/Antes, en/)).toBeNull();
    // Cumaná sigue en Formación, que es un dato académico
    expect(screen.getByText(/Cumaná, Venezuela/)).toBeInTheDocument();
    expect(screen.getByText(/Universidad de Oriente/).textContent).not.toMatch(/2006/);
    expect(screen.getByRole('button', { name: /mi forma de trabajar/i })).toBeInTheDocument();
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
  /* El CV se descarga desde el hero, junto a la tarjeta de identidad, y con
     selector de idioma: es el único sitio de la web donde aparece. */
  it('el hero ofrece el CV en los dos idiomas, y es el único sitio donde aparece', () => {
    const { container } = render(<AboutPage />);
    const intro = container.querySelector('section') as HTMLElement;
    expect(within(intro).getByText('Descargar CV')).toBeInTheDocument();
    expect(within(intro).getByRole('link', { name: /Descargar el CV en Español/ })).toHaveAttribute('href', '/victor-maza-cv.pdf');
    expect(within(intro).getByRole('link', { name: /Descargar el CV en English/ })).toHaveAttribute('href', '/victor-maza-cv-en.pdf');
    expect(within(container).getAllByText('Descargar CV')).toHaveLength(1);
  });
});
