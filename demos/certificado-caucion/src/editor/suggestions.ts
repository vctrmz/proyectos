import { Extension, type Editor, type Range } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { ReactRenderer } from '@tiptap/react';
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion';
import { GROUP_LABEL, variablesFor } from '../domain/variables';
import type { Locale, TemplateId } from '../domain/types';
import { SuggestionMenu, type MenuHandle, type MenuItem } from './SuggestionMenu';

/* Contexto vivo del paso: el editor se crea una vez y la plantilla o el
   idioma cambian después, así que los menús leen de aquí en cada pulsación. */
export interface StepContext {
  template: TemplateId;
  locale: Locale;
}

type Run = (editor: Editor, range: Range) => void;
interface Action extends MenuItem {
  run: Run;
  keywords?: string;
}

const matches = (q: string, ...fields: (string | undefined)[]) =>
  !q || fields.some((f) => f?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').includes(q));

const fold = (q: string) => q.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();

/* ── Popup: ReactRenderer + posición fija bajo el cursor. Sin dependencias
   de posicionamiento: la demo no lo necesita y se lee entera. ── */
function popup(label: string, empty: string): SuggestionOptions<Action>['render'] {
  return () => {
    let renderer: ReactRenderer<MenuHandle> | null = null;
    let host: HTMLDivElement | null = null;

    const place = (rect?: (() => DOMRect | null) | null) => {
      const r = rect?.();
      if (!host || !r) return;
      const below = r.bottom + 6;
      const fits = below + 360 < window.innerHeight;
      host.style.left = `${Math.min(r.left, window.innerWidth - 300)}px`;
      host.style.top = fits ? `${below}px` : `${Math.max(8, r.top - 366)}px`;
    };

    return {
      onStart: (props) => {
        host = document.createElement('div');
        host.className = 'menu-host';
        document.body.appendChild(host);
        renderer = new ReactRenderer(SuggestionMenu, {
          editor: props.editor,
          props: { items: props.items, command: props.command, label, empty },
        });
        host.appendChild(renderer.element);
        place(props.clientRect);
      },
      onUpdate: (props) => {
        renderer?.updateProps({ items: props.items, command: props.command, label, empty });
        if (host) host.hidden = false;
        place(props.clientRect);
      },
      onKeyDown: ({ event }) => {
        if (event.key === 'Escape') {
          if (host) host.hidden = true;
          return true;
        }
        return renderer?.ref?.onKeyDown(event) ?? false;
      },
      onExit: () => {
        renderer?.destroy();
        host?.remove();
        renderer = null;
        host = null;
      },
    };
  };
}

/* ── `/`: bloques y estilo de documento ── */
const block = (id: string, group: string, title: string, icon: string, run: Run, keywords?: string): Action => ({ id, group, title, icon, run, keywords });

const BLOCKS: Action[] = [
  block('h2', 'Estilo de documento', 'Título', 'ri-h-1', (e, r) => e.chain().focus().deleteRange(r).setNode('heading', { level: 2 }).run(), 'heading titulo h1'),
  block('h3', 'Estilo de documento', 'Subtítulo', 'ri-h-2', (e, r) => e.chain().focus().deleteRange(r).setNode('heading', { level: 3 }).run(), 'heading subtitulo h2'),
  block('p', 'Estilo de documento', 'Párrafo', 'ri-text', (e, r) => e.chain().focus().deleteRange(r).setParagraph().run(), 'texto'),
  block('ul', 'Estilo de documento', 'Lista', 'ri-list-unordered', (e, r) => e.chain().focus().deleteRange(r).toggleBulletList().run(), 'bullets viñetas'),
  block('ol', 'Estilo de documento', 'Lista numerada', 'ri-list-ordered', (e, r) => e.chain().focus().deleteRange(r).toggleOrderedList().run(), 'numeros'),
  block('quote', 'Estilo de documento', 'Caja de texto', 'ri-chat-quote-line', (e, r) => e.chain().focus().deleteRange(r).toggleBlockquote().run(), 'cita destacado'),
  block('hr', 'Estilo de documento', 'Separador', 'ri-separator', (e, r) => e.chain().focus().deleteRange(r).setHorizontalRule().run(), 'linea'),
  block('var', 'Datos de sistema', 'Variable de la póliza…', 'ri-braces-line', (e, r) => e.chain().focus().deleteRange(r).insertContent('@').run(), 'variable dato tomador beneficiario'),
];

export const SlashCommand = Extension.create({
  name: 'slashCommand',
  addProseMirrorPlugins() {
    return [
      Suggestion<Action, Action>({
        editor: this.editor,
        pluginKey: new PluginKey('slashCommand'),
        char: '/',
        startOfLine: false,
        items: ({ query }) => BLOCKS.filter((b) => matches(fold(query), b.title, b.keywords)),
        command: ({ editor, range, props }) => props.run(editor, range),
        render: popup('Comandos', 'Sin comandos para esa búsqueda'),
      }),
    ];
  },
});

/* ── `@`: variables de la plantilla activa, en el idioma activo ── */
export const VariableSuggestion = Extension.create<{ getContext: () => StepContext }>({
  name: 'variableSuggestion',
  addOptions() {
    return { getContext: () => ({ template: 'privado', locale: 'es' }) };
  },
  addProseMirrorPlugins() {
    const { getContext } = this.options;
    return [
      Suggestion<Action, Action>({
        editor: this.editor,
        pluginKey: new PluginKey('variableSuggestion'),
        char: '@',
        items: ({ query }) => {
          const { template, locale } = getContext();
          const q = fold(query);
          return variablesFor(template)
            .filter((v) => matches(q, v.key, v.label[locale], GROUP_LABEL[v.group][locale]))
            .slice(0, 12)
            .map((v) => ({
              id: v.key,
              group: GROUP_LABEL[v.group][locale],
              title: v.label[locale],
              hint: v.key,
              icon: 'ri-braces-line',
              run: (e: Editor, r: Range) => e.chain().focus().deleteRange(r).insertVariable(v.key).run(),
            }));
        },
        command: ({ editor, range, props }) => props.run(editor, range),
        render: popup('Variables', 'Ninguna variable coincide'),
      }),
    ];
  },
});
