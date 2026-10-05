'use client';
import ScrollProgress from './ScrollProgress';
import TransitionTabs from './TransitionTabs';
import ImageComparison from './ImageComparison';
import { MorphingDialog, MorphingDialogTrigger, MorphingDialogContainer, MorphingDialogContent, MorphingDialogTitle, MorphingDialogImage, MorphingDialogDescription, MorphingDialogClose } from './MorphingDialog';
import s from './LabPrimitivos.module.css';

/* Los cuatro primitivos con material real del portfolio —las láminas de
   Pidemony—, para verlos funcionando antes de llevarlos a un caso. */
const lamina = (n: string) => `/assets/shots/${n}.webp`;

export default function LabPrimitivos() {
  return (
    <main id="contenido" className={`container ${s.main}`}>
      <ScrollProgress />
      <p className={s.kicker}>Laboratorio · no se publica</p>
      <h1 className={s.h1}>Primitivos de movimiento</h1>
      <p className={s.lead}>Adaptados de motion-primitives a los tokens de esta web, con teclado, ARIA y movimiento reducido. La barra de arriba es el primero: progreso de lectura.</p>

      <section className={s.sec} aria-labelledby="lab-tabs">
        <h2 id="lab-tabs">Transition panel · pestañas</h2>
        <p className={s.note}>Para enseñar variantes en el mismo hueco. Prueba con las flechas del teclado.</p>
        <TransitionTabs label="Láminas de la guía de Pidemony" tabs={[
          { id: 'mc', label: 'Móvil · colores', content: <img className={s.sheet} src={lamina('pm-movil-colores')} alt="Lámina de colores de la guía móvil" /> },
          { id: 'mt', label: 'Móvil · tipografía', content: <img className={s.sheet} src={lamina('pm-movil-tipografia')} alt="Lámina de tipografía de la guía móvil" /> },
          { id: 'wc', label: 'Web · colores', content: <img className={s.sheet} src={lamina('pm-web-colores')} alt="Lámina de colores de la guía web" /> },
          { id: 'wt', label: 'Web · tipografía', content: <img className={s.sheet} src={lamina('pm-web-tipografia')} alt="Lámina de tipografía de la guía web" /> },
        ]} />
      </section>

      <section className={s.sec} aria-labelledby="lab-cmp">
        <h2 id="lab-cmp">Image comparison · antes y después</h2>
        <p className={s.note}>Arrastra el asa o enfócala con Tab y usa las flechas.</p>
        <div className={s.narrow}>
          <ImageComparison width={595} height={842} labels={['Móvil', 'Web']}
            before={{ src: lamina('pm-movil-colores'), alt: 'Guía móvil: colores' }} after={{ src: lamina('pm-web-colores'), alt: 'Guía web: colores' }} />
        </div>
      </section>

      <section className={s.sec} aria-labelledby="lab-md">
        <h2 id="lab-md">Morphing dialog · tarjeta que se amplía</h2>
        <p className={s.note}>La tarjeta crece hasta el centro sin cambiar de página. Esc o la X la cierran.</p>
        <div className={s.narrow}>
          <MorphingDialog>
            <MorphingDialogTrigger>
              <MorphingDialogImage src={lamina('pm-web-colores')} alt="Lámina de colores de la guía web de Pidemony" className={s.thumb} />
              <span className={s.cardText}>
                <MorphingDialogTitle className={s.cardTitle}>Pedir dinero con un enlace</MorphingDialogTitle>
                <span className={s.cardMeta}>Mercantil Banco Panamá · 2021</span>
              </span>
            </MorphingDialogTrigger>
            <MorphingDialogContainer>
              <MorphingDialogContent>
                <MorphingDialogImage src={lamina('pm-web-colores')} alt="Lámina de colores de la guía web de Pidemony" />
                <div className={s.body}>
                  <MorphingDialogTitle as="h2" className={s.bodyTitle}>Pedir dinero con un enlace</MorphingDialogTitle>
                  <MorphingDialogDescription>
                    <p>Quien pide lo hace en la app mony; quien paga, con su tarjeta desde un enlace. La página de pago dice quién pide, cuánto y hasta cuándo antes de pedir la tarjeta.</p>
                  </MorphingDialogDescription>
                </div>
                <MorphingDialogClose />
              </MorphingDialogContent>
            </MorphingDialogContainer>
          </MorphingDialog>
        </div>
      </section>
    </main>
  );
}
