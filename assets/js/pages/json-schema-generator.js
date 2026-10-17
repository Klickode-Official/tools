import { $, persist, setStatus, download } from '../ui.js';
import { parse } from '../lib/json.js';
import { generateSchema } from '../lib/schema.js';

const input = $('#input');
const output = $('#output');
const status = $('#status');
const required = $('#required');
const strict = $('#strict');
const formats = $('#formats');
persist(input, required, strict, formats);

function generate() {
  if (!input.value.trim()) return setStatus(status, '');
  try {
    const schema = generateSchema(parse(input.value), { required: required.checked, strict: strict.checked, formats: formats.checked });
    output.value = JSON.stringify(schema, null, 2);
    setStatus(status, 'Schema generated', true);
  } catch (e) {
    output.value = '';
    setStatus(status, e.message, false);
  }
}

$('#generate').addEventListener('click', generate);
for (const el of [required, strict, formats]) el.addEventListener('change', generate);
$('#clear').addEventListener('click', () => {
  input.value = output.value = '';
  setStatus(status, '');
});
$('#sample').addEventListener('click', () => {
  input.value = JSON.stringify(
    {
      id: '3f2b8c1e-9a4d-4e7b-8c2a-1d5e6f7a8b9c',
      email: 'ada@example.com',
      created: '2025-06-01T12:00:00Z',
      age: 36,
      orders: [{ sku: 'A1', qty: 2, price: 9.99 }, { sku: 'B2', qty: 1, price: 20, gift: true }],
    },
    null,
    2,
  );
  generate();
});
$('#download').addEventListener('click', () => output.value && download('schema.json', output.value, 'application/schema+json'));

if (input.value.trim()) generate();
