import type { JSONContent } from '@tiptap/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppShell, type StepId } from './components/AppShell';
import { CertificateStep } from './components/CertificateStep';
import { StoryDeck } from './components/StoryDeck';
import { SummaryStep } from './components/SummaryStep';
import { buildDocumentModel, initialBody } from './domain/document';
import type { Locale, PolicyData, TemplateId } from './domain/types';
import { SAMPLE_POLICY } from './domain/variables';

type View = 'deck' | 'demo';
const viewFromHash = (): View => (window.location.hash === '#demo' ? 'demo' : 'deck');

export default function App({ initialView }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView ?? viewFromHash);
  const [step, setStep] = useState<StepId>('certificados');
  const [template, setTemplate] = useState<TemplateId>('publico-tasas');
  const [locale, setLocale] = useState<Locale>('es');
  const [drafts, setDrafts] = useState<Record<string, JSONContent>>({});
  const [data, setData] = useState<PolicyData>(SAMPLE_POLICY);
  const [gateAttempt, setGateAttempt] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onHash = () => setView(viewFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = (v: View) => {
    window.location.hash = v;
    setView(v);
  };

  const key = `${template}:${locale}`;
  const body = useMemo(() => drafts[key] ?? initialBody(template, locale), [drafts, key, template, locale]);
  const model = useMemo(() => buildDocumentModel({ template, locale, body, data }), [template, locale, body, data]);

  const onBody = useCallback(
    (doc: JSONContent | null) =>
      setDrafts((d) => {
        const next = { ...d };
        if (doc) next[key] = doc;
        else delete next[key];
        return next;
      }),
    [key],
  );
  const onFill = (k: string, value: string) => setData((d) => ({ ...d, [k]: value }));

  const next = () => {
    if (model.variables.missing.length) return setGateAttempt((n) => n + 1);
    setStep('resumen');
  };

  if (view === 'deck') return <StoryDeck onOpenDemo={() => go('demo')} />;

  const footer =
    step === 'certificados' ? (
      <>
        <button type="button" className="btn btn--outline" disabled title="Bastanteo queda fuera de la demo">
          <i className="ri-arrow-left-s-line" aria-hidden="true" /> Anterior
        </button>
        <button type="button" className="btn btn--outline" onClick={() => setToast('Borrador guardado. Puedes volver a este paso más tarde.')}>
          <i className="ri-bookmark-line" aria-hidden="true" /> Guardar y terminar después
        </button>
        <button type="button" className="btn btn--primary" onClick={next} aria-describedby="continue-hint">
          Continuar <i className="ri-arrow-right-s-line" aria-hidden="true" />
        </button>
        <span id="continue-hint" className="visually-hidden">
          {model.variables.missing.length ? 'Hay datos pendientes en el certificado' : 'Emite la póliza'}
        </span>
      </>
    ) : (
      <button type="button" className="btn btn--outline" onClick={() => setStep('certificados')}>
        <i className="ri-arrow-left-s-line" aria-hidden="true" /> Volver a Certificados
      </button>
    );

  return (
    <AppShell step={step} onStep={(s) => (s === 'resumen' ? next() : setStep(s))} onPresentation={() => go('deck')} footer={footer}>
      {step === 'certificados' ? (
        <CertificateStep
          template={template}
          locale={locale}
          onTemplate={setTemplate}
          onLocale={setLocale}
          body={body}
          onBody={onBody}
          data={data}
          onFill={onFill}
          model={model}
          gateAttempt={gateAttempt}
        />
      ) : (
        <SummaryStep template={template} locale={locale} body={body} data={data} model={model} />
      )}
      {toast && (
        <p className="snackbar" role="status">
          <i className="ri-check-line" aria-hidden="true" /> {toast}
        </p>
      )}
    </AppShell>
  );
}
