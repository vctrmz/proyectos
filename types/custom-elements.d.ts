import type { CSSProperties } from 'react';

type Attr = string | number | undefined;

interface CustomElementBase {
  style?: CSSProperties;
  className?: string;
}

interface StarfieldButtonAttrs extends CustomElementBase {
  label: string;
  href?: string;
  'new-tab'?: string;
  accent?: string;
  fill?: string;
  'text-color'?: string;
  'border-color'?: string;
  rounded?: Attr;
  padding?: string;
  'font-size'?: Attr;
  'light-size'?: Attr;
  'light-thickness'?: Attr;
  speed?: Attr;
  'pixel-size'?: Attr;
  'pixel-density'?: Attr;
  'glow-size'?: Attr;
}

interface CursorRingFieldAttrs extends CustomElementBase {
  colors?: string;
  background?: string;
  density?: Attr;
  'dot-size'?: Attr;
  speed?: Attr;
  'camera-distance'?: Attr;
  'ring-radius'?: Attr;
  'ring-width'?: Attr;
  push?: Attr;
  turbulence?: Attr;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'starfield-button': StarfieldButtonAttrs;
      'cursor-ring-field': CursorRingFieldAttrs;
    }
  }
}

export {};
