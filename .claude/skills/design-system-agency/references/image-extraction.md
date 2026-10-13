# Extraer evidencia de capturas

Receta para `figma-evidence-extractor` cuando la entrada es una imagen y no un enlace de Figma. Una captura dice menos que Figma: la agencia lo deja escrito.

## Qué se puede saber y con qué certeza

| Dato | Cómo | Certeza |
|---|---|---|
| Color | `node scripts/image-palette.js <png>`: paleta exacta con porcentajes. `--at x,y` lee un píxel concreto (texto, borde, botón). | Exacto en PNG → `sampled: true` |
| Tamaños, espaciados, radios | Medición visual sobre la imagen, dividida por la escala (`scale_hint`: 2 en capturas retina de 2880 px) | `estimated: true` |
| Tipografía | Familia por reconocimiento visual; tamaño y peso aproximados | `estimated: true` y «probable» en `notes` |
| Componentes, variantes, estados visibles | Lectura visual | Lo visto es evidencia; lo no visto, `proposed` |
| Variables, estilos, componentes maestros | Imposible | Nunca hay `confirmed` desde una imagen |

## Pasos

1. Comprueba el formato: solo PNG. Si llega un JPG, avisa de que los colores no serán exactos y trátalos como `estimated`.
2. `node scripts/image-palette.js inputs/<archivo>.png --top 30 --json` → anota ancho, alto, `scale_hint` y la paleta.
3. Mira la imagen con Read. Inventaria las zonas: navegación, cabecera, contenido, acciones.
4. Para cada elemento clave (texto principal, texto secundario, botón principal, borde de campo, fondo de tarjeta) lee su color exacto con `--at x,y` sobre un píxel interior, no sobre el borde suavizado.
5. Estima medidas en múltiplos de la escala y redondea a enteros: escribe 16, no 15.5.
6. Escribe `specs/screens/<slug>.evidence.json` con `source: { "type": "image", "path": "inputs/<archivo>.png" }`. Marca `sampled: true` en los colores leídos con el script y `estimated: true` en todo lo medido a ojo.

## Advertencias que van al informe

- «Valores de tamaño estimados sobre captura; confírmalos en Figma antes de publicar tokens».
- Si dos capturas tienen escalas distintas, normaliza antes de comparar medidas.
- Los colores de fotos, avatares y logos no son del sistema.
