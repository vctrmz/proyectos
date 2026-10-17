# Upstream

Motor de https://github.com/lucasmarkes/hairline (MIT, ver `LICENSE-hairline.md`), de Lucas Marques. Es un spike del laboratorio: no se usa en ninguna página pública.

- Commit: `37d2e78dcb333ab30c3338e28ed4a690364ea014` (2026-10-14)
- `kernel.js` viene de `skills/hairline-create/kernel.js`. El sha256 del archivo original es `47ebec7647174e04e4f59c0305277c2a1dab83a763676946b17fa1694e7952fe`; la cabecera trae el suyo propio, que no es el del archivo.

## Cambios locales

- `kernel.js`: solo se añaden las dos últimas líneas (`export default HL;` y su comentario), para importarlo como módulo. Lo de encima es el original sin tocar.
- `tokens.js` es nuestro: una figura escrita con la skill `hairline-create` para el caso «Design system: 267 → 24 tokens». Se dejó tal como la aceptó el validador de la skill. Por eso llama a un `HL` y a un `hairline()` globales, que pone `HairlineFigure.tsx` al cargarla.

## Validar la figura

Con la skill de upstream clonada (`<skill>` = `skills/hairline-create`), desde una carpeta de trabajo con una copia de `tokens.js`:

```sh
node <skill>/build.mjs tokens.js        # escribe hairline-tokens.html con el banco de la skill
node <skill>/validate.mjs hairline-tokens.html
node <skill>/look.mjs tokens.js --answer 24,24,7.5 --edge 4,4,0 --edge 140,92,0
```

Resultado del 2026-10-17: el validador pasa, y en `look.mjs` pasan el marco, la lectura, la consola y el parpadeo. Queda un aviso: a 240 px la respuesta mueve el 21 % de la tinta, y la skill recomienda un 37 %. Es así porque la respuesta es local: solo cuadra las pilas que quedan cerca del puntero, y la esquina delantera ya está en orden en reposo.

## Actualizar

Copia `kernel.js` de un commit más nuevo, vuelve a añadirle las dos líneas del final y actualiza el commit y el sha256. Después pasa otra vez el validador sobre `tokens.js`.
