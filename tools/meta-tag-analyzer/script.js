import { $, persist, setStatus, escapeHtml, debounce, t } from '/assets/js/ui.js';
import { localise } from '/tools/json-formatter/json-error.js';
import { extract, audit } from '/assets/js/lib/seo.js';
import { measure } from '/assets/js/shared/serp-measure.js';

const input = $('#input');
const status = $('#status');
const checks = $('#checks');
const summary = $('#summary');
const headings = $('#headings');
persist(input);

const ICONS = { ok: '✓', warn: '!', error: '✕', info: 'i' };

// The audit's sentences (from /assets/js/lib/seo.js), as templates t() can translate.
const MESSAGES = [
  [/^Title is short \((\d+) characters\)\. Aim for (\d+)–(\d+)\.$/, 'Title is short ({n} characters). Aim for {min}–{max}.', ['n', 'min', 'max']],
  [/^Title may be truncated in search results \((\d+) characters, ~(\d+)px\)\.$/, 'Title may be truncated in search results ({n} characters, ~{px}px).', ['n', 'px']],
  [/^Title may be truncated in search results \((\d+) characters\)\.$/, 'Title may be truncated in search results ({n} characters).', ['n']],
  [/^Title length is good \((\d+) characters\)\.$/, 'Title length is good ({n} characters).', ['n']],
  [/^(\d+) <title> tags found; use exactly one\.$/, '{n} <title> tags found; use exactly one.', ['n']],
  [/^Meta description is short \((\d+) characters\)\. Aim for (\d+)–(\d+)\.$/, 'Meta description is short ({n} characters). Aim for {min}–{max}.', ['n', 'min', 'max']],
  [/^Meta description may be truncated \((\d+) characters\)\.$/, 'Meta description may be truncated ({n} characters).', ['n']],
  [/^Meta description length is good \((\d+) characters\)\.$/, 'Meta description length is good ({n} characters).', ['n']],
  [/^(\d+) meta descriptions found; use exactly one\.$/, '{n} meta descriptions found; use exactly one.', ['n']],
  [/^(\d+) <h1> headings\. One clear <h1> per page is the convention\.$/, '{n} <h1> headings. One clear <h1> per page is the convention.', ['n']],
  [/^Heading level skips from h(\d) to h(\d) \((".*")\)\.$/, 'Heading level skips from h{from} to h{to} ({text}).', ['from', 'to', 'text']],
  [/^(\d+) of (\d+) images have no alt attribute \(use alt="" for decorative images\)\.$/, '{n} of {total} images have no alt attribute (use alt="" for decorative images).', ['n', 'total']],
  [/^All (\d+) images have alt attributes\.$/, 'All {n} images have alt attributes.', ['n']],
  [/^Canonical URL should be absolute: (".*")\.$/, 'Canonical URL should be absolute: {url}.', ['url']],
  [/^Canonical: (.*)$/, 'Canonical: {url}', ['url']],
  [/^meta robots is (".*"): this page will not be indexed\.$/, 'meta robots is {value}: this page will not be indexed.', ['value']],
  [/^Missing Open Graph tags: (.*)\. Links shared on social media will look plain\.$/, 'Missing Open Graph tags: {tags}. Links shared on social media will look plain.', ['tags']],
  [/^JSON-LD block (\d+) is valid \((.*)\)\.$/, 'JSON-LD block {n} is valid ({types}).', ['n', 'types']],
  [/^JSON-LD block (\d+) is valid\.$/, 'JSON-LD block {n} is valid.', ['n']],
  [/^JSON-LD block (\d+) is not valid JSON: (.*)$/, 'JSON-LD block {n} is not valid JSON: {error}', ['n', 'error']],
  [/^Only ~(\d+) words of visible text\. Thin pages tend to rank poorly\.$/, 'Only ~{n} words of visible text. Thin pages tend to rank poorly.', ['n']],
];

function run() {
  checks.innerHTML = summary.innerHTML = headings.innerHTML = '';
  if (!input.value.trim()) return setStatus(status, '');
  // DOMParser builds an inert document: scripts don't run and nothing is fetched.
  const doc = new DOMParser().parseFromString(input.value, 'text/html');
  const data = extract(doc);
  const { checks: list, score } = audit(data, measure);
  const counts = list.reduce((c, x) => ((c[x.level] = (c[x.level] || 0) + 1), c), {});
  const errors = counts.error || 0;
  const warnings = counts.warn || 0;
  setStatus(status, `${t(errors === 1 ? '1 error' : '{n} errors', { n: errors })} · ${t(warnings === 1 ? '1 warning' : '{n} warnings', { n: warnings })} · ${t('{n} passed', { n: counts.ok || 0 })}`, !counts.error);
  summary.innerHTML = `<div class="score">${score}<span>/100</span></div>
    <table class="kv">
      <tr><th>${t('Title')}</th><td>${escapeHtml(data.title ?? '—')}</td></tr>
      <tr><th>${t('Description')}</th><td>${escapeHtml(data.description ?? '—')}</td></tr>
      <tr><th>Canonical</th><td>${escapeHtml(data.canonical ?? '—')}</td></tr>
      <tr><th>Robots</th><td>${escapeHtml(data.robots ?? t('index, follow (default)'))}</td></tr>
      <tr><th>${t('Links')}</th><td>${t('{total} total · {external} absolute/external · {nofollow} nofollow', data.links)}</td></tr>
      <tr><th>${t('Words')}</th><td>~${data.wordCount.toLocaleString()}</td></tr>
    </table>`;
  checks.innerHTML = list
    .map((c) => `<li class="${c.level}"><span class="lvl" aria-label="${t(c.level)}">${ICONS[c.level]}</span><span class="area">${t(c.area)}</span><span>${escapeHtml(localise(c.message, MESSAGES))}</span></li>`)
    .join('');
  headings.innerHTML = data.headings.length
    ? data.headings.map((h) => `<li style="padding-left:${(h.level - 1) * 16}px"><span class="badge changed">h${h.level}</span>${escapeHtml(h.text || t('(empty)'))}</li>`).join('')
    : `<li>${t('No headings found.')}</li>`;
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
