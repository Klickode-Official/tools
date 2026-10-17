import { $, persist, setStatus, escapeHtml, debounce } from '/assets/js/ui.js';
import { extract, audit } from '/assets/js/lib/seo.js';
import { measure } from '/assets/js/shared/serp-measure.js';

const input = $('#input');
const status = $('#status');
const checks = $('#checks');
const summary = $('#summary');
const headings = $('#headings');
persist(input);

const ICONS = { ok: '✓', warn: '!', error: '✕', info: 'i' };

function run() {
  checks.innerHTML = summary.innerHTML = headings.innerHTML = '';
  if (!input.value.trim()) return setStatus(status, '');
  // DOMParser builds an inert document: scripts don't run and nothing is fetched.
  const doc = new DOMParser().parseFromString(input.value, 'text/html');
  const data = extract(doc);
  const { checks: list, score } = audit(data, measure);
  const counts = list.reduce((c, x) => ((c[x.level] = (c[x.level] || 0) + 1), c), {});
  const n = (k, word) => `${counts[k] || 0} ${word}${counts[k] === 1 ? '' : 's'}`;
  setStatus(status, `${n('error', 'error')} · ${n('warn', 'warning')} · ${counts.ok || 0} passed`, !counts.error);
  summary.innerHTML = `<div class="score">${score}<span>/100</span></div>
    <table class="kv">
      <tr><th>Title</th><td>${escapeHtml(data.title ?? '—')}</td></tr>
      <tr><th>Description</th><td>${escapeHtml(data.description ?? '—')}</td></tr>
      <tr><th>Canonical</th><td>${escapeHtml(data.canonical ?? '—')}</td></tr>
      <tr><th>Robots</th><td>${escapeHtml(data.robots ?? 'index, follow (default)')}</td></tr>
      <tr><th>Links</th><td>${data.links.total} total · ${data.links.external} absolute/external · ${data.links.nofollow} nofollow</td></tr>
      <tr><th>Words</th><td>~${data.wordCount.toLocaleString()}</td></tr>
    </table>`;
  checks.innerHTML = list
    .map((c) => `<li class="${c.level}"><span class="lvl" aria-label="${c.level}">${ICONS[c.level]}</span><span class="area">${c.area}</span><span>${escapeHtml(c.message)}</span></li>`)
    .join('');
  headings.innerHTML = data.headings.length
    ? data.headings.map((h) => `<li style="padding-left:${(h.level - 1) * 16}px"><span class="badge changed">h${h.level}</span>${escapeHtml(h.text || '(empty)')}</li>`).join('')
    : '<li>No headings found.</li>';
}

input.addEventListener('input', debounce(run, 250));
$('#clear').addEventListener('click', () => {
  input.value = '';
  run();
});
$('#sample').addEventListener('click', () => {
  input.value = `<!doctype html>
<html>
<head>
  <title>Image Converter</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="og:title" content="Image Converter">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"Image Converter"}</script>
</head>
<body>
  <h1>Convert images online</h1>
  <h3>Supported formats</h3>
  <img src="formats.png">
  <p>Convert JPG, PNG and WebP images in your browser.</p>
</body>
</html>`;
  run();
});
run();
