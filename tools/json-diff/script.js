import { $, persist, setStatus, escapeHtml } from '/assets/js/ui.js';
import { parse, stringify } from '/assets/js/lib/json.js';
import { jsonDiff } from '/assets/js/lib/diff.js';

const left = $('#left');
const right = $('#right');
const status = $('#status');
const result = $('#result');
persist(left, right);

const show = (v) => escapeHtml(v === undefined ? '' : stringify(v));

function compare() {
  result.innerHTML = '';
  let a, b;
  try {
    a = parse(left.value);
  } catch (e) {
    return setStatus(status, `Original: ${e.message}`, false);
  }
  try {
    b = parse(right.value);
  } catch (e) {
    return setStatus(status, `Changed: ${e.message}`, false);
  }
  const diffs = jsonDiff(a, b);
  if (!diffs.length) return setStatus(status, 'The documents are equivalent.', true);
  const counts = diffs.reduce((c, d) => ((c[d.type] = (c[d.type] || 0) + 1), c), {});
  setStatus(status, `${diffs.length} difference${diffs.length > 1 ? 's' : ''}: ${Object.entries(counts).map(([k, n]) => `${n} ${k}`).join(', ')}`, true);
  result.innerHTML = diffs
    .map((d) => {
      const detail = d.type === 'changed' ? `${show(d.from)} → ${show(d.to)}` : d.type === 'added' ? show(d.to) : show(d.from);
      return `<li><span class="badge ${d.type}">${d.type}</span>${escapeHtml(d.path)}: ${detail}</li>`;
    })
    .join('');
}

$('#compare').addEventListener('click', compare);
$('#clear').addEventListener('click', () => {
  left.value = right.value = result.innerHTML = '';
  setStatus(status, '');
});
$('#sample').addEventListener('click', () => {
  left.value = JSON.stringify({ id: 1, name: 'Ada', tags: ['math', 'code'], settings: { theme: 'dark', beta: false } }, null, 2);
  right.value = JSON.stringify({ id: 1, name: 'Ada Lovelace', tags: ['math'], settings: { theme: 'dark', beta: true }, email: 'ada@example.com' }, null, 2);
  compare();
});
