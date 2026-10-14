# Guion · Paso CERTIFICADO (APRD-513)

**Formato:** 12–15 min. 8 min de historia (`#deck`), 5 de demo (`#demo`) y preguntas.
**Navegación del deck:** ← → o espacio. «Ir al prototipo» arriba a la derecha en cualquier diapositiva.

## Antes de presentar: confirmar

El proceso (diapositivas 2 a 5) es el que contaste: research desk, front lead, PO, reunión
conjunta, backend y la decisión final de diseño. La otra finalista no se nombra a propósito.
Quedan por cerrar:

- [ ] **Estado:** ¿el paso está en producción, en piloto o se quedó en propuesta? Ajusta el cierre.
- [ ] **Tenant real:** la demo usa «Surety Demo». Decide si en la sala puedes nombrar al cliente.
- [ ] **Rol:** la portada dice «research, diseño e implementación revisada en React».

## Diapositivas

**1 · Portada (30 s).** «Un paso nuevo en el flujo de emisión de caución: elegir uno de cuatro
modelos legales, en español o inglés, y adaptar el cuerpo sin tocar lo que obliga a la aseguradora.»

**2 · El encargo (1 min).** Lee la cita del ticket. Señala las cuatro tarjetas: es el alcance
completo. Abajo, la tensión que hay que resolver: flexibilidad para quien escribe frente a
control sobre lo que obliga a la aseguradora. El ticket pedía «WYSIWYG o similar»: esa palabra,
*similar*, es la que abrió la búsqueda.

**3 · Investigar con el equipo (2 min).** La diapositiva más personal; cuéntala en primera persona.
«Nunca había diseñado un sistema de creación de documentos en HERMES. Cuando no sé por dónde
empezar, pido ayuda y organizo la decisión.» Que se oiga el liderazgo: tú convocaste, tú
marcaste el orden y tú pusiste el criterio final. Recorre los seis pasos en orden:
1. Research desk y benchmark de otros productos, con herramientas de design thinking.
2. Le explico la idea al front lead.
3. La contrasto con la PO.
4. A los dos o tres días nos juntamos: el front lead había encontrado un par de aplicaciones y
   coincidimos en dos.
5. No conocíamos bien cómo encajaba con la base de datos: acordamos un par de horas de
   investigación y una reunión con back. Las dos funcionaban.
6. Con las dos viables, el criterio final lo puse yo: cuál encajaba mejor en el diseño.

**4 · Anatomía (1,5 min).** La pieza de diseño que fija los criterios de la elección: partir el
A4 en regiones. Las cuatro fijas se comparten entre los cuatro modelos; solo cambia el cuerpo.
Frase clave: *lo fijo no está dentro del editor, así que no hay permiso que saltarse.*

**5 · Elegir el editor (1,5 min).** «Backend validó las dos. La pregunta pasó a ser cuál se
adaptaba mejor al diseño.» Los cuatro motivos de TipTap: headless (la UI sale del design system),
nodos propios (la variable como componente), extensiones a la carta (solo el formato que la
plantilla permite) y salida JSON (lo que guarda el `document_model`). Cierra con: *el equipo
puso el filtro técnico; la última decisión fue de diseño.* Si preguntan por la otra finalista,
basta con decir que también era viable y que perdió en adaptabilidad al diseño.

**6 · Decisiones (1,5 min).** No las leas todas. Elige tres: variables atómicas, `/` y `@`,
huecos visibles. Las otras salen en la demo.

**7 · Handoff (1 min).** El prototipo produce el mismo `document_model` que guarda backend.
`variables.missing` es la regla de negocio: si no está vacía, no se emite.

**8 · Validar (1 min).** Cada criterio de aceptación es un test. Y lo que mediríamos: sin cifras
inventadas, se dice que está sin medir.

**9 · Demo.** Pulsa «Abrir prototipo».

## Ruta de la demo (5 min)

1. **Paso Certificados.** Señala el stepper (criterio 1), el selector ES/EN y la plantilla
   *Público con fecha – Tasas aeroportuarias*.
2. **Anatomía.** Pulsa «Anatomía»: las regiones se etiquetan como en el Figma. Pasa el ratón
   por la cabecera: candado, no hay cursor. Vuelve a pulsar.
3. **Editar.** Clic al final de un párrafo, Enter, escribe `/`: Título, Lista, Caja de texto…
   Elige «Variable de la póliza…» o escribe `@benef` y Enter. La variable entra como un chip:
   no hay cursor dentro; si la seleccionas y escribes, se sustituye entera (y `Ctrl+Z` la recupera). El estado pasa a «Modificado respecto a la plantilla
   aprobada» y aparece «Restaurar plantilla».
4. **Panel de variables.** Clic en *Beneficiario · CIF*: se inserta en el cursor y aparece el check
   de «ya está en el documento».
5. **Dos lecturas.** Cambia a «Datos de la póliza»: los chips muestran lo que se imprimirá.
6. **document_model.** Ábrelo y edita algo con el panel abierto: el JSON cambia en vivo.
   `modified: true`, `variables.used`, `missing: []`.
7. **Idioma.** Pasa a EN: otro borrador, el de ES no se pierde. Vuelve a ES y sigue tu edición.
8. **Un hueco.** Cambia a *Certificado Almacenamiento*: aviso «Falta 1 dato para emitir»
   (la subestación no se recogió en Riesgo). Abre la vista previa: el hueco se marca en el PDF.
   Pulsa «Continuar»: no deja. Completa el dato (p. ej. «Antequera 220 kV») y continúa.
9. **Resumen.** Póliza emitida; el certificado sale como uno más de los documentos. «Ver» abre
   el PDF con la plantilla y el idioma elegidos.

**Plan B sin red:** `npm run build && npx vite preview`. Si falla todo, las capturas del Figma
cuentan lo mismo hasta el paso 7.

## Preguntas probables

**¿Por qué no dejar el documento entero editable?** Porque cabecera, apoderamiento y pie son
los que obligan a la aseguradora. Si se pueden editar, Legal tiene que revisar cada certificado;
si no, solo revisa la plantilla una vez.

**¿Por qué TipTap y no la otra finalista?** Las dos pasaron el filtro de front y back. TipTap
es headless, así que toolbar, menús y chips salen de nuestro design system, y deja definir la
variable como un nodo propio con salida JSON. Era la que menos peleaba con el diseño.

**¿Lo validaste con usuarios?** No: el research fue de escritorio y con el equipo. Dilo así y
sigue con lo que harías hoy: sumar a quien emite certificados antes de cerrar la anatomía. Es
exactamente lo que pone el caso en «Lo que corregiría».

**¿Qué harías distinto?** Validar la anatomía con quien emite antes de cerrarla, y versionar las
plantillas desde el primer día (`template_version` en el `document_model`).

**¿Cómo empezaste algo que no habías hecho nunca?** Research desk y benchmark para ver qué
hacen otros productos, y después pedir ayuda: front lead, PO y back, en ese orden. La decisión
técnica salió de conversaciones, no de una imposición.

**¿Qué pasa si Legal cambia una plantilla y hay borradores abiertos?** El `document_model` ya
guarda `template` y `modified`. El siguiente paso es versionar la plantilla (`template_version`)
y, si un borrador está sobre una versión antigua, avisar y ofrecer rehacerlo sobre la nueva.

**¿Cómo se genera el PDF?** Backend renderiza desde el `document_model`: regiones fijas de la
plantilla + `body` con las variables resueltas. La vista previa del prototipo usa el mismo JSON.

**¿Y si una variable no tiene dato?** Se marca en el editor, en la vista previa y bloquea
«Continuar». En producción el aviso lleva al paso donde se recoge el dato.

**¿Escala a más plantillas o tenants?** Las plantillas son datos (DSL → JSON) y el catálogo de
variables se filtra por plantilla. El tenant es un objeto de configuración más una capa de
tokens (`--tenant-*`).

**¿Accesibilidad?** Toolbar con `aria-pressed`, menús `/` y `@` como `listbox` con flechas,
Enter y Escape, foco visible y regiones fijas etiquetadas. Objetivo WCAG 2.2 AA.

**¿Colaboración en tiempo real?** No estaba en el alcance. TipTap la soporta con Y.js si
hiciera falta, sin cambiar el modelo del documento.
