import Image from 'next/image';
import Button from '@/components/ui/Button';
import s from './PasoCertificadoDemo.module.css';

/* La demo del paso Certificado vive fuera de la página: es una app aparte
   (Vite + TipTap, en demos/certificado-caucion) que se sirve como un único
   HTML estático. Aquí solo va la puerta: qué se puede probar y dos enlaces,
   uno al prototipo y otro a la presentación del caso. Datos ficticios. */

const DEMO = '/demos/paso-certificado.html';
const CODE = 'https://github.com/vctrmz/proyectos/tree/main/demos/certificado-caucion';

const TRY = [
  'Cambiar de plantilla y de idioma sin perder lo editado.',
  'Insertar variables con @ o desde el panel, y bloques con /.',
  'Ver la anatomía: qué regiones son fijas y cuál se edita.',
  'Abrir el document_model que recibe backend, en vivo.',
];

export default function PasoCertificadoDemo() {
  return (
    <div className={s.wrap}>
      <a href={`${DEMO}#demo`} target="_blank" rel="noopener" className={s.shot} aria-label="Abrir el prototipo del paso Certificado en una pestaña nueva">
        <Image src="/assets/shots/pc-paso.webp" alt="Paso Certificados de la demo: selector de idioma y plantilla, panel de variables y el A4 con el cuerpo editable" width={1600} height={1000} sizes="(max-width: 900px) 100vw, 720px" />
      </a>
      <div className={s.side}>
        <ul className={s.list}>
          {TRY.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <div className={s.actions}>
          <Button href={`${DEMO}#demo`} external>Abrir el prototipo</Button>
          <Button href={`${DEMO}#deck`} external variant="outline">Ver la presentación</Button>
        </div>
        <p className={s.note}>
          Datos ficticios: el tenant, la aseguradora y la póliza son inventados. <a href={CODE} target="_blank" rel="noopener">Código de la demo</a>, con un test por criterio de aceptación.
        </p>
      </div>
    </div>
  );
}
