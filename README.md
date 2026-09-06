# Víctor Maza — Portfolio

Landing y perfil de Víctor Maza (Product Designer UX/UI, Málaga), exportados desde
Claude Design y servidos como sitio estático.

## Estructura

```
index.html                 Portada  (origen: "Portada v3.dc.html")
perfil.html                Sobre mí (origen: "Perfil v3.dc.html")
support.js                 Runtime de los componentes del canvas
neat-effects.js            Efectos de fondo
image-slot.js              Componente de imagen (lee .image-slots.state.json)
cursor-ring-field.js       Efecto de cursor
starfield-button.js        Botón con campo de estrellas
.image-slots.state.json    Imágenes embebidas de los slots (logos de clientes)
assets/
  hermes/                  Capturas del producto HERMES (21 PNG)
  h-card/                  Versión "card" de esas capturas (JPG)
  h-thumb/                 Miniaturas (JPG)
  logos/                   Logos de clientes
  victor.jpg / victor.png  Retrato
  hero-bg.mp4              Vídeo de fondo
```

## Desarrollo local

Cualquier servidor estático sobre la raíz del repo, por ejemplo:

```bash
npx serve .
```

No hay paso de build.

## Despliegue

Vercel — proyecto `proyectos`, preset `Other`, sin build command, root `./`.
Cada push a `main` genera un despliegue.

## Franja de clientes

La sección «Sistemas en los que he trabajado» (8 logos enlazados, justo encima de
«Sectores») venía de `Portada v2`. Al generar `Portada v3` en Claude Design se
borró el marcado de plantilla y solo sobrevivió la función de datos `logos()`,
que quedó huérfana. Se ha vuelto a portar el bloque `<sc-for list="{{logos}}">`
adaptándolo a la paleta de v3.

Seis logos se pintan desde `.image-slots.state.json` (webp incrustados) mediante
`<image-slot>`; Wakari y Linikit son archivos de `assets/logos/`. Con enlace:
Atrinium, Wakari, Linikit, Flesip, Montsaint y Ayax. Sin enlace: Mercantil Panamá
y Mony.

## Metadatos y compartir

Cada página lleva `<title>`, `<meta name="description">`, `canonical`, Open Graph
y `twitter:card`. El favicon es `favicon.svg` (monograma VM sobre el degradado de
marca) y la imagen de previsualización es `assets/og.png` (1200×630).

`og.png` se genera desde `_og-source.html` (no versionado): se sirve el sitio en
local, se abre esa página y se ejecuta `renderOg()` en la consola, que rasteriza
la tarjeta con html2canvas y la guarda vía el endpoint `POST /_save-og` de
`_serve.js`. Solo hace falta rehacerla si cambian el retrato o el titular.

## Analítica

Dos servicios, los dos detrás del mismo consentimiento:

| Servicio | Para qué | Identificador |
|---|---|---|
| Microsoft Clarity | Mapas de calor y grabación de sesión | proyecto `portafolio`, ID `yd4g6685po` |
| HubSpot | Seguimiento de visitas y formularios recogidos | portal `148496979`, región **EU** |

Paneles: https://clarity.microsoft.com/projects/view/yd4g6685po y
https://app-eu1.hubspot.com/

HubSpot se carga con su script loader oficial, inyectado desde `consent.js`:

```html
<script id="hs-script-loader" async defer src="https://js-eu1.hs-scripts.com/148496979.js"></script>
```

Ojo con la región: al ser cuenta europea el loader vive en `js-eu1.hs-scripts.com`.
El dominio genérico `js.hs-scripts.com` responde 307 a ese mismo portal, pero
conviene apuntar directo al de la región. El loader arrastra `collectedforms.js`,
`hs-analytics` y el beacon `track-eu1.hubspot.com/__ptq.gif`, y deja las cookies
`__hstc`, `hubspotutk`, `__hssrc` y `__hssc`.

**Ninguno de los dos arranca hasta que el visitante lo acepta.** `consent.js` muestra un
banner, guarda la decisión en `localStorage` bajo la clave `vm-consent`
(`granted` / `denied`) y solo entonces importa el paquete oficial
`@microsoft/clarity@1.0.2` por CDN como módulo ES:

```js
import(PKG).then(m => m.default.init('yd4g6685po'));
```

Si se rechaza no se pide ni un solo recurso a `clarity.ms` ni a `hs-scripts.com`.
Para volver a ver el banner:
`vmConsentReset()` desde la consola — útil si algún día quieres enlazarlo desde
un pie de página tipo «gestionar cookies».

`consent.js` va en el `<head>` de `index.html` y `perfil.html` con `defer`.

**Al reexportar desde Claude Design se pierden el `<script>`, los metadatos y el
favicon** — los artboards no los llevan. Hay que volver a añadirlos a mano.
