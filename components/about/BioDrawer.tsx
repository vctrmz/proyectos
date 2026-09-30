'use client';
import { useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import { aboutIn } from '@/lib/content/en';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { getUi } from '@/lib/i18n/ui';
import { splitBold } from '@/lib/content/text';
import ProcessInfographic from './ProcessInfographic';
import s from './about.module.css';

export default function BioDrawer({ locale }: { locale?: 'es' | 'en' }) {
  const ctx = useLocale();
  const lang = locale ?? ctx;
  const ABOUT = aboutIn(lang);
  const t = getUi(lang).about;
  const [open, setOpen] = useState(false);
  const cta = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <span ref={(el) => { cta.current = el?.querySelector('button') ?? null; }}>
        <Button onClick={() => setOpen(true)}>{t.drawer}</Button>
      </span>
      <Drawer open={open} onClose={() => setOpen(false)} title={t.drawerTitle} returnFocusTo={cta}>
        <div className={s.bio}>
          {ABOUT.bio.map((para) => <p key={para.slice(0, 40)}>{splitBold(para).map((x, i) => (x.strong ? <strong key={i}>{x.text}</strong> : <span key={i}>{x.text}</span>))}</p>)}
        </div>
        <ProcessInfographic />
      </Drawer>
    </>
  );
}
