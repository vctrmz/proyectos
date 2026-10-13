# Arquitectura de tokens

Guía de `token-architect`. Basada en el método de Hardik Pandya ([Expose your design system to LLMs](https://hardik.substack.com/p/expose-your-design-system-to-llms)) y en la skill [ds-specs](https://github.com/ejun-9/ds-specs) (MIT).

## Fuente de verdad

Los JSON de `tokens/` son la fuente. `tokens.css` y `specs/tokens/token-reference.md` los genera `node scripts/build-tokens.js`; no se editan a mano.

| Archivo | Capa | Variable CSS | Contiene |
|---|---|---|---|
| `tokens/primitives.json` | 1 | `--ds-color-slate-800` | Valores crudos observados. Nunca alias. |
| `tokens/semantic.json` | 2 | `--color-text-primary` | Intención. Siempre alias de una primitiva. Es el contrato de los componentes. |
| `tokens/components.json` | 3 | `--button-primary-background` | Solo cuando un componente necesita su propio punto de ajuste. Siempre alias de un semántico. |
| `tokens/modes/dark.json` | modo | reescribe la capa 2 | Solo si hay pantallas de ese modo. Alias a primitivas. |

Los componentes y el código usan la capa 2 (o su capa 3). Nunca `--ds-*` ni valores crudos.

## Formato (W3C DTCG)

```json
{
  "color": {
    "$type": "color",
    "slate": {
      "800": {
        "$value": "#1E293B",
        "$extensions": { "agency": {
          "status": "recurring",
          "sources": ["figma:aBcDeF1234567890GhIjKl/1:22326", "figma:aBcDeF1234567890GhIjKl/1:31903"],
          "occurrences": 34
        } }
      }
    }
  }
}
```

Semántico:

```json
{ "color": { "$type": "color", "text": { "primary": {
  "$value": "{color.slate.800}",
  "$description": "Texto principal: títulos, valores de campos, cifras",
  "$extensions": { "agency": { "status": "recurring", "sources": ["…"] } }
} } } }
```

Tipos: `color`, `dimension` (`"8px"`), `fontFamily` (lista), `fontWeight` (número), `number`, `duration` (`"200ms"`), `cubicBezier` (lista de 4), `shadow` (objeto `offsetX`, `offsetY`, `blur`, `spread`, `color`, o lista), `typography` (objeto compuesto con alias).

Propuestas: `"status": "proposed"` + `"rationale": "por qué"`. Ejemplo: un `color.text.disabled` que no aparece en las pantallas pero hace falta para el estado deshabilitado. Un token `proposed` lleva valor; no contradice la regla de no inventar, porque va etiquetado como propuesta y nunca como observado.

Lo que falta y no se puede proponer con criterio (no hay de dónde sacar el valor) **no se crea**: va a `open-questions.md` como `pending`.

## Nombres

- Dot notation, minúsculas con guiones: `color.text.primary`, `space.200`, `radius.control`.
- Primitivas por tono y paso: `color.slate.800`, `color.azure.500`. Si no hay escala clara, usa el paso más cercano de una escala 50-900 según la luminosidad y anótalo.
- Semánticos por intención, nunca por apariencia: `color.text.secondary`, no `color.grey-text`. El nombre debe sobrevivir a un rebrand.
- Escalas numéricas con pasos estables para que la IA razone tamaños relativos: `space.050` 4 · `space.100` 8 · `space.150` 12 · `space.200` 16 · `space.300` 24 · `space.400` 32 · `space.600` 48 · `space.800` 64.
- Primitivas que no son color, por familia: `space.<px>` o `dimension.<px>`, `radius.<px>`, `font.size.<px>`, `font.weight.<peso>`, `font.line-height.<valor>`, `border.width.<px>`, `size.<px>`. Dos familias pueden compartir valor (12px en `font.size` y en `space`): no es un duplicado.
- Si dos valores casi iguales (distancia RGB ≤ 6, mismo rol) cumplen la misma función, entran como una primitiva: la más usada o la ligada a variable. El resto, a la auditoría de consistencia.
- Interlineado «auto» de Figma: en CSS es `normal`; si necesitas un número, el de la fuente (Inter ≈ 1.21) y anótalo.
- Radio completo: el valor observado (999 o 9999), no uno teórico.

## Cobertura mínima de la capa 2

Cada hueco es un sitio donde la IA inventará un valor. Si no hay evidencia, crea el token como `proposed` o `pending` en lugar de dejar el hueco.

- **Color**: texto (primary, secondary, subtle, inverse, link), superficie (default, raised, sunken, page), borde (default, strong, focus), acción (primary + hover, pressed, disabled), estado (success, warning, danger, info).
- **Espaciado**: 8+ pasos sobre una sola retícula (4 u 8).
- **Tipografía**: familias, tamaños de caption a display, pesos, interlineados.
- **Radio**: de sutil a `full` (9999px).
- **Elevación**: por intención (`raised`, `overlay`).
- **Z-index**: capas con nombre (`dropdown`, `modal`, `toast`, `tooltip`), nunca enteros sueltos.
- **Movimiento**: duraciones y curvas.
- **Tamaño y layout**, si se observan: alto de controles (`size.control.md`), tamaños de icono y avatar, alto de barras, ancho de menús y columnas. Sin ellos, los ejemplos de código acaban usando pasos de espaciado como medidas.

## Consolidar sin mentir

Las pantallas reales tienen ruido: seis grises de texto casi iguales, un 13 px fuera de la retícula, un 13.46 px de una capa escalada. La agencia no lo esconde:

1. **Primitivas**: entran los valores `confirmed` y `recurring`. Los `candidate` entran solo si son claramente intencionados (un color de estado único, por ejemplo).
2. **Semánticos**: cuando varios valores cumplen la misma función, el semántico apunta al más frecuente o al ligado a una variable de Figma.
3. **Desviaciones**: el resto va a `specs/audits/consistency-audit.md` con su valor, dónde aparece, a qué token debería ir y si es errata o decisión pendiente.
4. **Decisiones**: si consolidar cambia algo visible (fundir dos azules), se escribe un ADR en `specs/decisions/` con estado `proposed`. La agencia no decide por el equipo.

## Después de editar los JSON

```bash
node scripts/validate-tokens.js && node scripts/build-tokens.js
```
