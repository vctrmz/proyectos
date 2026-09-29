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
    sectorsKicker: string; sectorsTitle: [string, string];
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
    back: string; live: string; index: string; parts: (n: number) => string;
    context: string; role: string; delivery: string;
    sections: Record<string, string>;
    why: string; changed: string; tradeoff: string; wouldFix: string;
    systemToggle: string; implToggle: string; kitLabel: string;
    output: string; outcome: string; unavailable: string; measure: string;
    codeIllustrative: string; codeRepo: string; codeOpen: string;
    findings: { n: string; finding: string; rule: string; severity: string; where: string; caption: string };
    severity: Record<string, string>;
    next: string; nextLabel: string;
  };
  about: {
    title: string; personal: string; live: string; before: string; born: string;
    education: string; eduNote: string; drawer: string; drawerTitle: string;
    ikigai: string; companies: string; tools: string; contact: string; skills: string;
    socialLabel: string; more: string; close: string;
  };
  cv: { label: string; format: string };
  footer: { role: string; contact: string; available: string; legal: string; privacy: string; cookies: string; remote: string };
  consent: { text: string; accept: string; reject: string; change: string };
  lang: { label: string };
}

const es: Ui = {
  nav: { work: 'Trabajo', about: 'Sobre mí', contact: 'Contactar' },
  skip: 'Saltar al contenido',
  home: {
    kicker: 'Product Designer · Design Systems · B2B SaaS e Insurtech',
    heroLines: ['Diseño producto B2B complejo', 'y lo llevo a producción.'],
    heroSub: 'Nueve años en SaaS asegurador, ERP y banca, casi siempre como único diseñador. Modelo el dominio, lo convierto en tokens, componentes y reglas que el front consume tal cual, y reviso la implementación en React hasta que el diseño llega entero.',
    facts: [
      { value: '267 → 24', label: 'valores de color a tokens' }, { value: '8', label: 'áreas de producto' },
      { value: '5', label: 'productos, un lenguaje' }, { value: '2022–2026', label: 'único diseñador del holding' },
    ],
    sectorsKicker: 'Sectores',
    sectorsTitle: ['Dominios donde', 'un error cuesta dinero.'],
    manifesto: ['Diseño productos B2B donde un error operativo cuesta dinero,', 'por eso creo reglas escalables en lugar de resolver casos uno a uno.'],
    workKicker: 'Trabajo',
    workTitle: ['Casos y productos', 'en producción.'],
    logosLabel: 'Empresas con las que he trabajado',
    closingTitle: ['¿Tienes un producto complejo?', 'Reglas densas, varios clientes, un equipo que necesita diseño construible.'],
    closingGrid: [
      { k: 'Problema', v: 'Complejidad B2B' }, { k: 'Método', v: 'UX + sistema + UI + implementación' },
      { k: 'Evidencia', v: 'Nueve años · SaaS asegurador en producción' }, { k: 'Acción', v: 'Un correo' },
    ],
    availability: 'Disponible ahora · roles Senior o Lead de Product Design · remoto o híbrido en Málaga',
    competencies: 'Competencias clave',
    competenciesCount: (n) => String(n).padStart(2, '0'),
    competenciesUnit: 'competencias',
  },
  catalog: { filtersLabel: 'Filtrar proyectos', count: (n) => `${n} ${n === 1 ? 'proyecto' : 'proyectos'}`, seeCase: 'Ver caso', open: 'Abrir', listLabel: 'Proyectos' },
  case: {
    back: '← Trabajo', live: 'Ver en producción', index: 'Índice del caso', parts: (n) => `${String(n).padStart(2, '0')} partes`,
    context: 'Contexto', role: 'Rol', delivery: 'Entrega',
    sections: { 'c-problema': 'Problema', 'c-reto': 'El reto', 'c-complejidad': 'Complejidad', 'c-audiencias': 'Audiencias', 'c-decisiones': 'Decisiones', 'c-flujos': 'Flujos', 'c-sistema': 'Sistema', 'c-diseno': 'Diseño', 'c-hallazgos': 'Hallazgos', 'c-impl': 'Implementación', 'c-resultado': 'Resultado', 'c-apr': 'Aprendizajes' },
    why: 'Por qué.', changed: 'Qué cambió.', tradeoff: 'Contrapartida asumida', wouldFix: 'Lo que corregiría',
    systemToggle: 'Tokens, componentes y reglas', implToggle: 'Cómo llegó a producción', kitLabel: 'Kit del sistema',
    output: 'Output', outcome: 'Outcome', unavailable: 'Dato no disponible', measure: 'Qué mediría hoy',
    codeIllustrative: 'ejemplo ilustrativo', codeRepo: 'extracto del repositorio', codeOpen: 'Ver el archivo en GitHub',
    findings: { n: '#', finding: 'Hallazgo', rule: 'Regla', severity: 'Severidad', where: 'Dónde', caption: 'Hallazgos ordenados por severidad, con la regla que incumplen y la pantalla donde ocurren' },
    severity: { 'crítica': 'crítica', alta: 'alta', media: 'media', baja: 'baja' },
    next: 'Siguiente caso', nextLabel: 'Siguiente caso',
  },
  about: {
    title: 'Sobre mí', personal: 'Personal', live: 'Vivo en', before: 'Antes, en', born: 'Nací en Venezuela.',
    education: 'Formación', eduNote: 'Informático de formación, Product Designer de oficio.',
    drawer: 'Ver el detalle', drawerTitle: 'Nueve años, contados por dentro',
    ikigai: 'Ikigai', companies: 'Empresas', tools: 'Herramientas', contact: 'Contacto', skills: 'Lo que aporto',
    socialLabel: 'Redes', more: 'Más información', close: 'Cerrar',
  },
  cv: { label: 'Descargar CV', format: 'PDF' },
  footer: { role: 'Product Designer · Design Systems · B2B SaaS e Insurtech', contact: 'Ponte en contacto', available: 'Disponible ahora · Senior / Lead · remoto', legal: '© 2026', privacy: 'Privacidad', cookies: 'Cookies', remote: 'Trabajo en remoto' },
  consent: { text: 'Uso analítica para ver cómo se navega esta web: Google Analytics, Microsoft Clarity, Hotjar, Plerdy y HubSpot. Usan cookies o almacenamiento del navegador, nada de publicidad, y solo se activan si lo aceptas.', accept: 'Aceptar', reject: 'Rechazar', change: 'Cambiar mi decisión' },
  lang: { label: 'Idioma' },
};

const en: Ui = {
  nav: { work: 'Work', about: 'About', contact: 'Get in touch' },
  skip: 'Skip to content',
  home: {
    kicker: 'Product Designer · Design Systems · B2B SaaS and Insurtech',
    heroLines: ['I design complex B2B products', 'and take them to production.'],
    heroSub: 'Nine years in insurance SaaS, ERP and banking, almost always as the only designer. I model the domain, turn it into tokens, components and rules the front end consumes as they are, and review the React implementation until the design ships whole.',
    facts: [
      { value: '267 → 24', label: 'colour values to tokens' }, { value: '8', label: 'product areas' },
      { value: '5', label: 'products, one language' }, { value: '2022–2026', label: 'sole designer of the group' },
    ],
    sectorsKicker: 'Sectors',
    sectorsTitle: ['Domains where', 'a mistake costs money.'],
    manifesto: ['I design B2B products where an operational mistake costs money,', 'so I build scalable rules instead of solving cases one by one.'],
    workKicker: 'Work',
    workTitle: ['Cases and products', 'in production.'],
    logosLabel: 'Companies I have worked with',
    closingTitle: ['Do you have a complex product?', 'Dense rules, several clients, a team that needs design it can actually build.'],
    closingGrid: [
      { k: 'Problem', v: 'B2B complexity' }, { k: 'Method', v: 'UX + system + UI + implementation' },
      { k: 'Evidence', v: 'Nine years · insurance SaaS in production' }, { k: 'Action', v: 'One email' },
    ],
    availability: 'Available now · Senior or Lead Product Design roles · remote or hybrid in Málaga',
    competencies: 'Core competencies',
    competenciesCount: (n) => String(n).padStart(2, '0'),
    competenciesUnit: 'competencies',
  },
  catalog: { filtersLabel: 'Filter projects', count: (n) => `${n} ${n === 1 ? 'project' : 'projects'}`, seeCase: 'Read the case', open: 'Open', listLabel: 'Projects' },
  case: {
    back: '← Work', live: 'See it live', index: 'Case index', parts: (n) => `${String(n).padStart(2, '0')} parts`,
    context: 'Context', role: 'Role', delivery: 'Delivered',
    sections: { 'c-problema': 'Problem', 'c-reto': 'The challenge', 'c-complejidad': 'Complexity', 'c-audiencias': 'Audiences', 'c-decisiones': 'Decisions', 'c-flujos': 'Flows', 'c-sistema': 'System', 'c-diseno': 'Design', 'c-hallazgos': 'Findings', 'c-impl': 'Implementation', 'c-resultado': 'Result', 'c-apr': 'Takeaways' },
    why: 'Why.', changed: 'What changed.', tradeoff: 'Trade-off accepted', wouldFix: 'What I would fix',
    systemToggle: 'Tokens, components and rules', implToggle: 'How it reached production', kitLabel: 'System kit',
    output: 'Output', outcome: 'Outcome', unavailable: 'Data not available', measure: 'What I would measure today',
    codeIllustrative: 'illustrative example', codeRepo: 'excerpt from the repository', codeOpen: 'See the file on GitHub',
    findings: { n: '#', finding: 'Finding', rule: 'Rule', severity: 'Severity', where: 'Where', caption: 'Findings ordered by severity, with the rule they break and the screen where they happen' },
    severity: { 'crítica': 'critical', alta: 'high', media: 'medium', baja: 'low' },
    next: 'Next case', nextLabel: 'Next case',
  },
  about: {
    title: 'About me', personal: 'Personal', live: 'I live in', before: 'Before that, in', born: 'I was born in Venezuela.',
    education: 'Education', eduNote: 'Computer scientist by training, Product Designer by trade.',
    drawer: 'See the detail', drawerTitle: 'Nine years, from the inside',
    ikigai: 'Ikigai', companies: 'Companies', tools: 'Tools', contact: 'Contact', skills: 'What I bring',
    socialLabel: 'Social', more: 'More', close: 'Close',
  },
  cv: { label: 'Download CV', format: 'PDF, Spanish' },
  footer: { role: 'Product Designer · Design Systems · B2B SaaS and Insurtech', contact: 'Get in touch', available: 'Available now · Senior / Lead · remote', legal: '© 2026', privacy: 'Privacy', cookies: 'Cookies', remote: 'Working remotely' },
  consent: { text: 'I use analytics to see how this site is read: Google Analytics, Microsoft Clarity, Hotjar, Plerdy and HubSpot. They use cookies or browser storage, never advertising, and load only if you accept.', accept: 'Accept', reject: 'Decline', change: 'Change my choice' },
  lang: { label: 'Language' },
};

export const UI: Record<Locale, Ui> = { es, en };
export const getUi = (locale: Locale): Ui => UI[locale] ?? UI.es;
