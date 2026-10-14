# Guion · Paso CERTIFICADO (APRD-513)

**Formato:** 12–15 min. 8 min de historia (`#deck`), 5 de demo (`#demo`) y preguntas.
**Navegación del deck:** ← → o espacio. «Ir al prototipo» arriba a la derecha en cualquier diapositiva.

## Antes de presentar: confirmar

Lo que está en el deck sale del ticket, del Figma y del caso del editor de propuesta del portfolio.
Estos puntos no los he podido comprobar y conviene cerrarlos antes:

- [ ] **Entrevistas:** con quién (emisión, suscripción, Legal) y cuántas. La diapositiva 3
      («Tres voces») resume necesidades que se leen en el ticket; si tienes citas reales,
      cámbialas por ellas: pesan más.
- [ ] **Benchmark:** el Figma conserva un nodo `ck-editor__aria-label` en las primeras pantallas
      (Pantalla Circunstancias), así que la exploración partió de CKEditor. ¿Se miraron otros
      (Quill, Lexical, Slate)? Si sí, añádelos a la tabla de la diapositiva 5.
- [ ] **Estado:** ¿el paso está en producción, en piloto o se quedó en propuesta? Ajusta el cierre.
- [ ] **Tenant real:** la demo usa «Surety Demo». Decide si en la sala puedes nombrar al cliente.
- [ ] **Rol:** la portada dice «research, diseño e implementación revisada en React».

## Diapositivas

**1 · Portada (30 s).** «Un paso nuevo en el flujo de emisión de caución: elegir uno de cuatro
modelos legales, en español o inglés, y adaptar el cuerpo sin tocar lo que obliga a la aseguradora.»

**2 · El encargo (1 min).** Lee la cita del ticket. Señala las cuatro tarjetas: es el alcance
completo. El ticket pedía «WYSIWYG o similar»: esa palabra, *similar*, es la que abrió la búsqueda.

**3 · Empatizar (1,5 min).** Tres voces y una tensión: flexibilidad para quien escribe,
control para quien firma. Si Legal no está tranquilo, el editor no se usa; si quien emite no
puede adaptar el cuerpo, sigue haciéndolo en Word.

**4 · Anatomía (1,5 min).** La decisión que más simplifica todo: antes de pantallas, partir el
A4 en regiones. Las cuatro fijas se comparten entre los cuatro modelos; solo cambia el cuerpo.
Frase clave: *lo fijo no está dentro del editor, así que no hay permiso que saltarse.*

**5 · ¿Qué editor? (2 min).** Desde cero, CKEditor 5 y TipTap. Los criterios salen de la
anatomía: necesitábamos UI propia (design system), una variable como nodo de verdad y una
salida JSON que backend pudiera guardar. Decidido con el front lead. Cierra con la frase de
abajo: el filtro técnico cambió el diseño.

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

**¿Por qué no CKEditor si ya estaba en las primeras pantallas?** Trae su propia UI y su modelo
está orientado a HTML; necesitábamos UI de nuestro design system y un nodo de variable con
salida JSON. TipTap es headless, el núcleo es MIT y está sobre ProseMirror.

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
