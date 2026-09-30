import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '@/lib/content/site';
import { LOCALES } from '@/lib/i18n/config';
import CvLink from './CvLink';

describe('CvLink', () => {
  it('descarga el PDF español y anuncia formato y peso', () => {
    render(<CvLink />);
    const a = screen.getByRole('link', { name: /Descargar CV/ });
    expect(a).toHaveAttribute('href', '/victor-maza-cv.pdf');
    expect(a).toHaveAttribute('download', 'Victor_Maza_CV.pdf');
    expect(a.textContent).toMatch(new RegExp(`PDF, ${SITE.cv.es.kb} KB`));
  });
  /* Había un aviso «(PDF, Spanish)» porque el CV solo existía en español. Ya
     hay uno en inglés, así que el enlace lleva al suyo y el aviso desaparece:
     si volviera a faltar la traducción, este test lo delata. */
  it('en inglés descarga el CV en inglés y no avisa de idioma', () => {
    render(<CvLink locale="en" />);
    const a = screen.getByRole('link', { name: /Download CV/ });
    expect(a).toHaveAttribute('href', '/victor-maza-cv-en.pdf');
    expect(a).toHaveAttribute('download', 'Victor_Maza_CV_EN.pdf');
    expect(a.textContent).not.toMatch(/Spanish/);
  });
  it('el peso anunciado es el del archivo publicado, en los dos idiomas', () => {
    for (const l of LOCALES) {
      const cv = SITE.cv[l];
      const bytes = statSync(join(process.cwd(), 'public', cv.href)).size;
      expect(cv.kb, cv.href).toBe(Math.round(bytes / 1024));
    }
  });
});
