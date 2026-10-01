export const ABOUT = {
  /* El claim "un error operativo cuesta dinero" vive solo en el manifiesto de
     la home, y "informático de formación" solo en Formación: aquí no se
     repiten. */
  intro: [
    'Soy Víctor, Product Designer.',
    'Nueve años en producto B2B denso: SaaS asegurador, banca digital y movilidad.',
  ],
  cities: [
    { name: 'Cumaná', country: 'VE' as const },
    { name: 'Caracas', country: 'VE' as const },
    { name: 'Zulia', country: 'VE' as const },
    { name: 'Jaén', country: 'ES' as const },
    { name: 'Madrid', country: 'ES' as const },
    { name: 'Lleida', country: 'ES' as const },
    { name: 'Barcelona', country: 'ES' as const },
    { name: 'Málaga', country: 'ES' as const, years: '2022 – ahora', current: true },
  ],
  places: [] as { src: string; alt: string; caption: string }[],
  education: [
    { degree: 'Titulación universitaria de 5 años en Informática', school: 'Universidad de Oriente', place: 'Cumaná, Venezuela', years: '2017' },
  ],
  ikigai: {
    tech: 'Informático de formación: sé cómo se construye lo que diseño, y respeto cómo piensa el framework.',
    design: 'Product Designer de oficio: nueve años en producto B2B denso, de la arquitectura al handoff.',
    business: 'Reglas de negocio, discovery con Product Owners y decisiones defendidas en lenguaje de negocio.',
    center: 'Product design',
  },
  companies: [
    { id: 'atrinium', name: 'Atrinium', years: '2022–2026', href: '/es/cases/hermes',
      body: 'Único diseñador de un holding con cinco productos. El principal, HERMES: un ERP SaaS multi-tenant para aseguradoras, reaseguradoras, MGAs y brokers, con el administrador que gobierna todo el grupo. Alrededor, facturación electrónica, un sistema de pólizas 360, gestión de usuarios y permisos y un e-commerce. Cinco productos, un solo lenguaje de diseño.' },
    { id: 'mercantil', name: 'Mercantil Panamá', years: '2021–2022', href: '/es?f=banca#trabajo',
      body: 'Banca digital en entorno regulado, en remoto desde España como diseñador de Darien Technology, la consultora del proyecto. El sistema ya existía y mi trabajo era aplicarlo con criterio y validar cada pantalla antes de desarrollo: tests no moderados con Maze, entrevistas propias y sesiones con Marketing para los emails transaccionales. Nada pasaba a desarrollo sin haberse probado.' },
    { id: 'taksio', name: 'Taksio', years: '2017–2019', href: '/es?f=transporte#trabajo',
      body: 'Plataforma de movilidad multimodal en Caracas: design system y flujos operativos de conductor y pasajero levantados desde cero.' },
  ],
  vision: {
    title: 'Diseño sistemas, no pantallas.',
    paragraphs: [
      'Mi base en informática me sirve para *pensar el producto en sistemas, en estructura y en cómo se va a construir de verdad*, y para bajarlo a código cuando hace falta. *Modelo el dominio antes que la pantalla*, *defino estados, reglas y casos límite*, y cierro con un *handoff que el equipo puede construir sin interpretar nada*.',
      'Trabajo con *patrones validados y criterios de usabilidad*, no con invenciones, y respetando cómo se construye realmente en *React, Chakra UI o Tailwind*. Esta web es un ejemplo: el diseño es mío y *dirigí la implementación con IA hasta el detalle*. Generar es la parte fácil; lo que aporto es *saber qué hay que pedir y reconocer cuándo lo que devuelve no sirve*.',
      'Me interesan *los flujos completos, no las pantallas sueltas*. *Sistemas que hagan que el siguiente diseño y el siguiente desarrollo cuesten menos que el anterior.*',
    ],
  },
  /* La cita que abre los libros: dice de dónde sale el criterio con el que
     están elegidos. Sin foto de Jakob Nielsen —no tengo derechos sobre un
     retrato suyo—, así que la ficha lleva su monograma. */
  quote: {
    text: 'Lo que los usuarios dicen y lo que hacen es diferente.',
    author: 'Jakob Nielsen',
    role: 'Experto en usabilidad',
    org: 'Co-fundador de Nielsen Norman Group',
  },
  skills: [
    'Arquitectura de información y flujos críticos en dominios regulados',
    'Design systems con gobernanza y criterios de uso',
    'Producto multi-tenant y white-labeling',
    'Formularios y reglas de negocio declarados como dato',
    'Accesibilidad WCAG 2.2 como requisito de entrada',
    'Discovery y defensa de propuestas ante Product Owners',
    'Handoff acompañado y diálogo técnico con desarrollo',
    'Research por observación indirecta cuando no hay acceso a usuarios',
  ],
  /* El cajón se llama «Mi forma de trabajar», así que aquí va el método y no
     el catálogo de productos —eso ya está en los casos y en la portada—. Dos
     párrafos de entrada —cómo me preparo y cómo adapto el método— y el detalle
     en la infografía, que se lee paso a paso en lugar de scrollear. En
     lenguaje corriente: quien decide contratar no siempre es diseñador. */
  bio: [
    'Antes de dibujar nada me preparo. *Analizo los requisitos* con quien los pide hasta separar el problema real de la solución que ya trae pensada, y *reviso lo que ya tenemos*: componentes del design system, flujos parecidos y decisiones tomadas antes. *Lo que ya funciona se reutiliza*; rediseñar lo que existe cuesta tiempo y rompe la coherencia del producto.',
    'Después sigo un proceso de *design thinking*, pero *no uso todas sus herramientas en cada proyecto*: cuánto investigo y cuántas vueltas doy *depende del plazo, de la urgencia y del riesgo*. Una funcionalidad nueva en un dominio regulado pide investigar a fondo; un ajuste urgente, un prototipo rápido sobre lo que existe. Lo que no cambia es que *cada decisión se pueda explicar en lenguaje de negocio*, porque un diseño que no se sabe defender no se aprueba.',
  ],
  process: {
    intro: 'Seis pasos: *dos de preparación y cuatro de design thinking*. El orden se mantiene; lo que cambia es *cuánto dura cada uno y qué herramientas uso*, según el plazo, la urgencia y lo maduro que esté el producto.',
    steps: [
      { id: 'analizar', name: 'Analizar', body: 'Empiezo por los *requisitos*: el brief, quién decide y qué límites hay de plazo, normativa y tecnología. Casi siempre llegan con una pantalla en la cabeza; mi trabajo es *separar el problema real de la solución que ya traen pensada*.',
        does: ['Brief y entrevistas con cliente y Product Owners', 'Límites de plazo, normativa y tecnología', 'Escribir en una frase qué hay que resolver y para quién'] },
      { id: 'reutilizar', name: 'Reutilizar', body: 'Antes de proponer nada nuevo *reviso lo que ya tenemos*: componentes y patrones del design system, flujos parecidos dentro del producto y decisiones que se tomaron antes. *Lo que funciona se reutiliza*, lo que se queda corto se amplía y solo se diseña de cero lo que de verdad falta.',
        does: ['Inventario de componentes y patrones del design system', 'Flujos parecidos que el producto ya resuelve', 'Qué se reutiliza, qué se amplía y qué falta'] },
      { id: 'investigar', name: 'Investigar', body: 'Después miro *qué se sabe ya* del problema: los datos de uso que la empresa tiene sin mirar, las quejas que se repiten y lo que otros han publicado sobre lo mismo. *Cuando no me dan acceso a los usuarios*, lo compenso observando cómo trabajan y apoyándome en estudios ya medidos.',
        does: ['Datos de uso y comentarios que ya existen en la empresa', 'Estudios, artículos y referencias del sector', 'Observar a alguien haciendo su trabajo, sin interrumpirle'] },
      { id: 'definir', name: 'Definir', body: 'Junto todo en *un solo lienzo* y lo reduzco a unas pocas decisiones con su motivo escrito. De ahí sale el mapa: *qué estados existen, qué reglas mandan y qué pasa en los casos raros*, antes de dibujar ninguna pantalla.',
        does: ['Un lienzo con lo aprendido y lo que aún no sé', 'Las decisiones y los descartes, por escrito', 'El mapa de estados y reglas, antes que la interfaz'] },
      { id: 'disenar', name: 'Diseñar', body: 'Llevo *dos o tres alternativas comparables* en vez de una sola propuesta: comparar ayuda a decidir y saca la conversación del terreno de los gustos. Todo se monta con piezas del sistema, así que *lo que se aprueba ya se puede construir*.',
        does: ['Dos o tres alternativas, con su ventaja y su coste', 'Prototipo navegable para verlo funcionando', 'Piezas del design system, no dibujos sueltos'] },
      { id: 'validar', name: 'Validar', body: 'Pruebo *con poca gente y pronto*: con cinco personas ya se ve dónde se atasca. Después acompaño la implementación y vuelvo a mirar los datos, porque *lo que la gente dice y lo que hace no coincide*.',
        does: ['Prueba con cinco personas sobre el prototipo', 'Revisión de la implementación hasta que llega entera', 'Datos de uso después, no sólo opiniones antes'] },
    ],
    principles: [
      { name: 'KISS', body: 'La *solución más simple que resuelve el caso completo*: en producto denso cada elemento de más es carga cognitiva y deuda de mantenimiento.' },
      { name: 'Mobile first', body: 'Obliga a *jerarquizar lo esencial* antes de disponer de espacio; el escalado a escritorio es una ampliación, no un rediseño.' },
      { name: '60 · 30 · 10', body: 'El *neutro dominante* sostiene la lectura, el *secundario* estructura superficies y el *acento* queda reservado a la acción: lo importante se distingue sin más saturación.', bar: [60, 30, 10] as [number, number, number] },
    ],
    outro: 'Por encima del método, lo que busco es *crear atmósfera*: que cada pantalla, cada estado y cada palabra hagan que *la marca respire el mismo aire* de un extremo a otro del producto.',
  },
  toolGroups: [
    { name: 'Diseño y multimedia', items: ['Figma (avanzado)', 'FigJam', 'Prototipos interactivos', 'Photoshop', 'Illustrator', 'Premiere', 'CapCut'] },
    { name: 'Desarrollo y despliegue', items: ['HTML · CSS', 'React', 'Next.js', 'TypeScript', 'Chakra UI', 'Tailwind', 'Material UI', 'GitHub', 'Vercel', 'WordPress'] },
    { name: 'Analítica y comportamiento', items: ['Microsoft Clarity', 'Google Analytics', 'HubSpot', 'Maze', 'Mobbin'] },
    { name: 'Inteligencia artificial', items: ['Claude', 'Gemini', 'Google Stitch', 'Perplexity'] },
    { name: 'Mensajería y correo', items: ['SendGrid'] },
  ],
};
