'use client';
import { createContext, useCallback, useContext, useEffect, useId, useRef } from 'react';
import Button from '@/components/ui/Button';
import CopyEmail from '@/components/ui/CopyEmail';
import { SOCIAL_ICON } from '@/components/ui/socialIcons';
import { SITE } from '@/lib/content/site';
import { useUi } from '@/lib/i18n/LocaleContext';
import { getLenis } from '@/lib/motion/lenisStore';
import ContactForm from './ContactForm';
import s from './ContactDialog.module.css';

/* El contacto vive en un único modal para toda la web, y cualquier
   «Contactar» lo abre. Dentro hay tres vías, de la más rápida a la más
   completa: copiar el correo, escribir por LinkedIn o dejar un mensaje en el
   formulario. Así nada de eso ocupa la página de quien solo está mirando, y el
   correo no está escrito en ninguna parte de la web.

   Es un <dialog> nativo abierto con showModal(): el navegador ya pone el
   resto de la página inerte, mete el foco dentro, cierra con Esc y devuelve el
   foco al botón que lo abrió. Aquí solo se añade el cierre al pulsar el velo
   y el bloqueo del scroll de fondo, que con Lenis hay que parar a mano.

   El modal no se desmonta al cerrar: si alguien lo cierra a medio escribir,
   al volver a abrirlo encuentra su mensaje donde lo dejó. */
const Ctx = createContext<() => void>(() => {});
export const useAbrirContacto = () => useContext(Ctx);

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const ui = useUi();
  const t = ui.contact;
  const dialogo = useRef<HTMLDialogElement>(null);
  const titulo = useId();

  const abrir = useCallback(() => {
    const d = dialogo.current;
    if (!d || d.open) return;
    d.showModal();
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
  }, []);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    const alCerrar = () => { document.body.style.overflow = ''; getLenis()?.start(); };
    d.addEventListener('close', alCerrar);
    return () => d.removeEventListener('close', alCerrar);
  }, []);

  /* El velo es el ::backdrop del propio <dialog>, así que un clic en él llega
     con el <dialog> como destino. Se mira también dónde empezó: quien
     selecciona texto en un campo y suelta fuera no debe perder el modal. */
  const empezoEnVelo = useRef(false);
  const esVelo = (e: React.PointerEvent | React.MouseEvent) => e.target === e.currentTarget;

  return (
    <Ctx.Provider value={abrir}>
      {children}
      <dialog
        ref={dialogo}
        className={s.dialog}
        aria-labelledby={titulo}
        onPointerDown={(e) => { empezoEnVelo.current = esVelo(e); }}
        onClick={(e) => { if (empezoEnVelo.current && esVelo(e)) dialogo.current?.close(); }}
        data-lenis-prevent
      >
        {/* `inset` da el tono oscuro del bloque de cierre: el formulario, el
            botón de copiar y los enlaces ya saben pintarse sobre él. */}
        <div className={`inset ${s.panel}`}>
          <div className={s.head}>
            <h2 id={titulo} className={s.title}>{t.title}</h2>
            <button type="button" className={s.close} onClick={() => dialogo.current?.close()} aria-label={ui.about.close}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
          <p className={s.lead}>{t.lead}</p>
          {/* Las dos vías de un clic van arriba: en el móvil el formulario
              llena la pantalla y no se verían. */}
          <div className={s.vias}>
            <CopyEmail />
            <Button href={SITE.linkedin} external variant="outline">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={s.icon}><path d={SOCIAL_ICON.LinkedIn} fill="currentColor" /></svg>
              {t.linkedin}
            </Button>
          </div>
          <p className={s.sep}><span>{t.separador}</span></p>
          <ContactForm />
        </div>
      </dialog>
    </Ctx.Provider>
  );
}
