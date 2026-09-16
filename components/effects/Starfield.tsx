'use client';

interface Props {
  label: string;
  href?: string;
  newTab?: boolean;
  fill?: string;
  rounded?: number;
  padding?: string;
  fontSize?: number;
  lightSize?: number;
  pixelDensity?: number;
  glowSize?: number;
  speed?: number;
}

/* Envoltorio del custom element de public/effects/starfield-button.js. Los
   atributos comunes a todos los usos del sitio van fijos. */
export default function Starfield({
  label, href, newTab, fill = 'rgba(35,39,51,0.6)', rounded, padding = '14px 28px',
  fontSize = 14, lightSize = 92, pixelDensity = 48, glowSize = 16, speed = 55,
}: Props) {
  return (
    <starfield-button
      label={label}
      href={href}
      new-tab={newTab ? '1' : undefined}
      accent="#8bde5f"
      fill={fill}
      text-color="#ececec"
      border-color="#343a4a"
      rounded={rounded}
      padding={padding}
      font-size={fontSize}
      light-size={lightSize}
      light-thickness={2}
      speed={speed}
      pixel-size={4}
      pixel-density={pixelDensity}
      glow-size={glowSize}
    />
  );
}
