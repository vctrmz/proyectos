/* Configuración del tenant. HERMES es multi-tenant: marca, razón social y
   producto vienen de aquí y no de la plantilla, así que el mismo paso sirve a
   otro tenant cambiando este objeto. La demo usa un tenant ficticio. */
export const TENANT = {
  id: 'surety-demo',
  name: 'SURETY DEMO',
  legalName: 'Surety Demo, S.L.U.',
  insurer: 'Aseguradora Demo, S.A.',
  product: { es: 'Caución', en: 'Surety' },
  policy: 'SDC-25000009',
  premium: { before: '1.151,50 €', now: '1.001,50 €' },
} as const;
