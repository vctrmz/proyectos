# Modelo de evidencia

La agencia solo documenta lo que puede demostrar. Cada valor, token, componente y patrón lleva un estado y sus fuentes.

## Estados

| Estado | Significa | Quién lo asigna |
|---|---|---|
| `confirmed` | Existe en Figma como variable, estilo o componente maestro | `merge-evidence.js` (automático) |
| `recurring` | Aparece en 2+ pantallas, o 3+ veces en una misma pantalla | `merge-evidence.js` (automático) |
| `candidate` | Aparece 1-2 veces en una sola pantalla; puede ser reutilizable o un error | `merge-evidence.js` (automático) |
| `proposed` | No se ha observado: es una recomendación de la agencia | los agentes, siempre con `rationale` |
| `pending` | Falta información para decidir | los agentes, con la pregunta en `specs/decisions/open-questions.md` |

Reglas:

- Un agente puede **bajar** un estado (de `recurring` a `candidate` si sospecha un error), nunca subirlo sin evidencia nueva.
- Los estados no visibles en las pantallas (hover, focus, disabled, error, carga…) se documentan como `proposed`.
- Un valor medido sobre una imagen lleva `estimated: true`, salvo los colores leídos píxel a píxel con `image-palette.js` (`sampled: true`).
- Nunca se declara cumplimiento WCAG sin los dos colores exactos y la ratio calculada.

## Fuentes

Formato de cada fuente, en `sources` (frontmatter de las specs y `$extensions.agency.sources` de los tokens):

- `figma:<fileKey>/<nodeId>` → por ejemplo `figma:aBcDeF1234567890GhIjKl/1:22326`
- `image:<ruta>` → por ejemplo `image:inputs/alta-cliente.png`

## Archivo de evidencia por pantalla

`specs/screens/<slug>.evidence.json`. Lo escribe `figma-evidence-extractor`, uno por pantalla. Solo hechos: sin proponer ni interpretar.

```json
{
  "schema": 1,
  "screen": {
    "slug": "alta-cliente-contacto",
    "name": "Alta de cliente · Datos del contacto",
    "source": { "type": "figma", "file_key": "aBcDeF1234567890GhIjKl", "node_id": "1:22326", "url": "https://www.figma.com/design/…" },
    "viewport": { "width": 1440, "height": 1313, "scale": 1 },
    "screen_types": ["form", "navigation"]
  },
  "colors":         [{ "value": "#1E293B", "role": "text", "count": 22, "example": "\"Acme Seguros\" (1:22338)", "variable": null, "figma_style": null }],
  "contrast_pairs": [{ "fg": "#738096", "bg": "#F8FAFD", "size": 11, "weight": 600, "count": 7, "example": "\"CLIENTE\" (1:21763)" }],
  "typography":     [{ "family": "Inter", "weight": 600, "font_style": "Semi Bold", "size": 15, "line_height": "auto", "letter_spacing": "0", "text_case": "upper", "count": 2, "example": "…", "figma_style": null }],
  "spacing":        [{ "value": 16, "kind": "padding", "count": 36 }],
  "layout":         [{ "between": "etiqueta y campo", "value": 4, "example": "1:22395 → 1:22397" }],
  "radius":         [{ "value": "4", "count": 48 }],
  "borders":        [{ "width": 1, "color": "#E2E8F0", "sides": "all", "count": 21 }],
  "shadows":        [{ "css": "0px 1px 3px 0px rgba(0,0,0,0.04)", "count": 1 }],
  "components":     [{ "name": "Button", "figma": "Button → Variant=Secondary, State=Default", "instances": 2, "tier": "atom", "variants_seen": ["secondary"], "states_seen": ["default"], "count": 2, "example": "…" }],
  "patterns":       [{ "name": "form-layout", "note": "Formulario en tarjetas por sección, dos columnas, acciones abajo" }],
  "content":        { "language": "es", "voice": "tuteo", "issues": ["«resposable» → «responsable»"] },
  "hidden":         ["Paso: check y número ocultos en cada ítem del menú de pasos (1:22609…)"],
  "notes":          ["El menú lateral de pasos es un componente distinto de la navegación principal"]
}
```

Campos:

- `role` del color: `text`, `fill`, `icon` o `stroke`. `opacity` (0-1) solo si el relleno no es opaco.
- `contrast_pairs`: color de texto, fondo real (el primer antepasado con relleno opaco) y tamaño y peso del texto. Los da el escaneo de Figma; en capturas, léelos con `image-palette.js --at`. Es lo que usa accesibilidad.
- `typography`: `text_case` (`upper`, `lower`, `title`) solo si no es el original. `figma_style`: el estilo de texto de Figma, si lo hay.
- `kind` del espaciado: `padding` o `gap`. `layout` (opcional): distancias entre piezas que no son padding ni gap de auto layout, medidas con `get_metadata`.
- `borders`: `sides` (`all` o `top,bottom`…), `dash_pattern` si es discontinuo.
- `screen_types`, de esta lista: `navigation`, `form`, `table`, `detail`, `dashboard`, `loading`, `empty`, `error`, `auth`, `modal`. La madurez la deciden `form`, `table`, `detail`, `loading`, `empty` y `error`.
- `tier` del componente: `atom`, `molecule` u `organism` (ver `taxonomy.md`).
- `variable` y `figma_style`: nombre exacto de la variable o estilo de Figma si el valor está ligado. Es lo que convierte un valor en `confirmed`. (`style` y `text_style` se siguen leyendo por compatibilidad.)
- `figma` e `instances` del componente: el maestro y cuántas apariciones son instancias suyas. Si `instances` < `count`, el resto son copias sueltas y el informe lo dice.
- `hidden`: capas ocultas que parecen estados guardados (checks, errores, progreso). No son evidencia de estado visible, pero sí una pista para las preguntas abiertas.

## Qué cuenta y qué no

- **`count` de un componente** = número de instancias del componente, no de sus partes. Un stepper de 11 pasos es 1 stepper; los pasos son anatomía.
- **Un nombre por componente distinto.** Si dos bloques ocupan el mismo sitio pero tienen otra anatomía o función (el menú de una sección frente al menú de pasos de un registro), son dos componentes con dos nombres de `taxonomy.md`. El recuento los une por nombre: un nombre compartido por error infla el estado.
- **Iconos**: se registran como componente `Icon` (con la librería en `notes`), no como un color más.
- **Fuera del sistema**: fotos, logotipos de terceros, ilustraciones y emojis. Sus colores no van a `colors`; si el escaneo los mezcla y no puedes separarlos, réstalos a mano y explícalo en `notes`. Los avatares de iniciales sí son interfaz.
- **Contenido**: `voice` es `tú`, `usted`, `vos`, `nosotros` o `impersonal`; si se mezclan, lista los casos en `issues`.

## Estado de una ficha de pantalla

`specs/screens/<slug>.md` lleva `status: confirmed` si viene de Figma y `status: candidate` si viene de una captura (sus medidas son estimadas).

## Después de extraer

```bash
node scripts/merge-evidence.js
```

Genera `specs/audits/evidence-summary.json` (lo leen los demás agentes) y `specs/audits/evidence-matrix.md` (lo leen las personas). Ninguno de los dos se edita a mano.
