export interface TextPart { text: string; strong: boolean }

/* Los textos largos marcan la negrita con *asteriscos*, como en perfil.html. */
export function splitBold(src: string): TextPart[] {
  return src.split('*').map((text, i) => ({ text, strong: i % 2 === 1 })).filter((p) => p.text);
}
