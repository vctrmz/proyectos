import { describe, it, expect } from 'vitest';
import { card, thumb, WORKS, workRows, sectorRows, LOGOS, USE_CASES, BIO, SKILLS, COMP_DATA, TOOL_GROUPS } from './data';

describe('rutas de imagen', () => {
  it('convierte el nombre a jpg en h-card y h-thumb', () => {
    expect(card('01-datos-del-contacto.png')).toBe('/assets/h-card/01-datos-del-contacto.jpg');
    expect(thumb('assets/hermes/12-editor-variables.png')).toBe('/assets/h-thumb/12-editor-variables.jpg');
  });
});

describe('workRows', () => {
  it('numera los dos casos y añade Ayax y Figma como enlaces externos', () => {
    const rows = workRows();
    expect(WORKS).toHaveLength(2);
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => r.n)).toEqual(['01', '02', '03', '04']);
    expect(rows[0]).toMatchObject({ title: 'Módulo de suscripción de cliente', action: { kind: 'case', index: 0 } });
    expect(rows[2].action).toEqual({ kind: 'url', url: 'https://ayax-summit-olive.vercel.app/' });
    expect(rows[3].kicker).toBe('FIGMA · Archivo de trabajo');
    expect(rows[0].img).toBe('/assets/h-card/01-datos-del-contacto.jpg');
  });
});

describe('sectorRows', () => {
  it('solo pinta la cabecera de grupo en la primera fila de cada grupo', () => {
    expect(sectorRows().map((r) => r.head)).toEqual(['Atrinium', '', '', 'Proyectos anteriores', '']);
  });
  it('el CTA depende de si hay caso o web', () => {
    const rows = sectorRows();
    expect(rows[0]).toMatchObject({ cta: 'Ver el caso ↗', href: '#trabajo', external: false });
    expect(rows[1]).toMatchObject({ cta: 'Ver el producto ↗', href: 'https://flesip.com/', external: true });
    expect(rows[3].cta).toBeNull();
  });
});

describe('contenido', () => {
  it('tiene los volúmenes del original', () => {
    expect(LOGOS).toHaveLength(8);
    expect(USE_CASES).toHaveLength(2);
    expect(USE_CASES[0].steps).toHaveLength(4);
    expect(BIO).toHaveLength(9);
    expect(SKILLS).toHaveLength(16);
    expect(COMP_DATA.map((g) => g.items.length)).toEqual([6, 6, 5, 5]);
    expect(TOOL_GROUPS).toHaveLength(5);
  });
});
