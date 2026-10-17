import { $, persist, setStatus, shareLink, readShared, escapeHtml, debounce } from '../ui.js';

const pattern = $('#pattern');
const flags = $('#flags');
const input = $('#input');
const replacement = $('#replacement');
const status = $('#status');
const highlight = $('#highlight');
const details = $('#details');
const replaced = $('#replaced');

const shared = readShared();
if (shared) {
  pattern.value = shared.pattern ?? '';
  flags.value = shared.flags ?? 'g';
  input.value = shared.input ?? '';
  replacement.value = shared.replacement ?? '';
}
persist(pattern, flags, input, replacement);

const TIMEOUT_MS = 1500;
let worker;
let seq = 0;
let timer;
let sentText = '';

function spawn() {
  worker = new Worker(new URL('../regex-worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = ({ data }) => {
    if (data.id !== seq) return;
    clearTimeout(timer);
    render(data);
  };
}

function run() {
  highlight.innerHTML = escapeHtml(input.value);
  details.innerHTML = '';
  replaced.textContent = '';
  if (!pattern.value) return setStatus(status, '');
  if (/[^dgimsuvy]/.test(flags.value)) return setStatus(status, 'Unknown flag. Valid flags are d g i m s u v y.', false);
  if (!worker) spawn();
  const id = ++seq;
  clearTimeout(timer);
  timer = setTimeout(() => {
    // The pattern is still running: kill the worker so the page stays responsive.
    worker.terminate();
    worker = null;
    setStatus(status, `Gave up after ${TIMEOUT_MS / 1000}s. The pattern is probably backtracking catastrophically (e.g. nested quantifiers like (a+)+).`, false);
  }, TIMEOUT_MS);
  sentText = input.value;
  worker.postMessage({ id, pattern: pattern.value, flags: flags.value, input: sentText, replacement: replacement.value });
}

function render({ error, matches, replaced: replacedText, ms }) {
  if (error) return setStatus(status, error, false);
  setStatus(status, `${matches.length}${matches.length === 1000 ? '+' : ''} match${matches.length === 1 ? '' : 'es'} · ${ms.toFixed(1)} ms`, matches.length > 0);

  let html = '';
  let last = 0;
  matches.forEach((m, i) => {
    html += escapeHtml(sentText.slice(last, m.index));
    html += `<mark class="${i % 2 ? 'alt' : ''}" title="Match ${i + 1}">${escapeHtml(m.text) || '&#8203;'}</mark>`;
    last = m.end;
  });
  highlight.innerHTML = html + escapeHtml(sentText.slice(last));

  details.innerHTML = matches
    .slice(0, 200)
    .map((m, i) => {
      const groups = m.groups.map((g, gi) => `<tr><th>Group ${gi + 1}</th><td>${g === undefined ? '<em>not matched</em>' : escapeHtml(g)}</td></tr>`);
      for (const [name, g] of Object.entries(m.named || {})) {
        groups.push(`<tr><th>&lt;${escapeHtml(name)}&gt;</th><td>${g === undefined ? '<em>not matched</em>' : escapeHtml(g)}</td></tr>`);
      }
      return `<table class="kv"><tr><th>Match ${i + 1}</th><td>${escapeHtml(m.text)} <span class="check">(index ${m.index}–${m.end})</span></td></tr>${groups.join('')}</table>`;
    })
    .join('');
  if (matches.length > 200) details.innerHTML += `<p class="check">Showing the first 200 matches.</p>`;

  replaced.textContent = replacedText;
}

const go = debounce(run, 120);
for (const el of [pattern, flags, input, replacement]) el.addEventListener('input', go);
$('#clear').addEventListener('click', () => {
  input.value = '';
  run();
});
$('#sample').addEventListener('click', () => {
  pattern.value = '(?<user>[\\w.+-]+)@(?<domain>[\\w-]+(?:\\.[\\w-]+)+)';
  flags.value = 'gi';
  input.value = 'Contact ada@example.com or grace.hopper+navy@mail.example.org.\nNot an email: user@localhost';
  replacement.value = '$<user> [at] $<domain>';
  run();
});
$('#share').addEventListener('click', () => shareLink({ pattern: pattern.value, flags: flags.value, input: input.value, replacement: replacement.value }));

run();
