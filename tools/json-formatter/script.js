import { $, persist, setStatus, download, shareLink, readShared, debounce } from '/assets/js/ui.js';
import { format, minify, parse, countBigNums } from '/assets/js/lib/json.js';

const input = $('#input');
const output = $('#output');
const status = $('#status');
const indentSel = $('#indent');
const sort = $('#sort');

const shared = readShared();
if (shared?.input) input.value = shared.input;
persist(input, indentSel, sort);

function selectError(e) {
  if (typeof e.index !== 'number') return;
  input.focus();
  input.setSelectionRange(e.index, Math.min(e.index + 1, input.value.length));
}

function run(mode) {
  try {
    const indent = indentSel.value === 'tab' ? '\t' : Number(indentSel.value);
    output.value = mode === 'minify' ? minify(input.value) : format(input.value, { indent, sort: sort.checked });
    const bytes = new TextEncoder().encode(output.value).length;
    const big = countBigNums(parse(input.value));
    const note = big ? ` · kept ${big} long number${big === 1 ? '' : 's'} exactly as written` : '';
    setStatus(status, `Valid JSON · ${bytes.toLocaleString()} bytes${note}`, true);
  } catch (e) {
    output.value = '';
    setStatus(status, e.message, false);
    return e;
  }
}

$('#format').addEventListener('click', () => {
  const e = run('format');
  if (e) selectError(e);
});
$('#minify').addEventListener('click', () => {
  const e = run('minify');
  if (e) selectError(e);
});
indentSel.addEventListener('change', () => input.value && run('format'));
sort.addEventListener('change', () => input.value && run('format'));
input.addEventListener(
  'input',
  debounce(() => {
    if (!input.value.trim()) return setStatus(status, '');
    try {
      parse(input.value);
      setStatus(status, 'Valid JSON', true);
    } catch (e) {
      setStatus(status, e.message, false);
    }
  }, 250),
);
$('#clear').addEventListener('click', () => {
  input.value = output.value = '';
  input.dispatchEvent(new Event('input'));
});
$('#sample').addEventListener('click', () => {
  input.value = '{"id":42,"name":"Ada Lovelace","roles":["admin","author"],"active":true,"profile":{"joined":"2024-03-01T09:30:00Z","score":98.6,"manager":null}}';
  run('format');
});
$('#download').addEventListener('click', () => output.value && download('formatted.json', output.value, 'application/json'));
$('#share').addEventListener('click', () => shareLink({ input: input.value }));

if (input.value.trim()) run('format');
