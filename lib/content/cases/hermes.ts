import { shot, type CaseStudy } from './types';

export const hermes: CaseStudy = {
  slug: 'hermes', title: 'HERMES, plataforma aseguradora', company: 'Atrinium', years: '2022–2026',
  tagline: 'Un producto estándar para negocios que no se parecen: 165 pantallas y 8 áreas sobre un único núcleo, sin bifurcar el producto por cliente.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Multi-tenant'], brand: '#1f2a5a',
  hero: shot('08-planes-servicios', 'Configuración de planes y servicios por compañía en HERMES', 'Planes y servicios: la misma pantalla sirve a compañías con catálogos distintos'),
  context: 'SaaS asegurador de Atrinium para corredurías, agencias de suscripción y aseguradoras: suscripción, pólizas, recibos, facturación y siniestros. Producto en producción sin ventana de parada, con migración de framework y base de datos en marcha y dos generaciones de interfaz conviviendo.',
  role: 'Único diseñador del holding, en un equipo de siete personas. Discovery semanal con los Product Owners de las aseguradoras y defensa de cada propuesta antes de pasarla a desarrollo.',
  delivery: 'Aplicación web multi-tenant, design system completo y superficies de configuración por compañía.',
  problem: [
    'Cada compañía llegaba con su lógica de negocio, su moneda, su idioma y su regulador, y esperaba que el producto se comportara como el suyo.',
    'Si el producto se dobla ante cada cliente deja de ser producto; si no se dobla nada, no lo usa nadie.',
  ],
  complexity: { diagram: 'clients-to-system', caption: 'Tres compañías con reglas incompatibles sobre un sistema configurable: la diferencia vive en el dato, no en una rama del producto.' },
  decisions: [
    { title: 'Diseñé reglas en lugar de casos.', why: 'Cada ramo de seguro tiene su cuestionario; diseñar una pantalla por ramo y por cliente no escala y deja el criterio en la cabeza del diseñador.', changed: 'El cuestionario de cada ramo se declara como dato y la interfaz lo renderiza con su validación. Dar de alta una compañía nueva deja de exigir diseño a medida.', figure: { diagram: 'before-after' } },
    { title: 'El nivel de sistema que cada producto se puede permitir.', why: 'La respuesta obvia era imponer un sistema único a los cinco productos del holding. Los productos ligeros no necesitan esa gobernanza.', changed: 'Design system completo para el ERP y el administrador; brandsheet y UI kit para los productos ligeros. Cinco negocios que no se sienten como cinco empresas distintas.', figure: { shot: shot('07-seleccionar-moneda', 'Componente de selección de moneda', 'Componentes con contrato: el mismo selector en los cuatro front') } },
    { title: 'Marca e idioma como variables, no como versiones.', why: 'White-labeling por tenant con cinco idiomas base y siete locales de terminología aseguradora.', changed: 'Paleta por cliente al iniciar sesión y terminología por locale, propagadas por tokens semánticos y catálogos de idioma, sin duplicar componentes.', figure: { shot: shot('04-preparar-producto', 'Preparación de producto: módulos, plugins e idiomas por cliente', 'Módulos, plugins e idiomas del sistema configurados por cliente') } },
    { title: 'Migración módulo a módulo, consistencia completa antes que mejoras repartidas.', why: 'Con dos generaciones de interfaz conviviendo, mejorar un poco todo mantiene la inconsistencia para siempre.', changed: 'Cada módulo migrado sale entero con el sistema nuevo; el criterio queda escrito y no depende de que yo esté en la reunión.', figure: { diagram: 'areas-map' } },
  ],
  system: {
    body: [
      'Auditoría del monorepo con IA para extraer todos los valores de color en uso: 267 dispersos reducidos a 24 tokens con un rol cada uno, adoptados por los cuatro front. Los tokens se exportaron para evolucionar el design system anterior, no para tirarlo.',
      'Componentes con contrato y accesibilidad forzada por el linter: cuándo se usa cada patrón y por qué queda documentado antes de llegar a desarrollo.',
    ],
    code: { title: "Tokens semánticos del sistema", lang: 'json', code: "{\n  \"color\": {\n    \"brand\":      \"#1f2a5a\",\n    \"action\":     \"#2f5bea\",\n    \"success\":    \"#1f9d55\",\n    \"warning\":    \"#d97706\",\n    \"danger\":     \"#c0392b\",\n    \"surface\":    \"#f6f7fb\",\n    \"ink\":        \"#121317\",\n    \"ink-muted\":  \"#6a6a71\"\n  },\n  \"font\": {\n    \"family\": \"Inter\",\n    \"size\":   { \"xs\": 12, \"sm\": 14, \"md\": 16, \"lg\": 20, \"xl\": 28 },\n    \"weight\": { \"regular\": 400, \"medium\": 500 }\n  },\n  \"radius\": { \"sm\": 6, \"md\": 10, \"lg\": 16, \"pill\": 999 },\n  \"space\":  [4, 8, 12, 16, 24, 32]\n}" },
    uiKit: [
      { kind: 'tokens', title: 'Tokens con rol', body: '267 valores de color en uso reducidos a 24 tokens, cada uno con un rol declarado: la marca de cada compañía se resuelve al iniciar sesión, sin duplicar componentes.', wide: true },
      { kind: 'form', title: 'Formulario por esquema', body: 'El cuestionario de cada ramo se declara como dato y la interfaz lo renderiza con su validación: un ramo nuevo no pide pantallas nuevas.', wide: true },
      { kind: 'table', title: 'Tabla de alta densidad', body: 'La tabla es el espacio de trabajo: filas compactas, estado a la derecha y acciones que aparecen en la fila activa.' },
      { kind: 'states', title: 'Estados', body: 'Color y fondo propios, nunca solo color: el mismo lenguaje de estado en tabla, panel y documento.' },
      { kind: 'actions', title: 'Jerarquía de acción', body: 'La acción que cierra el paso en color de marca, la reversible en contorno, la de salida sin peso.', label: 'Emitir póliza' },
    ],
  },
  design: [
    shot('08-planes-servicios', 'Planes y servicios por compañía', 'Planes y servicios: catálogo de producto compuesto por negocio, sin desarrollo a medida'),
    shot('14-document-model', 'Modelo del documento', 'Modelo del documento: la restricción vive en el dato, no solo en la interfaz'),
    shot('10-logs-firmantes', 'Registro de firmantes', 'Trazabilidad por documento: firmantes, motor de firma y estado'),
    shot('16-datos-contacto', 'Datos de contacto', 'Formulario generado por esquema con validación por regla'),
  ],
  implementation: [
    'Los tokens y componentes se entregaron con criterios de uso; el equipo de desarrollo dejó de preguntar cómo se comporta un patrón porque está definido antes de llegar a ellos.',
    'Cada módulo nuevo se arma con componentes que ya existen; cuando necesita algo nuevo, lo devuelve al catálogo.',
  ],
  result: {
    output: [
      { value: '165', label: 'pantallas en producción', meaning: 'Una por flujo real, no por variante de cliente: la variación la absorbe la configuración.' },
      { value: '8', label: 'áreas de producto', meaning: 'Suscripción, pólizas, recibos, facturación, siniestros, administración, usuarios y reporting con el mismo lenguaje de diseño.' },
      { value: '60 → 14', label: 'campos visibles por paso al emitir una póliza', meaning: 'Los campos se muestran cuando una regla los pide, en lugar de aparecer todos siempre.' },
      { value: '267 → 24', label: 'tokens de color', meaning: 'Adoptados por los cuatro desarrolladores front: la base que hace que reutilizar componentes ahorre de verdad.' },
    ],
    outcome: 'unavailable',
    measure: 'Instrumenté el design system pero no el producto: sabía cuántos componentes cumplían el sistema, no cuántos minutos ahorraba emitir una póliza. Hoy pediría analítica de uso desde el primer módulo migrado: tiempo de emisión, errores por paso y tickets por módulo.',
  },
  learnings: [
    'Las discusiones pasaron de gustos a criterios porque las reglas están escritas y se pueden consultar.',
    'El sistema se mantiene solo cuando cada módulo nuevo se construye con lo que existe y devuelve lo que le falta.',
  ],
  next: 'suscripcion',
};
