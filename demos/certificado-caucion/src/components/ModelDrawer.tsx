import { useEffect, useState } from 'react';
import type { DocumentModel } from '../domain/types';

/* El handoff con desarrollo, en vivo: el payload que el paso entrega a
   backend se actualiza con cada pulsación. Es la parte del ticket que dice
   «sección dinámica para área de texto del document_model». */
export function ModelDrawer({ model, onClose }: { model: DocumentModel; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify({ document_model: model }, null, 2);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Sin permiso de portapapeles: el JSON sigue a la vista para copiarlo a mano. */
    }
  };

  return (
    <aside className="drawer" aria-label="document_model">
      <header className="drawer__head">
        <div>
          <h3>document_model</h3>
          <p>Lo que este paso entrega a backend. Solo <code>body</code> trae contenido; el resto son referencias a la plantilla.</p>
        </div>
        <div className="drawer__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={copy}>
            <i className={copied ? 'ri-check-line' : 'ri-file-copy-line'} aria-hidden="true" /> {copied ? 'Copiado' : 'Copiar'}
          </button>
          <button type="button" className="icon-btn" aria-label="Cerrar document_model" onClick={onClose}>
            <i className="ri-close-line" aria-hidden="true" />
          </button>
        </div>
      </header>
      <dl className="drawer__facts">
        <div><dt>Plantilla</dt><dd>{model.template}</dd></div>
        <div><dt>Idioma</dt><dd>{model.locale}</dd></div>
        <div><dt>Modificado</dt><dd>{model.modified ? 'sí' : 'no'}</dd></div>
        <div><dt>Variables</dt><dd>{model.variables.used.length}</dd></div>
        <div><dt>Sin dato</dt><dd data-alert={model.variables.missing.length > 0 || undefined}>{model.variables.missing.length}</dd></div>
      </dl>
      <pre className="drawer__code" tabIndex={0}><code>{json}</code></pre>
    </aside>
  );
}
