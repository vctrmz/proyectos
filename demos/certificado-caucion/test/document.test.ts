import { describe, expect, it } from 'vitest';
import { auditVariables, buildDocumentModel, collectVariables, initialBody, parseInline, sameDoc, templateToDoc } from '../src/domain/document';
import { TEMPLATES } from '../src/domain/templates';
import { findVariable, SAMPLE_POLICY } from '../src/domain/variables';

describe('mini-DSL de plantilla', () => {
  it('separa texto, negrita y variables', () => {
    expect(parseInline('A **{{ tomador.nombre }}** con CIF {{tomador.cif}}.')).toEqual([
      { kind: 'text', text: 'A ', bold: false },
      { kind: 'var', key: 'tomador.nombre', bold: true },
      { kind: 'text', text: ' con CIF ', bold: false },
      { kind: 'var', key: 'tomador.cif', bold: false },
      { kind: 'text', text: '.', bold: false },
    ]);
  });

  it('un párrafo por bloque separado por línea en blanco', () => {
    const doc = templateToDoc('Uno\n\nDos {{ poliza.suma }}');
    expect(doc.content).toHaveLength(2);
    expect(doc.content?.[1].content?.[1]).toEqual({ type: 'variable', attrs: { key: 'poliza.suma' } });
  });
});

describe('plantillas', () => {
  it('son las cuatro del ticket, cada una en ES y EN', () => {
    expect(TEMPLATES.map((t) => t.id)).toEqual(['abogacia', 'privado', 'almacenamiento', 'publico-tasas']);
    for (const t of TEMPLATES) for (const l of ['es', 'en'] as const) expect(t.content[l].body.length).toBeGreaterThan(200);
  });

  it('solo usan variables del catálogo, y las mismas en ES y EN', () => {
    for (const t of TEMPLATES) {
      const es = collectVariables(initialBody(t.id, 'es'));
      const en = collectVariables(initialBody(t.id, 'en'));
      expect(es.filter((k) => !findVariable(k)), t.id).toEqual([]);
      expect(new Set(en), t.id).toEqual(new Set(es));
    }
  });
});

describe('document_model', () => {
  it('solo el cuerpo es editable y trae contenido', () => {
    const m = buildDocumentModel({ template: 'privado', locale: 'es', body: initialBody('privado', 'es'), data: SAMPLE_POLICY });
    expect(m.regions.filter((r) => r.editable).map((r) => r.id)).toEqual(['body']);
    expect(m.regions.filter((r) => r.content).map((r) => r.id)).toEqual(['body']);
    expect(m).toMatchObject({ product: 'caucion', step: 'CERTIFICADO', modified: false });
  });

  it('incluye las variables de las regiones fijas', () => {
    const m = buildDocumentModel({ template: 'privado', locale: 'es', body: initialBody('privado', 'es'), data: SAMPLE_POLICY });
    expect(m.variables.used).toEqual(expect.arrayContaining(['certificado.numero', 'certificado.fecha', 'tomador.nombre']));
  });

  it('detecta datos que faltan en la póliza', () => {
    const body = initialBody('almacenamiento', 'es');
    expect(auditVariables(collectVariables(body), SAMPLE_POLICY, 'es').missing).toEqual(['riesgo.subestacion']);
    const filled = { ...SAMPLE_POLICY, 'riesgo.subestacion': 'Antequera 220 kV' };
    expect(auditVariables(collectVariables(body), filled, 'es').missing).toEqual([]);
  });

  it('marca como modificado un cuerpo distinto de la plantilla', () => {
    const body = initialBody('abogacia', 'en');
    const edited = structuredClone(body);
    edited.content![0].content!.push({ type: 'text', text: ' Extra.' });
    expect(sameDoc(body, initialBody('abogacia', 'en'))).toBe(true);
    expect(buildDocumentModel({ template: 'abogacia', locale: 'en', body: edited, data: SAMPLE_POLICY }).modified).toBe(true);
  });
});
