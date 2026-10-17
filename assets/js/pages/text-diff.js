import { $, persist, setStatus, escapeHtml } from '../ui.js';
import { textDiff } from '../lib/diff.js';

const left = $('#left');
const right = $('#right');
const trim = $('#trim');
const status = $('#status');
const result = $('#result');
persist(left, right, trim);

function compare() {
  const norm = (s) => (trim.checked ? s.split('\n').map((l) => l.trim()).join('\n') : s);
  try {
    const ops = textDiff(norm(left.value), norm(right.value));
    const added = ops.filter((o) => o.type === 'added').length;
    const removed = ops.filter((o) => o.type === 'removed').length;
    setStatus(status, added || removed ? `${added} line${added === 1 ? '' : 's'} added, ${removed} removed` : 'The texts are identical.', true);
    result.innerHTML = ops.map((o) => `<span class="diff-line ${o.type}">${escapeHtml(o.text) || ' '}</span>`).join('');
  } catch (e) {
    setStatus(status, e.message, false);
  }
}

$('#compare').addEventListener('click', compare);
trim.addEventListener('change', compare);
$('#clear').addEventListener('click', () => {
  left.value = right.value = result.innerHTML = '';
  setStatus(status, '');
});
$('#sample').addEventListener('click', () => {
  left.value = 'function greet(name) {\n  console.log("Hello " + name);\n  return true;\n}';
  right.value = 'function greet(name, greeting = "Hello") {\n  console.log(`${greeting} ${name}`);\n  return true;\n}';
  compare();
});
