import type { JSONContent } from '@tiptap/react';
import { useCallback, useState } from 'react';
import { findTemplate } from '../domain/templates';
import type { DocumentModel, Locale, PolicyData, TemplateId } from '../domain/types';
import { PreviewModal } from './PreviewModal';

interface Props {
  template: TemplateId;
  locale: Locale;
  body: JSONContent;
  data: PolicyData;
  model: DocumentModel;
}

/* Cierre del flujo («¡Congratulations! Policy Bound» en el Figma): el
   certificado editado sale como uno más de los documentos de la póliza. */
export function SummaryStep({ template, locale, body, data, model }: Props) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const t = findTemplate(template);
  const docs = [
    { name: 'Condiciones generales.pdf', cert: false },
    { name: 'Resumen de coberturas.pdf', cert: false },
    { name: `${t.name[locale]} (${locale.toUpperCase()}).pdf`, cert: true },
  ];

  return (
    <div className="summary">
      <section className="summary__hero">
        <div>
          <h1>Póliza emitida</h1>
          <p>El certificado sale con la plantilla y el idioma elegidos en el paso anterior.</p>
        </div>
        <p className="toast" role="status">
          <i className="ri-checkbox-circle-fill" aria-hidden="true" /> Póliza registrada con éxito
        </p>
      </section>

      <section className="summary__facts">
        <div className="fact fact--id">
          <span>Número de póliza</span>
          <strong>{model.policy}</strong>
          <em className="badge">Aceptado</em>
        </div>
        <div className="fact"><span>Plantilla</span><strong>{t.code}</strong></div>
        <div className="fact"><span>Idioma</span><strong>{locale.toUpperCase()}</strong></div>
        <div className="fact"><span>Cuerpo</span><strong>{model.modified ? 'Adaptado' : 'Plantilla aprobada'}</strong></div>
        <div className="fact"><span>Variables resueltas</span><strong>{model.variables.used.length - model.variables.missing.length} / {model.variables.used.length}</strong></div>
      </section>

      <section className="summary__docs">
        <h2>Documentos</h2>
        <p>Generando <strong>{docs.length}</strong> documentos</p>
        <ul>
          {docs.map((d) => (
            <li key={d.name}>
              <i className="ri-file-pdf-2-fill" aria-hidden="true" />
              <span>{d.name}</span>
              {d.cert ? (
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setOpen(true)}>
                  <i className="ri-eye-line" aria-hidden="true" /> Ver
                </button>
              ) : (
                <span className="muted">Fuera de la demo</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {open && <PreviewModal template={template} locale={locale} body={body} data={data} missing={model.variables.missing.length} onClose={close} />}
    </div>
  );
}
