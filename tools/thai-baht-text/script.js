import { $, persist, setStatus, t } from '/assets/js/ui.js';
import { toSatang, bahtText, bahtTextEnglish, formatBaht } from '/assets/js/lib/thai.js';

const amount = $('#amount');
const figure = $('#figure');
const thai = $('#thai');
const english = $('#english');
const status = $('#status');
persist(amount);

function run() {
  const raw = amount.value.trim();
  const satang = raw ? toSatang(raw) : null;
  if (raw && satang === null) setStatus(status, t('That isn’t a number. Use digits, with a dot for satang.'), false);
  else if (satang !== null && (satang < 0n ? -satang : satang) >= 10n ** 23n) return setStatus(status, t('That amount is too large to write out.'), false);
  else setStatus(status, '');
  figure.textContent = satang === null ? '' : `฿${formatBaht(satang)}`;
  thai.textContent = satang === null ? '' : bahtText(satang);
  english.textContent = satang === null ? '' : (bahtTextEnglish(satang) ?? '');
}

amount.addEventListener('input', run);
if (!amount.value) amount.value = '1,234.50';
run();
