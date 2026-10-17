// Detect metadata embedded in image files (EXIF, GPS location, XMP, ICC, text chunks)
// so users can see what re-encoding strips. Reads bytes only; never modifies them.

function readExifTiff(view, start, end) {
  // TIFF header: byte order, 42, offset to IFD0.
  if (end - start < 8) return { exif: true };
  const order = view.getUint16(start);
  const le = order === 0x4949;
  if (!le && order !== 0x4d4d) return { exif: true };
  const u16 = (o) => view.getUint16(start + o, le);
  const u32 = (o) => view.getUint32(start + o, le);
  const tags = new Set();
  let orientation = 1;
  try {
    const ifd = u32(4);
    const count = u16(ifd);
    for (let i = 0; i < count; i++) {
      const tag = u16(ifd + 2 + i * 12);
      tags.add(tag);
      if (tag === 0x0112) orientation = u16(ifd + 2 + i * 12 + 8);
    }
  } catch {
    // Truncated IFD: we still know EXIF is present.
  }
  return {
    exif: true,
    gps: tags.has(0x8825),
    camera: tags.has(0x010f) || tags.has(0x0110),
    dateTime: tags.has(0x0132),
    orientation,
  };
}

const ascii = (bytes, at, len) => String.fromCharCode(...bytes.subarray(at, at + len));

function jpeg(bytes, view) {
  const found = {};
  let i = 2;
  while (i + 4 <= bytes.length) {
    if (bytes[i] !== 0xff) break;
    const marker = bytes[i + 1];
    if (marker === 0xd9 || marker === 0xda) break; // EOI / start of scan: no more metadata segments
    if (marker === 0xff) {
      i++;
      continue;
    }
    const len = view.getUint16(i + 2);
    const body = i + 4;
    if (marker === 0xe1 && ascii(bytes, body, 6) === 'Exif\0\0') Object.assign(found, readExifTiff(view, body + 6, i + 2 + len));
    else if (marker === 0xe1 && ascii(bytes, body, 28).startsWith('http://ns.adobe.com/xap/1.0/')) found.xmp = true;
    else if (marker === 0xe2 && ascii(bytes, body, 11) === 'ICC_PROFILE') found.icc = true;
    else if (marker === 0xfe) found.comment = true;
    i += 2 + len;
  }
  return found;
}

function png(bytes, view) {
  const found = {};
  let i = 8;
  while (i + 8 <= bytes.length) {
    const len = view.getUint32(i);
    const type = ascii(bytes, i + 4, 4);
    if (type === 'eXIf') Object.assign(found, readExifTiff(view, i + 8, i + 8 + len));
    else if (type === 'iCCP') found.icc = true;
    else if (type === 'tEXt' || type === 'zTXt') found.text = true;
    else if (type === 'iTXt') {
      if (ascii(bytes, i + 8, 17) === 'XML:com.adobe.xmp') found.xmp = true;
      else found.text = true;
    } else if (type === 'IEND') break;
    i += 12 + len;
  }
  return found;
}

function webp(bytes, view) {
  const found = {};
  let i = 12;
  while (i + 8 <= bytes.length) {
    const type = ascii(bytes, i, 4);
    const len = view.getUint32(i + 4, true);
    if (type === 'EXIF') {
      let s = i + 8;
      if (ascii(bytes, s, 6) === 'Exif\0\0') s += 6;
      Object.assign(found, readExifTiff(view, s, i + 8 + len));
    } else if (type === 'XMP ') found.xmp = true;
    else if (type === 'ICCP') found.icc = true;
    i += 8 + len + (len & 1);
  }
  return found;
}

export function detectFormat(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'jpeg';
  if (bytes[0] === 0x89 && ascii(bytes, 1, 3) === 'PNG') return 'png';
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') return 'webp';
  if (ascii(bytes, 0, 3) === 'GIF') return 'gif';
  if (ascii(bytes, 0, 2) === 'BM') return 'bmp';
  if (ascii(bytes, 4, 4) === 'ftyp') {
    const brand = ascii(bytes, 8, 4);
    if (brand === 'avif' || brand === 'avis') return 'avif';
    if (/^(heic|heix|hevc|mif1|msf1)$/.test(brand)) return 'heic';
  }
  return 'unknown';
}

export function inspectMetadata(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const format = detectFormat(bytes);
  let found = {};
  try {
    if (format === 'jpeg') found = jpeg(bytes, view);
    else if (format === 'png') found = png(bytes, view);
    else if (format === 'webp') found = webp(bytes, view);
  } catch {
    // Malformed structure past this point; report what we found so far.
  }
  return { format, ...found };
}

export function describeMetadata(m) {
  const items = [];
  if (m.gps) items.push('GPS location');
  if (m.camera) items.push('camera make/model');
  if (m.dateTime) items.push('date taken');
  if (m.exif && !m.gps && !m.camera && !m.dateTime) items.push('EXIF data');
  if (m.xmp) items.push('XMP');
  if (m.icc) items.push('colour profile');
  if (m.text || m.comment) items.push('text comments');
  return items;
}

// Remove metadata without re-encoding pixels. Returns null when the format isn't supported
// or when removing EXIF would change how the image displays (non-default orientation).
export function stripMetadata(bytes) {
  const format = detectFormat(bytes);
  const info = inspectMetadata(bytes);
  if (info.orientation && info.orientation !== 1) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const parts = [];
  try {
    if (format === 'jpeg') {
      parts.push(bytes.subarray(0, 2));
      let i = 2;
      for (;;) {
        if (bytes[i] !== 0xff) return null;
        const marker = bytes[i + 1];
        if (marker === 0xda) {
          parts.push(bytes.subarray(i)); // scan data through EOI is copied untouched
          break;
        }
        const len = view.getUint16(i + 2);
        // Drop EXIF/XMP (APP1), Photoshop/IPTC (APP13) and comments; keep ICC (APP2) so colours don't shift.
        const drop = marker === 0xe1 || marker === 0xed || marker === 0xfe || (marker >= 0xe3 && marker <= 0xef && marker !== 0xee);
        if (!drop) parts.push(bytes.subarray(i, i + 2 + len));
        i += 2 + len;
      }
    } else if (format === 'png') {
      parts.push(bytes.subarray(0, 8));
      let i = 8;
      while (i + 8 <= bytes.length) {
        const len = view.getUint32(i);
        const type = ascii(bytes, i + 4, 4);
        if (!['eXIf', 'tEXt', 'zTXt', 'iTXt', 'tIME'].includes(type)) parts.push(bytes.subarray(i, i + 12 + len));
        i += 12 + len;
        if (type === 'IEND') break;
      }
    } else if (format === 'webp') {
      let i = 12;
      const chunks = [];
      while (i + 8 <= bytes.length) {
        const type = ascii(bytes, i, 4);
        const len = view.getUint32(i + 4, true);
        const end = Math.min(bytes.length, i + 8 + len + (len & 1));
        if (type !== 'EXIF' && type !== 'XMP ') chunks.push(bytes.slice(i, end));
        i = end;
      }
      for (const c of chunks) if (ascii(c, 0, 4) === 'VP8X') c[8] &= ~0x0c; // clear EXIF + XMP flags
      const size = 4 + chunks.reduce((n, c) => n + c.length, 0);
      const header = bytes.slice(0, 12);
      new DataView(header.buffer).setUint32(4, size, true);
      parts.push(header, ...chunks);
    } else {
      return null;
    }
  } catch {
    return null;
  }
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}
