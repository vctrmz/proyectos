# Extraer evidencia de Figma

Receta para `figma-evidence-extractor`. Todo es lectura: nunca se modifica el archivo de Figma.

## Enlaces

De `https://www.figma.com/design/<fileKey>/<nombre>?node-id=1-2` salen `fileKey` y `nodeId` (`1-2` → `1:2`). Si el enlace no trae `node-id`, pide el enlace del frame concreto: sin él no hay evidencia trazable.

## Herramientas

Son las del conector de Figma (`get_screenshot`, `use_figma`, `get_variable_defs`, `get_metadata`, `get_design_context`).

- Si aparecen como diferidas, cárgalas con ToolSearch. Una búsqueda por palabra («figma») no las trae todas: busca primero sus nombres completos (llevan el prefijo del servidor, `mcp__<id>__get_screenshot`) y cárgalas juntas con `select:nombre1,nombre2,…`.
- Las descripciones de `use_figma` y `get_design_context` piden cargar antes unas guías de Figma (figma-use, figma-design-to-code). Si no están disponibles, sigue: aquí solo se lee, y el script de escaneo no escribe nada.
- `get_metadata` recomienda llamar después a `get_design_context`: ignóralo y sigue esta guía.
- Si no hay conector de Figma, para y avisa: sin él solo se puede trabajar con capturas.

## Orden de llamadas por pantalla

1. **`get_screenshot`** del frame (`maxDimension: 1440`). Descarga el PNG con `curl` a `output/<run>/capturas/<slug>.png` y míralo con Read. Sirve para entender la pantalla y para `image-palette.js` si hace falta.
2. **`use_figma` con `figma-evidence-scan.js`**. Copia el archivo entero, cambia `ROOT_ID` por el `nodeId` y ejecútalo. Devuelve frecuencias reales de colores, pares texto/fondo, tipografías, espaciados, radios, bordes (también de un solo lado y discontinuos), sombras, componentes, variables, estilos y capas ocultas. Es la fuente principal de `count`, `variable`, `figma_style` y `contrast_pairs`.
   - Mira `totals` y `truncated`: si una categoría aparece en `truncated`, repite con `ONLY = ['colors']` (o la que sea) para verla entera. Registra **todos** los valores, no solo las primeras filas.
3. **`get_variable_defs`** del frame. Da los nombres y valores de las variables ligadas; contrasta con el escaneo.
4. **`get_metadata`** del frame, si necesitas la jerarquía (nombres de capas, anidación) para reconocer componentes que no son instancias.
5. **`get_design_context`** solo para un componente concreto cuyo detalle (anatomía, auto layout) no quede claro con lo anterior. Es caro: no lo pidas para pantallas enteras.

## Límites conocidos

- `use_figma` devuelve como máximo 20 KB: escanea **un frame por llamada**. El script ya compacta las filas.
- `get_metadata` falla con secciones o páginas enormes (respuesta de más de 1 MB). Pide frames, no secciones. Si necesitas el índice de una sección, usa `use_figma` con un script de solo lectura que liste `children` (id, nombre, tipo, tamaño).
- `get_screenshot` y `get_design_context` necesitan un `nodeId` concreto.
- El escaneo no recorre lo que hay dentro de las capas ocultas, pero las lista en `hidden` (solo la de más arriba de cada rama).

## Cómo pasar el escaneo al JSON de evidencia

| Fila del escaneo | Campo del JSON |
|---|---|
| `text #1E293B · ×22 · "Acme Seguros" (1:22338)` | `colors: { value: "#1E293B", role: "text", count: 22, example: "\"Acme Seguros\" (1:22338)" }` |
| `fill #E1ECFF` + estilo `Fill → fill ×11` | añade `figma_style: "Fill"` al color que coincida |
| `color/azure/43 → fills` | busca su valor con `get_variable_defs` y añade `variable: "color/azure/43"` a ese color |
| `Inter Semi Bold 11/auto ls 0.4px upper [Label]` | `typography: { family: "Inter", font_style: "Semi Bold", weight: 600, size: 11, line_height: "auto", letter_spacing: "0.4px", text_case: "upper", figma_style: "Label" }` |
| `#738096 on #F8FAFD · 11px Semi Bold · ×7` | `contrast_pairs: { fg: "#738096", bg: "#F8FAFD", size: 11, weight: 600, count: 7 }` (un fondo `#FFFFFF?` es supuesto: compruébalo en la captura) |
| `0.5px #E6E8EE inside sides:bottom,left` | `borders: { width: 0.5, color: "#E6E8EE", sides: "bottom,left" }` |
| `padding 16 · ×36` / `gap 12 · ×32` | `spacing: { value: 16, kind: "padding", count: 36 }` |
| `Button → Variant=Secondary, State=Default [librería]` | `components: { name: "Button", figma: "Button → Variant=Secondary, State=Default", instances: 2, variants_seen: ["secondary"], states_seen: ["default"] }` |
| `hidden: "check" · en "Paso 2"` | `hidden: ["…"]`: pista de estados guardados, no evidencia de estado visible |

Pesos: Thin 100 · Extra Light 200 · Light 300 · Regular 400 · Medium 500 · Semi Bold 600 · Bold 700 · Extra Bold 800 · Black 900.

## Qué no es evidencia

- Los nombres de capa genéricos (`Frame 1618873647`) no son componentes. Un componente es una instancia de un maestro o un bloque que se repite con la misma anatomía.
- Los iconos de una librería externa (Remix, Material…) se registran como iconografía, no como componentes del sistema.
- Los colores de ilustraciones, fotos y logotipos de terceros no son color del sistema: anótalos en `notes` y déjalos fuera de `colors`.
- Los valores con decimales (13.46 px) son capas escaladas: se registran tal cual; los marca `merge-evidence.js`.
