import { $, persist, setStatus, escapeHtml, t } from '/assets/js/ui.js';
import { textDiff, wordDiff } from '/assets/js/lib/diff.js';

const left = $('#left');
const right = $('#right');
const trim = $('#trim');
const status = $('#status');
const result = $('#result');
persist(left, right, trim);

// When a run of removed lines is followed by added lines, pair them up and mark the changed words.
function render(ops) {
  const html = [];
  const line = (type, inner) => `<span class="diff-line ${type}">${inner || ' '}</span>`;
  for (let i = 0; i < ops.length; ) {
    if (ops[i].type !== 'removed') {
      html.push(line(ops[i].type, escapeHtml(ops[i].text)));
      i++;
      continue;
    }
    const removed = [];
    while (i < ops.length && ops[i].type === 'removed') removed.push(ops[i++].text);
    const added = [];
    while (i < ops.length && ops[i].type === 'added') added.push(ops[i++].text);
    const pairs = Math.min(removed.length, added.length);
    const words = removed.slice(0, pairs).map((r, k) => wordDiff(r, added[k]));
    removed.forEach((r, k) => {
      const w = words[k];
      html.push(line('removed', w ? w.filter((o) => o.type !== 'added').map((o) => (o.type === 'removed' ? `<del>${escapeHtml(o.text)}</del>` : escapeHtml(o.text))).join('') : escapeHtml(r)));
    });
    added.forEach((a, k) => {
      const w = words[k];
      html.push(line('added', w ? w.filter((o) => o.type !== 'removed').map((o) => (o.type === 'added' ? `<ins>${escapeHtml(o.text)}</ins>` : escapeHtml(o.text))).join('') : escapeHtml(a)));
    });
  }
  return html.join('');
}

function compare() {
  const norm = (s) => (trim.checked ? s.split('\n').map((l) => l.trim()).join('\n') : s);
  try {
    const ops = textDiff(norm(left.value), norm(right.value));
    const added = ops.filter((o) => o.type === 'added').length;
    const removed = ops.filter((o) => o.type === 'removed').length;
    setStatus(status, added || removed ? t(added === 1 ? '{added} line added, {removed} removed' : '{added} lines added, {removed} removed', { added, removed }) : t('The texts are identical.'), true);
    result.innerHTML = render(ops);
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
