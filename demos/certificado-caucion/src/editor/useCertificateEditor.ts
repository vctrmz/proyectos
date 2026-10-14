import TextAlign from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extensions';
import { useEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRef } from 'react';
import { SlashCommand, VariableSuggestion, type StepContext } from './suggestions';
import { VariableNode } from './VariableNode';

/* Un único editor para todo el paso. Cambiar de plantilla o idioma no lo
   recrea: se sustituye el contenido (ver CertificateStep), y los menús leen
   el contexto vivo por ref. */
export function useCertificateEditor(args: {
  context: StepContext;
  initial: JSONContent;
  onChange: (doc: JSONContent) => void;
}) {
  const ctx = useRef(args.context);
  ctx.current = args.context;
  const onChange = useRef(args.onChange);
  onChange.current = args.onChange;

  return useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        code: false,
        link: { openOnClick: false, autolink: true },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right', 'justify'] }),
      Placeholder.configure({ placeholder: 'Escribe, pulsa / para comandos o @ para insertar una variable' }),
      VariableNode,
      SlashCommand,
      VariableSuggestion.configure({ getContext: () => ctx.current }),
    ],
    content: args.initial,
    editorProps: {
      attributes: {
        class: 'doc-body',
        'aria-label': 'Cuerpo del certificado (editable)',
        spellcheck: 'true',
      },
    },
    onUpdate: ({ editor }) => onChange.current(editor.getJSON()),
  });
}
