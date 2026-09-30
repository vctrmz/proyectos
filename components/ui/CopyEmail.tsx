'use client';
import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/lib/content/site';
import { useLocale, useUi } from '@/lib/i18n/LocaleContext';
import s from './CopyEmail.module.css';

/* Copiar la dirección al portapapeles, al lado de donde está escrita.
   Un mailto: abre el cliente de correo del sistema, que en un portátil
   corporativo o en quien usa webmail a veces no abre nada; copiar siempre
   funciona y deja pegar la dirección donde de verdad escribe.

   Los iconos son de Remix Icon —file-copy-line y check-line— puestos como SVG
   en línea y no con su fuente: dos glifos no justifican descargar un webfont
   de iconos entero.

   El aviso vive en un <span aria-live="polite">: quien no ve el cambio de
   icono lo oye. Y si el portapapeles falla —permiso denegado, contexto no
   seguro— lo dice en lugar de fingir que copió. */
const COPIAR = 'M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z';
const HECHO = 'M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z';

type Estado = 'listo' | 'copiado' | 'error';

export default function CopyEmail({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const ui = useUi();
  const [estado, setEstado] = useState<Estado>('listo');
  const reloj = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (reloj.current) clearTimeout(reloj.current); }, []);

  const copiar = async () => {
    if (reloj.current) clearTimeout(reloj.current);
    try {
      await navigator.clipboard.writeText(SITE.email);
      setEstado('copiado');
    } catch {
      setEstado('error');
    }
    reloj.current = setTimeout(() => setEstado('listo'), 2200);
  };

  const t = ui.copy;
  const aviso = estado === 'copiado' ? t.done : estado === 'error' ? t.failed : '';
  return (
    <span className={`${s.wrap} ${className}`}>
      <button
        type="button"
        onClick={copiar}
        className={`${s.btn} ${estado === 'copiado' ? s.ok : ''}`}
        aria-label={`${t.label}: ${SITE.email}`}
        title={t.label}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={s.icon}>
          <path d={estado === 'copiado' ? HECHO : COPIAR} fill="currentColor" />
        </svg>
      </button>
      {/* Reservado siempre: si el aviso apareciera y desapareciera moviendo lo
          de al lado, el clic desplazaría la fila justo al pulsarla. */}
      <span className={`${s.flash} ${aviso ? s.on : ''}`} aria-live="polite" lang={locale}>{aviso}</span>
    </span>
  );
}
