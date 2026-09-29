import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Bookshelf from './Bookshelf';
import { BOOKS } from '@/lib/content/books';

describe('Bookshelf', () => {
  it('pinta cada libro con portada, título y autor', () => {
    render(<Bookshelf />);
    const list = screen.getByRole('list', { name: 'Libros que recomiendo' });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(BOOKS.length);
    expect(within(items[0]).getByText(BOOKS[0].title)).toBeInTheDocument();
    expect(within(items[0]).getByText(BOOKS[0].author)).toBeInTheDocument();
    expect(list.querySelectorAll('img')).toHaveLength(BOOKS.filter((b) => b.cover).length);
  });
  it('un libro sin imagen lleva una portada tipográfica, no un hueco', () => {
    render(<Bookshelf />);
    const sin = BOOKS.find((b) => !b.cover)!;
    expect(screen.getAllByText(sin.title).length).toBeGreaterThanOrEqual(2);
  });
  it('en inglés la lista se llama Books I recommend', () => {
    render(<Bookshelf locale="en" />);
    expect(screen.getByRole('list', { name: 'Books I recommend' })).toBeInTheDocument();
  });
});
