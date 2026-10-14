import type { JSONContent } from '@tiptap/react';
import { Fragment, type ReactNode } from 'react';
import { parseInline } from '../domain/document';
import type { Locale, PolicyData } from '../domain/types';
import { resolveValue, variableLabel } from '../domain/variables';

/* Render de solo lectura: el mismo JSON que guarda backend pintado como
   saldrá en el PDF. Una variable sin dato se ve como hueco marcado, nunca
   como `{{ clave }}` impreso. */

interface Ctx {
  data: PolicyData;
  locale: Locale;
}

function Var({ k, ctx }: { k: string; ctx: Ctx }) {
  const value = resolveValue(ctx.data, k, ctx.locale);
  if (value === undefined)
    return (
      <mark className="gap" title={`Falta {{ ${k} }}`}>
        {variableLabel(k, ctx.locale)}
      </mark>
    );
  return <span className="resolved">{value}</span>;
}

function withMarks(node: JSONContent, child: ReactNode, key: number) {
  const marked = (node.marks ?? []).reduceRight<ReactNode>((acc, m) => {
    switch (m.type) {
      case 'bold': return <strong>{acc}</strong>;
      case 'italic': return <em>{acc}</em>;
      case 'underline': return <u>{acc}</u>;
      case 'strike': return <s>{acc}</s>;
      case 'link': return <a href={m.attrs?.href}>{acc}</a>;
      default: return acc;
    }
  }, child);
  return <Fragment key={key}>{marked}</Fragment>;
}

function renderNode(node: JSONContent, ctx: Ctx, i: number): ReactNode {
  const kids = () => node.content?.map((n, j) => renderNode(n, ctx, j));
  const style = node.attrs?.textAlign ? { textAlign: node.attrs.textAlign } : undefined;
  switch (node.type) {
    case 'doc': return <>{kids()}</>;
    case 'paragraph': return <p key={i} style={style}>{kids()}</p>;
    case 'heading': return node.attrs?.level === 3 ? <h4 key={i} style={style}>{kids()}</h4> : <h3 key={i} style={style}>{kids()}</h3>;
    case 'bulletList': return <ul key={i}>{kids()}</ul>;
    case 'orderedList': return <ol key={i}>{kids()}</ol>;
    case 'listItem': return <li key={i}>{kids()}</li>;
    case 'blockquote': return <blockquote key={i}>{kids()}</blockquote>;
    case 'horizontalRule': return <hr key={i} />;
    case 'hardBreak': return <br key={i} />;
    case 'text': return withMarks(node, node.text, i);
    case 'variable': return withMarks(node, <Var k={node.attrs?.key} ctx={ctx} />, i);
    default: return null;
  }
}

export function RenderDoc({ doc, data, locale }: { doc: JSONContent } & Ctx) {
  return <>{renderNode(doc, { data, locale }, 0)}</>;
}

/** Texto de una región fija con sus variables resueltas (o en etiqueta). */
export function RenderInline({ text, data, locale, resolve }: { text: string; resolve: boolean } & Ctx) {
  return (
    <>
      {parseInline(text).map((p, i) => {
        const inner = p.kind === 'text' ? p.text : resolve ? <Var k={p.key} ctx={{ data, locale }} /> : <span className="var-inline">{variableLabel(p.key, locale)}</span>;
        return p.bold ? <strong key={i}>{inner}</strong> : <span key={i}>{inner}</span>;
      })}
    </>
  );
}
