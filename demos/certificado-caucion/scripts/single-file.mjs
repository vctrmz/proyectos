/* Junta el build de Vite en un único HTML: JS, CSS y la fuente de iconos van
   dentro, así la demo se sirve como un archivo estático más del portfolio
   (public/demos/) o se publica tal cual. Uso:
     node scripts/single-file.mjs <dist> <salida.html> [--fragment]
   --fragment omite doctype, head y body, para hosts que ponen su esqueleto. */
import fs from 'node:fs';
import path from 'node:path';

const [dist, out, flag] = process.argv.slice(2);
if (!dist || !out) throw new Error('Uso: node scripts/single-file.mjs <dist> <salida.html> [--fragment]');
const assets = path.join(dist, 'assets');
const files = fs.readdirSync(assets);
const pick = (ext) => {
  const f = files.find((n) => n.endsWith(ext));
  if (!f) throw new Error(`No hay ${ext} en ${assets}`);
  return path.join(assets, f);
};

const js = fs.readFileSync(pick('.js'), 'utf8').replace(/<\/script/gi, '<\\/script');
const woff2 = fs.readFileSync(pick('.woff2')).toString('base64');
/* Solo woff2: el resto de formatos de Remix Icon no hace falta en navegadores actuales. */
const css = fs
  .readFileSync(pick('.css'), 'utf8')
  .replace(/(@font-face\{[^}]*font-family:\s*"?remixicon"?[^}]*?)src:[^;}]*(;src:[^;}]*)*;?/, `$1src:url(data:font/woff2;base64,${woff2}) format("woff2");`);
if (/url\(\.\/remixicon/.test(css)) throw new Error('Quedan URLs de Remix Icon sin embeber');

const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">`;
const body = `<div id="root"></div>\n<script type="module">${js}</script>`;
const icon = `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23123a63'/%3E%3Ctext x='16' y='22' font-family='Arial' font-weight='700' font-size='17' fill='white' text-anchor='middle'%3ES%3C/text%3E%3C/svg%3E">`;

const html =
  flag === '--fragment'
    ? `<title>Paso Certificado</title>\n${fonts}\n<style>${css}</style>\n${body}\n`
    : `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Paso Certificado · Demo · Víctor Maza</title>
${icon}
${fonts}
<style>${css}</style>
</head>
<body>
${body}
</body>
</html>
`;

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`${out} · ${Math.round(html.length / 1024)} KB`);
