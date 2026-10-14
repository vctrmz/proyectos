import type { JSONContent } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';
import { findTemplate } from '../domain/templates';
import type { Locale, PolicyData, TemplateId } from '../domain/types';
import { A4Page } from './A4Page';
import { RenderDoc } from './RenderDoc';

interface Props {
  template: TemplateId;
  locale: Locale;
  body: JSONContent;
  data: PolicyData;
  missing: number;
  onClose: () => void;
}

/* «Vista previa del certificado»: el visor PDF del Figma (Suscription). Lo
   que se ve aquí es lo que se imprime: regiones fijas + cuerpo resuelto. */
export function PreviewModal({ template, locale, body, data, missing, onClose }: Props) {
  const [zoom, setZoom] = useState(100);
  const dialog = useRef<HTMLDivElement>(null);
  const t = findTemplate(template);
  const file = `${t.name[locale]}.pdf`;

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.classList.add('is-previewing');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-previewing');
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={`Vista previa: ${file}`} ref={dialog} tabIndex={-1}>
      <header className="viewer__bar">
        <span className="viewer__file">
          <i className="ri-file-pdf-2-fill" aria-hidden="true" /> {file}
        </span>
        <span className="viewer__pages">1 / 1</span>
        <span className="viewer__zoom">
          <button type="button" aria-label="Alejar" onClick={() => setZoom((z) => Math.max(60, z - 10))}>−</button>
          <output>{zoom}%</output>
          <button type="button" aria-label="Acercar" onClick={() => setZoom((z) => Math.min(150, z + 10))}>+</button>
        </span>
        <span className="viewer__actions">
          {/* Las páginas embebidas (p. ej. la versión publicada) no pueden abrir el diálogo de impresión. */}
          {!import.meta.env.VITE_NO_PRINT && (
            <button type="button" aria-label="Imprimir" title="Imprimir" onClick={() => window.print()}>
              <i className="ri-printer-line" aria-hidden="true" />
            </button>
          )}
          <button type="button" aria-label="Cerrar vista previa" title="Cerrar" onClick={onClose}>
            <i className="ri-close-line" aria-hidden="true" />
          </button>
        </span>
      </header>
      {missing > 0 && (
        <p className="viewer__warn" role="status">
          <i className="ri-error-warning-fill" aria-hidden="true" /> {missing === 1 ? 'Falta 1 dato' : `Faltan ${missing} datos`} de la póliza: aparece marcado y el certificado no se puede emitir así.
        </p>
      )}
      <div className="viewer__stage">
        <div className="viewer__page print-root" style={{ zoom: zoom / 100 }}>
          <A4Page content={t.content[locale]} locale={locale} data={data} resolve>
            <div className="doc-render">
              <RenderDoc doc={body} data={data} locale={locale} />
            </div>
          </A4Page>
        </div>
      </div>
    </div>
  );
}
