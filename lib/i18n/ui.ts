import type { Locale } from './config';

/* Etiquetas de interfaz en los dos idiomas. Aquí solo van las palabras del
   chasis —navegación, encabezados de sección, estados—; el contenido de cada
   caso vive en lib/content y en lib/content/en. */
export interface Ui {
  nav: { work: string; about: string; contact: string };
  skip: string;
  home: {
    kicker: string; heroLines: [string, string]; heroSub: string;
    facts: { value: string; label: string }[];
    sectorsKicker: string; sectorsTitle: [string, string]; sectorsLead: string; sectorsAreas: string;
    manifesto: [string, string];
    workKicker: string; workTitle: [string, string];
    logosLabel: string;
    closingTitle: [string, string];
    closingGrid: { k: string; v: string }[];
    availability: string;
    competencies: string; competenciesCount: (n: number) => string; competenciesUnit: string;
  };
  catalog: { filtersLabel: string; count: (n: number) => string; seeCase: string; open: string; listLabel: string };
  case: {
    back: string; navLabel: string; demo: string; gallery: { open: string; close: string; prev: string; next: string; of: string }; dock: { label: string; back: string; prev: string; next: string; of: string }; live: string; index: string; parts: (n: number) => string;
    context: string; role: string; delivery: string;
    sections: Record<string, string>;
    why: string; changed: string; tradeoff: string; wouldFix: string;
    systemToggle: string; implToggle: string; kitLabel: string;
    /* El caso contado como storyboard (ver `Storyboard` en los tipos del caso). */
    story: { slate: string; company: string; years: string; acts: string; shots: string; decisions: string; map: string; mapNote: string; rowActs: string; rowShots: string; rowDecision: string; rowFrame: string; frame: { draw: string; live: string; shot: string; diagram: string }; act: string; shot: string; decision: string; bridge: string; meta: (shots: number, decisions: number) => string; progress: string; close: string; learnings: string };
    output: string; outcome: string; unavailable: string; measure: string;
    codeIllustrative: string; codeRepo: string; codeOpen: string;
    findings: { n: string; finding: string; rule: string; severity: string; where: string; caption: string };
    severity: Record<string, string>;
    next: string; nextLabel: string;
    handoff: { eyebrow: string; title: string; lead: string; steps: { t: string; d: string }[]; outLabel: string; out: string[] };
    film: { eyebrow: string; title: string; lead: string; play: string; pause: string; replay: string; timeline: string; shot: string; stage: string; from: string; phases: string[] };
  };
  about: {
    title: string; personal: string; live: string; before: string; born: string;
    education: string; eduNote: string; drawer: string; drawerTitle: string;
    proc: { title: string; steps: string; prev: string; next: string; principles: string; does: string };
    deck: { flip: string; back: string; seen: (n: number, total: number) => string; done: string; doneLink: string; skillsCount: (n: number) => string };
    film: { title: string; lead: string; play: string; pause: string; replay: string; music: string; fullscreen: string; exitFullscreen: string; timeline: string; hint: string; stage: string };
    ikigai: string; companies: string; tools: string; skills: string;
    socialLabel: string; more: string; close: string; books: string;
  };
  cv: { label: string; format: string; download: (lang: string, kb: number) => string };
  footer: { role: string; contact: string; available: string; legal: string; privacy: string; cookies: string; remote: string };
  consent: { text: string; accept: string; reject: string; change: string };
  copy: { label: string; done: string; failed: string };
  contact: {
    title: string; lead: string;
    nombre: string; email: string; mensaje: string; privacidad: string; privacidadEnlace: string;
    enviar: string; enviando: string;
    okTitulo: string; okTexto: string; otro: string; linkedin: string; separador: string;
    errNombre: string; errEmail: string; errMensaje: string; errPrivacidad: string; errServicio: string; errBot: string;
    obligatorio: string; capa: string;
  };
  lang: { label: string };
}

const es: Ui = {
  nav: { work: 'Trabajos', about: 'Sobre mí', contact: 'Contactar' },
  skip: 'Saltar al contenido',
  home: {
    kicker: 'Senior Product Designer · Design Systems · B2B y B2C SaaS e Insurtech',
    heroLines: ['Diseño producto B2B complejo', 'y lo llevo a producción.'],
    heroSub: 'Más de ocho años en producto B2B; los cuatro últimos, único diseñador de un holding de cinco productos. Modelo el dominio, lo convierto en tokens, componentes y reglas, y reviso la implementación en React hasta que el diseño llega entero.',
    facts: [
      { value: '267 → 24', label: 'valores de color a tokens' }, { value: '8', label: 'áreas de producto' },
      { value: '5', label: 'productos, un lenguaje' }, { value: '2022–2026', label: 'único diseñador del holding' },
    ],
    sectorsKicker: 'Sectores',
    sectorsTitle: ['Cinco sectores', 'que conozco por dentro.'],
    sectorsLead: 'Un CRM o un back office no se diseña para un usuario: lo usan a la vez comercial, operaciones, finanzas y dirección, cada uno con sus permisos y sus prisas. Mi trabajo es que el mismo sistema les sirva a todos, sin que ninguno pague el atajo de otro.',
    sectorsAreas: 'Para quién diseñé',
    manifesto: ['Diseño productos B2B donde un error operativo cuesta dinero,', 'por eso creo reglas escalables en lugar de resolver casos uno a uno.'],
    workKicker: 'Trabajos',
    workTitle: ['Casos y productos', 'en producción.'],
    logosLabel: 'Empresas con las que he trabajado',
    closingTitle: ['¿Tienes un producto complejo?', 'Lo convierto en flujos, estados y criterios claros, y los trabajo con tu equipo hasta producción.'],
    closingGrid: [
      { k: 'Problema', v: 'Complejidad B2B' }, { k: 'Método', v: 'UX + sistema + UI + implementación' },
      { k: 'Evidencia', v: 'Más de ocho años · SaaS asegurador en producción' }, { k: 'Acción', v: 'Un correo' },
    ],
    availability: 'Disponible ahora · roles Senior o Lead de Product Design · en remoto desde España (CET)',
    competencies: 'Competencias clave',
    competenciesCount: (n) => String(n).padStart(2, '0'),
    competenciesUnit: 'competencias',
  },
  catalog: { filtersLabel: 'Filtrar proyectos', count: (n) => `${n} ${n === 1 ? 'proyecto' : 'proyectos'}`, seeCase: 'Ver caso', open: 'Abrir', listLabel: 'Proyectos' },
  case: {
    back: '← Trabajos', demo: 'Ver demo', navLabel: 'Navegación entre casos', gallery: { open: 'Ampliar', close: 'Cerrar', prev: 'Imagen anterior', next: 'Imagen siguiente', of: '{i} de {n}' }, dock: { label: 'Proyectos', back: 'Trabajos', prev: 'Caso anterior', next: 'Siguiente caso', of: 'Caso {i} de {n}' }, live: 'Ver en producción', index: 'Índice del caso', parts: (n) => `${String(n).padStart(2, '0')} partes`,
    context: 'Contexto', role: 'Rol', delivery: 'Entrega',
    sections: { 'c-problema': 'Problema', 'c-demo': 'Pruébalo', 'c-reto': 'El reto', 'c-complejidad': 'Complejidad', 'c-audiencias': 'Audiencias', 'c-decisiones': 'Decisiones', 'c-flujos': 'Flujos', 'c-sistema': 'Sistema', 'c-diseno': 'Diseño', 'c-hallazgos': 'Hallazgos', 'c-impl': 'Implementación', 'c-resultado': 'Resultado', 'c-apr': 'Aprendizajes' },
    why: 'Por qué.', changed: 'Qué cambió.', tradeoff: 'Contrapartida asumida', wouldFix: 'Lo que corregiría',
    systemToggle: 'Tokens, componentes y reglas', implToggle: 'Cómo llegó a producción', kitLabel: 'Kit del sistema',
    story: { slate: 'Ficha del caso', company: 'Empresa', years: 'Año', acts: 'Actos', shots: 'Planos', decisions: 'Decisiones', map: 'El caso, plano a plano', mapNote: 'Cada columna es un plano. Las marcas señalan dónde se tomó una decisión; pulsa un plano para ir a él.', rowActs: 'Actos', rowShots: 'Planos', rowDecision: 'Decisión', rowFrame: 'Fotograma', frame: { draw: 'Dibujo', live: 'Pieza viva', shot: 'Captura', diagram: 'Diagrama' }, act: 'Acto', shot: 'Plano', decision: 'Decisión', bridge: 'Lleva a', meta: (n, d) => `${n} ${n === 1 ? 'plano' : 'planos'}${d ? ` · ${d} ${d === 1 ? 'decisión' : 'decisiones'}` : ''}`, progress: 'Progreso del storyboard', close: 'Resultado', learnings: 'Aprendizajes' },
    output: 'Output', outcome: 'Outcome', unavailable: 'Dato no disponible', measure: 'Qué mediría hoy',
    codeIllustrative: 'ejemplo ilustrativo', codeRepo: 'extracto del repositorio', codeOpen: 'Ver el archivo en GitHub',
    findings: { n: '#', finding: 'Hallazgo', rule: 'Regla', severity: 'Severidad', where: 'Dónde', caption: 'Hallazgos ordenados por severidad, con la regla que incumplen y la pantalla donde ocurren' },
    severity: { 'crítica': 'crítica', alta: 'alta', media: 'media', baja: 'baja' },
    next: 'Siguiente caso', nextLabel: 'Siguiente caso',
    handoff: {
      eyebrow: 'Cómo entrego el sistema', title: 'Del Figma al código, sin traducciones',
      lead: 'Las pantallas son la mitad del trabajo. La otra mitad es que desarrollo pueda construirlas sin adivinar, y que el producto se vea igual en el ticket número cien que en el primero.',
      steps: [
        { t: 'Kick-off en Figma', d: 'El proyecto arranca en un archivo compartido: objetivo, alcance, usuarios y flujos en el mismo lienzo donde después se diseña. Negocio, producto y desarrollo deciden sobre lo mismo desde el primer día.' },
        { t: 'Pantallas dinámicas con IA', d: 'Con vibe coding convierto las pantallas clave en prototipos que funcionan en el navegador. Son ejemplos reales para probar el responsive en cualquier ancho y validar con datos antes de escribir una línea de producción.' },
        { t: 'Micro-interacciones y motion', d: 'Hover, carga, éxito y error se definen con duración y curva, no con adjetivos. Lo que se aprueba en el prototipo es exactamente lo que se mueve en producción.' },
        { t: 'Efectos con sus valores', d: 'Sombras, desenfoques, degradados y entradas animadas documentados con números. El acabado no depende de quién lo implemente.' },
        { t: 'Foundations en JSON', d: 'Exporto los tokens en JSON: colores, tipografía, espaciado, radios, reglas de uso y comportamientos. Desarrollo los importa tal cual, y una IA los lee sin interpretar.' },
      ],
      outLabel: 'Lo que recibe el equipo', out: ['Archivo de kick-off', 'Prototipo navegable', 'Especificación de motion', 'tokens.json con reglas'],
    },
    film: { eyebrow: 'Film del caso', title: 'El caso, plano a plano', lead: 'El proyecto montado como un storyboard: las pantallas reales entran por fases y cada plano abre una parte del caso, que se lee debajo junto a su plano.', play: 'Reproducir', pause: 'Pausa', replay: 'Volver a ver', timeline: 'Línea de tiempo del film', shot: 'Plano', stage: 'Fotograma del film', from: 'Desde aquí', phases: ['Apertura', 'Descubrir', 'Definir', 'Desarrollar', 'Entregar', 'Cierre'] },
  },
  about: {
    title: 'Sobre mí', personal: 'Personal', live: 'Vivo en', before: 'Antes, en', born: 'Nací en Venezuela.',
    education: 'Formación', eduNote: 'Informático de formación, Product Designer de oficio.',
    drawer: 'Mi forma de trabajar', drawerTitle: 'Cómo trabajo, de los requisitos a producción',
    proc: { title: 'El proceso', steps: 'Pasos del proceso', prev: 'Paso anterior', next: 'Paso siguiente', principles: 'Tres criterios no negociables', does: 'Qué hago en este paso' },
    deck: { flip: 'Ver la prueba', back: 'Volver', seen: (n, total) => `${n} de ${total} vistas`, done: 'Las tres, aplicadas en un caso real.', doneLink: 'Ver HERMES', skillsCount: (n) => `${n} capacidades` },
    film: { title: 'Página en blanco', lead: 'Un motion film sin voz, de 85 segundos, sobre cómo diseño con IA: de la página en blanco a la mesa de clientes, por las fases del design thinking.', play: 'Reproducir', pause: 'Pausa', replay: 'Volver a ver', music: 'Música', fullscreen: 'Pantalla completa', exitFullscreen: 'Salir de pantalla completa', timeline: 'Línea de tiempo del film', hint: 'Pulsa la línea de tiempo para saltar. Con las flechas ← → avanzas o retrocedes 2,5 s, un compás.', stage: 'Film «Página en blanco», 85 segundos, sin voz' },
    ikigai: 'Ikigai', companies: 'Empresas', tools: 'Herramientas', skills: 'Lo que aporto',
    socialLabel: 'Redes', more: 'Más información', close: 'Cerrar', books: 'Libros que recomiendo',
  },
  cv: { label: 'Descargar CV', format: 'PDF', download: (lang, kb) => `Descargar el CV en ${lang} (PDF, ${kb} KB)` },
  footer: { role: 'Senior Product Designer · Design Systems · B2B y B2C SaaS e Insurtech', contact: 'Ponte en contacto', available: 'Disponible ahora · Senior / Lead · remoto desde España (CET)', legal: '© 2026', privacy: 'Privacidad', cookies: 'Cookies', remote: 'Trabajo en remoto' },
  consent: { text: 'Uso analítica para ver cómo se navega esta web: Google Analytics, Microsoft Clarity, Hotjar y HubSpot. Usan cookies o almacenamiento del navegador, nada de publicidad, y solo se activan si lo aceptas.', accept: 'Aceptar', reject: 'Rechazar', change: 'Cambiar mi decisión' },
  copy: { label: 'Copiar mi correo', done: 'Correo copiado', failed: 'No se pudo copiar, cópialo a mano' },
  contact: {
    title: 'Escríbeme', lead: 'Cuéntame qué producto tienes entre manos. Respondo yo, y en un día laborable.',
    nombre: 'Tu nombre', email: 'Tu correo', mensaje: 'Qué necesitas', privacidad: 'He leído y acepto la', privacidadEnlace: 'política de privacidad',
    enviar: 'Enviar mensaje', enviando: 'Enviando…',
    okTitulo: 'Mensaje enviado.', okTexto: 'Te respondo a tu correo en un día laborable.', otro: 'Escribir otro', linkedin: 'Escríbeme en LinkedIn', separador: 'O envíame un mensaje',
    errNombre: 'Escribe tu nombre, aunque sea sólo el de pila.',
    errEmail: 'Ese correo no parece válido, y es por donde te respondo.',
    errMensaje: 'Cuéntame algo más: con diez caracteres no sé qué necesitas.',
    errPrivacidad: 'Necesito que aceptes la política para poder responderte.',
    errServicio: 'No he podido enviarlo. Escríbeme directamente a vctrmz47@gmail.com y lo vemos.',
    errBot: 'No he podido enviarlo. Copia mi correo o escríbeme por LinkedIn, aquí arriba, y lo vemos.',
    obligatorio: 'obligatorio',
    capa: 'Tus datos los trato yo, Víctor Maza, solo para responderte. Puedes acceder a ellos, corregirlos o borrarlos cuando quieras.',
  },
  lang: { label: 'Idioma' },
};

const en: Ui = {
  nav: { work: 'Works', about: 'About', contact: 'Get in touch' },
  skip: 'Skip to content',
  home: {
    kicker: 'Senior Product Designer · Design Systems · B2B and B2C SaaS and Insurtech',
    heroLines: ['I design complex B2B products', 'and take them to production.'],
    heroSub: 'Eight-plus years in B2B product; the last four as the only designer of a group of five products. I model the domain, turn it into tokens, components and rules, and review the React implementation until the design ships whole.',
    facts: [
      { value: '267 → 24', label: 'colour values to tokens' }, { value: '8', label: 'product areas' },
      { value: '5', label: 'products, one language' }, { value: '2022–2026', label: 'sole designer of the group' },
    ],
    sectorsKicker: 'Sectors',
    sectorsTitle: ['Five sectors', 'I know from the inside.'],
    sectorsLead: 'A CRM or a back office is never designed for one user: sales, operations, finance and management work in it at the same time, each with their own permissions and pressures. My job is to make one system serve all of them, without anyone paying for someone else’s shortcut.',
    sectorsAreas: 'Who I designed for',
    manifesto: ['I design B2B products where an operational mistake costs money,', 'so I build scalable rules instead of solving cases one by one.'],
    workKicker: 'Works',
    workTitle: ['Cases and products', 'in production.'],
    logosLabel: 'Companies I have worked with',
    closingTitle: ['Do you have a complex product?', 'I turn it into clear flows, states and criteria, and work them through with your team until they ship.'],
    closingGrid: [
      { k: 'Problem', v: 'B2B complexity' }, { k: 'Method', v: 'UX + system + UI + implementation' },
      { k: 'Evidence', v: 'Eight-plus years · insurance SaaS in production' }, { k: 'Action', v: 'One email' },
    ],
    availability: 'Available now · Senior or Lead Product Design roles · remote',
    competencies: 'Core competencies',
    competenciesCount: (n) => String(n).padStart(2, '0'),
    competenciesUnit: 'competencies',
  },
  catalog: { filtersLabel: 'Filter projects', count: (n) => `${n} ${n === 1 ? 'project' : 'projects'}`, seeCase: 'Read the case', open: 'Open', listLabel: 'Projects' },
  case: {
    back: '← Works', demo: 'See the demo', navLabel: 'Case navigation', gallery: { open: 'Enlarge', close: 'Close', prev: 'Previous image', next: 'Next image', of: '{i} of {n}' }, dock: { label: 'Projects', back: 'Works', prev: 'Previous case', next: 'Next case', of: 'Case {i} of {n}' }, live: 'See it live', index: 'Case index', parts: (n) => `${String(n).padStart(2, '0')} parts`,
    context: 'Context', role: 'Role', delivery: 'Delivered',
    sections: { 'c-problema': 'Problem', 'c-demo': 'Try it', 'c-reto': 'The challenge', 'c-complejidad': 'Complexity', 'c-audiencias': 'Audiences', 'c-decisiones': 'Decisions', 'c-flujos': 'Flows', 'c-sistema': 'System', 'c-diseno': 'Design', 'c-hallazgos': 'Findings', 'c-impl': 'Implementation', 'c-resultado': 'Result', 'c-apr': 'Takeaways' },
    why: 'Why.', changed: 'What changed.', tradeoff: 'Trade-off accepted', wouldFix: 'What I would fix',
    systemToggle: 'Tokens, components and rules', implToggle: 'How it reached production', kitLabel: 'System kit',
    story: { slate: 'Case slate', company: 'Company', years: 'Year', acts: 'Acts', shots: 'Shots', decisions: 'Decisions', map: 'The case, shot by shot', mapNote: 'Each column is a shot. The marks show where a decision was made; select a shot to jump to it.', rowActs: 'Acts', rowShots: 'Shots', rowDecision: 'Decision', rowFrame: 'Frame', frame: { draw: 'Drawing', live: 'Live piece', shot: 'Screenshot', diagram: 'Diagram' }, act: 'Act', shot: 'Shot', decision: 'Decision', bridge: 'Leads to', meta: (n, d) => `${n} ${n === 1 ? 'shot' : 'shots'}${d ? ` · ${d} ${d === 1 ? 'decision' : 'decisions'}` : ''}`, progress: 'Storyboard progress', close: 'Outcome', learnings: 'Learnings' },
    output: 'Output', outcome: 'Outcome', unavailable: 'Data not available', measure: 'What I would measure today',
    codeIllustrative: 'illustrative example', codeRepo: 'excerpt from the repository', codeOpen: 'See the file on GitHub',
    findings: { n: '#', finding: 'Finding', rule: 'Rule', severity: 'Severity', where: 'Where', caption: 'Findings ordered by severity, with the rule they break and the screen where they happen' },
    severity: { 'crítica': 'critical', alta: 'high', media: 'medium', baja: 'low' },
    next: 'Next case', nextLabel: 'Next case',
    handoff: {
      eyebrow: 'How I hand over the system', title: 'From Figma to code, nothing lost in translation',
      lead: 'Screens are half the job. The other half is making sure engineering can build them without guessing, and that the product looks the same on ticket one hundred as on ticket one.',
      steps: [
        { t: 'Kick-off in Figma', d: 'Every project starts in a shared file: goal, scope, users and flows on the same canvas where the design happens next. Business, product and engineering decide on the same thing from day one.' },
        { t: 'Live screens with AI', d: 'With vibe coding I turn the key screens into prototypes that run in the browser. They are real examples to test responsive behaviour at any width and validate with data before a single line of production code.' },
        { t: 'Micro-interactions and motion', d: 'Hover, loading, success and error are defined with duration and easing, not adjectives. What gets approved in the prototype is exactly what moves in production.' },
        { t: 'Effects with their values', d: 'Shadows, blurs, gradients and entrance animations documented with numbers. The finish does not depend on who builds it.' },
        { t: 'Foundations as JSON', d: 'I export the tokens as JSON: colour, type, spacing, radii, usage rules and behaviours. Engineering imports them as they are, and an AI reads them without interpreting.' },
      ],
      outLabel: 'What the team gets', out: ['Kick-off file', 'Clickable prototype', 'Motion spec', 'tokens.json with rules'],
    },
    film: { eyebrow: 'Case film', title: 'The case, shot by shot', lead: 'The project cut as a storyboard: the real screens come in by phase, and each shot opens a part of the case, which you can read below next to its shot.', play: 'Play', pause: 'Pause', replay: 'Watch again', timeline: 'Film timeline', shot: 'Shot', stage: 'Film frame', from: 'From here', phases: ['Opening', 'Discover', 'Define', 'Develop', 'Deliver', 'Close'] },
  },
  about: {
    title: 'About me', personal: 'Personal', live: 'I live in', before: 'Before that, in', born: 'I was born in Venezuela.',
    education: 'Education', eduNote: 'Computer scientist by training, Product Designer by trade.',
    drawer: 'How I work', drawerTitle: 'How I work, from requirements to production',
    proc: { title: 'The process', steps: 'Process steps', prev: 'Previous step', next: 'Next step', principles: 'Three non-negotiables', does: 'What I do in this step' },
    deck: { flip: 'See the proof', back: 'Back', seen: (n, total) => `${n} of ${total} seen`, done: 'All three, applied in a real case.', doneLink: 'See HERMES', skillsCount: (n) => `${n} capabilities` },
    film: { title: 'Blank page', lead: 'An 85-second motion film with no voice-over about how I design with AI: from the blank page to the client table, through the phases of design thinking.', play: 'Play', pause: 'Pause', replay: 'Watch again', music: 'Music', fullscreen: 'Full screen', exitFullscreen: 'Exit full screen', timeline: 'Film timeline', hint: 'Select the timeline to jump. Use the ← → arrows to move 2.5 s, one bar.', stage: '“Blank page” film, 85 seconds, no voice-over' },
    ikigai: 'Ikigai', companies: 'Companies', tools: 'Tools', skills: 'What I bring',
    socialLabel: 'Social', more: 'More', close: 'Close', books: 'Books I recommend',
  },
  cv: { label: 'Download CV', format: 'PDF', download: (lang, kb) => `Download the CV in ${lang} (PDF, ${kb} KB)` },
  footer: { role: 'Senior Product Designer · Design Systems · B2B and B2C SaaS and Insurtech', contact: 'Get in touch', available: 'Available now · Senior / Lead · remote from Spain (CET)', legal: '© 2026', privacy: 'Privacy', cookies: 'Cookies', remote: 'Working remotely' },
  consent: { text: 'I use analytics to see how this site is read: Google Analytics, Microsoft Clarity, Hotjar and HubSpot. They use cookies or browser storage, never advertising, and load only if you accept.', accept: 'Accept', reject: 'Decline', change: 'Change my choice' },
  copy: { label: 'Copy my email', done: 'Email copied', failed: 'Could not copy it, copy it by hand' },
  contact: {
    title: 'Write to me', lead: 'Tell me what product you are working on. I answer personally, within one working day.',
    nombre: 'Your name', email: 'Your email', mensaje: 'What you need', privacidad: 'I have read and accept the', privacidadEnlace: 'privacy policy',
    enviar: 'Send message', enviando: 'Sending…',
    okTitulo: 'Message sent.', okTexto: 'I will reply to your email within one working day.', otro: 'Write another', linkedin: 'Message me on LinkedIn', separador: 'Or send me a message',
    errNombre: 'Please write your name, a first name is enough.',
    errEmail: 'That email does not look valid, and it is how I reply.',
    errMensaje: 'Tell me a bit more: ten characters is not enough to know what you need.',
    errPrivacidad: 'I need you to accept the policy so that I can reply.',
    errServicio: 'I could not send it. Write to me directly at vctrmz47@gmail.com and we will sort it out.',
    errBot: 'I could not send it. Copy my email or message me on LinkedIn, just above, and we will sort it out.',
    obligatorio: 'required',
    capa: 'Your details are handled by me, Víctor Maza, only to reply to you. You can access, correct or delete them whenever you like.',
  },
  lang: { label: 'Language' },
};

export const UI: Record<Locale, Ui> = { es, en };
export const getUi = (locale: Locale): Ui => UI[locale] ?? UI.es;
