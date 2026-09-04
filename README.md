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
