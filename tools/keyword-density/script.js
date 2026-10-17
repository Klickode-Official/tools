import { $, persist, escapeHtml, debounce } from '/assets/js/ui.js';
import { keywordDensity, stats } from '/assets/js/lib/text.js';

const input = $('#input');
const stop = $('#stopwords');
const out = $('#result');
const statsEl = $('#stats');
persist(input, stop);

const table = (title, rows) =>
  `<div class="panel"><h3>${title}</h3>${
    rows.length
      ? `<table class="kv"><tr><th>Phrase</th><th>Count</th><th>Density</th></tr>${rows.map((r) => `<tr><td>${escapeHtml(r.phrase)}</td><td>${r.count}</td><td>${r.density.toFixed(2)}%</td></tr>`).join('')}</table>`
      : '<p class="check">None repeated yet.</p>'
  }</div>`;

function run() {
  const k = keywordDensity(input.value, { ignoreStopwords: stop.checked, top: 15 });
  const s = stats(input.value);
  statsEl.textContent = `${k.total.toLocaleString()} word${k.total === 1 ? '' : 's'} · ${s.sentences} sentence${s.sentences === 1 ? '' : 's'} · ~${s.readingMinutes} min read`;
  out.innerHTML = `<div class="grid-3">${table('Single words', k.single)}${table('Two-word phrases', k.double)}${table('Three-word phrases', k.triple)}</div>`;
}
input.addEventListener('input', debounce(run, 200));
stop.addEventListener('change', run);
$('#clear').addEventListener('click', () => {
  input.value = '';
  run();
});
run();
