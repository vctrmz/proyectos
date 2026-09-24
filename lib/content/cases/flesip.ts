import { shot, type CaseStudy } from './types';

export const flesip: CaseStudy = {
  slug: 'flesip', title: 'Facturar debería ser lo más aburrido de tu semana', company: 'Flesip · Atrinium', years: '2024–2025',
  tagline: 'La app de facturación para autónomos y pymes, de punta a punta: del boceto a mano de la factura rápida al módulo de Configuración, VeriFactu, la web para gestorías y el stand de feria.',
  tags: ['Caso de estudio', 'En producción', 'ERP', 'App y web'], brand: '#1F2B9C',
  hero: shot('flesip-fx_ingresos', 'Listado de ingresos de Flesip con facturas pendientes y completadas', 'Ingresos: las pendientes aún no llevan nombre de cliente; las completadas, sí'),
  context: 'Flesip crea, envía y cobra facturas desde web y app móvil. El problema no estaba en la factura, sino antes: una configuración dispersa que el usuario rellenaba una vez, mal, y no volvía a encontrar. Y encima llegaba VeriFactu, que obliga a registrar y firmar cada factura.',
  role: 'Product Designer del producto completo: app, web, el portal de la asesoría y las piezas con las que salió a feria.',
  delivery: 'Rediseño del módulo de Configuración en cuatro bloques, factura rápida en app con su landing para el cliente final, Flesip Asesor, emails de VeriFactu, stand y packaging.',
  problem: [
    'Cuatro bloques de ajustes con cuatro lógicas distintas: quien facturaba no sabía dónde se cambiaba una serie, una plantilla o una forma de pago.',
    'Y un usuario que no es contable: cada decisión que la ley obliga a tomar tenía que explicarse dentro del producto, no en un manual.',
  ],
  complexity: { diagram: 'pending-invoice', caption: 'La decisión que sostiene la factura rápida: un estado intermedio. La factura existe con importe y sin destinatario, y se completa sola cuando el cliente rellena sus datos.' },
  decisions: [
    { title: 'La configuración se agrupa por tarea, no por tabla de la base de datos.', why: 'El usuario no busca «entidades»: busca cobrar como le pagan, numerar sus facturas o cumplir con Hacienda.', changed: 'Cuatro bloques —Empresa, Facturación, Cobros y Cumplimiento— con la misma gramática: resumen de lectura, edición en línea o en modal, confirmación. Aprenderlo una vez sirve para todo el módulo.', tradeoff: 'Agrupar por tarea aleja la configuración del modelo de datos, así que un ajuste nuevo obliga a decidir a qué tarea pertenece antes de colocarlo.', figure: { shot: shot('flesip-general', 'Hub de configuración de Flesip con accesos agrupados por tarea', 'El hub: accesos agrupados por tarea y novedades dentro del producto, no en un email que nadie abre') } },
    { title: 'Primero se lee, después se edita.', why: 'Los formularios eternos hacen que el usuario abandone a mitad y guarde datos a medias.', changed: 'Cada bloque se muestra en lectura y el lápiz abre la edición solo de ese bloque. El logotipo se previsualiza en la plantilla antes de guardar.', figure: { shot: shot('flesip-cuenta', 'Vista de lectura de la información de la cuenta', 'Información de la cuenta: se lee primero y se edita por bloques') } },
    { title: 'La factura rápida nació en una pizarra, y el estado intermedio la hizo posible.', why: 'Un taxista termina el servicio y el pasajero quiere factura, pero en el coche no hay tiempo de pedirle NIF, dirección y código postal.', changed: 'El conductor emite el importe y el cliente completa sus datos cuando le venga bien, por QR o por correo. La pieza que faltaba en el boceto era la factura pendiente: existe, pero todavía no tiene destinatario.', tradeoff: 'Aparece un estado que el usuario tiene que entender: una factura que existe y aún no está completa. Se resolvió enseñándolo en la propia lista de ingresos, no en un manual.', figure: { shot: shot('flesip-sk_1', 'Boceto a mano de la app de facturas desatendidas para taxi, con envío por QR o email', 'El boceto original ya tenía el importe, las dos salidas y la landing del cliente') } },
    { title: 'La gestoría no se sustituye: se alimenta.', why: 'Los autónomos no presentan sus impuestos solos, y la asesoría ya tiene su software contable.', changed: 'Flesip Asesor recibe los datos clasificados —cuentas contables, conceptos y tipos de IVA ya configurados— y exporta en XLS o XML al software que la asesoría usa. Autorizar y revocar el acceso son simétricos, con confirmación y aviso por email a las dos partes.', figure: { shot: shot('flesip-sk_5', 'Gestión de facturas en Flesip Asesor: árbol de clientes, foto de la factura y campos', 'Revisar gastos como en una mesa de trabajo: la foto junto a los datos, y cuántas quedan') } },
    { title: 'Avisar antes de que algo deje de funcionar.', why: 'Si el certificado digital caduca o se revoca, Flesip no puede procesar facturas: el usuario se enteraría al intentar facturar.', changed: 'Emails con fecha concreta y consecuencia concreta —qué se desactiva y cuándo—, una sola acción por correo y el cierre de marca con las tiendas de descarga.', wouldFix: 'El mismo aviso dentro del producto, en la propia pantalla de facturación, y no solo en el correo: quien no abre el email se entera cuando ya no puede facturar.', figure: { shot: shot('flesip-mail_vencido', 'Email «Certificado vencido» de Flesip', 'Un email por estado del certificado: qué pasa, cuándo y qué tiene que hacer el usuario') } },
  ],
  system: {
    body: [
      'Cuatro cosas quedan preparadas en Configuración y después trabajan solas en cada factura: series y plantillas, impuestos, formas de pago y cuentas, y el certificado de VeriFactu. Configuras una vez, facturas con flow.',
      'VeriFactu es el centro del sistema, no una casilla: series, plantillas, impuestos y cobros convergen en una factura registrada y con QR, y el producto lo explica con tooltips justo donde la ley obliga a decidir.',
      'Los impuestos, las formas de pago y los componentes de cada tipo de factura se activan con toggles: menos opciones visibles en el formulario, menos errores al emitir.',
    ],
    code: { title: 'Tokens de Flesip: estados de la factura y avisos', lang: 'json', code: "{\n  \"estado\": {\n    \"borrador\":   { \"color\": \"#1F2B9C\", \"bg\": \"#EEF0FB\" },\n    \"pendiente\":  { \"color\": \"#A35A00\", \"bg\": \"#FFF1DE\" },\n    \"procesada\":  { \"color\": \"#1E9E62\", \"bg\": \"#DDF5E9\" },\n    \"vencida\":    { \"color\": \"#C0392B\", \"bg\": \"#FBEAEA\" }\n  },\n  \"documento\": {\n    \"serie\":     \"F-2026\",\n    \"tipos\":     [\"factura\", \"rectificativa\", \"proforma\"],\n    \"impuestos\": { \"iva\": 21, \"irpf\": 15 },\n    \"verifactu\": { \"qr\": true, \"firma\": \"obligatoria\" }\n  },\n  \"radius\": { \"chip\": 999, \"card\": 12, \"modal\": 16 },\n  \"space\":  { \"campo\": 12, \"bloque\": 24, \"seccion\": 40 }\n}" },
    uiKit: [
      { kind: 'states', title: 'Cuatro estados de factura', body: 'Borrador, pendiente, procesada y vencida, con color y fondo propios: los mismos en el listado de ingresos, en el detalle y en los avisos.', wide: true, labels: ['Borrador', 'Pendiente', 'Procesada', 'Vencida'] },
      { kind: 'actions', title: 'Una acción que cierra el documento', body: 'Convertir el borrador en factura procesada es la acción irreversible del producto: va en color de marca y el resto pierde peso a su lado.', wide: true, label: 'Convertir en factura' },
      { kind: 'form', title: 'Edición por bloques', body: 'Cada bloque se lee primero y se edita solo él, con los campos que la ley obliga marcados y explicados donde hay que decidir.', wide: true },
      { kind: 'scale', title: 'Chip, tarjeta y modal', body: 'Tres radios para todo el módulo: el chip de estado, la tarjeta de cada sección y el modal de edición corta.', wide: true },
    ],
  },
  challenge: {
    title: 'El reto',
    items: [
      { title: 'El usuario no es contable', body: 'Autónomos y pymes que necesitan que cada factura salga bien a la primera, sin saber qué es una retención ni una serie.' },
      { title: 'Una configuración dispersa', body: 'Cuatro bloques de ajustes con cuatro lógicas: se rellenaba una vez, mal, y no se volvía a encontrar.' },
      { title: 'VeriFactu obliga', body: 'La normativa exige registrar y firmar cada factura. Había que hacerlo comprensible, no solo cumplirlo.' },
      { title: 'Dos productos, un dato', body: 'La app del autónomo y el portal de la asesoría miran la misma factura con ojos distintos.' },
      { title: 'Facturar sin destinatario', body: 'Un taxista cierra el servicio y no puede pedir NIF y dirección dentro del coche.' },
      { title: 'Web y móvil a la vez', body: 'El mismo flujo tiene que funcionar en una pantalla de escritorio y en la mano, de pie.' },
    ],
  },
  flows: {
    title: 'Flujos',
    caption: 'La factura rápida tiene dos mitades que no coinciden en el tiempo: quien emite cierra en el momento y quien recibe rellena cuando le viene bien.',
    list: [
      { title: 'Quien factura', side: 'app', steps: [
        { n: '01', t: 'Ingresos', d: 'Las pendientes aún no llevan nombre de cliente; las completadas, sí.' },
        { n: '02', t: 'Detalle', d: 'La misma vista que al terminar la factura rápida, con la opción de reenviarla.' },
        { n: '03', t: 'Gestionar', d: 'Tres salidas según el cliente: código QR, correo o impresión.' },
        { n: '04', t: 'QR o correo', d: 'El QR se escanea en el sitio; el correo valida el dominio antes de activar el botón.' },
      ] },
      { title: 'Quien recibe', side: 'web, desde su móvil', steps: [
        { n: '01', t: 'Datos del servicio', d: 'Ya vienen rellenos: el cliente solo confirma lo que pagó.' },
        { n: '02', t: 'Quién eres', d: 'Particular o empresa, residencia fiscal, documento y contacto.' },
        { n: '03', t: 'Dirección', d: 'Al finalizar, la factura se completa sola en la app del emisor.' },
      ] },
      { title: 'De la app a la asesoría', side: 'sin pedir nada por correo', steps: [
        { n: '01', t: 'El autónomo factura', d: 'Desde la app, con factura rápida o completa.' },
        { n: '02', t: 'Flesip clasifica', d: 'Cuentas contables, conceptos y tipos de IVA ya configurados.' },
        { n: '03', t: 'Se exporta solo', d: 'XLS o XML hacia el software que la asesoría ya usa.' },
        { n: '04', t: 'La gestoría revisa', d: 'Desde Flesip Asesor, sin coste adicional para el cliente.' },
      ] },
    ],
  },
  design: [
    shot('flesip-fx_gestionar', 'Hoja de gestión con opciones código QR, vía correo e imprimir', 'Tres salidas según el cliente: QR, correo o impresión'),
    shot('flesip-fx_c2', 'Paso 2 de 3 de la landing del cliente: particular o empresa, residencia fiscal y contacto', 'Lo que ve el cliente final: tres pasos y los datos del servicio ya rellenos'),
    shot('flesip-verifactu', 'Estado de VeriFactu en la configuración de Flesip', 'Cumplimiento: estado de VeriFactu, certificados y emails de aviso en el mismo bloque'),
    shot('flesip-stand', 'Render del stand de Flesip en esquina, con paredes azules y mostrador naranja', 'El stand ordena el mensaje igual que la web: a quién sirve, por qué es distinto y qué puedes hacer'),
  ],
  implementation: [
    'El flujo completo se entregó como un documento de handoff con las dos caras —quien factura y quien recibe— y las anotaciones para desarrollo sobre el mismo lienzo, en lugar de una lista de pantallas suelta.',
    'La misma marca se declinó fuera de la pantalla: el stand de feria y la bolsa de regalo corporativo, que comparte pieza y estructura con Ayax y Atrinium y solo cambia ilustración, color y firma.',
  ],
  result: {
    output: [
      { value: '4', label: 'bloques con una sola gramática', meaning: 'Empresa, Facturación, Cobros y Cumplimiento: trece secciones que se aprenden una vez porque todas siguen el ciclo leer, editar, confirmar.' },
      { value: '3', label: 'pasos para el cliente final', meaning: 'Servicio, quién eres y dirección. Al finalizar, la factura se completa sola en la app de quien emitió.' },
      { value: '2', label: 'salidas sin pedir datos en el momento', meaning: 'QR o correo: el emisor no espera a nadie para cerrar su factura.' },
    ],
    outcome: 'unavailable',
    measure: 'Facturas rápidas que llegan a completarse, tiempo desde la emisión hasta que el cliente rellena sus datos y cuántos usuarios terminan la configuración en la primera sesión. Nada de eso se instrumentó.',
  },
  learnings: [
    'El problema casi nunca está en la pantalla que te piden: la factura funcionaba, lo que estaba roto era la configuración que la alimenta.',
    'Un estado intermedio bien definido —la factura pendiente— resolvió más que cualquier rediseño visual del formulario.',
    'Una gramática repetida (leer, editar, confirmar) ahorra más que trece pantallas bien resueltas por separado.',
    'Cumplir la norma no basta: si el usuario no entiende qué le obliga y cuándo, la norma se convierte en soporte.',
  ],
  next: 'montsaint',
};
