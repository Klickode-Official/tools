import { $, persist, setStatus, t } from '/assets/js/ui.js';
import { uuidv4, uuidv7, inspectUuid } from '/assets/js/lib/uuid.js';

const version = $('#version');
const count = $('#count');
const upper = $('#upper');
const nodash = $('#nodash');
const output = $('#output');
const check = $('#check');
const status = $('#status');
persist(version, count, upper, nodash);

function generate() {
  const n = Math.min(1000, Math.max(1, Number.parseInt(count.value, 10) || 1));
  const make = version.value === '7' ? uuidv7 : uuidv4;
  output.value = Array.from({ length: n }, () => {
    let id = make();
    if (nodash.checked) id = id.replace(/-/g, '');
    return upper.checked ? id.toUpperCase() : id;
  }).join('\n');
}

$('#generate').addEventListener('click', generate);
for (const el of [version, upper, nodash]) el.addEventListener('change', generate);

check.addEventListener('input', () => {
  if (!check.value.trim()) return setStatus(status, '');
  const info = inspectUuid(check.value);
  if (!info.valid) return setStatus(status, t('Not a valid UUID (expected 8-4-4-4-12 hex digits)'), false);
  if (info.version === 'nil') return setStatus(status, t('Valid nil UUID'), true);
  const variant = info.variant === 'other' ? t('other') : info.variant;
  setStatus(status, t('Valid UUID · version {v} · {variant} variant', { v: info.version, variant }) + (info.timestamp ? t(' · created {time}', { time: info.timestamp }) : ''), true);
});

generate();
