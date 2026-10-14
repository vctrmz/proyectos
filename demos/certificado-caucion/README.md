# Paso CERTIFICADO · demo

Demo del ticket **APRD-513** de HERMES: un paso nuevo en el flujo de emisión del producto
**Caución** para elegir idioma (ES/EN) y uno de los cuatro modelos de certificado, y editar
**solo el cuerpo** con un editor sobre **TipTap**, con variables que salen de la póliza.

En la misma URL hay una presentación del caso (`#deck`) y el prototipo (`#demo`).
El guion para presentarlo está en [`PRESENTACION.md`](./PRESENTACION.md).

> Datos ficticios. Tenant, aseguradora, apoderado, CIF e importes son inventados; el texto
> legal se ha resumido a partir de los modelos de Figma. No hay datos de clientes.

## Arrancar

```bash
cd demos/certificado-caucion
npm install
npm run dev        # http://localhost:5173/#deck  ·  /#demo para ir directo al prototipo
npm test           # dominio + un test por criterio de aceptación
npm run build      # typecheck + build estático en dist/ (base relativa)
npm run build:portfolio  # un único HTML en ../../public/demos/paso-certificado.html
```

El portfolio sirve la demo en `/demos/paso-certificado.html` y la enlaza desde el caso
`/es/cases/paso-certificado`. Después de cambiar la demo, vuelve a lanzar `build:portfolio`
y commitea el HTML. Las capturas del caso salen de `shots/` (`npm run images` en la raíz).

## Del ticket al código

| Ticket APRD-513 | Dónde vive |
| --- | --- |
| Paso «CERTIFICADO» en el flujo | `src/components/AppShell.tsx` (stepper) |
| Selector de idioma ES/EN | `CertificateStep.tsx`; un borrador por plantilla × idioma en `App.tsx` |
| Selector de las 4 plantillas | `src/domain/templates/index.ts` |
| Cabecera, logotipo y pie fijos | `A4Page.tsx`: las regiones fijas están **fuera** del editor |
| Cuerpo editable con formato | `src/editor/useCertificateEditor.ts` + `Toolbar.tsx` |
| Listado de variables a la izquierda | `VariablePanel.tsx` (clic para insertar) |
| Insertar variables en el texto | nodo `variable` (`VariableNode.ts`) + menú `@` (`suggestions.ts`) |
| «sección dinámica … del document_model» | `src/domain/document.ts` → `buildDocumentModel()`; visible en el panel *document_model* |
| Criterios de aceptación | `test/acceptance.test.tsx`, uno por criterio |

## Arquitectura

```
src/
  domain/            puro, sin React: se prueba sin montar el editor
    types.ts         DocumentModel, regiones, plantillas, variables
    variables.ts     catálogo {{ grupo.campo }}, etiquetas ES/EN, datos ficticios de póliza
    templates/       4 modelos × 2 idiomas en un mini-DSL (**negrita**, {{ variable }})
    document.ts      DSL → JSON de TipTap, auditoría de variables, document_model
    tenant.ts        marca y razón social del tenant (multi-tenant: solo cambia esto)
  editor/
    VariableNode.ts  nodo inline atómico: no se puede escribir dentro de una variable
    VariableChip.tsx node view: etiqueta o valor de la póliza, y estado (ok, sin dato, desconocida)
    suggestions.ts   menús `/` (bloques) y `@` (variables) sobre @tiptap/suggestion
    Toolbar.tsx      formato permitido por el modelo; sin color ni tipografía libres
  components/        shell del flujo, A4, panel de variables, vista previa, resumen, deck
  styles/            tokens.css (primitivos → semánticos → tenant), app.css, deck.css
```

Decisiones que conviene saber antes de tocar el código:

- **La restricción es estructural.** El editor solo contiene el cuerpo. Cabecera,
  apoderamiento, firma y pie se pintan desde la plantilla; no hay `contenteditable` que
  bloquear ni permisos que saltarse.
- **Una variable es un átomo.** `{{ tomador.nombre }}` se selecciona, se arrastra y se borra
  entera. `renderText` la serializa con la sintaxis del ticket al copiar como texto.
- **El document_model es el contrato.** Solo `body` lleva contenido (JSON de TipTap); las
  regiones fijas son referencias. `variables.missing` es la regla que bloquea la emisión.
- **Un editor por paso, un borrador por plantilla × idioma.** Cambiar de plantilla no recrea
  el editor: se sustituye el contenido fuera del commit de React (las variables son node
  views de React).

## Fuente

Figma «Untitled», página 2 (`node-id=95-22593`): ticket APRD-513, sección *Documents*
(anatomía y los cuatro modelos), *Product model* (pantallas del flujo) y *certificados-mejorado*.
