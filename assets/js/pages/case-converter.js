import { $, persist, escapeHtml } from '../ui.js';
import { cases, stats } from '../lib/text.js';

const input = $('#input');
const table = $('#cases');
const statsEl = $('#stats');
persist(input);

const labels = { camel: 'camelCase', pascal: 'PascalCase', snake: 'snake_case', constant: 'CONSTANT_CASE', kebab: 'kebab-case', title: 'Title Case', sentence: 'Sentence case', upper: 'UPPERCASE', lower: 'lowercase' };

function run() {
  const t = input.value;
  const s = stats(t);
  statsEl.textContent = `${s.words.toLocaleString()} words · ${s.characters.toLocaleString()} characters (${s.charactersNoSpaces.toLocaleString()} without spaces) · ${s.sentences} sentences · ${s.lines} lines · ~${s.readingMinutes} min read`;
  table.innerHTML = Object.entries(cases)
    .map(([k, fn], i) => `<tr><th>${labels[k]}</th><td id="case-${i}">${escapeHtml(fn(t))}</td><td style="width:1%"><button class="btn small" data-copy="#case-${i}">Copy</button></td></tr>`)
    .join('');
}

input.addEventListener('input', run);
$('#clear').addEventListener('click', () => {
  input.value = '';
  run();
});
run();
