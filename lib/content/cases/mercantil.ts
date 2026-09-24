import { shot, type CaseStudy } from './types';

export const mercantil: CaseStudy = {
  slug: 'mercantil', title: 'Que un producto financiero se entienda a la primera', company: 'Mercantil Banco Panamá', years: '2020–2022',
  tagline: 'Cinco ofertas y cinco audiencias que no hablan igual: pagos digitales, Mony, Tadelanto, Next Gen e hipotecas, del deck comercial al flujo en banca en línea.',
  tags: ['Caso de estudio', 'En producción', 'Banca', 'Research y UX'], brand: '#0B3A6B',
  hero: shot('mb-pay_01', 'Portada del deck «Soluciones de pago digitales para tu negocio» de Mercantil', 'Cada oferta llegaba como una definición de negocio y salía como experiencia y piezas de venta'),
  context: 'En Mercantil Banco Panamá el Product Owner definía la oferta —producto, condiciones, tarifas y audiencia— y yo la convertía en experiencia: flujos y prototipos para la banca en línea, piezas que explicaban cada producto a comercios, estudiantes y clientes, y la validación con UX y negocio antes de salir al mercado.',
  role: 'Product Designer en entorno regulado, entre el Product Owner que define la oferta y los canales que la venden.',
  delivery: 'Prototipos de banca en línea, emails transaccionales, decks y piezas de venta por audiencia, y la validación de flujos y contenido antes de lanzar.',
  problem: [
    'El banco tenía nueve soluciones de cobro y un deck que las presentaba una detrás de otra: la dueña de un comercio no sabe qué es un SDK y el desarrollador no necesita leer sobre el link de pago.',
    'En crédito, un error en la cifra pesa más que cualquier detalle visual: el simulador de adelanto mostraba una cuota que no cuadraba con el total.',
  ],
  complexity: { diagram: 'handoff-chain', caption: 'Mi sitio en el proceso: el PO define la oferta, yo la traduzco a experiencia, se valida con UX y negocio, y comercial la lleva al mercado.' },
  decisions: [
    { title: 'Ordenar quién necesita qué antes de diseñar nada.', why: 'Cinco productos y cinco audiencias —comercios, clientes de banca, estudiantes, colaboradores y referidores— se solapaban en los mismos materiales.', changed: 'Una matriz de producto por audiencia, con principal y secundaria, extendida desde el material del programa Next Gen a todas las ofertas en las que trabajé. Todo lo demás se priorizó contra ella.', figure: { shot: shot('mb-ng_12', 'Matriz de productos por audiencia: empresa, colaboradores, estudiantes, proveedores y padres', 'La matriz: qué producto habla a quién, antes de escribir una pantalla') } },
    { title: 'Un selector que parte de la situación del comercio, no del catálogo del banco.', why: 'Nueve soluciones en fila obligan al usuario a aprender la taxonomía interna del banco para elegir.', changed: 'Tres preguntas —dónde vendes, tienes web propia, cobras lo mismo cada mes— que llevan a la solución que le toca. El catálogo completo sigue disponible, pero deja de ser el punto de entrada.', figure: { shot: shot('mb-pay_07', 'Pasarela de pagos online para integrar en la web', 'Las nueve soluciones seguían ahí: lo que cambia es cómo se llega a la que te sirve') } },
    { title: 'Mony: lo visible es un QR en caja; debajo hay cuatro fases que deben funcionar juntas.', why: 'Convertir la billetera de más de 50.000 clientes en canal de cobro no es una pantalla: es afiliación, material físico, pago y conciliación.', changed: 'Un blueprint con las cuatro fases y sus soportes —banca en línea, plantillas de banner, plataforma Mony y motor de emails— para que el comercio no se quede a medias entre el ejecutivo y la caja.', figure: { shot: shot('mb-pay_18', 'Banners de Mony para caja y entrada del comercio', 'El material de tienda es parte del flujo: «Aceptamos Mony» en caja y en la entrada') } },
    { title: 'Evaluar mi propio prototipo de Tadelanto contra las heurísticas, y decirlo.', why: 'En un producto de crédito, un error en la cifra o en el coste engaña; y el prototipo tenía nueve hallazgos, dos de ellos graves.', changed: 'La cuota no cuadraba con el total, «tasa del 6 %» ocultaba una comisión de 30 dólares, y el modal de éxito aparecía antes de aceptar el tratamiento de datos. Los ordené por severidad, no por facilidad de arreglo.', figure: { shot: shot('mb-adl_05', 'Simulador de adelanto de salario con monto, forma de pago y cuotas', 'El simulador original: rango de 10 a 1.000 dólares con 500 preaprobados y cuatro opciones de cuota siempre activas') } },
    { title: 'El rediseño enseña el coste en dólares y las cuotas dependen de la frecuencia.', why: 'Nada que se pueda elegir y luego se rechace, y nada que se entienda solo después de firmar.', changed: 'El rango termina en el monto preaprobado, las cuotas se derivan de la forma de pago, el coste se muestra como «comisión única de 18 dólares» y la confirmación dice cuánto, dónde y cuándo se cobra. El email repite lo mismo con la misma voz.', figure: { shot: shot('mb-adl_07', 'Email de confirmación de Tadelanto', 'El email de confirmación, con la misma cifra y la misma voz que la pantalla') } },
  ],
  system: {
    body: [
      'Lo que unificó el trabajo no fue una biblioteca de componentes sino un vocabulario: un producto, un nombre. «Préstame», «Tadelanto», «adelanto de salario» y «adelanto de planilla» eran cuatro nombres para lo mismo en el mismo flujo.',
      'En crédito el contenido es interfaz: la cifra, la fecha de cobro y el coste total son los componentes que deciden, y tienen que aparecer igual en la pantalla, en el modal y en el email.',
      'Una nota honesta: la investigación de entonces no quedó documentada. Las proto-personas, el journey, el blueprint y la evaluación heurística los reconstruí en 2026 a partir del material que entregué, para hacer visible el razonamiento. No son estudios con usuarios de la época, y el caso propone cómo se validarían.',
    ],
    code: { title: 'Contenido como componente: qué tiene que decir cada cifra', lang: 'json', code: "{\n  \"adelanto\": {\n    \"preaprobado\":  500,\n    \"solicitado\":   300,\n    \"comision\":     { \"tipo\": \"unica\", \"pct\": 6, \"importe\": 18 },\n    \"total\":        318,\n    \"frecuencia\":   \"quincenal\",\n    \"cuotas\":       { \"quincenal\": [1, 4], \"mensual\": [1, 2] },\n    \"cuota\":        159,\n    \"cuenta\":       \"nomina ••5297\"\n  },\n  \"reglas\": [\n    \"el rango del slider termina en el preaprobado\",\n    \"las cuotas dependen de la frecuencia\",\n    \"el coste se muestra en dolares, no en porcentaje\",\n    \"la confirmacion repite cuanto, donde y cuando\"\n  ]\n}" },
    uiKit: [
      { kind: 'phases', title: 'Tres preguntas, una decisión', body: 'El simulador avanza por monto, frecuencia y cuotas, y cada paso limita el siguiente: no se puede configurar algo que después se rechaza.', wide: true, label: 'Paso 2 de 3 · las cuotas dependen de la frecuencia' },
      { kind: 'table', title: 'Hallazgos por severidad', body: 'Nueve hallazgos ordenados por lo que le cuesta al usuario —crítica, alta, media, baja—, no por lo que cuesta arreglarlos.', wide: true },
      { kind: 'states', title: 'Severidad con color y palabra', body: 'La severidad nunca va solo en color: crítica bloquea o engaña, alta afecta la decisión, media es fricción y baja es pulido.', wide: true, labels: ['Baja', 'Media', 'Alta', 'Crítica'] },
      { kind: 'form', title: 'Consentimiento antes del éxito', body: 'La autorización de tratamiento de datos se acepta antes de ver el modal de solicitud procesada, no debajo de él.', wide: true },
    ],
  },
  design: [
    shot('mb-pay_05', 'Diapositiva «Te contamos una historia»: Ana antes de digitalizar su negocio', 'La historia de Ana: el antes y el después del comercio, que después usé como proto-persona'),
    shot('mb-pay_20', 'Cómo pagan los clientes con Mony: banca móvil, enviar, QR', 'Mony explicado por el recorrido del cliente, no por la arquitectura del producto'),
    shot('mb-ng_09', 'Primera tarjeta de crédito sin papeleos desde Zinli', 'Next Gen: la primera tarjeta explicada a un estudiante que paga en efectivo'),
    shot('mb-pay_19', 'Correos de notificación de enviar y recibir dinero', 'Los emails transaccionales: la misma voz y las mismas cifras que la pantalla'),
  ],
  implementation: [
    'Cada oferta se validaba con UX y negocio antes de salir: revisión de flujos y de contenido, que en banca es la mitad del diseño.',
    'El rediseño del simulador está planteado con su plan de validación: tres hipótesis, un test moderado con seis a ocho colaboradores con nómina en el banco y la tarea de pedir 300 dólares a un mes. Es lo que no se midió entonces y lo que haría antes de programar.',
  ],
  result: {
    output: [
      { value: '5', label: 'ofertas llevadas del deck al flujo', meaning: 'Pagos digitales, Mony Jurídico, Tadelanto, Next Gen e hipotecas por referidos, cada una con su audiencia principal declarada.' },
      { value: '9', label: 'hallazgos en mi propio prototipo', meaning: 'Uno crítico y dos altos, con la pantalla y la heurística que incumplen. La auditoría es del caso, no del cliente: sirve para enseñar criterio, no para lucirlo.' },
      { value: '4 → 1', label: 'nombres para el mismo producto', meaning: 'Préstame, Tadelanto, adelanto de salario y adelanto de planilla convivían en el mismo flujo.' },
    ],
    outcome: 'unavailable',
    measure: 'Altas de comercio por solución, uso de Mony en caja y solicitudes completadas de Tadelanto frente a las iniciadas. En su momento no se instrumentó, y el caso incluye las hipótesis y el test con el que lo mediría hoy.',
  },
  learnings: [
    'En banca, el contenido es la interfaz: la cifra, el coste y la fecha deciden más que la composición.',
    'Auditar el propio trabajo años después enseña más que defenderlo, y marcar lo retrospectivo como tal es parte de la honestidad del caso.',
  ],
  next: 'suscripcion',
};
