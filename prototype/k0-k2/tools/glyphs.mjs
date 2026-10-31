// Extract the outline of a word from an OFL font as compact path commands (units: font size 1, y up).
import opentype from 'opentype.js';
import { readFileSync, writeFileSync } from 'node:fs';
const [fontPath, word, out] = process.argv.slice(2);
const buf = readFileSync(fontPath);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const path = new opentype.Path(); let x = 0; const scale = 1 / font.unitsPerEm;
const glyphs = [...word].map(ch => font.charToGlyph(ch));
glyphs.forEach((g, i) => {
  path.extend(g.getPath(x, 0, 1));
  x += g.advanceWidth * scale;
  if (i < glyphs.length - 1) x += font.getKerningValue(g, glyphs[i + 1]) * scale;
});
const r = v => Math.round(v * 10000) / 10000;
const cmds = path.commands.map(c => {
  if (c.type === 'M' || c.type === 'L') return [c.type, r(c.x), r(-c.y)];
  if (c.type === 'Q') return ['Q', r(c.x1), r(-c.y1), r(c.x), r(-c.y)];
  if (c.type === 'C') return ['C', r(c.x1), r(-c.y1), r(c.x2), r(-c.y2), r(c.x), r(-c.y)];
  return ['Z'];
});
const bb = path.getBoundingBox();
writeFileSync(out, JSON.stringify({ word, font: font.names.fullName?.en, bbox: [r(bb.x1), r(-bb.y2), r(bb.x2), r(-bb.y1)], cmds }));
console.log(font.names.fullName?.en, 'commands', cmds.length, 'bbox', bb, 'bytes', JSON.stringify(cmds).length);
