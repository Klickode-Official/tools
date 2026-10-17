import { $, persist, setStatus, escapeHtml } from '/assets/js/ui.js';
import { urlEncode, urlDecode } from '/assets/js/lib/encode.js';

const input = $('#input');
const output = $('#output');
const status = $('#status');
const full = $('#full');
const params = $('#params');
persist(input, full);

function showParams(text) {
  params.innerHTML = '';
  const q = text.includes('?') ? text.slice(text.indexOf('?') + 1) : text.includes('=') ? text : '';
  if (!q) return;
  const rows = [...new URLSearchParams(q.split('#')[0])].map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`);
  params.innerHTML = rows.join('') || '';
}

function run(fn, label) {
  try {
    output.value = fn();
    setStatus(status, label, true);
  } catch (e) {
    output.value = '';
    setStatus(status, e instanceof URIError ? 'Malformed percent-encoding (e.g. a stray % not followed by two hex digits)' : e.message, false);
  }
  showParams(input.value);
}

$('#encode').addEventListener('click', () => run(() => urlEncode(input.value, { component: !full.checked }), 'Encoded'));
$('#decode').addEventListener('click', () => run(() => urlDecode(input.value), 'Decoded'));
$('#swap').addEventListener('click', () => ([input.value, output.value] = [output.value, input.value]));
input.addEventListener('input', () => showParams(input.value));
$('#clear').addEventListener('click', () => {
  input.value = output.value = params.innerHTML = '';
  setStatus(status, '');
});
showParams(input.value);
