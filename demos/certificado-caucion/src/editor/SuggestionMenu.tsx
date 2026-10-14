import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface MenuItem {
  id: string;
  group: string;
  title: string;
  hint?: string;
  icon: string;
}

export interface MenuHandle {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

interface Props {
  items: MenuItem[];
  command: (item: MenuItem) => void;
  label: string;
  empty: string;
}

/* Menú flotante compartido por `/` (bloques) y `@` (variables). Mismo
   componente, mismo teclado: el usuario aprende un gesto, no dos menús. */
export const SuggestionMenu = forwardRef<MenuHandle, Props>(function SuggestionMenu({ items, command, label, empty }, ref) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => setActive(0), [items]);
  useEffect(() => {
    list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  useImperativeHandle(ref, () => ({
    onKeyDown: (event) => {
      if (!items.length) return false;
      if (event.key === 'ArrowDown') return setActive((i) => (i + 1) % items.length), true;
      if (event.key === 'ArrowUp') return setActive((i) => (i - 1 + items.length) % items.length), true;
      if (event.key === 'Enter' || event.key === 'Tab') return command(items[active]), true;
      return false;
    },
  }));

  let lastGroup = '';
  return (
    <div className="menu" role="listbox" aria-label={label} ref={list}>
      {!items.length && <p className="menu__empty">{empty}</p>}
      {items.map((item, i) => {
        const header = item.group !== lastGroup ? (lastGroup = item.group) : null;
        return (
          <div key={item.id}>
            {header && <p className="menu__group">{header}</p>}
            <button
              type="button"
              role="option"
              aria-selected={i === active}
              data-active={i === active}
              className="menu__item"
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => command(item)}
            >
              <i className={item.icon} aria-hidden="true" />
              <span>{item.title}</span>
              {item.hint && <code>{item.hint}</code>}
            </button>
          </div>
        );
      })}
    </div>
  );
});
