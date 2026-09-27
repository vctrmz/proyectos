import { describe, it, expect } from 'vitest';
import { PROJECTS, FILTERS, parseFilter, filterProjects, filterCounts, projectTags } from './projects';

describe('catálogo', () => {
  it('tiene 10 piezas con slug único y los cinco proyectos completos delante', () => {
    expect(PROJECTS).toHaveLength(10);
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(10);
    expect(PROJECTS.slice(0, 5).map((p) => p.slug)).toEqual(['ayax', 'hermes', 'flesip', 'montsaint', 'mercantil']);
  });
  it('cada pieza tiene resumen, color de marca y o bien imagen o bien logo propio', () => {
    for (const p of PROJECTS) {
      /* El logo es opcional: sin él, la miniatura usa el monograma de la marca
         en lugar de pedir prestado el logo de otro producto. */
      if (p.logo) expect(p.logo, p.slug).toMatch(/^\/assets\/logos\//);
      expect(p.summary.length, p.slug).toBeGreaterThan(30);
      expect(p.brand, p.slug).toMatch(/^#[0-9a-f]{6}$/i);
      if (p.image) expect(p.image.alt.length, p.slug).toBeGreaterThan(10);
    }
  });
  it('los nueve casos tienen hasCase y el resto enlaza o no', () => {
    expect(PROJECTS.filter((p) => p.hasCase).map((p) => p.slug)).toEqual(['ayax', 'hermes', 'flesip', 'montsaint', 'mercantil', 'suscripcion', 'editor-propuesta', 'vista-360', 'design-system']);
    expect(PROJECTS.find((p) => p.slug === 'flesip')?.url).toBe('https://flesip.com/');
    expect(PROJECTS.find((p) => p.slug === 'mercantil')?.url).toBeUndefined();
    expect(PROJECTS.find((p) => p.slug === 'taksio')?.hasCase).toBe(false);
  });
});

describe('filtros', () => {
  it('parseFilter devuelve todo para valores desconocidos o vacíos', () => {
    expect(parseFilter(null)).toBe('todo');
    expect(parseFilter('')).toBe('todo');
    expect(parseFilter('nada')).toBe('todo');
    expect(parseFilter('insurtech')).toBe('insurtech');
  });
  it('cuenta lo que enseña', () => {
    const c = filterCounts();
    expect(c.todo).toBe(10);
    expect(c.casos).toBe(9);
    expect(c.produccion).toBe(10);
    expect(c.insurtech).toBe(5);
    expect(c['design-system']).toBe(1);
    expect(c.erp + c.banca + c.ecommerce + c.transporte).toBe(4);
    for (const f of FILTERS) expect(filterProjects(f.id)).toHaveLength(c[f.id]);
  });
  it('mantiene el orden del catálogo al filtrar', () => {
    expect(filterProjects('insurtech').map((p) => p.slug)).toEqual(['ayax', 'hermes', 'suscripcion', 'editor-propuesta', 'vista-360']);
  });
  it('las etiquetas de la card salen del tipo, el estado y el sector', () => {
    expect(projectTags(PROJECTS[0])).toEqual(['Caso de estudio', 'En producción', 'Insurtech']);
    expect(projectTags(PROJECTS.find((p) => p.slug === 'montsaint')!)).toEqual(['Caso de estudio', 'En producción', 'E-commerce']);
    expect(projectTags(PROJECTS.find((p) => p.slug === 'taksio')!)).toEqual(['Producto', 'En producción', 'Transporte']);
  });
});
