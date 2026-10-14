import type { JSONContent } from '@tiptap/react';
import { TENANT } from './tenant';
import { findTemplate } from './templates';
import type { DocumentModel, Locale, PolicyData, Region, RegionId, TemplateId } from './types';
import { findVariable, resolveValue } from './variables';

/* El puente entre la plantilla que escribe Legal y el JSON que guarda backend.
   La plantilla es texto con `**negrita**` y `{{ variable }}`; el editor y el
   document_model trabajan con el JSON de TipTap. Todo es puro y se prueba sin
   montar el editor. */

const TOKEN = /\*\*|\{\{\s*([\w.]+)\s*\}\}/g;

export type InlinePart = { kind: 'text'; text: string; bold: boolean } | { kind: 'var'; key: string; bold: boolean };

/** Parte una línea del mini-DSL en trozos de texto y variables. */
export function parseInline(line: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let bold = false;
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) parts.push({ kind: 'text', text: line.slice(last, at), bold });
    if (m[0] === '**') bold = !bold;
    else parts.push({ kind: 'var', key: m[1], bold });
    last = at + m[0].length;
  }
  if (last < line.length) parts.push({ kind: 'text', text: line.slice(last), bold });
  return parts;
}

const boldMark = (bold: boolean) => (bold ? { marks: [{ type: 'bold' }] } : {});

/** Mini-DSL → documento TipTap: un párrafo por bloque separado por línea en blanco. */
export function templateToDoc(body: string): JSONContent {
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
  return {
    type: 'doc',
    content: paragraphs.map((p) => ({
      type: 'paragraph',
      content: parseInline(p).map((part) =>
        part.kind === 'text'
          ? { type: 'text', text: part.text, ...boldMark(part.bold) }
          : { type: 'variable', attrs: { key: part.key }, ...boldMark(part.bold) },
      ),
    })),
  };
}

export const initialBody = (template: TemplateId, locale: Locale) => templateToDoc(findTemplate(template).content[locale].body);

/** Claves de variable usadas en un documento, sin repetir y en orden de aparición. */
export function collectVariables(doc: JSONContent): string[] {
  const seen = new Set<string>();
  const walk = (node: JSONContent) => {
    if (node.type === 'variable' && typeof node.attrs?.key === 'string') seen.add(node.attrs.key);
    node.content?.forEach(walk);
  };
  walk(doc);
  return [...seen];
}

/** Estado de las variables frente a los datos de la póliza. */
export function auditVariables(keys: string[], data: PolicyData, locale: Locale) {
  return {
    used: keys,
    unknown: keys.filter((k) => !findVariable(k)),
    missing: keys.filter((k) => findVariable(k) && resolveValue(data, k, locale) === undefined),
  };
}

/* Comparación estructural para saber si el cuerpo se ha tocado respecto a la
   plantilla. Se ignoran atributos nulos que TipTap añade al normalizar. */
const normalize = (node: JSONContent): unknown => ({
  t: node.type,
  x: node.text,
  k: node.type === 'variable' ? node.attrs?.key : undefined,
  a: node.attrs?.textAlign && node.attrs.textAlign !== 'left' ? node.attrs.textAlign : undefined,
  l: node.type === 'heading' ? node.attrs?.level : undefined,
  m: node.marks?.map((m) => m.type).sort(),
  c: node.content?.map(normalize),
});

export const sameDoc = (a: JSONContent, b: JSONContent) => JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));

export const REGIONS: Region[] = [
  { id: 'header', editable: false },
  { id: 'preamble', editable: false },
  { id: 'body', editable: true },
  { id: 'signature', editable: false },
  { id: 'footer', editable: false },
];

const SOURCE: Record<Exclude<RegionId, 'body'>, string> = {
  header: 'template.title',
  preamble: 'tenant.insurer',
  signature: 'template.signature',
  footer: 'tenant.legal',
};

/** El payload que el paso CERTIFICADO entrega a backend. */
export function buildDocumentModel(args: {
  template: TemplateId;
  locale: Locale;
  body: JSONContent;
  data: PolicyData;
}): DocumentModel {
  const { template, locale, body, data } = args;
  const t = findTemplate(template).content[locale];
  const fixedVars = [t.title, t.signature].flatMap((s) => parseInline(s).flatMap((p) => (p.kind === 'var' ? [p.key] : [])));
  const keys = [...new Set([...fixedVars, ...collectVariables(body)])];
  return {
    tenant: TENANT.id,
    product: 'caucion',
    step: 'CERTIFICADO',
    policy: TENANT.policy,
    template,
    locale,
    modified: !sameDoc(body, initialBody(template, locale)),
    regions: REGIONS.map((r) => (r.id === 'body' ? { ...r, content: body } : { ...r, source: SOURCE[r.id as Exclude<RegionId, 'body'>] })),
    variables: auditVariables(keys, data, locale),
  };
}
