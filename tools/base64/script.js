import { $, persist, setStatus, t } from '/assets/js/ui.js';
import { base64Encode, base64Decode } from '/assets/js/lib/encode.js';

const input = $('#input');
const output = $('#output');
const status = $('#status');
const urlsafe = $('#urlsafe');
persist(input, urlsafe);

function run(fn, label) {
  try {
    output.value = fn();
    setStatus(status, label, true);
  } catch (e) {
    output.value = '';
    setStatus(status, e.name === 'TypeError' ? t('Decoded bytes are not valid UTF-8 text') : t(e.message), false);
  }
}

$('#encode').addEventListener('click', () => run(() => base64Encode(input.value, { urlSafe: urlsafe.checked }), t('Encoded')));
$('#decode').addEventListener('click', () => run(() => base64Decode(input.value), t('Decoded')));
$('#swap').addEventListener('click', () => ([input.value, output.value] = [output.value, input.value]));
$('#clear').addEventListener('click', () => {
  input.value = output.value = '';
  setStatus(status, '');
});
