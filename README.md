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

## Analítica

Microsoft Clarity (mapas de calor y grabaciones de sesión), proyecto `portafolio`,
ID `yd4g6685po`. Se carga con el paquete oficial `@microsoft/clarity` importado
por CDN como módulo ES, sin paso de build:

```html
<script type="module">
  import Clarity from 'https://cdn.jsdelivr.net/npm/@microsoft/clarity@1.0.2/index.js';
  Clarity.init('yd4g6685po');
</script>
```

Está en el `<head>` de `index.html` y `perfil.html`, justo antes de `support.js`.

**Al reexportar desde Claude Design este snippet se pierde** — hay que volver a
añadirlo a mano en las dos páginas.

Panel: https://clarity.microsoft.com/projects/view/yd4g6685po

### Pendiente: consentimiento

Clarity graba sesiones y usa cookies. En España eso normalmente exige banner de
consentimiento antes de arrancar la grabación. Hoy arranca sin pedirlo. El paquete
expone `Clarity.consent(false)` para diferir la grabación hasta que el visitante
acepte.
