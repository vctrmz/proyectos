import type { Locale, PolicyData, TemplateId, VariableDef, VariableGroup } from './types';

export const GROUP_LABEL: Record<VariableGroup, Record<Locale, string>> = {
  tomador: { es: 'Tomador', en: 'Policyholder' },
  beneficiario: { es: 'Beneficiario', en: 'Beneficiary' },
  poliza: { es: 'Póliza y garantía', en: 'Policy and guarantee' },
  riesgo: { es: 'Riesgo', en: 'Risk' },
  certificado: { es: 'Certificado', en: 'Certificate' },
};

export const VARIABLES: VariableDef[] = [
  { key: 'tomador.nombre', group: 'tomador', label: { es: 'Nombre', en: 'Name' } },
  { key: 'tomador.cif', group: 'tomador', label: { es: 'CIF', en: 'Tax ID' } },
  { key: 'tomador.domicilio', group: 'tomador', label: { es: 'Domicilio', en: 'Address' }, templates: ['privado'] },

  { key: 'beneficiario.nombre', group: 'beneficiario', label: { es: 'Nombre', en: 'Name' } },
  { key: 'beneficiario.cif', group: 'beneficiario', label: { es: 'CIF', en: 'Tax ID' } },

  { key: 'poliza.suma_texto', group: 'poliza', label: { es: 'Suma en letra', en: 'Amount in words' } },
  { key: 'poliza.suma', group: 'poliza', label: { es: 'Suma asegurada', en: 'Sum insured' } },
  { key: 'poliza.concepto', group: 'poliza', label: { es: 'Concepto de garantía', en: 'Guarantee type' }, templates: ['abogacia', 'privado'] },
  { key: 'poliza.expediente', group: 'poliza', label: { es: 'Nº de expediente', en: 'File number' }, templates: ['abogacia'] },
  { key: 'poliza.contrato', group: 'poliza', label: { es: 'Contrato', en: 'Contract' }, templates: ['abogacia', 'privado'] },
  { key: 'poliza.acuerdo', group: 'poliza', label: { es: 'Acuerdo', en: 'Agreement' }, templates: ['privado'] },
  { key: 'poliza.fecha_contrato', group: 'poliza', label: { es: 'Fecha del contrato', en: 'Contract date' }, templates: ['privado'] },
  { key: 'poliza.fecha_vencimiento', group: 'poliza', label: { es: 'Fecha de vencimiento', en: 'Expiry date' }, templates: ['privado', 'publico-tasas'] },

  { key: 'riesgo.instalacion', group: 'riesgo', label: { es: 'Instalación', en: 'Facility' }, templates: ['almacenamiento'] },
  { key: 'riesgo.capacidad_mw', group: 'riesgo', label: { es: 'Capacidad (MW)', en: 'Capacity (MW)' }, templates: ['almacenamiento'] },
  { key: 'riesgo.municipio', group: 'riesgo', label: { es: 'Término municipal', en: 'Municipality' }, templates: ['almacenamiento'] },
  { key: 'riesgo.provincia', group: 'riesgo', label: { es: 'Provincia', en: 'Province' }, templates: ['almacenamiento'] },
  { key: 'riesgo.subestacion', group: 'riesgo', label: { es: 'Subestación', en: 'Substation' }, templates: ['almacenamiento'] },

  { key: 'certificado.numero', group: 'certificado', label: { es: 'Nº de certificado', en: 'Certificate no.' } },
  { key: 'certificado.lugar', group: 'certificado', label: { es: 'Lugar de emisión', en: 'Place of issue' } },
  { key: 'certificado.fecha', group: 'certificado', label: { es: 'Fecha del certificado', en: 'Certificate date' } },
];

const BY_KEY = new Map(VARIABLES.map((v) => [v.key, v]));

export const findVariable = (key: string) => BY_KEY.get(key);

export const variablesFor = (template: TemplateId) =>
  VARIABLES.filter((v) => !v.templates || v.templates.includes(template));

export const variableLabel = (key: string, locale: Locale) => {
  const v = BY_KEY.get(key);
  return v ? `${GROUP_LABEL[v.group][locale]} · ${v.label[locale]}` : key;
};

/* Datos ficticios de la póliza en curso. Nombres, CIF e importes son
   inventados: la demo no publica datos de clientes reales. */
export const SAMPLE_POLICY: PolicyData = {
  'tomador.nombre': 'Construcciones Albor, S.L.',
  'tomador.cif': 'B-00000000',
  'tomador.domicilio': { es: 'Calle Mayor 1, 29001 Málaga', en: 'Calle Mayor 1, 29001 Málaga (Spain)' },
  'beneficiario.nombre': 'Infraestructuras del Sur, S.A.',
  'beneficiario.cif': 'A-11111111',
  'poliza.suma_texto': { es: 'CIENTO CINCUENTA MIL EUROS', en: 'ONE HUNDRED AND FIFTY THOUSAND EUROS' },
  'poliza.suma': '150.000,00 €',
  'poliza.concepto': { es: 'DEFINITIVA', en: 'FINAL PERFORMANCE' },
  'poliza.expediente': '2025/0417',
  'poliza.contrato': { es: 'OBRAS DE ADECUACIÓN DE LA ESTACIÓN NORTE', en: 'REFURBISHMENT WORKS AT NORTH STATION' },
  'poliza.acuerdo': { es: 'SUMINISTRO E INSTALACIÓN', en: 'SUPPLY AND INSTALLATION' },
  'poliza.fecha_contrato': { es: '12 de febrero de 2025', en: '12 February 2025' },
  'poliza.fecha_vencimiento': { es: '31 de marzo de 2026', en: '31 March 2026' },
  'riesgo.instalacion': 'CPD Levante',
  'riesgo.capacidad_mw': '40',
  'riesgo.municipio': 'Antequera',
  'riesgo.provincia': 'Málaga',
  // Vacía a propósito: enseña cómo la vista previa marca un hueco que el
  // paso no deja cerrar (la subestación no se recogió en el paso Riesgo).
  'riesgo.subestacion': '',
  'certificado.numero': '0290010000-0457',
  'certificado.lugar': { es: 'Madrid', en: 'Madrid' },
  'certificado.fecha': { es: '3 de marzo de 2025', en: '3 March 2025' },
};

/** Valor de una variable en un idioma. `undefined` si la póliza no lo tiene:
    eso es un hueco que la vista previa marca y el paso no deja cerrar. */
export const resolveValue = (data: PolicyData, key: string, locale: Locale): string | undefined => {
  const raw = data[key];
  if (raw === undefined || raw === '') return undefined;
  return typeof raw === 'string' ? raw : raw[locale];
};
