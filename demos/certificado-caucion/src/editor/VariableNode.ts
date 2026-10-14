import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { VariableChip } from './VariableChip';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      /** Inserta `{{ key }}` como un nodo atómico en la posición del cursor. */
      insertVariable: (key: string) => ReturnType;
    };
  }
}

/* Una variable es un átomo: se selecciona, se mueve y se borra entera, pero
   no se puede escribir dentro. Así `{{ tomador.nombre }}` nunca llega a
   backend como `{{ tomador.nom bre }}`, que es lo que pasa con texto libre. */
export const VariableNode = Node.create({
  name: 'variable',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      key: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-key'),
        renderHTML: (attrs) => ({ 'data-key': attrs.key }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-variable]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['span', mergeAttributes({ 'data-variable': '' }, HTMLAttributes), `{{ ${node.attrs.key} }}`];
  },

  /* Al copiar como texto plano sale la sintaxis del ticket, no la etiqueta. */
  renderText({ node }) {
    return `{{ ${node.attrs.key} }}`;
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableChip, { as: 'span' });
  },

  addCommands() {
    return {
      insertVariable:
        (key) =>
        ({ chain }) =>
          chain()
            .insertContent([{ type: this.name, attrs: { key } }, { type: 'text', text: ' ' }])
            .run(),
    };
  },
});
