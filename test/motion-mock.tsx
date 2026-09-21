/* Sustituto de motion/react para tests: los motion.* pasan a etiquetas planas
   y los envoltorios de presencia/layout a fragmentos. */
import React from 'react';
const STRIP = ['layout', 'layoutId', 'initial', 'animate', 'exit', 'transition', 'whileInView', 'viewport', 'variants', 'custom', 'whileHover', 'whileTap', 'style'];
const passthrough = (tag: string) => React.forwardRef<unknown, Record<string, unknown>>((p, ref) => {
  const rest: Record<string, unknown> = {};
  for (const k of Object.keys(p)) if (!STRIP.includes(k)) rest[k] = p[k];
  if (p.style && typeof p.style === 'object' && !('transformOrigin' in (p.style as object) && Object.keys(p.style as object).length === 1)) rest.style = p.style;
  return React.createElement(tag, { ...rest, ref });
});
const cache = new Map<string, unknown>();
export const motion = new Proxy({}, { get: (_, tag: string) => { if (!cache.has(tag)) cache.set(tag, passthrough(tag)); return cache.get(tag); } });
const Frag = ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children);
export const AnimatePresence = Frag;
export const LayoutGroup = Frag;
export const MotionConfig = Frag;
