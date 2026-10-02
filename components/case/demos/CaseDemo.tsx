'use client';
import dynamic from 'next/dynamic';
import type { DemoId } from '@/lib/content/cases/types';

/* Las demos se cargan aparte: el código y la fuente de cada una solo llegan a
   la página del caso que la trae. Tiene que ser un componente de cliente: si
   el import dinámico lo hiciera la página, que es de servidor, Next no
   separaría el código. */
const DEMOS: Record<DemoId, React.ComponentType> = {
  pidemony: dynamic(() => import('./PidemonyDemo')),
};

export default function CaseDemo({ id }: { id: DemoId }) {
  const Demo = DEMOS[id];
  return <Demo />;
}
