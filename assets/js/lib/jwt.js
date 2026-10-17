// Decode (not verify) JSON Web Tokens.
import { base64Decode } from './encode.js';

export function decodeJwt(token) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error(`A JWT has 3 dot-separated parts; this has ${parts.length}`);
  const part = (s, name) => {
    try {
      return JSON.parse(base64Decode(s));
    } catch {
      throw new Error(`The ${name} is not valid Base64URL-encoded JSON`);
    }
  };
  const header = part(parts[0], 'header');
  const payload = part(parts[1], 'payload');
  return { header, payload, signature: parts[2] };
}

export function describeClaims(payload, now = Date.now()) {
  const out = [];
  const time = (k, label) => {
    if (typeof payload[k] === 'number') out.push({ claim: k, label, value: new Date(payload[k] * 1000).toISOString() });
  };
  time('iat', 'Issued at');
  time('nbf', 'Not before');
  time('exp', 'Expires');
  let status = 'No expiry claim';
  if (typeof payload.exp === 'number') status = payload.exp * 1000 < now ? 'Expired' : 'Not expired';
  if (typeof payload.nbf === 'number' && payload.nbf * 1000 > now) status = 'Not yet valid';
  return { times: out, status };
}
