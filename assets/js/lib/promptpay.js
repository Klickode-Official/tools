// Thai PromptPay QR payloads (EMVCo merchant-presented format, as used by Thai banking apps).
// The payload is a string of ID/length/value fields ending in a CRC16 checksum.

// CRC-16/CCITT-FALSE: polynomial 0x1021, starting value 0xFFFF.
export function crc16(text) {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(text)) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

const field = (id, value) => `${id}${String(value.length).padStart(2, '0')}${value}`;

const PROMPTPAY_AID = 'A000000677010111';

/**
 * Work out what kind of PromptPay ID this is.
 * @returns {{ type: 'phone'|'id'|'ewallet', value: string } | null}
 *   phone: a Thai mobile number, stored as 0066 + number without its leading 0
 *   id: a 13-digit citizen ID or tax ID
 *   ewallet: a 15-digit e-wallet ID
 */
export function parseTarget(input) {
  const digits = String(input).replace(/[\s\-().]/g, '').replace(/^\+/, '');
  if (!/^\d+$/.test(digits)) return null;
  // 0066 + 9 digits is also 13 digits long; real IDs pass the check digit.
  if (digits.length === 13 && !(digits.startsWith('0066') && !validThaiId(digits))) return { type: 'id', value: digits };
  if (digits.length === 15) return { type: 'ewallet', value: digits };
  // 0812345678, 66812345678 or 0066812345678
  const local = digits.replace(/^0066/, '0').replace(/^66(?=\d{9}$)/, '0');
  if (/^0\d{9}$/.test(local)) return { type: 'phone', value: `0066${local.slice(1)}` };
  return null;
}

// Thai national ID / tax ID check digit (mod 11). Catches most typos.
export function validThaiId(id) {
  if (!/^\d{13}$/.test(id)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(id[i]) * (13 - i);
  return (11 - (sum % 11)) % 10 === Number(id[12]);
}

/**
 * Build the text to put in a PromptPay QR code.
 * @param {string} target phone number, citizen/tax ID or e-wallet ID
 * @param {{ amount?: number }} [opts] amount in baht; leave out to let the payer type it
 */
export function promptPayPayload(target, { amount } = {}) {
  const t = parseTarget(target);
  if (!t) throw new Error('Enter a Thai mobile number, a 13-digit ID or tax number, or a 15-digit e-wallet ID');
  const sub = { phone: '01', id: '02', ewallet: '03' }[t.type];
  const hasAmount = amount !== undefined && amount !== null && amount !== '';
  if (hasAmount && !(Number(amount) > 0 && Number(amount) < 1e10)) throw new Error('Amount must be more than 0');
  const parts = [
    field('00', '01'),
    field('01', hasAmount ? '12' : '11'),
    field('29', field('00', PROMPTPAY_AID) + field(sub, t.value)),
    field('58', 'TH'),
    field('53', '764'),
    hasAmount ? field('54', Number(amount).toFixed(2)) : '',
  ].join('');
  const body = `${parts}6304`;
  return body + crc16(body);
}

/** Read a payload back into its fields (used to double-check what was made). */
export function parseEmv(payload) {
  const out = {};
  for (let i = 0; i + 4 <= payload.length; ) {
    const id = payload.slice(i, i + 2);
    const len = Number(payload.slice(i + 2, i + 4));
    out[id] = payload.slice(i + 4, i + 4 + len);
    i += 4 + len;
  }
  return out;
}
