'use client';
import { useEffect, useState } from 'react';
/* 'down' cuando el usuario baja más de 8 px pasado el umbral; 'up' al subir. */
export function useScrollDirection(threshold = 80) {
  const [dir, setDir] = useState<'up' | 'down'>('up');
  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < threshold) setDir('up');
        else if (Math.abs(y - last) > 8) setDir(y > last ? 'down' : 'up');
        last = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [threshold]);
  return dir;
}
