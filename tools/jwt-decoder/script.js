import { $, setStatus, escapeHtml, t } from '/assets/js/ui.js';
import { decodeJwt, describeClaims } from '/assets/js/lib/jwt.js';

// Tokens are credentials, so unlike other tools this page deliberately does not persist input.
const input = $('#input');
const status = $('#status');
const header = $('#header');
const payload = $('#payload');
const times = $('#times');

// The decoder's messages carry a number or a part name; translate them by shape.
function errorText(msg) {
  const parts = /^A JWT has 3 dot-separated parts; this has (\d+)$/.exec(msg);
  if (parts) return t('A JWT has 3 dot-separated parts; this has {n}', { n: parts[1] });
  const bad = /^The (header|payload) is not valid Base64URL-encoded JSON$/.exec(msg);
  if (bad) return t('The {part} is not valid Base64URL-encoded JSON', { part: t(bad[1]) });
  return msg;
}

function run() {
  header.textContent = payload.textContent = times.innerHTML = '';
  if (!input.value.trim()) return setStatus(status, '');
  try {
    const tok = decodeJwt(input.value);
    header.textContent = JSON.stringify(tok.header, null, 2);
    payload.textContent = JSON.stringify(tok.payload, null, 2);
    const { times: rows, status: s } = describeClaims(tok.payload);
    setStatus(status, t('Decoded · {status} · signature not verified', { status: t(s) }), s !== 'Expired' && s !== 'Not yet valid');
    times.innerHTML = rows.map((r) => `<tr><th>${t(r.label)} (${r.claim})</th><td>${escapeHtml(r.value)}</td></tr>`).join('') || `<tr><td>${t('No iat, nbf or exp claims.')}</td></tr>`;
  } catch (e) {
    setStatus(status, errorText(e.message), false);
  }
}

input.addEventListener('input', run);
$('#clear').addEventListener('click', () => {
  input.value = '';
  run();
});
