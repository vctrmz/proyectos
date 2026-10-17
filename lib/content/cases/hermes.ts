import { shot, inGroup, type CaseStudy } from './types';

export const hermes: CaseStudy = {
  slug: 'hermes', title: 'HERMES, plataforma aseguradora', company: 'Atrinium', years: '2022–2026',
  tagline: 'Un producto estándar para negocios que no se parecen: 165 pantallas y 8 áreas sobre un único núcleo, con su CRM, la suscripción de clientes, el editor de certificados y la landing que lo vende, sin bifurcar el producto por cliente.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Multi-tenant', 'Formularios por esquema', 'Design tokens'], brand: '#1f2a5a',
  hero: shot('hx-dashboard', 'Dashboard CRM de HERMES Admin con indicadores de leads, tasa de conversión y lista de oportunidades', 'El panel: indicadores de la red comercial y lo que requiere acción, en la primera pantalla'),
  context: 'SaaS asegurador de Atrinium para corredurías, agencias de suscripción y aseguradoras: suscripción, pólizas, recibos, facturación y siniestros. Producto en producción sin ventana de parada, con migración de framework y base de datos en marcha y dos generaciones de interfaz conviviendo.',
  role: 'Único diseñador del holding, en un equipo de siete personas. Sesiones semanales con los Product Owners de las aseguradoras para resolver dudas, aclarar ideas, presentar propuestas, validar la lógica de cada proceso y ajustar el copy antes de pasarlo a desarrollo.',
  delivery: 'Aplicación web multi-tenant, su CRM, el design system completo, las superficies de configuración por compañía y la landing de producto.',
  problem: [
    'Cada compañía llegaba con su lógica de negocio, su moneda, su idioma y su regulador, y esperaba que el producto se comportara como el suyo.',
    'Si el producto se dobla ante cada cliente deja de ser producto; si no se dobla nada, no lo usa nadie.',
  ],
  complexity: { diagram: 'clients-to-system', caption: 'Tres compañías con reglas incompatibles sobre un sistema configurable: la diferencia vive en el dato, no en una rama del producto.' },
  decisions: [
    { title: 'Diseñé reglas en lugar de casos.', why: 'Cada ramo de seguro tiene su cuestionario; diseñar una pantalla por ramo y por cliente no escala y deja el criterio en la cabeza del diseñador.', changed: 'El cuestionario de cada ramo se declara como dato y la interfaz lo renderiza con su validación. Dar de alta una compañía nueva deja de exigir diseño a medida.', tradeoff: 'La regla se vuelve el artefacto crítico: un esquema mal declarado rompe una pantalla que nadie diseñó, así que la validación tiene que vivir con el dato.', figure: { diagram: 'before-after' } },
    { title: 'Marca e idioma como variables, no como versiones.', why: 'White-labeling por tenant con cinco idiomas base y siete locales de terminología aseguradora.', changed: 'Paleta por cliente al iniciar sesión y terminología por locale, propagadas por tokens semánticos y catálogos de idioma, sin duplicar componentes.', figure: { shot: shot('04-preparar-producto', 'Preparación de producto: módulos, plugins e idiomas por cliente', 'Módulos, plugins e idiomas del sistema configurados por cliente') } },
    { title: 'Migración módulo a módulo, consistencia completa antes que mejoras repartidas.', why: 'Con dos generaciones de interfaz conviviendo, mejorar un poco todo mantiene la inconsistencia para siempre.', changed: 'Cada módulo migrado sale entero con el sistema nuevo; el criterio queda escrito y no depende de que yo esté en la reunión.', tradeoff: 'Durante meses conviven dos generaciones de interfaz a la vista del usuario. Se asumió a cambio de no dejar la inconsistencia instalada para siempre.', figure: { diagram: 'areas-map' } },
    { title: 'Suscripción: máquina de estados, no wizard.', why: 'Veinte pasos lineales obligan a todos los roles a recorrer el mismo camino.', changed: 'Tres fases (cualificación, negociación, cerrado) con audiencias, permisos y criterios de salida propios. El 100 % de la interfaz se apoya en el sistema de componentes consolidado antes de empezar.', figure: { shot: shot('03-metodo-de-pago', 'Método de pago con checklist de bloqueos', 'Método de pago: SEPA, datos fiscales y calendario, con checklist de lo que bloquea la firma') } },
    { title: 'Certificados: lo fijo se queda fuera del editor.', why: 'Cabecera, logotipo y pie son los del documento legal y la marca del tenant; si se pueden tocar, alguien los tocará.', changed: 'El editor solo abre el cuerpo del certificado. La plantilla se elige por tipo de certificado y el resto del A4 llega bloqueado.', figure: { shot: shot('ep-plantilla-nueva', 'Certificado de seguro de caución en A4 con el nuevo estilo', 'La plantilla del certificado: la estructura legal no se toca, solo el cuerpo') } },
    { title: 'Cliente 360: doce exploraciones antes de decidir.', why: 'El método de las tres alternativas se queda corto cuando el coste de equivocarse es una pantalla que se usa cien veces al día.', changed: 'Doce composiciones reducidas a cuatro direcciones comparables.', figure: { diagram: 'grid-12-4-1' } },
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
    ...inGroup('Plataforma', [
      shot('08-planes-servicios', 'Planes y servicios por compañía', 'Planes y servicios: catálogo de producto compuesto por negocio, sin desarrollo a medida'),
      shot('hx-leads', 'Tabla de leads con fuente, estado y agente asignado, y la agenda del día', 'Leads: fuente, estado y agente, con la agenda del día al lado para llamar sin perder contexto'),
      shot('hx-tickets', 'Bandeja de tickets con vistas guardadas y prioridad por color', 'Tickets: vistas guardadas (sin asignar, abiertas, del grupo) y prioridad visible en cada fila'),
      shot('hx-login', 'Pantalla de acceso «Welcome to Hermes Admin» con fotografía en azul', 'El login: la seguridad de nivel empresa como primer mensaje del producto'),
      shot('14-document-model', 'Modelo del documento', 'Modelo del documento: la restricción vive en el dato, no solo en la interfaz'),
      shot('hx-landing', 'Landing completa de HERMES con los bloques de funcionalidad', 'La landing: cada funcionalidad con su pantalla real, alternando lados'),
    ]),
    ...inGroup('Suscripción', [
      shot('01-datos-del-contacto', 'Datos del contacto', 'Fase 1 · Cualificación: contacto principal, perfil del cliente y resumen vivo de la empresa'),
      shot('04-preparar-producto', 'Preparar producto', 'Preparar producto: módulos, plugins e idiomas del sistema por cliente'),
      shot('19-reservar-agenda', 'Reservar agenda', 'Reservar agenda: disponibilidad de ambos lados en la misma vista'),
      shot('20-drawer-contrato', 'Detalle de contrato en panel lateral', 'Contrato en panel lateral: el contexto no se pierde al revisar'),
    ]),
    ...inGroup('Certificados', [
      shot('ep-editor-vacio', 'Editor del modelo de documento vacío con la plantilla de certificado elegida', 'Punto de partida: se elige la plantilla y se escribe, o se pulsa / para insertar'),
      shot('ep-comandos', 'Menú de comandos sobre el texto del certificado', 'Comandos con /: estilo global, estilo del documento y datos del sistema (personas, brokers, aseguradora, tablas y gráficas)'),
      shot('ep-certificados', 'Paso Certificados dentro del suplemento, con editor y vista previa', 'Certificados como un paso más del suplemento, con la vista previa a un clic'),
      shot('ep-variables', 'Texto del certificado en producción con variables del sistema', 'En producción: el texto lleva variables del sistema (${…}) que se rellenan al emitir'),
      shot('ep-plantilla-original', 'Plantilla original del certificado de caución en A4', 'Plantilla original del certificado de caución (datos personales ocultos)'),
      shot('ep-plantilla-nueva', 'Plantilla del certificado con el nuevo estilo en A4', 'La misma plantilla con el nuevo estilo: cabecera de marca y enlaces reconocibles (datos personales ocultos)'),
      shot('ep-resumen', 'Resumen de la oportunidad con el bloque Certificado entre coberturas y datos del vehículo', 'Resumen de la oportunidad: el tipo de certificado es un bloque más, editable como el resto'),
      shot('ep-poliza', 'Póliza emitida con la lista de documentos generados', 'Póliza emitida: el certificado se genera junto a las condiciones y el resumen de coberturas'),
      shot('ep-pdf', 'Visor PDF con el certificado de caución generado', 'Vista previa del certificado en PDF antes de descargarlo o imprimirlo (datos personales ocultos)'),
    ]),
    ...inGroup('Cliente 360', [
      shot('11-resumen-comercial', 'Resumen comercial del cliente', 'Resumen comercial: identidad persistente, riesgo y actividad antes del histórico'),
      shot('17-agenda-reuniones', 'Agenda de reuniones', 'Agenda de reuniones del cliente'),
      shot('15-notas-comite', 'Notas de comité', 'Notas de comité vinculadas al cliente'),
    ]),
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
      { value: '60 → 14', label: 'campos visibles por paso al emitir una póliza', meaning: 'Formularios y reglas pasaron a definirse como datos, así que cada paso enseña solo los campos que le corresponden. Describe cuánta información pide la pantalla, no el tiempo de la tarea ni los errores, que no se midieron.' },
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
