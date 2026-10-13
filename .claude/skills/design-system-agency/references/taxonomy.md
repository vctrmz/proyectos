# Taxonomía: dónde va cada cosa

Sirve para clasificar igual en todos los proyectos. Los nombres de archivo van en inglés y kebab-case (`date-picker.md`) para que coincidan con el vocabulario de código. El contenido va en español.

**Solo se crea el archivo de lo que aparece en las pantallas.** Esta lista es un diccionario, no una plantilla para rellenar.

## Regla de clasificación

| Capa | Pregunta | Ejemplo |
|---|---|---|
| Foundation | ¿Es una decisión visual sin forma propia? | color, espaciado, tipografía |
| Atom | ¿Hace una sola cosa y no se puede dividir sin perder sentido? | botón, campo, badge |
| Molecule | ¿Combina átomos para una tarea concreta? | campo de formulario (label + input + ayuda), buscador |
| Organism | ¿Es una sección reconocible de la interfaz, con lógica propia? | tabla de datos, cabecera de página, menú lateral |
| Pattern | ¿Es una regla de composición entre varios componentes o pantallas? | lista-detalle, layout de formulario, gestión de errores |

Cada capa solo cita a la de arriba: una foundation nunca enlaza la spec de un componente concreto; un patrón cita componentes y tokens, no al revés. Las foundations transversales (accesibilidad, contenido y voz) sí pueden hablar de tipos de elemento en general («los botones», «los campos»), sin fijar valores de un componente.

## Foundations (`specs/foundations/`)

`color` · `typography` · `spacing` · `radius` · `elevation` · `motion` · `z-index` · `iconography` · `accessibility` · `breakpoints` · `grid` · `borders` · `opacity` · `content-and-voice`

`motion`, `z-index` y `breakpoints` casi nunca se ven en una captura: si no hay evidencia, no se crean, o se crean con estado `pending` y la pregunta abierta.

## Tokens (`specs/tokens/`)

`token-reference` (generado) · `color-tokens` · `spacing-tokens` · `typography-tokens` · `elevation-tokens` · `motion-tokens`

## Atoms (`specs/atoms/`)

`button` · `icon-button` · `link` · `input` · `textarea` · `checkbox` · `radio` · `toggle` · `select` · `avatar` · `badge` (etiqueta de categoría o contador: la spec dice cuál) · `lozenge` (estado en texto con fondo) · `tag` (etiqueta que se puede quitar o filtrar; también el chip de filtro) · `spinner` · `divider` · `icon` (cada uso de icono de librería cuenta aquí)

## Molecules (`specs/molecules/`)

`form-field` · `search` · `tabs` · `breadcrumbs` · `dropdown-menu` · `modal-dialog` · `banner` · `flag` · `inline-message` · `tooltip` · `toast` · `date-picker` · `pagination` · `inline-edit` · `popup` · `progress-bar` · `stepper` · `file-upload` · `empty-state` · `stat-card` (indicador con valor y etiqueta) · `add-row` (fila «+ Añadir…» que invita a crear un elemento opcional)

## Organisms (`specs/organisms/`)

`app-shell` · `top-navigation` · `side-navigation` (menú de una sección) · `work-item-navigation` (menú de las vistas o pasos de un registro) · `page-header` (cabecera de un listado o página) · `work-item-header` (cabecera de un registro con su estado) · `action-bar` (barra de acciones de un proceso: anterior, guardar, siguiente) · `table` · `filter-bar` · `content-panel` · `detail-panel` · `dashboard-card` · `chat-panel` · `activity-timeline` · `form` (formulario completo con secciones)

## Patterns (`specs/patterns/`)

`navigation` · `list-detail` · `form-layout` · `search-and-filter` · `table-actions` · `create-edit-flow` · `wizard-flow` · `destructive-actions` · `empty-states` · `loading-states` · `error-handling` · `responsive-grid` · `three-column-layout` · `canvas-content-flow` · `panel-expand-collapse` · `authentication` · `kpi-summary-band` (banda de indicadores sobre un listado)

## Nombres

- Si el producto llama distinto a algo estándar, el archivo usa el nombre estándar y la spec recoge el nombre del producto: `lozenge.md` con «En el producto se llama "Stage badge"».
- Si un elemento no encaja en la lista, se crea con un nombre descriptivo en inglés y se justifica en el informe.
- Dos variantes visuales del mismo elemento son **un** componente con variantes, no dos archivos (`button.md` con `primary`, `secondary`, `danger`).
- Antes de lanzar a varios analistas en paralelo, el encargo fija la **lista de nombres** (componente → archivo). Nadie inventa un nombre nuevo sin añadirlo a esa lista y avisarlo en su respuesta.
