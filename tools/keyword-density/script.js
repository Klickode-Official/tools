import { $, persist, escapeHtml, debounce, t } from '/assets/js/ui.js';
import { keywordDensity, stats } from '/assets/js/lib/text.js';

const input = $('#input');
const stop = $('#stopwords');
const out = $('#result');
const statsEl = $('#stats');
persist(input, stop);

const table = (title, rows) =>
  `<div class="panel"><h2 class="panel-title">${title}</h2>${
    rows.length
      ? `<table class="kv"><tr><th>${t('Phrase')}</th><th>${t('Count')}</th><th>${t('Density')}</th></tr>${rows.map((r) => `<tr><td>${escapeHtml(r.phrase)}</td><td>${r.count}</td><td>${r.density.toFixed(2)}%</td></tr>`).join('')}</table>`
      : `<p class="check">${t('None repeated yet.')}</p>`
  }</div>`;

function run() {
  const k = keywordDensity(input.value, { ignoreStopwords: stop.checked, top: 15 });
  const s = stats(input.value);
  const words = k.total === 1 ? t('1 word') : t('{n} words', { n: k.total.toLocaleString() });
  const sentences = s.sentences === 1 ? t('1 sentence') : t('{n} sentences', { n: s.sentences });
  statsEl.textContent = `${words} · ${sentences} · ${t('~{n} min read', { n: s.readingMinutes })}`;
  out.innerHTML = `<div class="grid-3">${table(t('Single words'), k.single)}${table(t('Two-word phrases'), k.double)}${table(t('Three-word phrases'), k.triple)}</div>`;
}
input.addEventListener('input', debounce(run, 200));
stop.addEventListener('change', run);
$('#clear').addEventListener('click', () => {
  input.value = '';
  run();
});
run();
