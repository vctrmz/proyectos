import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '@/lib/content/site';
import { LOCALES } from '@/lib/i18n/config';
import CvDownload from './CvDownload';

describe('CvDownload', () => {
  it('ofrece los dos idiomas, con el de la página primero', () => {
    render(<CvDownload />);
    const enlaces = within(screen.getByRole('list')).getAllByRole('link');
    expect(enlaces).toHaveLength(2);
    expect(enlaces[0]).toHaveAttribute('href', '/victor-maza-cv.pdf');
    expect(enlaces[0]).toHaveAttribute('download', 'Victor_Maza_CV.pdf');
    expect(enlaces[1]).toHaveAttribute('href', '/victor-maza-cv-en.pdf');
  });
  it('en inglés el orden se invierte', () => {
    render(<CvDownload locale="en" />);
    const enlaces = within(screen.getByRole('list')).getAllByRole('link');
    expect(enlaces[0]).toHaveAttribute('href', '/victor-maza-cv-en.pdf');
    expect(enlaces[0]).toHaveAttribute('download', 'Victor_Maza_CV_EN.pdf');
  });
  /* La bandera es decorativa, así que el nombre del idioma tiene que estar en
     el texto y en la etiqueta: una bandera sola no dice «español» a nadie que
     no la reconozca, ni a un lector de pantalla. */
  it('cada opción dice su idioma en texto, no solo en la bandera', () => {
    render(<CvDownload />);
    expect(screen.getByRole('link', { name: /Descargar el CV en Español \(PDF, \d+ KB\)/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Descargar el CV en English \(PDF, \d+ KB\)/ })).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
  });
  it('el desplegable no necesita JavaScript: es un details cerrado', () => {
    const { container } = render(<CvDownload />);
    const d = container.querySelector('details')!;
    expect(d).not.toBeNull();
    expect(d.open).toBe(false);
    expect(within(d).getByText('Descargar CV')).toBeInTheDocument();
  });
  it('el peso anunciado es el del archivo publicado, en los dos idiomas', () => {
    for (const l of LOCALES) {
      const cv = SITE.cv[l];
      const bytes = statSync(join(process.cwd(), 'public', cv.href)).size;
      expect(cv.kb, cv.href).toBe(Math.round(bytes / 1024));
    }
  });
});
