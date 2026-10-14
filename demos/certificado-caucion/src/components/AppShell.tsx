import type { ReactNode } from 'react';
import { TENANT } from '../domain/tenant';

export type StepId = 'certificados' | 'resumen';

const STEPS: Array<{ id: string; label: string; icon: string }> = [
  { id: 'mediador', label: 'Mediador', icon: 'ri-user-line' },
  { id: 'tomador', label: 'Tomador', icon: 'ri-building-line' },
  { id: 'intervinientes', label: 'Intervinientes', icon: 'ri-group-line' },
  { id: 'contragarantias', label: 'Contragarantías', icon: 'ri-shield-line' },
  { id: 'coberturas', label: 'Coberturas', icon: 'ri-stack-line' },
  { id: 'riesgo', label: 'Riesgo', icon: 'ri-pulse-line' },
  { id: 'precio', label: 'Precio', icon: 'ri-money-euro-circle-line' },
  { id: 'terminos', label: 'Términos y condiciones', icon: 'ri-file-list-3-line' },
  { id: 'bastanteo', label: 'Bastanteo', icon: 'ri-quill-pen-line' },
  { id: 'certificados', label: 'Certificados', icon: 'ri-award-line' },
  { id: 'resumen', label: 'Resumen', icon: 'ri-list-check' },
];

interface Props {
  step: StepId;
  onStep: (s: StepId) => void;
  onPresentation: () => void;
  footer: ReactNode;
  children: ReactNode;
}

/* El shell del flujo de emisión, como en «certificados-mejorado» del Figma.
   Los pasos anteriores a Certificados se dan por completados: la demo
   empieza donde empieza el ticket. */
export function AppShell({ step, onStep, onPresentation, footer, children }: Props) {
  const current = STEPS.findIndex((s) => s.id === step);
  return (
    <div className="shell">
      <header className="topnav">
        <span className="brand">
          <span className="brand__mark" aria-hidden="true">S</span>
          <span className="brand__name">{TENANT.name}</span>
        </span>
        <nav className="topnav__links" aria-label="Principal">
          <a aria-current="page">CRM</a>
          <a>Administración <i className="ri-arrow-down-s-line" aria-hidden="true" /></a>
          <a>Recibos <i className="ri-arrow-down-s-line" aria-hidden="true" /></a>
        </nav>
        <span className="topnav__end">
          <button type="button" className="link-btn" onClick={onPresentation}>
            <i className="ri-slideshow-3-line" aria-hidden="true" /> Presentación
          </button>
          <span className="avatar" aria-label="Usuario">VM</span>
        </span>
      </header>

      <div className="policybar">
        <span className="policybar__product">{TENANT.product.es.toUpperCase()}</span>
        <span className="policybar__id">{TENANT.policy}</span>
        <span className="policybar__price">
          <s>{TENANT.premium.before}</s> <strong>{TENANT.premium.now}</strong>
        </span>
        <span className="policybar__tools" aria-hidden="true">
          <span><i className="ri-download-2-line" /> Descargas</span>
          <span><i className="ri-sticky-note-line" /> Notas</span>
          <span><i className="ri-file-text-line" /> Documentos</span>
          <span><i className="ri-checkbox-line" /> Tareas</span>
        </span>
      </div>

      <div className="shell__body">
        <nav className="stepper" aria-label="Proceso de suscripción">
          <p className="stepper__head">
            <span>Suplemento</span>
            <strong>{TENANT.policy}</strong>
          </p>
          <ol>
            {STEPS.map((s, i) => {
              const reachable = s.id === 'certificados' || s.id === 'resumen';
              const done = i < current;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className="step"
                    aria-current={s.id === step ? 'step' : undefined}
                    data-done={done || undefined}
                    disabled={!reachable}
                    title={reachable ? undefined : 'Completado · fuera del alcance de la demo'}
                    onClick={() => reachable && onStep(s.id as StepId)}
                  >
                    <i className={s.icon} aria-hidden="true" />
                    <span>{s.label}</span>
                    {done && <i className="ri-check-line step__check" aria-label="completado" />}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
        <main className="shell__main" id="main">
          {children}
        </main>
      </div>

      <footer className="shell__footer">
        <span className="shell__copy">© 2025 {TENANT.legalName} · demo con datos ficticios</span>
        <span className="shell__actions">{footer}</span>
      </footer>
    </div>
  );
}
