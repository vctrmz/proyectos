import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PROJECTS } from '../lib/content/projects';
import { CASES } from '../lib/content/cases';
import { getCaseIn } from '../lib/content/en';

const root = process.cwd();
const manifestPath = join(root, 'public/assets/shots/manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
const used = new Set<string>();
for (const p of PROJECTS) if (p.image) used.add(p.image.src);
for (const c of CASES) { used.add(c.hero.src); c.design.forEach((s) => used.add(s.src)); c.decisions.forEach((d) => { if (d.figure && 'shot' in d.figure) used.add(d.figure.shot.src); }); }

/* Las capturas de HERMES no enseñan lo que dice su nombre: el 2026-10-14 se
   revisaron una a una y muchas estaban cruzadas (12-editor-variables es
   «Preparar producto», 13-historial-comentarios es el selector de moneda…).
   No se renombran porque el script de imágenes las regeneraría desde la
   fuente con el nombre de siempre. En su lugar, esta tabla dice qué enseña
   de verdad cada archivo, y el pie o el alt de quien la use tiene que
   nombrarlo. */
const CONTENIDO: Record<string, RegExp> = {
  '01-contratos-revision': /contacto|contact/i,
  '01-datos-del-contacto': /contacto|cualificaci|contact|qualif/i,
  '02-contratos-firmados': /agenda|reuni|meeting/i,
  '02-notas-y-comite': /comit/i,
  '03-delivery-documents': /participantes|participants/i,
  '03-metodo-de-pago': /pago|payment/i,
  '04-detalle-documento': /agenda|reserv|book/i,
  '04-preparar-producto': /producto|product/i,
  '05-contratos': /contrato|contract/i,
  '05-presupuesto-versiones': /reuni|agenda|meeting/i,
  '06-agenda-participantes': /participantes|participants/i,
  '06-preparar-producto': /revisi|transcrip|videollamada|review|call/i,
  '07-seleccionar-moneda': /revisi|reuni|review|meeting/i,
  '08-planes-servicios': /contrato|contract/i,
  '09-metodo-pago': /delivery|documentos|documents/i,
  '10-logs-firmantes': /contrato|firma|documento|contract|sign|document/i,
  '11-resumen-comercial': /documento|presupuesto|versi|document|quote|budget/i,
  '12-editor-variables': /producto|product/i,
  '13-historial-comentarios': /moneda|currency/i,
  '14-document-model': /planes|plans/i,
  '15-notas-comite': /pago|payment/i,
  '16-datos-contacto': /firma|documento|sign|document/i,
  '17-agenda-reuniones': /comercial|sales/i,
  '18-agregar-participantes': /editor|variables|documento|propuesta|document|proposal/i,
  '19-reservar-agenda': /comentarios|versiones|historial|comments|versions|history/i,
  '20-drawer-contrato': /modelo del documento|document model|contrato|contract/i,
  '21-notas-alternativa': /comit|notas|notes/i,
};

describe('capturas', () => {
  it('cada captura de HERMES se describe por lo que enseña de verdad', () => {
    const usos: { src: string; texto: string; donde: string }[] = [];
    const nota = (src: string, texto: string, donde: string) => usos.push({ src, texto, donde });
    for (const p of PROJECTS) if (p.image) nota(p.image.src, p.image.alt, `catálogo ${p.slug}`);
    for (const c of [...CASES, getCaseIn('en', 'hermes')!]) {
      nota(c.hero.src, `${c.hero.alt} ${c.hero.caption}`, `${c.slug} hero`);
      c.design.forEach((d) => nota(d.src, `${d.alt} ${d.caption}`, `${c.slug} diseño`));
      c.decisions.forEach((d) => { if (d.figure && 'shot' in d.figure) nota(d.figure.shot.src, `${d.figure.shot.alt} ${d.figure.shot.caption}`, `${c.slug} decisión`); });
    }
    let revisadas = 0;
    for (const u of usos) {
      const name = u.src.replace('/assets/shots/', '').replace('.webp', '');
      const re = CONTENIDO[name];
      if (!/^\d\d-/.test(name)) continue;
      expect(re, `${name}: falta en la tabla CONTENIDO`).toBeDefined();
      expect(u.texto, `${u.donde} usa ${name}`).toMatch(re);
      revisadas++;
    }
    expect(revisadas).toBeGreaterThan(20);
  });
  it('cada captura usada existe y está en el manifest con dimensiones', () => {
    expect(used.size).toBeGreaterThan(10);
    for (const src of used) {
      const name = src.replace('/assets/shots/', '').replace('.webp', '');
      expect(existsSync(join(root, 'public', src)), src).toBe(true);
      expect(manifest[name]?.width, src).toBeGreaterThan(0);
      expect(manifest[name]?.width, src).toBeLessThanOrEqual(1600);
    }
  });
});
