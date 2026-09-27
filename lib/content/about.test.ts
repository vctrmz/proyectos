import { describe, it, expect } from 'vitest';
import { ABOUT } from './about';

describe('sobre mí', () => {
  it('ciudades: Málaga actual, Venezuela y España', () => {
    expect(ABOUT.cities.find((c) => c.current)?.name).toBe('Málaga');
    expect(ABOUT.cities.filter((c) => c.country === 'VE').map((c) => c.name)).toEqual(['Cumaná', 'Caracas', 'Zulia']);
    expect(ABOUT.cities.filter((c) => c.country === 'ES').map((c) => c.name)).toEqual(['Jaén', 'Madrid', 'Lleida', 'Barcelona', 'Málaga']);
  });
  it('no inventa años: solo Málaga y la formación tienen fecha', () => {
    expect(ABOUT.cities.filter((c) => c.years).map((c) => c.name)).toEqual(['Málaga']);
    expect(ABOUT.education[0]).toMatchObject({ school: 'Universidad de Oriente', place: 'Cumaná, Venezuela', years: '2017' });
  });
  it('competencias recortadas y herramientas de producto', () => {
    expect(ABOUT.skills.length).toBeLessThanOrEqual(10);
    const all = ABOUT.toolGroups.flatMap((g) => g.items);
    expect(ABOUT.toolGroups.length).toBeGreaterThanOrEqual(4);
    expect(all).not.toContain('Canva');
    expect(all.some((t) => /^Figma/.test(t))).toBe(true);
  });
  it('el bloque de lugares no tiene fotos todavía', () => {
    expect(ABOUT.places).toEqual([]);
  });
});
