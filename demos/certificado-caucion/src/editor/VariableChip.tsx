import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import { findVariable, resolveValue, variableLabel } from '../domain/variables';
import { useDisplay } from './display';

export function VariableChip({ node, selected }: ReactNodeViewProps) {
  const { locale, mode, data } = useDisplay();
  const key: string = node.attrs.key;
  const known = Boolean(findVariable(key));
  const value = resolveValue(data, key, locale);
  const state = !known ? 'unknown' : value === undefined ? 'missing' : 'ok';
  const text = mode === 'values' && value !== undefined ? value : variableLabel(key, locale);

  return (
    <NodeViewWrapper
      as="span"
      className="var-chip"
      data-state={state}
      data-mode={mode}
      data-selected={selected || undefined}
      title={`{{ ${key} }}${state === 'missing' ? ' · sin dato en la póliza' : state === 'unknown' ? ' · variable desconocida' : ''}`}
      data-drag-handle
    >
      {state !== 'ok' && <i className="ri-error-warning-fill" aria-hidden="true" />}
      {text}
    </NodeViewWrapper>
  );
}
