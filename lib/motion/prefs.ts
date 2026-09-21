const q = (s: string) => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(s).matches;
export const prefersReducedMotion = () => q('(prefers-reduced-motion: reduce)');
export const isCoarsePointer = () => q('(pointer: coarse)');
export const motionAllowed = () => !prefersReducedMotion();
export const scrollEffectsAllowed = () => motionAllowed() && !isCoarsePointer();
