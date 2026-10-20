import { $, persist, setStatus, escapeHtml, t } from '/assets/js/ui.js';
import { jsonErrorText } from '/tools/json-formatter/json-error.js';
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
    return setStatus(status, t('Original: {message}', { message: jsonErrorText(e) }), false);
  }
  try {
    b = parse(right.value);
  } catch (e) {
    return setStatus(status, t('Changed: {message}', { message: jsonErrorText(e) }), false);
  }
  const diffs = jsonDiff(a, b);
  if (!diffs.length) return setStatus(status, t('The documents are equivalent.'), true);
  const counts = diffs.reduce((c, d) => ((c[d.type] = (c[d.type] || 0) + 1), c), {});
  const parts = Object.entries(counts).map(([k, n]) => t('{n} ' + k, { n }));
  setStatus(status, t(diffs.length === 1 ? '1 difference: {parts}' : '{n} differences: {parts}', { n: diffs.length, parts: parts.join(', ') }), true);
  result.innerHTML = diffs
    .map((d) => {
      const detail = d.type === 'changed' ? `${show(d.from)} → ${show(d.to)}` : d.type === 'added' ? show(d.to) : show(d.from);
      return `<li><span class="badge ${d.type}">${t(d.type)}</span>${escapeHtml(d.path)}: ${detail}</li>`;
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
