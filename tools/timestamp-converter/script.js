import { $, setStatus, escapeHtml, persist, t, lang } from '/assets/js/ui.js';
import { parseTimestamp, describe, COMMON_ZONES, allZones } from '/assets/js/lib/time.js';

const input = $('#input');
const status = $('#status');
const result = $('#result');
const clock = $('#clock');
const tz = $('#tz');

// Common zones first, then every zone the browser knows.
const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
const rest = allZones().filter((z) => !COMMON_ZONES.includes(z));
tz.innerHTML = `<optgroup label="${t('Common')}">${COMMON_ZONES.map((z) => `<option>${z}</option>`).join('')}</optgroup><optgroup label="${t('All time zones')}">${rest.map((z) => `<option>${z}</option>`).join('')}</optgroup>`;
tz.value = local === 'Asia/Bangkok' ? 'Europe/London' : 'Asia/Bangkok';
persist(tz);
tz.addEventListener('change', () => run());

const labels = { seconds: t('Unix seconds'), milliseconds: t('Unix milliseconds'), iso: 'ISO 8601 (UTC)', utc: 'UTC', local: t('Your local time'), zone: t('Time zone'), thai: t('Thai date (พ.ศ.)'), relative: t('Relative') };

// On Thai pages the Buddhist-calendar date comes first and "3 days ago" is in Thai.
function rows(date) {
  const out = describe(date, tz.value);
  if (lang !== 'th') return Object.entries(out);
  const diff = (date.getTime() - Date.now()) / 1000;
  const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]];
  const [u, secs] = units.find(([unit, s]) => Math.abs(diff) >= s || unit === 'second');
  out.relative = new Intl.RelativeTimeFormat('th', { numeric: 'auto' }).format(Math.round(diff / secs), u);
  const { thai, ...rest } = out;
  return thai ? [['thai', thai], ...Object.entries(rest)] : Object.entries(rest);
}

function run() {
  result.innerHTML = '';
  if (!input.value.trim()) return setStatus(status, '');
  try {
    const { date, unit } = parseTimestamp(input.value);
    setStatus(status, t('Interpreted as {unit}', { unit: t(unit) }), true);
    result.innerHTML = rows(date)
      .map(([k, v], i) => `<tr><th>${k === 'zone' ? escapeHtml(tz.value.replace(/_/g, ' ')) : labels[k]}</th><td id="ts-${i}">${escapeHtml(v)}</td><td style="width:1%"><button class="btn small" data-copy="#ts-${i}">${t('Copy')}</button></td></tr>`)
      .join('');
  } catch (e) {
    setStatus(status, t(e.message), false);
  }
}

input.addEventListener('input', run);
$('#now').addEventListener('click', () => {
  input.value = String(Math.floor(Date.now() / 1000));
  run();
});
const tick = () => (clock.textContent = t('Current Unix time: {n}', { n: Math.floor(Date.now() / 1000) }));
tick();
setInterval(tick, 1000);
input.value ||= String(Math.floor(Date.now() / 1000));
run();
