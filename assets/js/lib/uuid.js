// UUID v4 / v7 generation and validation using the Web Crypto API.

const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
const shape = (h) => `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;

export function uuidv4() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  return shape(hex(b));
}

export function uuidv7(now = Date.now()) {
  const b = crypto.getRandomValues(new Uint8Array(16));
  let ts = BigInt(now);
  for (let i = 5; i >= 0; i--) {
    b[i] = Number(ts & 0xffn);
    ts >>= 8n;
  }
  b[6] = (b[6] & 0x0f) | 0x70;
  b[8] = (b[8] & 0x3f) | 0x80;
  return shape(hex(b));
}

export function inspectUuid(s) {
  const v = s.trim().toLowerCase();
  if (/^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(v)) return { valid: true, version: 'nil' };
  const m = /^[0-9a-f]{8}-[0-9a-f]{4}-([0-9a-f])[0-9a-f]{3}-([0-9a-f])[0-9a-f]{3}-[0-9a-f]{12}$/.exec(v);
  if (!m) return { valid: false };
  const info = { valid: true, version: Number.parseInt(m[1], 16), variant: '89ab'.includes(m[2]) ? 'RFC 9562' : 'other' };
  if (info.version === 7) info.timestamp = new Date(Number.parseInt(v.replace(/-/g, '').slice(0, 12), 16)).toISOString();
  return info;
}
