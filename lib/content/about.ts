export const ABOUT = {
  intro: [
    'Soy Víctor, Product Designer.',
    'Diseño producto B2B donde un error operativo cuesta dinero.',
    'Informático de formación, Product Designer de oficio. Nueve años.',
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
    { degree: 'Licenciatura en Informática', school: 'Universidad de Oriente', place: 'Cumaná, Venezuela', years: '2006–2017' },
  ],
  ikigai: {
    tech: 'Informático de formación: sé cómo se construye lo que diseño, y respeto cómo piensa el framework.',
    design: 'Product Designer de oficio: nueve años en producto B2B denso, de la arquitectura al handoff.',
    business: 'Reglas de negocio, discovery con Product Owners y decisiones defendidas en lenguaje de negocio.',
    center: 'Product design',
  },
  companies: [
    { id: 'atrinium', name: 'Atrinium', years: '2022–2026', href: '/casos/hermes',
      body: 'Único diseñador de un holding con cinco productos. El principal, HERMES: un ERP SaaS multi-tenant para aseguradoras, reaseguradoras, MGAs y brokers, con el administrador que gobierna todo el grupo. Alrededor, facturación electrónica, un sistema de pólizas 360, gestión de usuarios y permisos y un e-commerce. Cinco productos, un solo lenguaje de diseño.' },
    { id: 'mercantil', name: 'Mercantil Panamá', years: '2020–2022', href: '/?f=banca#trabajo',
      body: 'Banca digital en entorno regulado. El sistema ya existía y mi trabajo era aplicarlo con criterio y validar cada pantalla antes de desarrollo: tests no moderados con Maze, entrevistas propias y sesiones con Marketing para los emails transaccionales. Nada pasaba a desarrollo sin haberse probado.' },
    { id: 'taksio', name: 'Taksio', years: '2017–2019', href: '/?f=transporte#trabajo',
      body: 'Plataforma de movilidad multimodal en Caracas: design system y flujos operativos de conductor y pasajero levantados desde cero.' },
  ],
  vision: {
    title: 'Diseño sistemas, no pantallas.',
    paragraphs: [
      'Mi base en informática no está para escribir código de producción: está para pensar el producto en sistemas, en estructura y en cómo se va a construir de verdad. Modelo el dominio antes que la pantalla, defino estados, reglas y casos límite, y cierro con un handoff que el equipo puede construir sin interpretar nada.',
      'Trabajo con patrones validados y criterios de usabilidad, no con invenciones, y respetando cómo se construye realmente en React, Chakra UI o Tailwind. Esta web es un ejemplo: el diseño es mío y dirigí la implementación con IA hasta el detalle. Generar es la parte fácil; lo que aporto es saber qué hay que pedir y reconocer cuándo lo que devuelve no sirve.',
      'Me interesan los flujos completos, no las pantallas sueltas. Sistemas que hagan que el siguiente diseño y el siguiente desarrollo cuesten menos que el anterior.',
    ],
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
  tools: ['Figma', 'FigJam', 'Prototipado interactivo', 'Chakra UI', 'Tailwind', 'React', 'GitHub', 'Vercel', 'Microsoft Clarity', 'Google Analytics', 'Maze', 'Mobbin', 'Claude'],
};
