import { $, setStatus, escapeHtml } from '../ui.js';
import { parseTimestamp, describe } from '../lib/time.js';

const input = $('#input');
const status = $('#status');
const result = $('#result');
const clock = $('#clock');

const labels = { seconds: 'Unix seconds', milliseconds: 'Unix milliseconds', iso: 'ISO 8601 (UTC)', utc: 'UTC', local: 'Local time', relative: 'Relative' };

function run() {
  result.innerHTML = '';
  if (!input.value.trim()) return setStatus(status, '');
  try {
    const { date, unit } = parseTimestamp(input.value);
    setStatus(status, `Interpreted as ${unit}`, true);
    result.innerHTML = Object.entries(describe(date))
      .map(([k, v], i) => `<tr><th>${labels[k]}</th><td id="ts-${i}">${escapeHtml(v)}</td><td style="width:1%"><button class="btn small" data-copy="#ts-${i}">Copy</button></td></tr>`)
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
