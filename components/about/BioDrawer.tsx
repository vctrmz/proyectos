'use client';
import { useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import { ABOUT } from '@/lib/content/about';
import { splitBold } from '@/lib/content/text';
import ProcessInfographic from './ProcessInfographic';
import s from './about.module.css';

export default function BioDrawer() {
  const [open, setOpen] = useState(false);
  const cta = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <span ref={(el) => { cta.current = el?.querySelector('button') ?? null; }}>
        <Button onClick={() => setOpen(true)}>Ver el detalle</Button>
      </span>
      <Drawer open={open} onClose={() => setOpen(false)} title="El detalle" returnFocusTo={cta}>
        <div className={s.bio}>
          {ABOUT.bio.map((para) => <p key={para.slice(0, 40)}>{splitBold(para).map((x, i) => (x.strong ? <strong key={i}>{x.text}</strong> : <span key={i}>{x.text}</span>))}</p>)}
        </div>
        <ProcessInfographic />
      </Drawer>
    </>
  );
}
