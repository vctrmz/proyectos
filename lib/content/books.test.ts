import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOOKS } from './books';

describe('libros', () => {
  it('once libros con título, autor y slug único', () => {
    expect(BOOKS).toHaveLength(11);
    expect(new Set(BOOKS.map((b) => b.slug)).size).toBe(11);
    for (const b of BOOKS) { expect(b.title.length, b.slug).toBeGreaterThan(3); expect(b.author.length, b.slug).toBeGreaterThan(3); }
  });
  it('cada portada declarada existe en public', () => {
    for (const b of BOOKS) if (b.cover) expect(existsSync(join(process.cwd(), 'public', b.cover)), b.slug).toBe(true);
  });
});
