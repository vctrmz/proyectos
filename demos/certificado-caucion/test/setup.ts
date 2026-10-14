import '@testing-library/jest-dom/vitest';

/* ProseMirror mide rectángulos para el cursor y las sugerencias; jsdom no
   pinta, así que devolvemos rectángulos vacíos en lugar de romper. */
const emptyRect = { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0, toJSON: () => ({}) };
if (!Range.prototype.getBoundingClientRect) {
  Range.prototype.getBoundingClientRect = () => emptyRect as DOMRect;
}
if (!Range.prototype.getClientRects) {
  Range.prototype.getClientRects = () => ({ length: 0, item: () => null, [Symbol.iterator]: [][Symbol.iterator] }) as unknown as DOMRectList;
}
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => {});
document.elementFromPoint = document.elementFromPoint || (() => null);

/* Sin `globals: true`, Testing Library no limpia solo entre tests. */
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(() => cleanup());
