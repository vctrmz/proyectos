import { describe, it, expect } from 'vitest';
import { splitBold } from './text';

describe('splitBold', () => {
  it('alterna normal/negrita por asteriscos y descarta vacíos', () => {
    expect(splitBold('a *b* c')).toEqual([
      { text: 'a ', strong: false }, { text: 'b', strong: true }, { text: ' c', strong: false },
    ]);
    expect(splitBold('*solo*')).toEqual([{ text: 'solo', strong: true }]);
    expect(splitBold('plano')).toEqual([{ text: 'plano', strong: false }]);
  });
});
