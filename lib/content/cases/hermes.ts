import { shot, type CaseStudy } from './types';

export const hermes: CaseStudy = {
  slug: 'hermes', title: 'HERMES, plataforma aseguradora', company: 'Atrinium', years: '2022–2026',
  tagline: 'Un producto estándar para negocios que no se parecen: 165 pantallas y 8 áreas sobre un único núcleo, con su CRM y la landing que lo vende, sin bifurcar el producto por cliente.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Multi-tenant', 'Formularios por esquema', 'Design tokens'], brand: '#1f2a5a',
  hero: shot('hx-dashboard', 'Dashboard CRM de HERMES Admin con indicadores de leads, tasa de conversión y lista de oportunidades', 'El panel: indicadores de la red comercial y lo que requiere acción, en la primera pantalla'),
  context: 'SaaS asegurador de Atrinium para corredurías, agencias de suscripción y aseguradoras: suscripción, pólizas, recibos, facturación y siniestros. Producto en producción sin ventana de parada, con migración de framework y base de datos en marcha y dos generaciones de interfaz conviviendo.',
  role: 'Único diseñador del holding, en un equipo de siete personas. Discovery semanal con los Product Owners de las aseguradoras y defensa de cada propuesta antes de pasarla a desarrollo.',
  delivery: 'Aplicación web multi-tenant, su CRM, el design system completo, las superficies de configuración por compañía y la landing de producto.',
  problem: [
    'Cada compañía llegaba con su lógica de negocio, su moneda, su idioma y su regulador, y esperaba que el producto se comportara como el suyo.',
    'Si el producto se dobla ante cada cliente deja de ser producto; si no se dobla nada, no lo usa nadie.',
  ],
  complexity: { diagram: 'clients-to-system', caption: 'Tres compañías con reglas incompatibles sobre un sistema configurable: la diferencia vive en el dato, no en una rama del producto.' },
  decisions: [
    { title: 'Diseñé reglas en lugar de casos.', why: 'Cada ramo de seguro tiene su cuestionario; diseñar una pantalla por ramo y por cliente no escala y deja el criterio en la cabeza del diseñador.', changed: 'El cuestionario de cada ramo se declara como dato y la interfaz lo renderiza con su validación. Dar de alta una compañía nueva deja de exigir diseño a medida.', tradeoff: 'La regla se vuelve el artefacto crítico: un esquema mal declarado rompe una pantalla que nadie diseñó, así que la validación tiene que vivir con el dato.', figure: { diagram: 'before-after' } },
    { title: 'El nivel de sistema que cada producto se puede permitir.', why: 'La respuesta obvia era imponer un sistema único a los cinco productos del holding. Los productos ligeros no necesitan esa gobernanza.', changed: 'Design system completo para el ERP y el administrador; brandsheet y UI kit para los productos ligeros. Cinco negocios que no se sienten como cinco empresas distintas.', figure: { shot: shot('07-seleccionar-moneda', 'Componente de selección de moneda', 'Componentes con contrato: el mismo selector en los cuatro front') } },
    { title: 'Marca e idioma como variables, no como versiones.', why: 'White-labeling por tenant con cinco idiomas base y siete locales de terminología aseguradora.', changed: 'Paleta por cliente al iniciar sesión y terminología por locale, propagadas por tokens semánticos y catálogos de idioma, sin duplicar componentes.', figure: { shot: shot('04-preparar-producto', 'Preparación de producto: módulos, plugins e idiomas por cliente', 'Módulos, plugins e idiomas del sistema configurados por cliente') } },
    { title: 'El CRM sigue el recorrido del agente, no el organigrama del producto.', why: 'Leads, contactos, pipeline y tickets existían como módulos sueltos, y el agente no trabaja por módulos: trabaja por preguntas del día.', changed: 'Cinco pasos encadenados —captar, conocer, negociar, atender y medir—, donde cada módulo alimenta al siguiente: el lead se convierte en contacto, en oportunidad y en cliente atendido sin cambiar de pestaña.', figure: { shot: shot('hx-pipeline', 'Pipeline de ventas en kanban por etapa con el valor de cada una', 'Pipeline: valor por etapa y probabilidad de cierre en la tarjeta, con el mismo código de color que el panel') } },
    { title: 'Una landing que explica el producto con el propio producto.', why: 'Un SaaS asegurador no se vende con ilustraciones: quien compra quiere ver la pantalla que va a operar su equipo.', changed: 'Cada bloque de funcionalidad va acompañado de su pantalla real en un marco de marca, alternando lados para marcar el ritmo de lectura, y cierra con contacto directo por WhatsApp, llamada o email.', figure: { shot: shot('hx-l_multi', 'Bloque de personalización y multilenguaje de la landing sobre fondo navy', 'El bloque que vende lo que más cuesta explicar: personalización, multi-idioma y multi-moneda') } },
    { title: 'Migración módulo a módulo, consistencia completa antes que mejoras repartidas.', why: 'Con dos generaciones de interfaz conviviendo, mejorar un poco todo mantiene la inconsistencia para siempre.', changed: 'Cada módulo migrado sale entero con el sistema nuevo; el criterio queda escrito y no depende de que yo esté en la reunión.', tradeoff: 'Durante meses conviven dos generaciones de interfaz a la vista del usuario. Se asumió a cambio de no dejar la inconsistencia instalada para siempre.', figure: { diagram: 'areas-map' } },
  ],
  system: {
    body: [
      'Auditoría del monorepo con IA para extraer todos los valores de color en uso: 267 dispersos reducidos a 24 tokens con un rol cada uno, adoptados por los cuatro front. Los tokens se exportaron para evolucionar el design system anterior, no para tirarlo.',
      'Componentes con contrato y accesibilidad forzada por el linter: cuándo se usa cada patrón y por qué queda documentado antes de llegar a desarrollo.',
      'El sistema visual es noche corporativa con un solo magenta: el índigo del login y la landing se convierte en el sidebar del panel, y el magenta de la «e» marca solo lo que requiere acción. El resto de estados usa color semántico, nunca el de marca.',
    ],
    code: { title: 'El cuestionario de un ramo, declarado como dato (extracto)', lang: 'json', source: 'illustrative', code: "{\n  \"line\": \"motor-fleet\",\n  \"version\": 3,\n  \"steps\": [\n    {\n      \"id\": \"vehicle\",\n      \"fields\": [\n        { \"id\": \"plate\", \"type\": \"text\", \"required\": true, \"pattern\": \"^[0-9]{4}[A-Z]{3}$\" },\n        { \"id\": \"use\", \"type\": \"select\", \"options\": [\"private\", \"fleet\", \"taxi\"], \"required\": true },\n        { \"id\": \"fleetSize\", \"type\": \"number\", \"min\": 2,\n          \"visibleIf\": { \"field\": \"use\", \"equals\": \"fleet\" } },\n        { \"id\": \"taxiLicence\", \"type\": \"text\",\n          \"visibleIf\": { \"field\": \"use\", \"equals\": \"taxi\" } }\n      ]\n    }\n  ],\n  \"labels\": \"i18n:insurance.motor\"\n}" },
    uiKit: [
      { kind: 'tokens', title: 'Tokens con rol', body: '267 valores de color en uso reducidos a 24 tokens, cada uno con un rol declarado: la marca de cada compañía se resuelve al iniciar sesión, sin duplicar componentes.', wide: true },
      { kind: 'form', title: 'Formulario por esquema', body: 'El cuestionario de cada ramo se declara como dato y la interfaz lo renderiza con su validación: un ramo nuevo no pide pantallas nuevas.', wide: true },
      { kind: 'table', title: 'Tabla de alta densidad', body: 'La tabla es el espacio de trabajo: filas compactas, estado a la derecha y acciones que aparecen en la fila activa.' },
      { kind: 'states', title: 'Estados', body: 'Color y fondo propios, nunca solo color: el mismo lenguaje de estado en tabla, panel y documento.' },
      { kind: 'actions', title: 'Jerarquía de acción', body: 'La acción que cierra el paso en color de marca, la reversible en contorno, la de salida sin peso.', label: 'Emitir póliza' },
    ],
  },
  flows: {
    title: 'Flujos',
    caption: 'El CRM no está ordenado por módulos sino por las preguntas del día de un agente: cada paso alimenta al siguiente.',
    list: [
      { title: 'Del lead a la póliza', side: 'sin cambiar de pestaña', steps: [
        { n: '01', t: 'Captar', d: 'Leads con su fuente, su estado y su agente, y la agenda del día al lado.' },
        { n: '02', t: 'Conocer', d: 'Ficha de contacto con historial por canal, comentarios internos y empresa vinculada.' },
        { n: '03', t: 'Negociar', d: 'Pipeline en kanban por etapa, con valor y probabilidad de cierre en la tarjeta.' },
        { n: '04', t: 'Atender', d: 'Tickets con vistas guardadas y prioridad visible por color.' },
        { n: '05', t: 'Medir', d: 'Panel con los indicadores de la red y los avisos de lo que requiere acción.' },
      ] },
    ],
  },
  design: [
    shot('08-planes-servicios', 'Planes y servicios por compañía', 'Planes y servicios: catálogo de producto compuesto por negocio, sin desarrollo a medida'),
    shot('hx-leads', 'Tabla de leads con fuente, estado y agente asignado, y la agenda del día', 'Leads: fuente, estado y agente, con la agenda del día al lado para llamar sin perder contexto'),
    shot('hx-tickets', 'Bandeja de tickets con vistas guardadas y prioridad por color', 'Tickets: vistas guardadas —sin asignar, abiertas, del grupo— y prioridad visible en cada fila'),
    shot('hx-login', 'Pantalla de acceso «Welcome to Hermes Admin» con fotografía en azul', 'El login: la seguridad de nivel empresa como primer mensaje del producto'),
    shot('14-document-model', 'Modelo del documento', 'Modelo del documento: la restricción vive en el dato, no solo en la interfaz'),
    shot('hx-landing', 'Landing completa de HERMES con los bloques de funcionalidad', 'La landing: cada funcionalidad con su pantalla real, alternando lados'),
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
    /* Outcome derivado: cada cifra es aritmética sobre un dato que el caso ya
       documenta, y su explicación dice de dónde sale. Lo que no se midió sigue
       declarado abajo, en `measure`. */
    outcome: [
      { value: '−77 %', label: 'campos que el usuario ve por paso', meaning: 'Aritmética sobre el dato de arriba: de 60 campos visibles por paso a 14 al emitir una póliza. No es una medición de tiempo, es la reducción de lo que la pantalla pide.' },
      { value: '−91 %', label: 'valores de color en el código', meaning: 'De 267 valores dispersos a 24 tokens con rol. La cifra sale de la auditoría del monorepo, que es donde se contaron.' },
      { value: '4 de 4', label: 'front que adoptaron los tokens', meaning: 'Adopción completa del equipo de front: es la condición para que reutilizar componentes ahorre de verdad, y es lo único de esta lista que se puede comprobar en el repositorio.' },
    ],
    measure: 'Instrumenté el design system pero no el producto: sabía cuántos componentes cumplían el sistema, no cuántos minutos ahorraba emitir una póliza. Hoy pediría analítica de uso desde el primer módulo migrado: tiempo de emisión, errores por paso y tickets por módulo.',
  },
  learnings: [
    'Las discusiones pasaron de gustos a criterios porque las reglas están escritas y se pueden consultar.',
    'El sistema se mantiene solo cuando cada módulo nuevo se construye con lo que existe y devuelve lo que le falta.',
    'Un producto que se vende con su propia pantalla necesita que esa pantalla aguante la mirada: la landing obligó a subir el nivel del panel.',
    'Instrumenté el sistema y no el producto: hoy pediría analítica de uso desde el primer módulo migrado.',
  ],
  next: 'flesip',
};
