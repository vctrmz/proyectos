import { shot, type CaseStudy } from './types';

export const estaWeb: CaseStudy = {
  slug: 'esta-web', title: 'Esta web, del sistema al código', company: 'Proyecto propio', years: '2026',
  tagline: 'Un portfolio tratado como producto: tokens, componentes, contenido tipado y tests que impiden publicar cifras que nadie midió. El diseño es mío; la implementación, dirigida con IA y revisada tarea a tarea.',
  tags: ['Caso de estudio', 'En producción', 'Design tokens', 'Next.js', 'Accesibilidad'], brand: '#121317',
  hero: shot('web-home', 'Portada de esta web con el titular, el enlace al CV y la franja de hechos', 'La portada: quién, qué y la prueba, antes del primer scroll'),
  context: 'La web anterior era HTML con 203 estilos inline, sin landmarks, con diez controles que no respondían al teclado y los casos dentro de un modal que fallaba en la primera visita. Quería que el portfolio demostrara lo mismo que cuenta: sistema, reglas y entrega.',
  role: 'Diseño, sistema, contenido y dirección técnica. Escribí las specs y los planes, dirigí la implementación con Claude Code y revisé cada tarea antes del commit.',
  delivery: 'Next.js 16 con App Router, tokens en CSS, dieciséis primitivas de interfaz, los casos como datos tipados, dos idiomas con el idioma en la URL, analítica solo con consentimiento y una batería de tests y auditorías automáticas.',
  problem: [
    'Un portfolio que dice «lo llevo a producción» y no enseña cómo pierde la frase en la primera entrevista técnica.',
    'La salida fácil era una plantilla vistosa; la útil, construirlo como construiría un producto: con sistema, decisiones escritas y pruebas.',
  ],
  complexity: { diagram: 'spec-to-prod', caption: 'Cada paso deja un documento que el siguiente consume, y la revisión antes del commit no se delega.' },
  decisions: [
    { title: 'Escribir la spec y el plan antes de pedir una línea de código.', why: 'Con IA, generar es barato; lo caro es corregir algo que nadie decidió.', changed: 'Cada rediseño tiene su spec y su plan fechados en el repositorio, con lo decidido y lo descartado. La IA implementa tareas pequeñas y cada una pasa por mi revisión antes del commit.', tradeoff: 'Más tiempo antes de ver nada en pantalla, a cambio de no deshacer trabajo después.' },
    { title: 'Tokens en :root y un test que los vigila.', why: 'Un sistema que depende de la disciplina se degrada a la tercera iteración.', changed: 'Color, tipografía, espacio y radios viven como variables CSS. Un test falla si reaparecen los grises retirados o las fuentes antiguas.' },
    { title: 'El contenido es dato tipado, y los tests defienden su honestidad.', why: 'En un portfolio el riesgo no es un bug: es una cifra que no se puede defender en una entrevista.', changed: 'Todos los casos son objetos TypeScript con la misma forma. Los tests fallan si un resultado no explica de dónde sale o si aparece una métrica de negocio que nadie midió.' },
    { title: 'Motion con interruptor, accesibilidad medida.', why: 'La animación ayuda a leer el recorrido, pero no puede ser un requisito para entenderlo.', changed: 'Todo el motion se apaga con prefers-reduced-motion y los efectos de scroll también con puntero táctil. axe se pasa en cada ruta y viewport: cero violaciones A/AA.' },
    { title: 'El idioma va en la URL y ningún enlace publicado se rompe.', why: 'Los enlaces a los casos ya circulaban por LinkedIn y por correo.', changed: 'Español en /es e inglés en /en, redirecciones permanentes desde las rutas antiguas y un interruptor que sabe a qué página del otro idioma ir.' },
  ],
  system: {
    body: [
      'Las primitivas —botón, chip, figura, divulgación, métrica…— consumen los mismos tokens, y los casos no tienen estilos propios: la plantilla se construye con el contenido. Añadir un caso es escribir datos, no maquetar.',
    ],
    code: { title: 'Tokens del sistema (extracto de app/globals.css)', lang: 'css', source: 'repo', href: 'https://github.com/vctrmz/proyectos/blob/main/app/globals.css', code: ':root {\n  --bg: #ffffff; --ink: #121317; --ink-2: #45474d; --ink-3: #6a6a71;\n  --surface: #f8f9fc; --accent: #8bde5f; --focus: #4a44f2;\n  --fs-100: 0.78125rem; --fs-300: 1rem; --fs-1100: clamp(3.5rem, 9vw, 6.6875rem);\n  --sp-4: 4px; --sp-8: 8px; --sp-16: 16px; --sp-32: 32px; --sp-128: 128px;\n  --r-media: 36px; --r-card: 16px; --r-pill: 9999px;\n  --ease: cubic-bezier(0.22, 1, 0.36, 1);\n}' },
    uiKit: [
      { kind: 'tokens', title: 'Tokens con nombre de función', body: 'Tinta en tres niveles, superficie, acento y foco: la interfaz elige por función, nunca por color.', wide: true },
      { kind: 'scale', title: 'Tres radios', body: 'Media, tarjeta y píldora. Lo que no está en la escala no se usa.' },
      { kind: 'actions', title: 'Una acción con peso por vista', body: 'Un solo botón sólido por pantalla; el resto, contorno o texto.', label: 'Ver el caso' },
    ],
  },
  design: [
    shot('web-home', 'Portada de la web', 'Portada: titular, CV y hechos antes del primer scroll'),
    shot('web-case', 'Página de caso con el índice numerado a la izquierda', 'Plantilla de caso: el índice se construye desde el contenido'),
  ],
  implementation: [
    'Cada cambio pasa por la misma cadena: spec, plan por tareas, implementación con Claude Code, mi revisión, tests y auditoría con axe antes de publicar.',
    'El repositorio es público: están el historial de commits, los planes y las auditorías.',
  ],
  result: {
    output: [
      { value: '0', label: 'violaciones axe A/AA', meaning: 'En las nueve combinaciones auditadas: portada, caso y sobre mí a 1280, 768 y 375 px.' },
      { value: '0,91 s', label: 'LCP en escritorio', meaning: 'Medido en frío sobre el build de producción; antes, 1,26 s más un loader de 1,6 s.' },
      { value: '100+', label: 'tests automáticos', meaning: 'Componentes, contenido y tokens, incluidos los que impiden publicar cifras sin explicar.' },
    ],
    outcome: 'unavailable',
    measure: 'Qué casos se abren desde la portada, cuánto se lee cada uno y cuántas visitas acaban en el correo o en el CV: el embudo de Clarity está pendiente de configurar.',
  },
  learnings: [
    'Con IA la ventaja no está en escribir más rápido, sino en saber qué pedir y reconocer cuándo lo que vuelve no sirve.',
    'Un test que protege la honestidad del contenido vale tanto como uno que protege el código.',
  ],
  next: 'hermes',
};
