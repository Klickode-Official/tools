import { $, persist, setStatus, t, lang } from '/assets/js/ui.js';
import { vatBreakdown, formatBaht, bahtText, bahtTextEnglish } from '/assets/js/lib/thai.js';

const amount = $('#amount');
const mode = $('#mode');
const rate = $('#rate');
const wht = $('#wht');
const table = $('#table');
const summary = $('#summary');
const status = $('#status');
persist(amount, mode, rate, wht);

function run() {
  const r = Math.min(100, Math.max(0, Number(rate.value) || 0));
  const w = Number(wht.value);
  const b = amount.value.trim() ? vatBreakdown(amount.value, { rate: r, mode: mode.value, withholding: w }) : null;
  setStatus(status, amount.value.trim() && !b ? t('That isn’t a number. Use digits, with a dot for satang.') : '', false);
  if (!b) {
    table.innerHTML = '';
    summary.textContent = '';
    return;
  }
  const words = lang === 'th' ? bahtText(w ? b.payable : b.total) : bahtTextEnglish(w ? b.payable : b.total);
  const rows = [
    [t('Price before VAT'), formatBaht(b.base)],
    [t('VAT {rate}%', { rate: r }), formatBaht(b.vat)],
    [t('Total including VAT'), formatBaht(b.total), 'strong'],
    ...(w ? [[t('Withholding tax {rate}%', { rate: w }), `−${formatBaht(b.wht)}`], [t('You receive'), formatBaht(b.payable), 'strong']] : []),
    [t('In words'), words, 'words'],
  ];
  table.innerHTML = rows.map(([k, v, cls]) => `<tr${cls ? ` class="${cls}"` : ''}><th>${k}</th><td>${v}</td></tr>`).join('');
  summary.textContent = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
}

for (const el of [amount, rate]) el.addEventListener('input', run);
for (const el of [mode, wht]) el.addEventListener('change', run);
if (!amount.value) amount.value = '10,000';
run();
