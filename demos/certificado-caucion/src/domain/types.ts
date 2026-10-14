import type { JSONContent } from '@tiptap/react';

export type Locale = 'es' | 'en';

export type TemplateId = 'abogacia' | 'privado' | 'almacenamiento' | 'publico-tasas';

export type VariableGroup = 'tomador' | 'beneficiario' | 'poliza' | 'riesgo' | 'certificado';

/** Una variable del documento. La clave es el contrato con backend:
    `{{ tomador.nombre }}` en la plantilla, `tomador.nombre` en el JSON. */
export interface VariableDef {
  key: string;
  group: VariableGroup;
  label: Record<Locale, string>;
  /** Plantillas donde la variable tiene sentido. Sin lista: todas. */
  templates?: TemplateId[];
}

/** Datos de la póliza en curso: lo que el flujo ya recogió en pasos anteriores. */
export type PolicyData = Record<string, Record<Locale, string> | string>;

/** Las cinco regiones de la anatomía del A4. Solo `body` es editable:
    la restricción vive en el modelo, no en la disciplina de quien escribe. */
export type RegionId = 'header' | 'preamble' | 'body' | 'signature' | 'footer';

export interface Region {
  id: RegionId;
  editable: boolean;
}

export interface TemplateLocaleContent {
  title: string;
  preamble: string;
  insures: string;
  /** Cuerpo en el mini-DSL: párrafos separados por línea en blanco,
      `**negrita**` y `{{ variable }}`. */
  body: string;
  signature: string;
  footer: string;
}

export interface CertificateTemplate {
  id: TemplateId;
  code: string;
  name: Record<Locale, string>;
  summary: Record<Locale, string>;
  content: Record<Locale, TemplateLocaleContent>;
}

export interface DocumentModel {
  tenant: string;
  product: 'caucion';
  step: 'CERTIFICADO';
  policy: string;
  template: TemplateId;
  locale: Locale;
  modified: boolean;
  regions: Array<Region & { content?: JSONContent; source?: string }>;
  variables: { used: string[]; missing: string[]; unknown: string[] };
}
