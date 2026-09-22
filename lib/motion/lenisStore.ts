/* Puente mínimo para que capas superpuestas (drawer) puedan parar y
   reanudar el smooth scroll sin importar Lenis. */
export interface LenisLike { stop(): void; start(): void }
let inst: LenisLike | null = null;
export const setLenis = (l: LenisLike | null) => { inst = l; };
export const getLenis = () => inst;
