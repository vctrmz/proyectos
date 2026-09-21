import manifest from '@/public/assets/shots/manifest.json';
const M = manifest as Record<string, { width: number; height: number }>;
export function shotSize(src: string): { width: number; height: number } {
  const name = src.replace('/assets/shots/', '').replace('.webp', '');
  return M[name] ?? { width: 1600, height: 1000 };
}
