// UTF-8 safe Base64, URL and HTML entity encoding.

export function base64Encode(text, { urlSafe = false } = {}) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const b64 = btoa(bin);
  return urlSafe ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b64;
}

export function base64ToBytes(input) {
  let s = input.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s)) throw new Error('Input contains characters that are not valid Base64');
  s = s.replace(/=+$/, '');
  if (s.length % 4 === 1) throw new Error('Base64 input has an invalid length');
  s += '='.repeat((4 - (s.length % 4)) % 4);
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

export function base64Decode(input) {
  return new TextDecoder('utf-8', { fatal: true }).decode(base64ToBytes(input));
}

export function urlEncode(text, { component = true } = {}) {
  return component ? encodeURIComponent(text) : encodeURI(text);
}

export function urlDecode(text, { plusAsSpace = true } = {}) {
  return decodeURIComponent(plusAsSpace ? text.replace(/\+/g, ' ') : text);
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function htmlEscape(text) {
  return text.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}
