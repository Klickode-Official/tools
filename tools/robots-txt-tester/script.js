import { $, persist, setStatus, escapeHtml, debounce } from '/assets/js/ui.js';
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
    <tr><th>Groups</th><td>${parsed.groups.length}</td></tr>
    <tr><th>Applies to "${escapeHtml(ua.value || '*')}"</th><td>${groups.length ? groups.map((g) => `User-agent: ${escapeHtml(g.agents.join(', '))} (line ${g.line})`).join('<br>') : 'None, so everything is allowed'}</td></tr>
    <tr><th>Sitemaps</th><td>${parsed.sitemaps.map(escapeHtml).join('<br>') || '—'}</td></tr>
    ${parsed.warnings.map((w) => `<tr><th>Line ${w.line}</th><td class="err-text">${escapeHtml(w.message)}</td></tr>`).join('')}
  </table>`;
  const lines = urls.value.split('\n').map((s) => s.trim()).filter(Boolean);
  if (!lines.length) return setStatus(status, '');
  const rows = lines.map((u) => ({ u, r: isAllowed(parsed, ua.value || '*', u) }));
  const blocked = rows.filter((x) => !x.r.allowed).length;
  setStatus(status, `${rows.length - blocked} allowed · ${blocked} blocked`, true);
  results.innerHTML = rows
    .map(({ u, r }) => `<li><span class="badge ${r.allowed ? 'added' : 'removed'}">${r.allowed ? 'allowed' : 'blocked'}</span>${escapeHtml(u)} <span class="check">(${escapeHtml(r.reason)})</span></li>`)
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
