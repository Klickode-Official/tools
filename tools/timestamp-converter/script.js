import { $, setStatus, escapeHtml, persist } from '/assets/js/ui.js';
import { parseTimestamp, describe, COMMON_ZONES, allZones } from '/assets/js/lib/time.js';

const input = $('#input');
const status = $('#status');
const result = $('#result');
const clock = $('#clock');
const tz = $('#tz');

// Common zones first, then every zone the browser knows.
const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
const rest = allZones().filter((z) => !COMMON_ZONES.includes(z));
tz.innerHTML = `<optgroup label="Common">${COMMON_ZONES.map((z) => `<option>${z}</option>`).join('')}</optgroup><optgroup label="All time zones">${rest.map((z) => `<option>${z}</option>`).join('')}</optgroup>`;
tz.value = local === 'Asia/Bangkok' ? 'Europe/London' : 'Asia/Bangkok';
persist(tz);
tz.addEventListener('change', () => run());

const labels = { seconds: 'Unix seconds', milliseconds: 'Unix milliseconds', iso: 'ISO 8601 (UTC)', utc: 'UTC', local: 'Your local time', zone: 'Time zone', thai: 'Thai date (พ.ศ.)', relative: 'Relative' };

function run() {
  result.innerHTML = '';
  if (!input.value.trim()) return setStatus(status, '');
  try {
    const { date, unit } = parseTimestamp(input.value);
    setStatus(status, `Interpreted as ${unit}`, true);
    result.innerHTML = Object.entries(describe(date, tz.value))
      .map(([k, v], i) => `<tr><th>${k === 'zone' ? escapeHtml(tz.value.replace(/_/g, ' ')) : labels[k]}</th><td id="ts-${i}">${escapeHtml(v)}</td><td style="width:1%"><button class="btn small" data-copy="#ts-${i}">Copy</button></td></tr>`)
      .join('');
  } catch (e) {
    setStatus(status, e.message, false);
  }
}

input.addEventListener('input', run);
$('#now').addEventListener('click', () => {
  input.value = String(Math.floor(Date.now() / 1000));
  run();
});
const tick = () => (clock.textContent = `Current Unix time: ${Math.floor(Date.now() / 1000)}`);
tick();
setInterval(tick, 1000);
input.value ||= String(Math.floor(Date.now() / 1000));
run();
