import { $, setStatus, t, escapeHtml } from '/assets/js/ui.js';
import { checkThaiId, ID_TYPES } from '/assets/js/lib/thai.js';

// Not remembered between visits on purpose: ID numbers are personal data.
const input = $('#input');
const results = $('#results');
const status = $('#status');

function why(r) {
  if (r.reason === 'length') return t('Needs 13 digits (this has {n})', { n: r.length });
  if (r.reason === 'digits') return t('Only digits, dashes and spaces');
  return t('Last digit should be {d}, so there’s probably a typo', { d: r.expected });
}

function run() {
  const lines = input.value.split('\n').map((l) => l.trim()).filter(Boolean);
  const checked = lines.map((line) => ({ line, r: checkThaiId(line) }));
  results.innerHTML = checked
    .map(({ line, r }) =>
      r.valid
        ? `<li class="ok"><span class="mono">${r.formatted}</span><span class="pv-tag ok">${t('Valid')}</span><small>${escapeHtml(t(ID_TYPES[r.type] ?? ''))}</small></li>`
        : `<li class="bad"><span class="mono">${escapeHtml(r.formatted ?? line)}</span><span class="pv-tag bad">${t('Not valid')}</span><small>${escapeHtml(why(r))}</small></li>`,
    )
    .join('');
  const ok = checked.filter((c) => c.r.valid).length;
  setStatus(status, checked.length > 1 ? t('{ok} of {n} valid', { ok, n: checked.length }) : '', ok === checked.length);
}

input.addEventListener('input', run);
$('#clear').addEventListener('click', () => {
  input.value = '';
  run();
  input.focus();
});
