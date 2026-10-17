// Write text metadata (copyright, author) into a PNG without touching its pixels.
// Used for the site's own images (social cards, icons), never for files users make with the tools.
import { readFile, writeFile } from 'node:fs/promises';
import { crc32 } from '../assets/js/lib/zip.js';

function textChunk(key, value) {
  const data = Buffer.concat([Buffer.from(key, 'latin1'), Buffer.from([0]), Buffer.from(value, 'latin1')]);
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write('tEXt', 4, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
}

// PNG tEXt is Latin-1, so © becomes (c) and ™ becomes (TM).
const latin = (s) => s.replace(/©/g, '(c)').replace(/™/g, '(TM)').replace(/[^\x20-\xff]/g, '');

export async function stampPng(file, fields) {
  const png = await readFile(file);
  // Drop any tEXt chunks we wrote before, then insert fresh ones right after IHDR.
  const ihdrEnd = 8 + 8 + png.readUInt32BE(8) + 4;
  const parts = [png.subarray(0, ihdrEnd)];
  for (const [k, v] of Object.entries(fields)) parts.push(textChunk(k, latin(v)));
  let i = ihdrEnd;
  while (i < png.length) {
    const len = png.readUInt32BE(i);
    const type = png.toString('latin1', i + 4, i + 8);
    const end = i + 12 + len;
    const key = type === 'tEXt' ? png.toString('latin1', i + 8, png.indexOf(0, i + 8)) : null;
    if (!(key && key in fields)) parts.push(png.subarray(i, end));
    i = end;
  }
  await writeFile(file, Buffer.concat(parts));
}
