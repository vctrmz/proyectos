import { EditorContent, type JSONContent } from '@tiptap/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { initialBody } from '../domain/document';
import { TEMPLATES, findTemplate } from '../domain/templates';
import type { DocumentModel, Locale, PolicyData, TemplateId } from '../domain/types';
import { variableLabel } from '../domain/variables';
import { DisplayContext, type ChipMode } from '../editor/display';
import { Toolbar } from '../editor/Toolbar';
import { useCertificateEditor } from '../editor/useCertificateEditor';
import { A4Page } from './A4Page';
import { ModelDrawer } from './ModelDrawer';
import { PreviewModal } from './PreviewModal';
import { VariablePanel } from './VariablePanel';

interface Props {
  template: TemplateId;
  locale: Locale;
  onTemplate: (t: TemplateId) => void;
  onLocale: (l: Locale) => void;
  body: JSONContent;
  onBody: (doc: JSONContent | null) => void;
  data: PolicyData;
  onFill: (key: string, value: string) => void;
  model: DocumentModel;
  /** Sube cada vez que alguien intenta continuar con datos pendientes. */
  gateAttempt: number;
}

export function CertificateStep({ template, locale, onTemplate, onLocale, body, onBody, data, onFill, model, gateAttempt }: Props) {
  const [mode, setMode] = useState<ChipMode>('labels');
  const [anatomy, setAnatomy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const closePreview = useCallback(() => setPreview(false), []);
  const closeDrawer = useCallback(() => setDrawer(false), []);
  const editor = useCertificateEditor({ context: { template, locale }, initial: body, onChange: onBody });

  /* Plantilla o idioma nuevos: mismo editor, otro borrador. Cada combinación
     guarda el suyo, así que ir a EN y volver no pierde lo editado en ES. */
  const docKey = `${template}:${locale}`;
  const loaded = useRef(docKey);
  useEffect(() => {
    if (!editor || loaded.current === docKey) return;
    /* Fuera del commit de React: las variables son node views de React y
       pintarlas dentro de un efecto obliga a un flushSync anidado. */
    const id = setTimeout(() => {
      loaded.current = docKey;
      editor.commands.setContent(body, { emitUpdate: false });
    });
    return () => clearTimeout(id);
  }, [editor, docKey, body]);

  const restore = () => {
    if (!editor) return;
    editor.commands.setContent(initialBody(template, locale), { emitUpdate: false });
    onBody(null);
  };

  const gate = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (gateAttempt > 0) gate.current?.querySelector('input')?.focus();
  }, [gateAttempt]);

  const t = findTemplate(template);
  const { missing, used } = model.variables;

  return (
    <DisplayContext.Provider value={{ locale, mode, data }}>
      <div className="step-head">
        <h1>
          <i className="ri-award-line" aria-hidden="true" /> Certificados
        </h1>
        <div className="step-head__controls">
          <div className="segmented" role="radiogroup" aria-label="Idioma del certificado">
            {(['es', 'en'] as const).map((l) => (
              <button key={l} type="button" role="radio" aria-checked={locale === l} onClick={() => onLocale(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <label className="select">
            <span className="visually-hidden">Plantilla</span>
            <select value={template} onChange={(e) => onTemplate(e.target.value as TemplateId)} aria-label="Plantilla del certificado">
              {TEMPLATES.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name[locale]}
                </option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line" aria-hidden="true" />
          </label>
          <button type="button" className="btn btn--outline" onClick={() => setPreview(true)}>
            <i className="ri-eye-line" aria-hidden="true" /> Vista previa del certificado
          </button>
        </div>
      </div>

      <p className="step-sub">
        <span className="tag">{t.code}</span> {t.summary[locale]}
        <span className="step-sub__spacer" />
        <button type="button" className="link-btn" aria-pressed={anatomy} onClick={() => setAnatomy((a) => !a)}>
          <i className="ri-layout-5-line" aria-hidden="true" /> Anatomía
        </button>
        <button type="button" className="link-btn" aria-pressed={drawer} onClick={() => setDrawer((d) => !d)}>
          <i className="ri-braces-line" aria-hidden="true" /> document_model
        </button>
      </p>

      {missing.length > 0 && (
        <div className={`gate${gateAttempt ? ' gate--shake' : ''}`} key={gateAttempt} ref={gate} role="alert">
          <i className="ri-error-warning-fill" aria-hidden="true" />
          <div className="gate__text">
            <strong>{missing.length === 1 ? 'Falta 1 dato para emitir' : `Faltan ${missing.length} datos para emitir`}</strong>
            <span>En producción, este aviso lleva al paso donde se recoge el dato. En la demo puedes completarlo aquí.</span>
          </div>
          <form
            key={missing[0]}
            className="gate__fill"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem('value') as HTMLInputElement;
              if (input.value.trim()) onFill(missing[0], input.value.trim());
            }}
          >
            <label>
              <span>{variableLabel(missing[0], locale)}</span>
              <input name="value" placeholder="Valor" />
            </label>
            <button type="submit" className="btn btn--primary btn--sm">Completar</button>
          </form>
        </div>
      )}

      <div className="workspace">
        {editor && <VariablePanel editor={editor} template={template} locale={locale} data={data} used={used} />}
        <div className="canvas">
          {editor && <Toolbar editor={editor} mode={mode} onModeChange={setMode} />}
          <div className="canvas__status">
            <span data-modified={model.modified || undefined}>
              <i className={model.modified ? 'ri-edit-2-line' : 'ri-shield-check-line'} aria-hidden="true" />
              {model.modified ? 'Modificado respecto a la plantilla aprobada' : 'Igual que la plantilla aprobada'}
            </span>
            {model.modified && (
              <button type="button" className="link-btn" onClick={restore}>
                <i className="ri-refresh-line" aria-hidden="true" /> Restaurar plantilla
              </button>
            )}
            <span className="canvas__count">
              {used.length} variables · {missing.length} sin dato
            </span>
          </div>
          <div className="canvas__scroll">
            <A4Page content={t.content[locale]} locale={locale} data={data} anatomy={anatomy} resolve={mode === 'values'}>
              <EditorContent editor={editor} />
            </A4Page>
          </div>
        </div>
        {drawer && <ModelDrawer model={model} onClose={closeDrawer} />}
      </div>

      {preview && (
        <PreviewModal template={template} locale={locale} body={body} data={data} missing={missing.length} onClose={closePreview} />
      )}
    </DisplayContext.Provider>
  );
}
