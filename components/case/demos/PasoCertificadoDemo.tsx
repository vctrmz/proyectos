import Image from 'next/image';
import Button from '@/components/ui/Button';
import type { Locale } from '@/lib/i18n/config';
import s from './PasoCertificadoDemo.module.css';

/* La demo del paso Certificado vive fuera de la página: es una app aparte
   (Vite + TipTap, en demos/certificado-caucion) que se sirve como un único
   HTML estático. Aquí solo va la puerta: qué se puede probar y dos enlaces,
   uno al prototipo y otro a la presentación del caso. Datos ficticios. La
   demo está en español; en /en el texto lo avisa. */

const DEMO = '/demos/paso-certificado.html';
const CODE = 'https://github.com/vctrmz/proyectos/tree/main/demos/certificado-caucion';

const T = {
  es: {
    alt: 'Paso Certificados de la demo: selector de idioma y plantilla, panel de variables y el A4 con el cuerpo editable',
    open: 'Abrir el prototipo del paso Certificado en una pestaña nueva',
    try: [
      'Cambiar de plantilla y de idioma sin perder lo editado.',
      'Insertar variables con @ o desde el panel, y bloques con /.',
      'Ver la anatomía: qué regiones son fijas y cuál se edita.',
      'Abrir el document_model que recibe backend, en vivo.',
    ],
    proto: 'Abrir el prototipo', deck: 'Ver la presentación',
    note: 'Datos ficticios: el tenant, la aseguradora y la póliza son inventados.', code: 'Código de la demo', tests: ', con un test por criterio de aceptación.',
  },
  en: {
    alt: 'Certificates step in the demo: language and template pickers, variables panel and the A4 page with its editable body',
    open: 'Open the Certificate step prototype in a new tab',
    try: [
      'Switch template and language without losing your edits.',
      'Insert variables with @ or from the panel, and blocks with /.',
      'See the anatomy: which regions are fixed and which one is editable.',
      'Open the document_model the back end receives, live.',
    ],
    proto: 'Open the prototype', deck: 'View the presentation',
    note: 'Fictitious data: the tenant, the insurer and the policy are made up. The demo is in Spanish.', code: 'Demo source code', tests: ', with one test per acceptance criterion.',
  },
};

export default function PasoCertificadoDemo({ locale = 'es' }: { locale?: Locale }) {
  const t = T[locale === 'en' ? 'en' : 'es'];
  return (
    <div className={s.wrap}>
      <a href={`${DEMO}#demo`} target="_blank" rel="noopener" className={s.shot} aria-label={t.open}>
        <Image src="/assets/shots/pc-paso.webp" alt={t.alt} width={1600} height={1000} sizes="(max-width: 900px) 100vw, 720px" />
      </a>
      <div className={s.side}>
        <ul className={s.list}>
          {t.try.map((x) => <li key={x}>{x}</li>)}
        </ul>
        <div className={s.actions}>
          <Button href={`${DEMO}#demo`} external>{t.proto}</Button>
          <Button href={`${DEMO}#deck`} external variant="outline">{t.deck}</Button>
        </div>
        <p className={s.note}>
          {t.note} <a href={CODE} target="_blank" rel="noopener">{t.code}</a>{t.tests}
        </p>
      </div>
    </div>
  );
}
