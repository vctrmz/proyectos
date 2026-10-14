import { useEditorState, type Editor } from '@tiptap/react';
import type { ChipMode } from './display';

interface Props {
  editor: Editor;
  mode: ChipMode;
  onModeChange: (mode: ChipMode) => void;
}

type Btn = { id: string; icon: string; label: string; run: () => void; active?: boolean; disabled?: boolean };

/* Toolbar mínimo: lo que el ticket pide (negrita, listas, saltos) más lo que
   el modelo admite. Nada de color, fuente ni tamaño libres: eso lo fija la
   plantilla, igual que cabecera y pie. */
export function Toolbar({ editor, mode, onModeChange }: Props) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      ul: e.isActive('bulletList'),
      ol: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      left: e.isActive({ textAlign: 'left' }),
      center: e.isActive({ textAlign: 'center' }),
      right: e.isActive({ textAlign: 'right' }),
      justify: e.isActive({ textAlign: 'justify' }),
    }),
  });
  const c = () => editor.chain().focus();

  const groups: Btn[][] = [
    [
      { id: 'undo', icon: 'ri-arrow-go-back-line', label: 'Deshacer', run: () => c().undo().run(), disabled: !s.canUndo },
      { id: 'redo', icon: 'ri-arrow-go-forward-line', label: 'Rehacer', run: () => c().redo().run(), disabled: !s.canRedo },
    ],
    [
      { id: 'h2', icon: 'ri-h-1', label: 'Título', run: () => c().toggleHeading({ level: 2 }).run(), active: s.h2 },
      { id: 'h3', icon: 'ri-h-2', label: 'Subtítulo', run: () => c().toggleHeading({ level: 3 }).run(), active: s.h3 },
    ],
    [
      { id: 'bold', icon: 'ri-bold', label: 'Negrita', run: () => c().toggleBold().run(), active: s.bold },
      { id: 'italic', icon: 'ri-italic', label: 'Cursiva', run: () => c().toggleItalic().run(), active: s.italic },
      { id: 'underline', icon: 'ri-underline', label: 'Subrayado', run: () => c().toggleUnderline().run(), active: s.underline },
      { id: 'strike', icon: 'ri-strikethrough', label: 'Tachado', run: () => c().toggleStrike().run(), active: s.strike },
    ],
    [
      { id: 'left', icon: 'ri-align-left', label: 'Alinear a la izquierda', run: () => c().setTextAlign('left').run(), active: s.left },
      { id: 'center', icon: 'ri-align-center', label: 'Centrar', run: () => c().setTextAlign('center').run(), active: s.center },
      { id: 'right', icon: 'ri-align-right', label: 'Alinear a la derecha', run: () => c().setTextAlign('right').run(), active: s.right },
      { id: 'justify', icon: 'ri-align-justify', label: 'Justificar', run: () => c().setTextAlign('justify').run(), active: s.justify },
    ],
    [
      { id: 'ul', icon: 'ri-list-unordered', label: 'Lista', run: () => c().toggleBulletList().run(), active: s.ul },
      { id: 'ol', icon: 'ri-list-ordered', label: 'Lista numerada', run: () => c().toggleOrderedList().run(), active: s.ol },
      { id: 'quote', icon: 'ri-chat-quote-line', label: 'Caja de texto', run: () => c().toggleBlockquote().run(), active: s.quote },
      { id: 'hr', icon: 'ri-separator', label: 'Separador', run: () => c().setHorizontalRule().run() },
    ],
    [{ id: 'var', icon: 'ri-braces-line', label: 'Insertar variable (@)', run: () => c().insertContent('@').run() }],
  ];

  return (
    <div className="toolbar" role="toolbar" aria-label="Formato del cuerpo">
      {groups.map((g, i) => (
        <div className="toolbar__group" key={i}>
          {g.map((b) => (
            <button
              key={b.id}
              type="button"
              className="tb-btn"
              aria-label={b.label}
              title={b.label}
              aria-pressed={b.active ?? undefined}
              disabled={b.disabled}
              onClick={b.run}
            >
              <i className={b.icon} aria-hidden="true" />
            </button>
          ))}
        </div>
      ))}
      <div className="toolbar__spacer" />
      <div className="segmented" role="radiogroup" aria-label="Cómo se ven las variables">
        {(['labels', 'values'] as const).map((m) => (
          <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => onModeChange(m)}>
            {m === 'labels' ? 'Etiquetas' : 'Datos de la póliza'}
          </button>
        ))}
      </div>
    </div>
  );
}
