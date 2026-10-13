# Control de calidad

Nada se entrega sin pasar esta puerta. La pasa `design-director` al final de cada encargo.

## 1. Comprobaciones automáticas

```bash
node scripts/merge-evidence.js
node scripts/validate-tokens.js
node scripts/build-tokens.js
node scripts/validate-links.js
node scripts/design-system-audit.js
```

O todo junto: `npm run ds:check`. Las cinco salen con 0 errores. Los avisos se leen uno a uno: o se corrigen o se explican en el informe.

## 2. Revisión de criterio

| Pregunta | Dónde mirar |
|---|---|
| ¿Hay alguna afirmación sin fuente ni etiqueta `proposed`? | specs con `status` sólido y secciones sin evidencia |
| ¿Algún estado no visto aparece como observado? | sección «Estados» de cada componente |
| ¿Dos specs dicen cosas distintas del mismo valor? | foundations frente a componentes |
| ¿Hay un componente duplicado con otro nombre? | `taxonomy.md`, variantes frente a archivos |
| ¿Los nombres de tokens hablan de intención y no de aspecto? | `tokens/semantic.json` |
| ¿Cada componente dice cuándo **no** usarlo? | sección 2 |
| ¿Se declara WCAG sin ratio calculada? | `foundations/accessibility.md`, auditoría |
| ¿Las desviaciones están en `consistency-audit.md` y no escondidas en la escala? | foundations y auditoría |
| ¿Hay archivos vacíos o con «Pendiente» sin estado `pending`? | aviso de `validate-links.js` |
| ¿El informe dice con claridad qué falta para madurar? | `output/<run>/informe.md` |

## 3. Veredicto

- **Listo**: 0 errores y ninguna respuesta «sí» en la tabla.
- **Listo con reservas**: 0 errores; los «sí» están anotados como deuda en el backlog.
- **No listo**: algún error, o una afirmación inventada. Se devuelve al agente responsable con la corrección concreta y se repite la puerta una vez.
