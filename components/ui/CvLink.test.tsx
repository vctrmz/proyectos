import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '@/lib/content/site';
import CvLink from './CvLink';

describe('CvLink', () => {
  it('descarga el PDF y anuncia formato y peso', () => {
    render(<CvLink />);
    const a = screen.getByRole('link', { name: /Descargar CV/ });
    expect(a).toHaveAttribute('href', '/victor-maza-cv.pdf');
    expect(a).toHaveAttribute('download', 'Victor_Maza_CV.pdf');
    expect(a.textContent).toMatch(new RegExp(`PDF, ${SITE.cv.kb} KB`));
  });
  it('en inglés avisa de que el CV está en español', () => {
    render(<CvLink locale="en" />);
    expect(screen.getByRole('link', { name: /Download CV/ }).textContent).toMatch(/Spanish/);
  });
  it('el peso anunciado es el del archivo publicado', () => {
    const bytes = statSync(join(process.cwd(), 'public', SITE.cv.href)).size;
    expect(SITE.cv.kb).toBe(Math.round(bytes / 1024));
  });
});
