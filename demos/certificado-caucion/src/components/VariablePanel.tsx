import type { Editor } from '@tiptap/react';
import { useMemo, useState } from 'react';
import type { Locale, PolicyData, TemplateId, VariableGroup } from '../domain/types';
import { GROUP_LABEL, resolveValue, variablesFor } from '../domain/variables';

interface Props {
  editor: Editor;
  template: TemplateId;
  locale: Locale;
  data: PolicyData;
  used: string[];
}

const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

/* Parte izquierda del ticket: el catálogo de variables de la plantilla activa.
   Cada fila dice qué dato es, qué valor tiene en esta póliza y si ya está en
   el documento. Un clic lo inserta donde está el cursor. */
export function VariablePanel({ editor, template, locale, data, used }: Props) {
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const query = fold(q.trim());
    const list = variablesFor(template).filter(
      (v) => !query || fold(`${v.key} ${v.label[locale]} ${GROUP_LABEL[v.group][locale]}`).includes(query),
    );
    const by = new Map<VariableGroup, typeof list>();
    list.forEach((v) => by.set(v.group, [...(by.get(v.group) ?? []), v]));
    return [...by.entries()];
  }, [q, template, locale]);

  return (
    <aside className="vars" aria-label="Variables del documento">
      <header className="vars__head">
        <h3>Variables</h3>
        <p>Clic para insertar · o escribe <kbd>@</kbd> en el texto</p>
        <label className="search">
          <i className="ri-search-line" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar variable" aria-label="Buscar variable" />
        </label>
      </header>
      <div className="vars__list">
        {groups.map(([group, vars]) => (
          <section key={group}>
            <h4>{GROUP_LABEL[group][locale]}</h4>
            <ul>
              {vars.map((v) => {
                const value = resolveValue(data, v.key, locale);
                const inDoc = used.includes(v.key);
                return (
                  <li key={v.key}>
                    <button
                      type="button"
                      className="var-row"
                      data-missing={value === undefined || undefined}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => editor.chain().focus().insertVariable(v.key).run()}
                      aria-label={`Insertar ${GROUP_LABEL[v.group][locale]} · ${v.label[locale]}`}
                    >
                      <span className="var-row__label">
                        {v.label[locale]}
                        {inDoc && <i className="ri-checkbox-circle-fill var-row__used" title="Ya está en el documento" aria-label="en el documento" />}
                      </span>
                      <code>{`{{ ${v.key} }}`}</code>
                      <span className="var-row__value">{value ?? 'Sin dato en la póliza'}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {!groups.length && <p className="vars__empty">Ninguna variable coincide con «{q}».</p>}
      </div>
    </aside>
  );
}
