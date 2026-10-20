import { $, persist, escapeHtml, t } from '/assets/js/ui.js';
import { cases, stats } from '/assets/js/lib/text.js';

const input = $('#input');
const table = $('#cases');
const statsEl = $('#stats');
persist(input);

const labels = { camel: 'camelCase', pascal: 'PascalCase', snake: 'snake_case', constant: 'CONSTANT_CASE', kebab: 'kebab-case', title: 'Title Case', sentence: 'Sentence case', upper: 'UPPERCASE', lower: 'lowercase' };

function run() {
  const text = input.value;
  const s = stats(text);
  const n = (v) => v.toLocaleString();
  statsEl.textContent = [
    t(s.words === 1 ? '{n} word' : '{n} words', { n: n(s.words) }),
    t('{n} characters ({m} without spaces)', { n: n(s.characters), m: n(s.charactersNoSpaces) }),
    t(s.sentences === 1 ? '{n} sentence' : '{n} sentences', { n: s.sentences }),
    t(s.lines === 1 ? '{n} line' : '{n} lines', { n: s.lines }),
    t('~{n} min read', { n: s.readingMinutes }),
  ].join(' · ');
  table.innerHTML = Object.entries(cases)
    .map(([k, fn], i) => `<tr><th>${labels[k]}</th><td id="case-${i}">${escapeHtml(fn(text))}</td><td style="width:1%"><button class="btn small" data-copy="#case-${i}">${t('Copy')}</button></td></tr>`)
    .join('');
}

input.addEventListener('input', run);
$('#clear').addEventListener('click', () => {
  input.value = '';
  run();
});
run();
