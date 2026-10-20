import { $, persist, setStatus, download, t } from '/assets/js/ui.js';
import { jsonErrorText } from '/tools/json-formatter/json-error.js';
import { csvToJson, jsonToCsv } from '/assets/js/lib/csv.js';
import { parse } from '/assets/js/lib/json.js';

const toJson = document.body.dataset.direction === 'csv';
const input = $('#input');
const output = $('#output');
const status = $('#status');
const delimiter = $('#delimiter');
const opts = toJson ? [$('#header'), $('#types')] : [$('#flatten')];
persist(input, delimiter, ...opts);

function convert() {
  if (!input.value.trim()) return setStatus(status, '');
  try {
    if (toJson) {
      const data = csvToJson(input.value, { delimiter: delimiter.value, header: opts[0].checked, types: opts[1].checked });
      output.value = JSON.stringify(data, null, 2);
      setStatus(status, data.length === 1 ? t('Converted 1 row') : t('Converted {n} rows', { n: data.length.toLocaleString() }), true);
    } else {
      output.value = jsonToCsv(parse(input.value), { delimiter: delimiter.value, flattenNested: opts[0].checked });
      setStatus(status, t('Converted {n} rows', { n: (output.value.split('\n').length - 1).toLocaleString() }), true);
    }
  } catch (e) {
    output.value = '';
    setStatus(status, jsonErrorText(e), false);
  }
}

$('#convert').addEventListener('click', convert);
for (const el of [delimiter, ...opts]) el.addEventListener('change', convert);
$('#clear').addEventListener('click', () => {
  input.value = output.value = '';
  setStatus(status, '');
});
$('#sample').addEventListener('click', () => {
  input.value = toJson
    ? 'id,name,email,active,score\n1,Ada Lovelace,ada@example.com,true,98.5\n2,"Hopper, Grace",grace@example.com,false,91\n3,"Alan ""AT"" Turing",alan@example.com,true,'
    : JSON.stringify([{ id: 1, name: 'Ada', address: { city: 'London', zip: 'N1' }, tags: ['math'] }, { id: 2, name: 'Grace, RADM', address: { city: 'New York' } }], null, 2);
  convert();
});
$('#file').addEventListener('click', () => $('#file-input').click());
$('#file-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  input.value = await file.text();
  if (toJson && /\.tsv$/i.test(file.name)) delimiter.value = '\t';
  convert();
});
$('#download').addEventListener('click', () => {
  if (output.value) download(toJson ? 'data.json' : 'data.csv', output.value, toJson ? 'application/json' : 'text/csv');
});

if (input.value.trim()) convert();
