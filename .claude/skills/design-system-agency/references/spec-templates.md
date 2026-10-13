# Plantillas de specs

Las specs son lo que una IA lee al empezar cada sesión. Si todas tienen la misma forma, leerlas cuesta poco. Copia la plantilla literal y rellena; borra una sección solo si de verdad no aplica, y dilo.

Frontmatter obligatorio en foundations, atoms, molecules, organisms, patterns y screens (lo valida `validate-links.js`):

```yaml
---
title: Button
category: atom            # foundation | atom | molecule | organism | pattern | screen
status: recurring         # confirmed | recurring | candidate | proposed | pending
sources:                  # obligatorio salvo en proposed y pending
  - figma:aBcDeF1234567890GhIjKl/1:22326
  - image:inputs/ficha-cliente.png
---
```

Convenciones de cita (las comprueba `validate-links.js`):

- **Tokens que existen**: entre comillas invertidas y con su nombre CSS exacto (`--color-text-primary`), también dentro de `var()` en los ejemplos. Las specs de componentes y patrones nunca citan `--ds-*`.
- **Tokens que faltan o se proponen**: en dot notation y sin `--` (`color.border.control`), con `proposed` y el motivo. Así no parecen reales.
- **Fuentes de un componente**: el nodo de una instancia de ejemplo (`figma:<fileKey>/<nodeId>`), no el frame de la pantalla.
- **Otras specs**: enlace relativo si el archivo ya existe; si lo está escribiendo otro agente en paralelo, su ruta entre comillas invertidas (`organisms/table.md`), con el nombre de la lista de nombres del encargo. El editor las convierte en enlaces en la fase 4. Lo que no va a existir (un patrón sin pantallas) se nombra sin ruta: «estados vacíos (sin pantalla todavía)».
- **Estados de las specs de tokens** (`specs/tokens/*.md`): `category: tokens`; no llevan frontmatter de estado, porque cada token tiene el suyo en el JSON.

---

## Foundation · `specs/foundations/<nombre>.md`

```markdown
---
(frontmatter)
---

# Color

## Principio
Un párrafo: la regla que encarna y por qué.

## Escala
| Token | Valor | Para qué | Estado |
|---|---|---|---|
| `--color-text-primary` | #1E293B | Títulos y valores | recurring |

## Reglas
- Frases comprobables: «Ningún texto usa un color fuera de esta tabla».

## Sí / No
| Sí | No |
|---|---|
| `color: var(--color-text-primary)` | `color: #1E293B` |

## Desviaciones observadas
Valores que aparecen en las pantallas y no entran en la escala, con enlace a `../audits/consistency-audit.md`.

## Relacionado
Enlaces a los archivos de tokens y a los patrones que dependen de esta foundation.
```

Una foundation nunca nombra un componente concreto: «el botón usa 12 px» va en `atoms/button.md`.

---

## Componente · `specs/atoms|molecules|organisms/<nombre>.md`

```markdown
---
(frontmatter)
figma_component: "Button → Variant=Secondary"   # si existe en Figma
---

# Button

## 1. Metadatos
- **Capa:** atom
- **Estado:** recurring
- **Nombre en el producto:** si difiere del estándar

## 2. Cuándo usarlo
**Qué es.** Una o dos frases.

**Úsalo para:**
- …

**No lo uses para:**
- Navegar entre páginas: usa [Link](link.md).
- …

## 3. Anatomía
1. Contenedor: padding, radio, fondo
2. Icono inicial (opcional)
3. Etiqueta: obligatoria
(Si ayuda, un esquema ASCII.)

## 4. Tokens
| Propiedad | Token |
|---|---|
| Fondo (primary) | `--color-action-primary` |
| Padding | `--space-100` `--space-200` |

## 5. Variantes y API
| Prop | Valores | Por defecto | Evidencia |
|---|---|---|---|
| `variant` | `primary` · `secondary` · `danger` | `secondary` | recurring (2 pantallas) |

## 6. Estados
| Estado | Aspecto y comportamiento | Evidencia |
|---|---|---|
| Default | … | recurring |
| Hover | … | proposed |
| Focus | Anillo de 2 px `--color-border-focus`; nunca se quita | proposed |
| Disabled | … | pending |

(En componentes no interactivos —divider, badge, lozenge— basta una línea: «Sin estados de interacción».)

## 7. Contenido
Reglas de texto: mayúsculas, longitud, verbos. Ejemplos reales de las pantallas.

## 8. Accesibilidad
Rol, teclado, foco, nombre accesible, contraste (solo con ratio calculada).

## 9. Ejemplo de código
Marcado HTML/CSS mínimo que use solo tokens de la capa 2. Etiqueta: `proposed` si no hay código real.

## 10. Relaciones
- **Usa:** [Icon](icon.md) — componentes que contiene.
- **Lo usan:** [Form](../organisms/form.md), [Page header](../organisms/page-header.md) — solo los que lo contienen, no los vecinos de página.
- **Patrones:** [Form layout](../patterns/form-layout.md) — patrones que lo citan.

(El autor lo escribe con lo que sabe; el editor completa los dos sentidos en la fase 4.)

## Evidencia
| Pantalla | Dónde | Nota |
|---|---|---|
| [alta-contacto](../screens/alta-contacto.md) | Barra inferior, «Next» | variant primary |

## Preguntas abiertas
- …
```

Las secciones 2 («No lo uses para») y 6 (estados completos) son las que más valor aportan y las que más se saltan. No se saltan.

---

## Patrón · `specs/patterns/<nombre>.md`

```markdown
---
(frontmatter)
---

# Form layout

## Problema
Qué pregunta de composición resuelve.

## Estructura
Disposición con el token de espaciado entre cada pieza (lista anidada o ASCII).

## Espaciado
| Entre | Token |
|---|---|
| Etiqueta y campo | `--space-050` |

## Responsive
| Ancho | Comportamiento | Evidencia |
|---|---|---|
| <ancho observado> | Lo que se ve en ese frame | recurring |
| <otros anchos> | Solo si hay frames de ese ancho; si no, `pending` y la pregunta | pending |

## Componentes
Enlaces a las specs que compone.

## Evidencia
| Pantalla | Dónde | Nota |
|---|---|---|

## Preguntas abiertas
- …

## Casos límite
Errores de validación, etiquetas largas, vacío, carga.

## Antipatrones
- …
```

---

## Pantalla · `specs/screens/<slug>.md`

```markdown
---
title: Alta de cliente · Datos del contacto
category: screen
status: confirmed          # confirmed si viene de Figma; candidate si es una captura
sources:
  - figma:aBcDeF1234567890GhIjKl/1:22326
screen_types: [form, navigation]
---

# Alta de cliente · Datos del contacto

![captura](../../output/<run>/capturas/alta-contacto.png)

## Propósito
## Usuario y tarea
## Estructura
Zonas de la pantalla de arriba abajo.
## Componentes y patrones
Tabla con nombre y ruta entre comillas invertidas (`atoms/button.md`): en la fase 1 las specs aún no existen. Usa los nombres de la lista del encargo.
## Estados visibles
## Hallazgos
Inconsistencias, erratas, deuda de diseño.
## Evidencia
Enlace a `<slug>.evidence.json`.
```

---

## Decisión · `specs/decisions/ADR-NNN-<tema>.md`

```markdown
---
title: Fundir los grises de texto en tres pasos
status: proposed        # proposed | accepted | rejected | superseded
date: 2026-10-11
---

# ADR-001 · Fundir los grises de texto en tres pasos

## Contexto
Qué se observó (con enlaces a la matriz de evidencia).
## Opciones
## Propuesta
## Consecuencias
Qué tokens y specs cambian. Qué se rompe.
```

---

## Preguntas abiertas · `specs/decisions/open-questions.md`

Una tabla: pregunta, por qué importa, a quién (diseño, producto, desarrollo), qué la desbloquea (una pantalla, una decisión, un dato).
