// QR code encoder (ISO/IEC 18004), written for this site and tested against a reference encoder.
// Supports numeric, alphanumeric and byte (UTF-8) mode, versions 1–40 and all four error
// correction levels. encodeQr() returns a square grid of booleans (true = dark).

const ECL = {
  L: { index: 0, bits: 1 },
  M: { index: 1, bits: 0 },
  Q: { index: 2, bits: 3 },
  H: { index: 3, bits: 2 },
};
const ECL_ORDER = ['L', 'M', 'Q', 'H'];

// Error correction codewords per block, and number of blocks, by level and version (index 0 unused).
const ECC_PER_BLOCK = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];
const NUM_BLOCKS = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

const ALNUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
const MODES = {
  numeric: { bits: 0x1, count: [10, 12, 14] },
  alphanumeric: { bits: 0x2, count: [9, 11, 13] },
  byte: { bits: 0x4, count: [8, 16, 16] },
};

export class QrTooLongError extends Error {
  constructor() {
    super('That’s too much text for one QR code. Shorten it or use a lower error correction level.');
    this.name = 'QrTooLongError';
  }
}

// --- data segment -------------------------------------------------------------------------
function pickMode(text) {
  if (!text) return 'byte';
  if (/^\d+$/.test(text)) return 'numeric';
  if ([...text].every((c) => ALNUM.includes(c))) return 'alphanumeric';
  return 'byte';
}

function encodeData(text) {
  const mode = pickMode(text);
  const bits = [];
  const put = (value, len) => {
    for (let i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  let count;
  if (mode === 'numeric') {
    count = text.length;
    for (let i = 0; i < text.length; i += 3) {
      const group = text.slice(i, i + 3);
      put(Number(group), group.length * 3 + 1);
    }
  } else if (mode === 'alphanumeric') {
    count = text.length;
    for (let i = 0; i + 1 < text.length; i += 2) put(ALNUM.indexOf(text[i]) * 45 + ALNUM.indexOf(text[i + 1]), 11);
    if (text.length % 2) put(ALNUM.indexOf(text[text.length - 1]), 6);
  } else {
    const bytes = new TextEncoder().encode(text);
    count = bytes.length;
    for (const b of bytes) put(b, 8);
  }
  return { mode, count, bits };
}

const countBits = (mode, version) => MODES[mode].count[version < 10 ? 0 : version < 27 ? 1 : 2];

function rawDataModules(ver) {
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const align = Math.floor(ver / 7) + 2;
    result -= (25 * align - 10) * align - 55;
    if (ver >= 7) result -= 36;
  }
  return result;
}

const dataCodewords = (ver, ecl) => Math.floor(rawDataModules(ver) / 8) - ECC_PER_BLOCK[ECL[ecl].index][ver] * NUM_BLOCKS[ECL[ecl].index][ver];

// --- Reed–Solomon over GF(256) ---------------------------------------------------------------
function gfMul(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function rsDivisor(degree) {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

function rsRemainder(data, divisor) {
  const result = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ result.shift();
    result.push(0);
    divisor.forEach((coef, i) => (result[i] ^= gfMul(coef, factor)));
  }
  return result;
}

function addEcc(data, ver, ecl) {
  const e = ECL[ecl].index;
  const numBlocks = NUM_BLOCKS[e][ver];
  const eccLen = ECC_PER_BLOCK[e][ver];
  const raw = Math.floor(rawDataModules(ver) / 8);
  const numShort = numBlocks - (raw % numBlocks);
  const shortLen = Math.floor(raw / numBlocks);
  const divisor = rsDivisor(eccLen);
  const blocks = [];
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const dat = data.slice(k, k + shortLen - eccLen + (i < numShort ? 0 : 1));
    k += dat.length;
    const ecc = rsRemainder(dat, divisor);
    if (i < numShort) dat.push(0);
    blocks.push(dat.concat(ecc));
  }
  const result = [];
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((block, j) => {
      if (i !== shortLen - eccLen || j >= numShort) result.push(block[i]);
    });
  }
  return result;
}

// --- the symbol --------------------------------------------------------------------------------
function alignmentPositions(ver) {
  if (ver === 1) return [];
  const size = ver * 4 + 17;
  const count = Math.floor(ver / 7) + 2;
  const step = Math.floor((ver * 8 + count * 3 + 5) / (count * 4 - 4)) * 2;
  const result = [6];
  for (let pos = size - 7; result.length < count; pos -= step) result.splice(1, 0, pos);
  return result;
}

const MASKS = [
  (x, y) => (x + y) % 2 === 0,
  (x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

function buildSymbol(ver, ecl, codewords) {
  const size = ver * 4 + 17;
  const modules = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFunction = Array.from({ length: size }, () => new Array(size).fill(false));
  const set = (x, y, dark) => {
    modules[y][x] = dark;
    isFunction[y][x] = true;
  };

  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, dist !== 2 && dist !== 4);
      }
    }
  }
  const align = alignmentPositions(ver);
  const last = align.length - 1;
  align.forEach((ay, i) =>
    align.forEach((ax, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }),
  );

  const infoCells = []; // format and version modules, left light while masks are scored
  const drawFormat = (mask) => {
    const data = (ECL[ecl].bits << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    const bit = (i) => ((bits >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6));
    set(8, 8, bit(7));
    set(7, 8, bit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
    set(8, size - 8, true);
  };
  drawFormat(0); // reserve the area; redrawn once the mask is chosen
  for (let i = 0; i < 9; i++) if (i !== 6) infoCells.push([8, i], [i, 8]);
  for (let i = 0; i < 8; i++) infoCells.push([size - 1 - i, 8], [8, size - 1 - i]);

  const drawVersion = () => {
    if (ver < 7) return;
    let rem = ver;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (ver << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const dark = ((bits >>> i) & 1) === 1;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      set(a, b, dark);
      set(b, a, dark);
    }
  };
  drawVersion();
  if (ver >= 7) for (let i = 0; i < 18; i++) infoCells.push([size - 11 + (i % 3), Math.floor(i / 3)], [Math.floor(i / 3), size - 11 + (i % 3)]);

  // Data in two-module columns, snaking up and down from the bottom right.
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFunction[y][x] && i < codewords.length * 8) {
          modules[y][x] = ((codewords[i >>> 3] >>> (7 - (i & 7))) & 1) === 1;
          i++;
        }
      }
    }
  }
  // The dark module next to the bottom-left finder isn't part of the format info.
  const blankInfo = () => infoCells.forEach(([x, y]) => (modules[y][x] = false));
  return { size, modules, isFunction, drawFormat, drawVersion, blankInfo };
}

function applyMask(sym, mask) {
  const fn = MASKS[mask];
  for (let y = 0; y < sym.size; y++) for (let x = 0; x < sym.size; x++) if (!sym.isFunction[y][x] && fn(x, y)) sym.modules[y][x] = !sym.modules[y][x];
}

// The standard's penalty score; the mask with the lowest score is used.
export function penalty(modules) {
  const size = modules.length;
  let score = 0;
  const lines = [];
  for (let y = 0; y < size; y++) lines.push(modules[y]);
  for (let x = 0; x < size; x++) lines.push(modules.map((row) => row[x]));
  // 1:1:3:1:1 finder look-alikes with four light modules on one side. The quiet zone around the
  // symbol counts as light.
  const finder = [1, 0, 1, 1, 1, 0, 1];
  for (const line of lines) {
    let run = 1;
    for (let i = 1; i <= size; i++) {
      if (i < size && line[i] === line[i - 1]) run++;
      else {
        if (run >= 5) score += run - 2;
        run = 1;
      }
    }
    for (let i = 0; i + 7 <= size; i++) {
      if (!finder.every((v, k) => +line[i + k] === v)) continue;
      const lightBefore = line.slice(Math.max(0, i - 4), i).every((m) => !m);
      const lightAfter = line.slice(i + 7, i + 11).every((m) => !m);
      if (lightBefore || lightAfter) {
        score += 40;
        i += 6;
      } else i += 3;
    }
  }
  for (let y = 0; y + 1 < size; y++) {
    for (let x = 0; x + 1 < size; x++) {
      const c = modules[y][x];
      if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) score += 3;
    }
  }
  let dark = 0;
  for (const row of modules) for (const m of row) dark += m;
  score += Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
  return score;
}

/**
 * Encode text as a QR code.
 * @param {string} text
 * @param {{ ecl?: 'L'|'M'|'Q'|'H', boostEcl?: boolean, mask?: number, minVersion?: number }} [opts]
 *   boostEcl raises the error correction level when the data still fits in the same size.
 * @returns {{ version: number, size: number, ecl: string, mask: number, mode: string, modules: boolean[][] }}
 */
export function encodeQr(text, { ecl = 'M', boostEcl = true, mask = -1, minVersion = 1 } = {}) {
  const seg = encodeData(String(text));
  let version;
  let usedBits;
  for (let v = minVersion; v <= 40; v++) {
    const cb = countBits(seg.mode, v);
    const need = 4 + cb + seg.bits.length;
    if (seg.count < 1 << cb && need <= dataCodewords(v, ecl) * 8) {
      version = v;
      usedBits = need;
      break;
    }
  }
  if (!version) throw new QrTooLongError();
  if (boostEcl) {
    for (const level of ECL_ORDER.slice(ECL_ORDER.indexOf(ecl) + 1)) if (usedBits <= dataCodewords(version, level) * 8) ecl = level;
  }

  const capacity = dataCodewords(version, ecl) * 8;
  const bits = [];
  const put = (value, len) => {
    for (let i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  put(MODES[seg.mode].bits, 4);
  put(seg.count, countBits(seg.mode, version));
  bits.push(...seg.bits);
  put(0, Math.min(4, capacity - bits.length));
  put(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) put(pad, 8);
  const data = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));

  const sym = buildSymbol(version, ecl, addEcc(data, version, ecl));
  if (mask < 0) {
    // Masks are scored on the data and function patterns only, as the standard describes;
    // format and version info are written afterwards.
    sym.blankInfo();
    let best = Infinity;
    for (let m = 0; m < 8; m++) {
      applyMask(sym, m);
      const p = penalty(sym.modules);
      if (p < best) {
        best = p;
        mask = m;
      }
      applyMask(sym, m); // XOR again to undo
    }
  }
  applyMask(sym, mask);
  sym.drawFormat(mask);
  sym.drawVersion();
  return { version, size: sym.size, ecl, mask, mode: seg.mode, modules: sym.modules };
}

/** SVG markup for a QR code. One path for all dark modules keeps the file small. */
export function qrToSvg(qr, { margin = 4, dark = '#000000', light = '#ffffff', scale = 10 } = {}) {
  const full = qr.size + margin * 2;
  let d = '';
  qr.modules.forEach((row, y) => {
    let x = 0;
    while (x < qr.size) {
      if (!row[x]) {
        x++;
        continue;
      }
      const start = x;
      while (x < qr.size && row[x]) x++;
      d += `M${start + margin} ${y + margin}h${x - start}v1h${start - x}z`;
    }
  });
  const bg = light && light !== 'transparent' ? `<rect width="${full}" height="${full}" fill="${light}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${full} ${full}" width="${full * scale}" height="${full * scale}" shape-rendering="crispEdges">${bg}<path fill="${dark}" d="${d}"/></svg>`;
}
