// What goes inside the QR code for each type. Pure functions, tested in tests/qr-tools.test.js.

// Wi-Fi and MECARD-style fields escape these characters with a backslash.
const wifiEscape = (s) => String(s).replace(/([\\;,:"])/g, '\\$1');

// A phone number in international form without the plus: 0812345678 → 66812345678 (Thai numbers
// are the common case here; anything that already has a country code is left alone).
export function intlPhone(input, defaultCountry = '66') {
  const raw = String(input).trim();
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (raw.startsWith('+')) return digits;
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) return defaultCountry + digits.slice(1);
  return digits;
}

export function normaliseUrl(input) {
  const s = String(input).trim();
  if (!s) return '';
  if (/^[a-z][a-z\d+.-]*:/i.test(s)) return s;
  return `https://${s.replace(/^\/+/, '')}`;
}

// vCard text values escape backslash, comma, semicolon and newlines.
const vEscape = (s) => String(s).replace(/([\\,;])/g, '\\$1').replace(/\r?\n/g, '\\n');

export const TYPES = {
  url: {
    label: 'Link',
    build: ({ url }) => normaliseUrl(url),
  },
  text: {
    label: 'Text',
    build: ({ text }) => String(text ?? ''),
  },
  wifi: {
    label: 'Wi-Fi',
    build: ({ ssid, password, security = 'WPA', hidden }) => {
      if (!ssid) return '';
      const t = security === 'nopass' ? 'nopass' : security;
      return `WIFI:T:${t};S:${wifiEscape(ssid)};${t === 'nopass' ? '' : `P:${wifiEscape(password ?? '')};`}${hidden ? 'H:true;' : ''};`;
    },
  },
  whatsapp: {
    label: 'WhatsApp',
    build: ({ phone, message }) => {
      const p = intlPhone(phone ?? '');
      if (!p) return '';
      return `https://wa.me/${p}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    },
  },
  line: {
    label: 'LINE',
    // Official accounts start with @ (https://line.me/R/ti/p/@shop); personal IDs use ~id.
    build: ({ lineId }) => {
      const id = String(lineId ?? '').trim();
      if (!id) return '';
      if (/^https?:\/\//i.test(id)) return id;
      return id.startsWith('@') ? `https://line.me/R/ti/p/${encodeURIComponent(id)}` : `https://line.me/ti/p/~${encodeURIComponent(id)}`;
    },
  },
  email: {
    label: 'Email',
    build: ({ email, subject, body }) => {
      if (!email) return '';
      const q = [subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean).join('&');
      return `mailto:${String(email).trim()}${q ? `?${q}` : ''}`;
    },
  },
  phone: {
    label: 'Call',
    build: ({ phone }) => {
      const p = intlPhone(phone ?? '');
      return p ? `tel:+${p}` : '';
    },
  },
  sms: {
    label: 'SMS',
    build: ({ phone, message }) => {
      const p = intlPhone(phone ?? '');
      return p ? `SMSTO:+${p}:${message ?? ''}` : '';
    },
  },
  contact: {
    label: 'Contact',
    build: ({ name, org, title, phone, email, url, address }) => {
      if (!name && !org && !phone && !email) return '';
      const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
      const [first, ...rest] = String(name ?? '').trim().split(/\s+/);
      if (name) lines.push(`N:${vEscape(rest.join(' '))};${vEscape(first)};;;`, `FN:${vEscape(name)}`);
      else lines.push('N:;;;;', `FN:${vEscape(org)}`);
      if (org) lines.push(`ORG:${vEscape(org)}`);
      if (title) lines.push(`TITLE:${vEscape(title)}`);
      if (phone) lines.push(`TEL;TYPE=CELL:+${intlPhone(phone)}`);
      if (email) lines.push(`EMAIL:${vEscape(email)}`);
      if (url) lines.push(`URL:${vEscape(normaliseUrl(url))}`);
      if (address) lines.push(`ADR:;;${vEscape(address)};;;;`);
      lines.push('END:VCARD');
      return lines.join('\r\n');
    },
  },
};

export const buildPayload = (type, fields) => (TYPES[type] ? TYPES[type].build(fields || {}) : '');
