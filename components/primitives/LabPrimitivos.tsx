'use client';
import Image from 'next/image';
import Link from 'next/link';
import ScrollProgress from './ScrollProgress';
import TransitionTabs from './TransitionTabs';
import ImageComparison from './ImageComparison';
import { MorphingDialog, MorphingDialogTrigger, MorphingDialogContainer, MorphingDialogContent, MorphingDialogTitle, MorphingDialogImage, MorphingDialogDescription, MorphingDialogClose } from './MorphingDialog';
import { getProject } from '@/lib/content/projects';
import s from './LabPrimitivos.module.css';

/* El laboratorio de primitivos, en escenario oscuro y a tamaño protagonista:
   cada componente con material real del portfolio —proyectos del catálogo,
   bocetos de Flesip, pantallas de HERMES—, que es como se verán en un caso. */
const shot = (n: string) => `/assets/shots/${n}.webp`;

const PROYECTOS = [
  { slug: 'ayax', img: 'ayax-x_hero' },
  { slug: 'hermes', img: '11-resumen-comercial' },
  { slug: 'flesip', img: 'flesip-fx_board' },
  { slug: 'mercantil', img: 'mb-pay_01' },
];

const PANTALLAS = [
  { id: 'resumen', label: 'Resumen', img: '11-resumen-comercial', w: 1600, h: 1064, alt: 'Resumen comercial del cliente en HERMES' },
  { id: 'pago', label: 'Método de pago', img: '09-metodo-pago', w: 1600, h: 1047, alt: 'Método de pago en HERMES' },
  { id: 'agenda', label: 'Agenda', img: '17-agenda-reuniones', w: 1600, h: 1186, alt: 'Agenda de reuniones del cliente en HERMES' },
  { id: 'comentarios', label: 'Comentarios', img: '13-historial-comentarios', w: 1600, h: 1061, alt: 'Historial de comentarios en HERMES' },
];

function Escena({ n, nombre, para, children }: { n: string; nombre: string; para: string; children: React.ReactNode }) {
  return (
    <section className={s.stage} aria-labelledby={`lab-${n}`}>
      <header className={s.stageHead}>
        <span className={s.num} aria-hidden="true">{n}</span>
        <h2 id={`lab-${n}`} className={s.name}>{nombre}</h2>
        <p className={s.para}>{para}</p>
      </header>
      {children}
    </section>
  );
}

export default function LabPrimitivos() {
  return (
    <main id="contenido" className={s.lab}>
      <ScrollProgress />
      <div className={s.inner}>
        <header className={s.hero}>
          <p className={s.kicker}>Laboratorio · no se publica</p>
          <h1 className={s.h1}>Movimiento<br /><span>con intención.</span></h1>
          <p className={s.lead}>Cuatro primitivos de motion-primitives, adaptados a esta web: tokens propios, teclado, ARIA y movimiento reducido. La línea de arriba es el cuarto: avanza mientras lees.</p>
        </header>

        <Escena n="01" nombre="Tarjeta que se amplía" para="El catálogo sin cambiar de página: la tarjeta crece hasta su vista previa y vuelve a su sitio.">
          <div className={s.cards}>
            {PROYECTOS.map(({ slug, img }) => {
              const p = getProject(slug)!;
              return (
                <MorphingDialog key={slug} tone="dark">
                  <MorphingDialogTrigger>
                    <span className={s.thumb}><MorphingDialogImage src={shot(img)} alt="" /></span>
                    <span className={s.cardText}>
                      <MorphingDialogTitle as="p" className={s.cardTitle}>{p.title}</MorphingDialogTitle>
                      <span className={s.cardMeta}>{p.company} · {p.years}</span>
                    </span>
                  </MorphingDialogTrigger>
                  <MorphingDialogContainer>
                    <MorphingDialogContent>
                      <MorphingDialogImage src={shot(img)} alt={p.image?.alt ?? p.title} />
                      <div className={s.dialogBody}>
                        <MorphingDialogTitle as="h2" className={s.dialogTitle}>{p.title}</MorphingDialogTitle>
                        <MorphingDialogDescription>
                          <p className={s.dialogMeta}>{p.company} · {p.years}</p>
                          <p className={s.dialogText}>{p.summary}</p>
                          <Link href={`/es/cases/${slug}`} className={s.dialogLink}>Ver el caso <span aria-hidden="true">→</span></Link>
                        </MorphingDialogDescription>
                      </div>
                      <MorphingDialogClose />
                    </MorphingDialogContent>
                  </MorphingDialogContainer>
                </MorphingDialog>
              );
            })}
          </div>
        </Escena>

        <Escena n="02" nombre="Antes y después" para="Del boceto a mano al flujo diseñado de Flesip, en el mismo marco. Arrastra, o enfoca el asa y usa las flechas.">
          <div className={s.compare}>
            <ImageComparison width={1600} height={1000} labels={['Boceto', 'Diseño']}
              before={{ src: shot('flesip-sk_1'), alt: 'Boceto a mano de la app de Flesip: factura desde el taxi' }}
              after={{ src: shot('flesip-fx_board'), alt: 'Flujo diseñado de Flesip: factura enviada, del usuario al cliente' }} />
          </div>
        </Escena>

        <Escena n="03" nombre="Pestañas con transición" para="Cuatro pantallas de HERMES en el mismo hueco. La pastilla viaja y la pantalla entra desde el lado hacia el que vas.">
          <TransitionTabs tone="dark" label="Pantallas de HERMES" tabs={PANTALLAS.map((p) => ({
            id: p.id, label: p.label,
            content: <Image src={shot(p.img)} alt={p.alt} width={p.w} height={p.h} sizes="(max-width: 1100px) 100vw, 1100px" className={s.screen} />,
          }))} />
        </Escena>
      </div>
    </main>
  );
}
