import { $, setStatus, escapeHtml } from '/assets/js/ui.js';
import { decodeJwt, describeClaims } from '/assets/js/lib/jwt.js';

// Tokens are credentials, so unlike other tools this page deliberately does not persist input.
const input = $('#input');
const status = $('#status');
const header = $('#header');
const payload = $('#payload');
const times = $('#times');

function run() {
  header.textContent = payload.textContent = times.innerHTML = '';
  if (!input.value.trim()) return setStatus(status, '');
  try {
    const t = decodeJwt(input.value);
    header.textContent = JSON.stringify(t.header, null, 2);
    payload.textContent = JSON.stringify(t.payload, null, 2);
    const { times: rows, status: s } = describeClaims(t.payload);
    setStatus(status, `Decoded · ${s} · signature not verified`, s !== 'Expired' && s !== 'Not yet valid');
    times.innerHTML = rows.map((r) => `<tr><th>${r.label} (${r.claim})</th><td>${escapeHtml(r.value)}</td></tr>`).join('') || '<tr><td>No iat, nbf or exp claims.</td></tr>';
  } catch (e) {
    setStatus(status, e.message, false);
  }
}

input.addEventListener('input', run);
$('#clear').addEventListener('click', () => {
  input.value = '';
  run();
});
