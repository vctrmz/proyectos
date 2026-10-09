import { shot, type CaseStudy } from './types';

/* Pidemony: la guía de estilo con la que se presentó a negocio una función
   de la app mony, y las dos caras que documenta. Las pantallas y la guía son
   mías, hechas solo; se aprobó y salió. No hay datos de uso, y se dice.

   Los resultados son hitos, no métricas: aprobación y lanzamiento. Lo que
   pasó después no lo sé, y el caso no lo inventa. Lo único verificable desde
   fuera va en `measure`: pedir dinero sigue existiendo en el grupo, en Zinli,
   la billetera de MFTech S.A., filial de Mercantil Panamá (Efecto Cocuyo,
   2-5-2021; preguntas frecuentes de Zinli, «Solicitar dinero a otro
   Zinler»). No se afirma que Pidemony acabara en Zinli.

   La revisión de contraste es de hoy, no de entonces: el caso la cuenta como
   lo que cambiaría, y la demo de la página ya la aplica. */
export const pidemony: CaseStudy = {
  slug: 'pidemony', title: 'Pedir dinero con un enlace', company: 'Mercantil Banco Panamá', years: '2021',
  tagline: 'Pidemony, dentro de la app mony: quien pide lo hace en cuatro pasos y quien paga, con su tarjeta desde un enlace. Diseñé las dos caras y la guía de estilo con la que se presentó a negocio.',
  tags: ['Caso de estudio', 'En producción', 'Banca', 'UI kit', 'Móvil y web'], brand: '#004E9B',
  hero: shot('pm-movil-colores', 'Lámina de colores de la guía móvil de Pidemony junto a la pantalla de solicitud', 'La guía de estilo de Pidemony: la propuesta que se llevó a negocio'),
  context: 'Mony es la billetera de Mercantil Banco Panamá. Pidemony le añade lo contrario de pagar: pedir. Quien pide elige a quién, cuánto y para qué desde la app; a quien le piden le llega un enlace y paga con tarjeta desde el navegador. Lo hice para el Squad Pasivos.',
  role: 'Product Designer, solo: los flujos de móvil y web, y la guía de estilo con la que se presentó a negocio.',
  delivery: 'Pantallas de móvil y web, y una guía de estilo de seis láminas. Se aprobó y salió en la app mony.',
  problem: [
    'Pedir dinero tiene dos personas y dos pantallas. Quien pide está dentro de la app; quien paga llega por un enlace, desde el navegador y con su tarjeta. Si cualquiera de las dos duda, la petición se queda sin pagar.',
    'Antes de construir nada había que convencer a negocio, y negocio decide sobre lo que ve. Por eso la propuesta llegó con las dos caras dibujadas y con una guía que el equipo pudiera seguir sin reinterpretarla.',
  ],
  complexity: { diagram: 'pide-y-paga', caption: 'Dos personas, dos superficies y, entre ellas, un enlace con fecha de caducidad.' },
  demo: {
    id: 'pidemony',
    intro: 'El flujo de Pidemony con su propio UI kit. Pide dinero desde la app y abre después el enlace como quien paga. Es una demo: no se envía ni se cobra nada, y la tarjeta es de ejemplo.',
  },
  decisionsLayout: 'bento',
  decisions: [
    { title: 'Cuatro tramos a la vista, de los datos al enlace.', why: 'Pedir dinero no es un formulario: es decir qué, revisarlo, aceptar los términos y compartir el enlace. Si no se ve cuánto falta, se abandona a mitad.', changed: 'Un stepper de cuatro tramos arriba de cada pantalla: en verde lo hecho, en gris lo que queda.', wouldFix: 'El verde #70C972 sobre blanco da 2,0:1, por debajo del 3:1 que se pide a un elemento gráfico. Hoy lo acompañaría de texto —«Paso 2 de 4»— y no confiaría solo en el color. En la demo de arriba ya va así.' },
    { title: 'Los límites del monto se dicen antes de equivocarse.', why: 'Un error que aparece después de escribir obliga a borrar y adivinar. Si el rango está a la vista desde el principio, el error casi no hace falta.', changed: 'Bajo «¿Cuánto le vas a pedir?» va escrito el rango: más de $5 y menos de $2,000. «Siguiente» no se activa hasta que los datos son válidos.' },
    { title: 'El concepto viaja con la petición.', why: 'A quien le piden dinero lo primero que se pregunta es para qué. Sin concepto, un enlace de pago se parece demasiado a un fraude.', changed: '«¡Déjale un mensaje!» es opcional en la app, pero cuando existe aparece en el mensaje de WhatsApp y en la página de pago: «Concepto de: Gasolina de la quincena».' },
    { title: 'Quien paga ve primero quién le pide y cuánto.', why: 'Quien llega por un enlace no está dentro de la app. Antes de pedirle la tarjeta hay que decirle quién le pide, cuánto y hasta cuándo.', changed: 'La web abre con un saludo con su nombre, la petición y el «Válido hasta». La tarjeta va debajo, con el aviso de cifrado de Visa y Mastercard.', figure: { shot: shot('pm-web-colores', 'Lámina de colores web con la página de pago de Pidemony', 'La página de pago: quién pide, cuánto y hasta cuándo, antes de la tarjeta') } },
    { title: 'El enlace caduca, y cuando caduca lo dice claro.', why: 'Un enlace de pago sin fecha se puede reenviar o pagar tarde. Pero un error técnico tampoco le sirve a quien lo abre.', changed: 'La fecha de caducidad se ve en la página de pago. Si ya pasó, un modal dice qué ocurre —«El link que quieres utilizar ya se encuentra vencido»— y qué hacer: hablar con quien lo envió.', figure: { shot: shot('pm-web-tipografia', 'Lámina de tipografía web con el modal de enlace vencido', 'El enlace vencido: qué pasó y qué hacer, sin código de error') } },
  ],
  system: {
    body: [
      'La guía tiene dos partes, móvil y web, con la misma tipografía —Roboto— y la misma paleta: azul #004E9B para títulos y botones, negro y gris para el texto, verde #70C972 para el progreso y la confirmación, y naranja y celeste como alternativas.',
      'Lo que cambia es la escala. En móvil, títulos y botones a 16 px y texto a 12. En la web de pago, títulos a 20, modales a 24 y botones a 14: quien llega desde un enlace necesita la jerarquía más marcada.',
      'Revisada hoy con WCAG 2.2 AA, solo el azul pasa como color de texto (8,2:1). El gris #7D7D7D se queda en 4,1:1 y el verde, en 2,0:1. En la demo de esta página el texto gris va en #6B6B6B (5,3:1) y el stepper lleva su texto; todo lo demás es el kit tal cual.',
    ],
    uiKit: [
      { kind: 'tokens', title: 'Paleta', body: 'Un rol por color: el azul manda en títulos y botones, y el verde es solo del progreso y la confirmación.', wide: true, labels: ['título y botón', 'progreso', 'texto', 'texto 2', 'alternativa', 'inactivo'], swatches: ['#004E9B', '#70C972', '#000000', '#7D7D7D', '#009FDA', '#E5E5E5'] },
      { kind: 'phases', title: 'Stepper de cuatro tramos', body: 'Lo hecho en verde y lo que queda en gris, arriba de cada pantalla de la app.', label: 'Paso 2 de 4 · confirma tu solicitud' },
      { kind: 'form', title: 'Solicitud', body: 'Tres campos —a quién, cuánto y un mensaje opcional—, con el rango del monto escrito antes de que haga falta un error.', label: 'más de $5 y menos de $2,000' },
      { kind: 'actions', title: 'Botones', body: 'Azul para la acción principal; gris claro mientras no se puede seguir. «Pide tu Mony» en la app, «Pagar» en la web.', label: 'Pide tu Mony', labels: ['Histórico de solicitudes', 'Salir'] },
    ],
  },
  design: [
    shot('pm-movil-colores', 'Colores de la guía móvil junto a la pantalla de solicitud', 'Móvil · colores: cada color con su rol y la pantalla de solicitud al lado'),
    shot('pm-movil-tipografia', 'Tipografía de la guía móvil junto a la pantalla de confirmación', 'Móvil · tipografía: Roboto a 16 y 12 px, con la confirmación y los términos'),
    shot('pm-web-colores', 'Colores de la guía web junto a la página de pago', 'Web · colores: la página de pago con tarjeta y los iconos que no cambian de color'),
    shot('pm-web-tipografia', 'Tipografía de la guía web junto al modal de enlace vencido', 'Web · tipografía: 20, 24, 12 y 14 px, con el aviso de enlace vencido'),
  ],
  implementation: [
    'La guía se presentó a negocio con las dos caras dibujadas, se aprobó y Pidemony salió en la app mony.',
    'La demo de esta página no es código del banco: la hice desde cero para este portfolio, con el kit de Pidemony, su paleta y Roboto. No guarda ni cobra nada.',
  ],
  result: {
    output: [
      { value: '2', label: 'superficies, una guía para cada una', meaning: 'La app, donde se pide, y la web, donde se paga con tarjeta: misma paleta y tipografía, escalas distintas.' },
      { value: '6', label: 'láminas en la guía de estilo', meaning: 'Una portada, colores y tipografía por cada superficie, y cada lámina con su pantalla de ejemplo al lado.' },
      { value: '4', label: 'tramos de la petición a la vista', meaning: 'De los datos al enlace compartido, con el progreso arriba de cada pantalla de la app.' },
    ],
    outcome: [
      { value: 'Aprobada', label: 'la propuesta que se llevó a negocio', meaning: 'Las dos caras y la guía de estilo se presentaron a negocio como propuesta y se aprobaron para construir. Era el objetivo de la entrega, y se cumplió.' },
      { value: '2021', label: 'Pidemony sale en la app mony', meaning: 'De propuesta a función publicada dentro de mony, la billetera de Mercantil Banco Panamá, el mismo año en que se diseñó. Cuánto siguió activa y cuánto se usó no lo sé: lo digo abajo.' },
    ],
    measure: 'No tengo datos de uso ni sé cuánto tiempo siguió activa. Desde fuera solo se ve que la necesidad sigue: el grupo también permite pedir dinero en Zinli, la billetera de MFTech, filial de Mercantil Panamá («Solicitar dinero a otro Zinler»). No sé si heredó algo de Pidemony, y no lo afirmo. Con acceso, mediría peticiones creadas frente a pagadas, tiempo hasta el pago y enlaces que caducan sin pagarse.',
  },
  learnings: [
    'Llevar a negocio las dos caras —la de quien pide y la de quien paga— convierte la propuesta en un producto que se puede juzgar entero.',
    'Un UI kit sin el contraste comprobado se hereda con sus fallos. Hoy lo reviso antes de entregar la paleta, no después.',
    'El color no puede ser lo único que dice en qué paso estás: el stepper necesitaba texto desde el principio.',
  ],
  next: 'ayax',
};
