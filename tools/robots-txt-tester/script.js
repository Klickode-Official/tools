import { $, persist, setStatus, escapeHtml, debounce, t } from '/assets/js/ui.js';
import { localise } from '/tools/json-formatter/json-error.js';

// Sentences from /assets/js/lib/robots.js, as templates t() can translate.
const MESSAGES = [
  [/^Unrecognised line: (".*")$/, 'Unrecognised line: {line}', ['line']],
  [/^(\S+) before any User-agent line is ignored$/, '{directive} before any User-agent line is ignored', ['directive']],
  [/^Unknown directive (".*")$/, 'Unknown directive {name}', ['name']],
  [/^Matched (Allow|Disallow): (.*) \(line (\d+)\)$/, 'Matched {type}: {path} (line {line})', ['type', 'path', 'line']],
];
import { parseRobots, isAllowed, selectGroups } from '/assets/js/lib/robots.js';

const input = $('#input');
const ua = $('#ua');
const urls = $('#urls');
const status = $('#status');
const results = $('#results');
const summary = $('#summary');
persist(input, ua, urls);

function run() {
  results.innerHTML = summary.innerHTML = '';
  const parsed = parseRobots(input.value);
  const groups = selectGroups(parsed, ua.value || '*');
  summary.innerHTML = `<table class="kv">
    <tr><th>${t('Groups')}</th><td>${parsed.groups.length}</td></tr>
    <tr><th>${t('Applies to "{ua}"', { ua: escapeHtml(ua.value || '*') })}</th><td>${groups.length ? groups.map((g) => `User-agent: ${escapeHtml(g.agents.join(', '))} ${t('(line {line})', { line: g.line })}`).join('<br>') : t('None, so everything is allowed')}</td></tr>
    <tr><th>Sitemaps</th><td>${parsed.sitemaps.map(escapeHtml).join('<br>') || '—'}</td></tr>
    ${parsed.warnings.map((w) => `<tr><th>${t('Line {line}', { line: w.line })}</th><td class="err-text">${escapeHtml(localise(w.message, MESSAGES))}</td></tr>`).join('')}
  </table>`;
  const lines = urls.value.split('\n').map((s) => s.trim()).filter(Boolean);
  if (!lines.length) return setStatus(status, '');
  const rows = lines.map((u) => ({ u, r: isAllowed(parsed, ua.value || '*', u) }));
  const blocked = rows.filter((x) => !x.r.allowed).length;
  setStatus(status, t('{allowed} allowed · {blocked} blocked', { allowed: rows.length - blocked, blocked }), true);
  results.innerHTML = rows
    .map(({ u, r }) => `<li><span class="badge ${r.allowed ? 'added' : 'removed'}">${r.allowed ? t('allowed') : t('blocked')}</span>${escapeHtml(u)} <span class="check">(${escapeHtml(localise(r.reason, MESSAGES))})</span></li>`)
    .join('');
}

const go = debounce(run, 150);
for (const el of [input, ua, urls]) el.addEventListener('input', go);
$('#sample').addEventListener('click', () => {
  input.value = `User-agent: *
Disallow: /admin/
Disallow: /search
Allow: /admin/public/
Disallow: /*.pdf$

User-agent: GPTBot
Disallow: /

Sitemap: https://example.com/sitemap.xml`;
  urls.value = '/\n/admin/settings\n/admin/public/logo.png\n/search?q=shoes\n/docs/guide.pdf\n/docs/guide.pdf?v=2';
  run();
});
$('#clear').addEventListener('click', () => {
  input.value = urls.value = '';
  run();
});
run();
