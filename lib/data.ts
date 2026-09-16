export const EMAIL = 'vctrmz47@gmail.com';
export const SOCIAL = {
  linkedin: 'https://linkedin.com/in/victor-maza47',
  behance: 'https://behance.net/mazdesign',
  instagram: 'https://instagram.com/mazdesign',
};
export const AYAX_URL = 'https://ayax-summit-olive.vercel.app/';
export const FIGMA_URL = 'https://www.figma.com/design/lEPRv8iPrIDwUBKnbWKMdu/Portfolio?node-id=8-136130&t=srL7KcBmRZtEGLME-1';

const CARD = '/assets/h-card/';
const THUMB = '/assets/h-thumb/';
const jpg = (name: string) => name.replace(/^.*\//, '').replace(/\.png$/, '.jpg');
export const card = (name: string) => CARD + jpg(name);
export const thumb = (name: string) => THUMB + jpg(name);

export type Shot = [file: string, caption: string];
export type StarItem = [letter: string, name: string, body: string, label: string];
export type TeamItem = [icon: string, name: string, body: string];
export type Fact = [value: string, label: string];

export interface Work {
  img: string; kicker: string; title: string; lead: string;
  gallery: Shot[]; star: StarItem[]; team: TeamItem[]; skills: string[]; facts: Fact[];
}

export const WORKS: Work[] = [
  {
    img: '01-datos-del-contacto.png',
    kicker: 'HERMES ADMIN · SaaS multi-tenant',
    title: 'Módulo de suscripción de cliente',
    lead: 'Tres meses de proceso manual en Excel, convertidos en un módulo en producción en cinco semanas.',
    gallery: [
      ['01-datos-del-contacto.png', 'Fase 1 · Cualificación: contacto principal, perfil del cliente y resumen vivo de la empresa'],
      ['06-agenda-participantes.png', 'Agenda: el tipo de reunión sugiere quién debe asistir de cada lado'],
      ['02-notas-y-comite.png', 'Comité: el acuerdo se vota con quórum, deadline y conversación trazada'],
      ['04-preparar-producto.png', 'Preparar producto: módulos, plugins e idiomas del sistema por cliente'],
      ['03-metodo-de-pago.png', 'Método de pago: SEPA, datos fiscales y calendario, con checklist de lo que bloquea la firma'],
      ['05-contratos.png', 'Contratos firmados, con firmantes, motor de firma y estado por documento'],
    ],
    star: [
      ['S', 'Situación', 'Cualificación, negociación, presupuesto, contrato y facturación se operaban a mano entre hojas de cálculo y correos, hasta tres meses de ciclo y seis roles distintos. El encargo cabía en una frase: automatizar esto, dame ideas. Sin especificación, sin alcance y sin una sola métrica, porque un proceso repartido en correos no deja rastro que medir.', 'No había módulo: había un proceso manual que nadie había mirado de frente'],
      ['T', 'Tarea', 'Definir el problema antes de resolverlo. Único diseñador del holding, con triple aprobación de CTO, CEO y responsable de la empresa, y la restricción de entregar sobre el catálogo de componentes que ya existía.', 'El encargo incluía acotar el alcance, no solo diseñarlo'],
      ['A', 'Acción', 'La primera decisión fue no abrir Figma hasta entender el proceso manual. Tres entrevistas con el closer que lo hacía a mano, los criterios de salida de cada stakeholder y research por observación indirecta: sin acceso a usuarios de módulos comparables, usé benchmark en Mobbin y grabaciones de producto reales como proxy, mirando operadores usando la herramienta en lugar de capturas de marketing. Esos patrones no se copiaron: se filtraron contra nuestro modelo de negocio y contra el catálogo de Hermes Tenant, y varios se recategorizaron en otros módulos porque no pertenecían a este flujo. Lo modelé como máquina de estados de tres fases (cualificación, negociación y cerrado) con audiencias, permisos y criterios de salida propios, no como un wizard de veinte pasos.', 'Research por observación indirecta y un módulo ajustado a nuestro flujo'],
      ['R', 'Resultado', 'Cinco semanas del arranque al primer cliente operando en producción, con el 70 % del flujo en la Fase 1. Sale en cinco semanas porque el 100 % de la interfaz se apoya en un sistema de componentes consolidado antes de empezar. El efecto de segundo orden es el que más me interesa: el mismo artefacto sirve a ventas para cerrar y a producto para estimar, así que el alcance deja de negociarse dos veces.', 'De Excel a producción con cliente real en cinco semanas'],
    ],
    team: [
      ['ri-search-eye-line', 'Research', 'Observación indirecta como método, no como excusa: benchmark en Mobbin y grabaciones de operadores reales sustituyeron el acceso a usuarios que no teníamos. El Excel que ya usaban era el mejor documento de requisitos disponible: un proceso manual que funciona te dice qué información necesita el negocio y en qué orden.'],
      ['ri-lightbulb-flash-line', 'Iniciativa propia', 'La agenda con transcripción y resumen automáticos no estaba en el encargo. La llevé primero a front y back, para saber qué era viable, con qué herramientas y a qué coste, y solo después al PO y al CEO. El filtro técnico cambió el diseño: el editor se desbloqueó cuando el equipo trajo TipTap. Una propuesta que llega con la viabilidad validada deja de ser una petición y pasa a ser una opción.'],
      ['ri-stack-line', 'Pensamiento sistémico', 'Auditoría del monorepo con IA para extraer todos los valores de color en uso: 267 dispersos reducidos a 24 tokens con un rol cada uno, adoptados por los cuatro front. No lo tiré y lo rehice: exporté los tokens para evolucionar el design system anterior.'],
      ['ri-recycle-line', 'Diseño reutilizable', 'Partí de los componentes de Hermes Tenant en lugar de inventar patrones: el equipo ensambla en vez de construir y quien ya opera el producto no tiene curva de aprendizaje. Y la vuelta, que es la parte que más me interesa: el panel de contexto, el editor con comentarios y el agendador se diseñaron para reincorporarse al catálogo. El sistema alimenta el módulo y el módulo devuelve componentes al sistema.'],
      ['ri-chat-3-line', 'Comunicación', 'La triple aprobación en cada entrega obligaba a defender la misma decisión en tres lenguajes: viabilidad técnica, impacto de negocio y operación diaria. Es la parte del trabajo que más me formó como lead.'],
      ['ri-eye-line', 'Detalle de producto', 'En las entrevistas apareció algo que ningún requisito recogía: el closer justificaba cada dato al cliente en directo. Ese conocimiento vivía en su experiencia, así que lo moví al producto con dos bloques persistentes junto a cada formulario. Un closer nuevo opera el flujo sin haber hecho las llamadas.'],
    ],
    skills: ['Definición de problema', 'Research por observación indirecta', 'Mobbin', 'Máquina de estados', 'Arquitectura de información', 'Design system', 'Tokens de color', 'Estrategia de componentes', 'Contratación y facturación', 'IA aplicada', 'Figma'],
    facts: [['5', 'semanas a producción'], ['267 → 24', 'tokens de color'], ['3', 'fases · 6 roles']],
  },
  {
    img: '12-editor-variables.png',
    kicker: 'HERMES ADMIN · Suscripción · Fase 2',
    title: 'Preparar la demo con el cliente',
    lead: 'La fase en que se arma la propuesta con el cliente: documento, variables y comentarios en un sitio.',
    gallery: [['12-editor-variables.png', 'Editor con variables'], ['14-document-model.png', 'Modelo del documento'], ['13-historial-comentarios.png', 'Historial de comentarios'], ['04-detalle-documento.png', 'Detalle del documento']],
    star: [
      ['S', 'Situación', 'La segunda fase del módulo de suscripción es la preparación de la demo con el cliente: se arma la propuesta, se ajustan condiciones y se recogen los comentarios de las dos partes. Todo eso vivía en documentos sueltos, así que cada versión se alejaba un poco más de la plantilla aprobada y al firmar nadie sabía qué se había cambiado.', 'La propuesta se preparaba a mano, fuera del producto'],
      ['T', 'Tarea', 'Llevar esa fase dentro del módulo, con rastro auditable de lo que se rellena, lo que es opcional y lo que está bloqueado.', 'Preparar la demo sin salirse de lo aprobado'],
      ['A', 'Acción', 'El front lead y yo acordamos construirlo sobre TipTap, el editor headless que se ajustaba a los requerimientos del cliente y a nuestro modelo de bloques sin coste de licencia, en vez de levantar un editor desde cero. Las variables se insertan con @ y los componentes con /, y las cláusulas opcionales son bloques que se activan. Trabajé el modelo del documento con Legal y backend a la vez, para que la restricción viviera en el dato y no solo en la interfaz.', 'TipTap, variables con @ y componentes con /'],
      ['R', 'Resultado', 'Se ve qué falta, qué es opcional y qué no se puede tocar. El miedo al presentarlo era que el usuario final no entendiera el patrón de comandos, así que lo acompañé de una guía de uso y una demo en vivo: el cliente se adaptó sin fricción.', 'Auditable mientras se escribe, y adoptado sin fricción'],
    ],
    team: [
      ['ri-team-line', 'Trabajo en equipo', 'Pareja estable con Legal para traducir requisitos normativos a reglas de interfaz, y con backend para acordar el modelo de variables.'],
      ['ri-flag-line', 'Liderazgo', 'Propuse frenar el editor libre que se estaba construyendo y reconducirlo a plantilla con huecos: menos libertad, mucho menos riesgo.'],
      ['ri-tools-line', 'Decisión técnica compartida', 'La elección de TipTap salió de una conversación entre el front lead y yo, no de una imposición de ninguno de los dos lados: pesaba a la vez lo que el cliente pedía, lo que el sistema aguantaba y lo que costaba mantener.'],
      ['ri-presentation-line', 'Adopción', 'Un patrón nuevo no se entiende solo: preparé la guía de uso y presenté el editor al cliente antes del despliegue, porque asumir que se entiende es donde se pierden los editores.'],
      ['ri-shield-check-line', 'Cumplimiento', 'Las validaciones se diseñaron con la persona que responde de la auditoría, no después de ella.'],
      ['ri-magic-line', 'IA en el proceso', 'Usé IA generativa para redactar variantes de microcopy legal y descartarlas rápido con Legal delante.'],
    ],
    skills: ['Diseño de editores', 'TipTap', 'Modelo de datos', 'Microcopy legal', 'Validaciones', 'Componentes reutilizables', 'Formación de usuario', 'IA aplicada'],
    facts: [['0', 'texto libre sin control'], ['2', 'áreas co-diseñando'], ['100%', 'campos trazables']],
  },
];

export type RowAction = { kind: 'case'; index: number } | { kind: 'url'; url: string };
export interface WorkRow { n: string; img: string; kicker: string; title: string; desc: string; action: RowAction }

export function workRows(): WorkRow[] {
  const rows: WorkRow[] = WORKS.map((w, i) => ({
    n: String(i + 1).padStart(2, '0'), img: card(w.img), kicker: w.kicker, title: w.title, desc: w.lead,
    action: { kind: 'case', index: i },
  }));
  rows.push({
    n: String(rows.length + 1).padStart(2, '0'), img: card('08-planes-servicios.png'),
    kicker: 'AYAX · Web en producción', title: 'Prototipo landing page',
    desc: 'Diseño y dirección de la implementación con IA, desplegado y en línea.',
    action: { kind: 'url', url: AYAX_URL },
  });
  rows.push({
    n: String(rows.length + 1).padStart(2, '0'), img: card('14-document-model.png'),
    kicker: 'FIGMA · Archivo de trabajo', title: 'Ver el proyecto en Figma',
    desc: 'Los frames, los estados y las alternativas descartadas, tal como quedaron en el archivo.',
    action: { kind: 'url', url: FIGMA_URL },
  });
  return rows;
}

/* `size: 'full'` = los que venían de image-slot (ocupan la celda entera);
   `size: 'small'` = los ficheros sueltos (max 78% / 52px). */
export interface Logo { id: string; name: string; src: string; size: 'full' | 'small'; href?: string }
export const LOGOS: Logo[] = [
  { id: 'hermes', name: 'HERMES · Atrinium', src: '/assets/logos/hermes.webp', size: 'full', href: 'https://atrinium.com/' },
  { id: 'wakari', name: 'Wakari Solutions', src: '/assets/logos/wakari.webp', size: 'small', href: 'https://wakarisolutions.com/' },
  { id: 'linikit', name: 'Linikit', src: '/assets/logos/linikit.png', size: 'small', href: 'https://linikit.com/' },
  { id: 'mercantil', name: 'Mercantil Panamá', src: '/assets/logos/mercantil.webp', size: 'full' },
  { id: 'mony', name: 'Mony', src: '/assets/logos/mony.webp', size: 'full' },
  { id: 'flesip', name: 'Flesip', src: '/assets/logos/flesip.webp', size: 'full', href: 'https://flesip.com/' },
  { id: 'montsaint', name: 'Montsaint', src: '/assets/logos/montsaint.webp', size: 'full', href: 'https://montsaint.es/' },
  { id: 'ayax', name: 'Ayax', src: '/assets/logos/ayax.webp', size: 'full', href: 'https://www.ayaxsuscripcion.com/es/home' },
];

export interface Sector { group: string; n: string; color: string; name: string; years: string; body: string; caseIdx?: number; site?: string }
export const SECTORS: Sector[] = [
  { group: 'Atrinium', n: '01', color: '#8bde5f', name: 'Insurtech · HERMES', years: '2022 a 2026', caseIdx: 0, body: 'Suscripción, contratación y facturación de seguros. Estados, permisos y documentos legales que condicionan cada pantalla.' },
  { group: 'Atrinium', n: '02', color: '#a9a4f8', name: 'Facturación y ERP · Flesip', years: '2024 a 2025', site: 'https://flesip.com/', body: 'Facturación electrónica para pymes: hacer que el camino que cumple la norma sea también el más corto.' },
  { group: 'Atrinium', n: '03', color: '#8bde5f', name: 'E-commerce · Montsaint', years: '2023 a 2025', site: 'https://montsaint.es/', body: 'Catálogo y checkout de marca: ficha de producto, tallas y pago sin fricción innecesaria.' },
  { group: 'Proyectos anteriores', n: '04', color: '#a9a4f8', name: 'Banca · Mercantil Panamá', years: '2020 a 2022', body: 'Pasivos, activos y tarjeta Next Gem, más la app Mony: onboarding y autenticación reforzada en entorno regulado.' },
  { group: 'Proyectos anteriores', n: '05', color: '#8bde5f', name: 'Transporte · Taksio', years: '2018 a 2019', body: 'Plataforma multimodal desde cero: design system primero, flujos de conductor y pasajero después.' },
];

export interface SectorRow extends Sector { head: string; cta: string | null; href: string; external: boolean }
export function sectorRows(): SectorRow[] {
  let last: string | null = null;
  return SECTORS.map((s) => {
    const head = s.group !== last ? s.group : '';
    last = s.group;
    const hasCase = typeof s.caseIdx === 'number';
    const linked = hasCase || !!s.site;
    return {
      ...s, head,
      cta: linked ? (hasCase ? 'Ver el caso ↗' : 'Ver el producto ↗') : null,
      href: hasCase ? '#trabajo' : s.site || '',
      external: !hasCase && !!s.site,
    };
  });
}

export interface UseStep { name: string; lead: string; points: string[] }
export interface UseCase { tab: string; kicker: string; title: string; role: string; context: string; period: string; pitch: string; metrics: { v: string; k: string }[]; learning: string; steps: UseStep[] }
export const USE_CASES: UseCase[] = [
  {
    tab: 'Producto multi-tenant',
    kicker: 'SaaS asegurador · ciclo completo',
    title: 'Un producto estándar para negocios que no se parecen',
    role: 'Único diseñador', context: 'Atrinium · HERMES', period: '2022 – 2026',
    pitch: 'Un SaaS asegurador vendido a compañías con lógicas de negocio incompatibles. Mi trabajo era que se comportaran igual sin obligarlas a trabajar igual.',
    metrics: [
      { v: '165', k: 'pantallas en producción' },
      { v: '8', k: 'áreas de producto' },
      { v: '60 → 14', k: 'campos visibles por paso al emitir una póliza' },
    ],
    learning: 'Instrumenté el design system pero no el producto: sabía cuántos componentes cumplían el sistema, no cuántos minutos ahorraba emitir una póliza. Hoy pediría analítica de uso desde el primer módulo migrado.',
    steps: [
      { name: 'El terreno', lead: 'Producto en producción sin ventana de parada, con corredurías, agencias de suscripción y aseguradoras sobre el mismo núcleo.',
        points: ['Cada compañía con su lógica, su moneda, su idioma y su regulador.', 'Migración de framework y base de datos en marcha, con dos generaciones de interfaz conviviendo.', 'Equipo de siete personas y un solo diseñador.'] },
      { name: 'Lo que había que lograr', lead: 'Homogeneizar el comportamiento sin aplanar la diferencia entre clientes, y sostener ocho áreas sin bifurcar el diseño.',
        points: ['Si el producto se dobla ante cada cliente deja de ser producto; si no se dobla nada, no lo usa nadie.', 'El criterio tenía que quedar escrito, no depender de que yo estuviera en la reunión.'] },
      { name: 'Lo que hice', lead: 'Diseñé reglas en lugar de casos: el cuestionario de cada ramo se declara como dato y la interfaz lo renderiza con su validación.',
        points: ['Design system con tokens semánticos, componentes con contrato y accesibilidad forzada por el linter.', 'Marca e idioma como variables: paleta por cliente al iniciar sesión, cinco idiomas base y siete locales de terminología.', 'Migración módulo a módulo, priorizando consistencia completa antes que mejoras repartidas.'] },
      { name: 'Cómo acabó', lead: 'Ocho áreas de producto funcionando con el mismo lenguaje de diseño, y compañías con modelos de negocio distintos operando sobre el mismo núcleo.',
        points: ['El sistema se mantiene solo: cada módulo nuevo se arma con componentes que ya existen, en vez de rediseñarse.', 'Las discusiones pasaron de gustos a criterios, porque las reglas están escritas y se pueden consultar.', 'El equipo de desarrollo dejó de preguntar cómo se comporta un patrón: está definido antes de llegar a ellos.'] },
    ],
  },
  {
    tab: 'Vista 360 del cliente',
    kicker: 'Panel interno · exploración',
    title: 'Doce alternativas para una decisión',
    role: 'Diseño y exploración', context: 'Atrinium · panel interno', period: '2026',
    pitch: 'El equipo perdía minutos reconstruyendo quién era un cliente antes de hablar con él. Exploré doce composiciones y elegí con criterio de negocio, no de gusto.',
    metrics: [
      { v: '12', k: 'alternativas exploradas' },
      { v: '4', k: 'direcciones finalistas' },
      { v: '1', k: 'nuevo módulo de suscripción de seguros' },
    ],
    learning: 'Validé las cuatro direcciones con el equipo y con criterio de negocio, no con usuarios. Teniéndolos a dos mesas, cinco sesiones de quince minutos habrían salido más baratas que cualquier debate interno.',
    steps: [
      { name: 'El terreno', lead: 'No había vista única del cliente: para entender una cuenta había que reconstruirla saltando entre módulos antes de cada conversación.',
        points: ['Panel interno, usuarios a dos mesas de distancia y una sola pantalla como alcance.'] },
      { name: 'Lo que había que lograr', lead: 'Que cualquiera del equipo entendiera a un cliente en diez segundos, y que el criterio de la elección quedara por escrito.',
        points: ['Aplicar en casa el método de las tres alternativas y llevarlo más lejos: doce exploraciones antes de decidir.'] },
      { name: 'Lo que hice', lead: 'Miré fuera antes de dibujar: benchmark de paneles 360 en CRM, banca y soporte, recorriendo flujos reales pantalla a pantalla con Mobbin en vez de capturas sueltas.',
        points: ['Saqué patrones adaptables (cabecera de identidad persistente, bloques de riesgo y actividad, resumen financiero antes del histórico) y descarté los que solo funcionan con datos que no teníamos.', 'Con esos patrones exploré doce composiciones y reduje a cuatro direcciones comparables.', 'Jerarquía por decisión: lo primero que se mira es lo que cambia una acción, no lo que hay más de.'] },
      { name: 'Cómo acabó', lead: 'Una pantalla en producción y un criterio reutilizable: por qué se descartaron las otras once.',
        points: ['El descarte documentado es lo que evita volver a discutir la misma decisión seis meses después.'] },
    ],
  },
];

export const BIO: string[] = [
  'Diseño producto B2B donde un error operativo cuesta dinero.',
  '*Informático de formación, Product Designer de oficio. Nueve años.* Esa base no está para escribir código de producción: está para cómo pienso el producto, *en sistemas, en estructura y en cómo se va a construir esto de verdad*. Diseño, *planteo la arquitectura de la solución* y la llevo hasta algo que funciona: *modelo el dominio antes que la pantalla*, *defino estados, reglas y casos límite*, y cierro con un *handoff que el equipo puede construir sin interpretar nada*. Trabajo con *patrones validados y criterios de usabilidad*, no con invenciones, y respetando cómo se construye realmente en *React, Chakra UI o Tailwind*. Saber cómo piensa el framework es lo que hace que un diseño llegue a producción tal como se diseñó. Esta web es un ejemplo: el diseño es mío, la implementación *la generé con IA y la dirigí hasta el detalle*. Generar es la parte fácil; lo que aporto es *saber qué hay que pedir y reconocer cuándo lo que devuelve no sirve*.',
  'Entre 2022 y 2026 fui *el único diseñador de un holding con cinco productos*. El principal, un *ERP SaaS multi-tenant para aseguradoras, reaseguradoras, MGAs y brokers*: suscripción, pólizas, recibos, facturación y siniestros. Con él, *el módulo administrador que gobierna todo el grupo*: tenants, planes, permisos y configuración por cliente.',
  'Alrededor de ese núcleo diseñé el resto de la cartera. *Facturación electrónica* con dos audiencias opuestas: el asesor que factura a diario y necesita velocidad, y el cliente final que entra una vez al mes y necesita contexto. Un *sistema de pólizas 360* donde una sola vista sostiene equipo, pólizas, recibos y los pagos a cada interesado. La *gestión de usuarios y permisos* que cruza los cinco productos. Y un *e-commerce* como línea alternativa. *Cinco productos, un solo lenguaje de diseño.*',
  'Es *producto B2B denso*: *tablas de alta densidad*, *wizards de varios pasos*, *formularios generados por esquema*, *white-labeling por tenant* y *reglas de negocio que cambian según el contrato*. Nada de eso se resuelve pantalla a pantalla.',
  'Al entrar, cada módulo se había construido con criterios distintos. La respuesta obvia era imponer un sistema único; propuse otra: *el nivel de sistema que cada producto se puede permitir*. *Design system completo* para el ERP y el administrador: componentes, tokens, jerarquía tipográfica y, sobre todo, *las reglas de decisión: cuándo se usa cada patrón y por qué*. En los productos ligeros, *brandsheet y UI kit*, lo suficiente para sostener la coherencia sin cargarlos con una gobernanza que no necesitan. El punto de partida fue una *auditoría del monorepo*: *267 valores de color reducidos a 24 tokens* con un rol asignado cada uno, *adoptados por los cuatro desarrolladores front*. Sin esa base compartida, reutilizar componentes entre productos no ahorra nada. Es lo que hace que cinco negocios distintos no se sientan como cinco empresas distintas.',
  'Cada semana me senté con *los Product Owners de las aseguradoras*: *discovery antes de diseñar*, y defender cada propuesta antes de pasarla a desarrollo. Se aprende rápido a *explicar una decisión de diseño en lenguaje de negocio*.',
  'Antes, *banca digital en entorno regulado*. Allí el sistema ya existía y mi trabajo era otro: *aplicarlo con criterio* y *validar cada pantalla antes de que llegara a desarrollo*. *Tests de usabilidad no moderados con Maze* y *entrevistas propias* para entender el porqué detrás de la métrica, no solo el dónde. También *sesiones con Marketing para testear los emails transaccionales* y las piezas de marca fuera de la app, porque la experiencia no termina en la pantalla del producto. Nada pasaba a desarrollo sin haberse probado. Antes de eso, una *plataforma de movilidad multimodal*: *design system y flujos operativos levantados desde cero*.',
  'Me interesan *los flujos completos, no las pantallas sueltas*. *Sistemas que hagan que el siguiente diseño y el siguiente desarrollo cuesten menos que el anterior.*',
];

export const SKILLS: string[] = [
  'Arquitectura de información y flujos críticos',
  'Design systems escalables con gobernanza y criterios de uso',
  'Producto B2B denso: tablas, wizards, formularios por esquema',
  'White-labeling y producto multi-tenant',
  'Accesibilidad WCAG 2.2 AAA como requisito de entrada',
  'Discovery y defensa de propuestas ante cliente',
  'Handoff acompañado y diálogo técnico con Desarrollo',
  'Prototipado interactivo y validación con datos de uso real',
  'Liderazgo de diseño en varios productos a la vez, con un solo lenguaje',
  'Research por observación indirecta cuando no hay acceso a usuarios',
  'Modelado de dominio: reglas de negocio declaradas como dato, no cableadas',
  'Auditoría de código y tokens semánticos adoptados por varios equipos front',
  'IA aplicada al proceso: dirigir la implementación, no solo generarla',
  'Marca fuera del producto: emails transaccionales y piezas con Marketing',
  'Decisiones técnicas acordadas con el front lead, no impuestas',
  'Adopción: guías de uso y formación para que un patrón nuevo se entienda',
];

export type CompItem = [lead: string, rest: string];
export interface CompGroup { name: string; items: CompItem[] }
export const COMP_DATA: CompGroup[] = [
  {
    name: 'Estrategia y diseño de producto',
    items: [
      ['Diseño de producto end-to-end.', ' Definición del problema, investigación, arquitectura de información, user flows, prototipado, validación, entrega e iteración después del lanzamiento.'],
      ['Pensamiento de producto y negocio.', ' Traducir necesidades de usuario y objetivos de negocio en soluciones viables, escalables y alineadas con la estrategia.'],
      ['Diseño basado en evidencia.', ' Analítica de producto, feedback de usuarios, pruebas de usabilidad e hipótesis para priorizar mejoras y fundamentar decisiones.'],
      ['Experiencias complejas en B2B SaaS.', ' Entornos con reglas de negocio, múltiples roles, flujos críticos y alta densidad de información.'],
      ['Arquitectura de información y flujos.', ' Simplificar procesos complejos para mejorar comprensión, eficiencia y finalización de tareas.'],
      ['Diseño accesible e inclusivo.', ' Aplicación práctica de WCAG 2.1 y 2.2 en componentes, contenido, contraste, foco, navegación por teclado y estados de error.'],
    ],
  },
  {
    name: 'Liderazgo e influencia',
    items: [
      ['Comunicación estratégica.', ' Presentar propuestas, racionales de diseño y hallazgos para alinear a Product, Engineering, Product Owners y stakeholders.'],
      ['Facilitación de dinámicas de producto.', ' Workshops, sesiones de co-creación, design critiques, definición de flujos y decisiones tomadas en grupo.'],
      ['Influencia transversal.', ' Equilibrio entre experiencia de usuario, objetivos de negocio, prioridades de roadmap y restricciones técnicas.'],
      ['Evangelización de producto y diseño.', ' Explicar la propuesta de valor y las decisiones de diseño ante equipos internos, clientes o audiencias externas.'],
      ['Gestión del conocimiento.', ' Documentación, guías, onboarding y estándares de trabajo que dan autonomía y consistencia al equipo.'],
      ['Autonomía y adaptación.', ' Ownership de iniciativas desde la exploración hasta la implementación, en contextos dinámicos y de alta ambigüedad.'],
    ],
  },
  {
    name: 'Design systems y calidad',
    items: [
      ['Pensamiento sistémico.', ' Creación, evolución y mantenimiento de design systems para plataformas digitales complejas.'],
      ['Gobernanza del sistema.', ' Principios, foundations, tokens, componentes, patrones, documentación, contribución y adopción entre equipos.'],
      ['Interfaces escalables.', ' UI consistente, responsive, accesible y preparada para múltiples casos de uso, estados y dispositivos.'],
      ['Calidad de experiencia.', ' Interacción, jerarquía visual, microcopy, estados vacíos, errores, carga, feedback y escenarios límite.'],
      ['Coherencia entre marca y producto.', ' Identidad visual, tono y principios de marca aplicados al producto, junto a Brand y Marketing.'],
    ],
  },
  {
    name: 'Colaboración técnica y entrega',
    items: [
      ['Colaboración estrecha con desarrollo.', ' Especificaciones claras, handoff estructurado, revisión de implementación y dudas resueltas juntos para preservar la intención de diseño.'],
      ['Front-end aplicado al diseño.', ' Componentes, responsive, design tokens y límites de implementación en entornos React, TypeScript y Chakra UI.'],
      ['Diseño orientado a viabilidad técnica.', ' Soluciones que equilibran calidad UX/UI, esfuerzo de desarrollo, mantenimiento y escalabilidad.'],
      ['Trabajo ágil y delivery.', ' Scrum y Kanban con Jira: prioridades, refinamiento y seguimiento de iniciativas.'],
      ['Herramientas de diseño y documentación.', ' Figma, prototipado, bibliotecas de componentes, documentación de patrones y handoff con equipos técnicos.'],
    ],
  },
];

export const TOOL_GROUPS: { name: string; items: string[] }[] = [
  { name: 'Diseño y multimedia', items: ['Figma (avanzado)', 'FigJam', 'Prototipos interactivos', 'Photoshop', 'Illustrator', 'Premiere', 'Canva', 'CapCut', 'Pincel'] },
  { name: 'Desarrollo y despliegue', items: ['HTML · CSS', 'Chakra UI', 'Tailwind', 'Material UI', 'React', 'GitHub', 'Vercel', 'WordPress'] },
  { name: 'Analítica y comportamiento', items: ['Microsoft Clarity', 'Google Analytics', 'HubSpot', 'Maze', 'Mobbin'] },
  { name: 'Inteligencia artificial', items: ['Claude', 'Gemini', 'Google Stitch', 'Perplexity'] },
  { name: 'Mensajería y correo', items: ['SendGrid'] },
];
