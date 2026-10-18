import { $, persist, setStatus, download, toast, debounce } from '/assets/js/ui.js';
import { encodeQr } from '/assets/js/lib/qr.js';
import { qrArt, scanWarnings } from '/assets/js/lib/qr-art.js';
import { TYPES, buildPayload } from './payloads.js';
import { svgToPng, loadLogo, withCaption } from '/assets/js/shared/qr-export.js';

const typeInput = $('#qr-type');
const styleInput = $('#qr-style');
const preview = $('#preview');
const status = $('#status');
const meta = $('#meta');
const payloadOut = $('#payload');
const dark = $('#dark');
const light = $('#light');
const transparent = $('#transparent');
const caption = $('#caption');
const ecl = $('#ecl');
const margin = $('#margin');
const size = $('#size');
let logo = null;
let current = null; // { svg, text, qr }

const fieldIds = ['f-url', 'f-text', 'f-ssid', 'f-pass', 'f-sec', 'f-hidden', 'f-wa', 'f-wa-msg', 'f-line', 'f-email', 'f-subject', 'f-body', 'f-tel', 'f-sms', 'f-sms-msg', 'f-c-name', 'f-c-org', 'f-c-title', 'f-c-tel', 'f-c-email', 'f-c-url', 'f-c-adr'];
const val = (id) => {
  const el = document.getElementById(id);
  return el.type === 'checkbox' ? el.checked : el.value;
};

// Wi-Fi passwords are as private as JWTs, so they aren't remembered.
persist(typeInput, styleInput, dark, light, transparent, caption, ecl, margin, size, ...fieldIds.filter((id) => id !== 'f-pass').map((id) => document.getElementById(id)));

// --- type picker ---------------------------------------------------------------------------
const types = $('#types');
types.innerHTML = Object.entries(TYPES)
  .map(([k, t]) => `<button type="button" role="radio" data-v="${k}" aria-checked="false">${t.label}</button>`)
  .join('');
function showType(type) {
  if (!TYPES[type]) type = 'url';
  typeInput.value = type;
  for (const b of types.children) b.setAttribute('aria-checked', String(b.dataset.v === type));
  for (const g of document.querySelectorAll('.qrg-fields [data-type]')) g.hidden = g.dataset.type !== type;
}
types.addEventListener('click', (e) => {
  const b = e.target.closest('[data-v]');
  if (!b) return;
  showType(b.dataset.v);
  render();
  document.querySelector(`.qrg-fields [data-type="${b.dataset.v}"] input, .qrg-fields [data-type="${b.dataset.v}"] textarea`)?.focus();
});

const styleSeg = $('#style');
function showStyle(v) {
  styleInput.value = v;
  for (const b of styleSeg.children) b.setAttribute('aria-pressed', String(b.dataset.v === v));
}
styleSeg.addEventListener('click', (e) => {
  const b = e.target.closest('[data-v]');
  if (!b) return;
  showStyle(b.dataset.v);
  render();
});

function fields() {
  return {
    url: val('f-url'),
    text: val('f-text'),
    ssid: val('f-ssid'),
    password: val('f-pass'),
    security: val('f-sec'),
    hidden: val('f-hidden'),
    phone: { whatsapp: val('f-wa'), phone: val('f-tel'), sms: val('f-sms'), contact: val('f-c-tel') }[typeInput.value],
    message: { whatsapp: val('f-wa-msg'), sms: val('f-sms-msg') }[typeInput.value],
    lineId: val('f-line'),
    email: typeInput.value === 'contact' ? val('f-c-email') : val('f-email'),
    subject: val('f-subject'),
    body: val('f-body'),
    name: val('f-c-name'),
    org: val('f-c-org'),
    title: val('f-c-title'),
    address: val('f-c-adr'),
    ...(typeInput.value === 'contact' && { url: val('f-c-url') }),
  };
}

// --- render ----------------------------------------------------------------------------------
const EMPTY = '<div class="qrg-empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg><span>Fill in the details and your code appears here.</span></div>';

function render() {
  $('#margin-val').textContent = `${margin.value} module${margin.value === '1' ? '' : 's'}`;
  const text = buildPayload(typeInput.value, fields());
  payloadOut.textContent = text;
  const bg = transparent.checked ? null : light.value;
  const warnings = scanWarnings(dark.value, bg ?? '#ffffff');
  if (!text) {
    current = null;
    preview.innerHTML = EMPTY;
    meta.textContent = '';
    setStatus(status, '');
    return;
  }
  try {
    const level = ecl.value === 'auto' ? (logo ? 'H' : 'M') : ecl.value;
    const qr = encodeQr(text, { ecl: level, boostEcl: true });
    const svg = qrArt(qr, { style: styleInput.value, dark: dark.value, light: bg, margin: Number(margin.value), logo, px: 320 });
    current = { qr, text, svg };
    preview.innerHTML = withCaption(svg, caption.value, { dark: dark.value, light: bg, px: 320 });
    preview.classList.toggle('see-through', !bg);
    const chars = [...text].length;
    meta.textContent = `${qr.size} × ${qr.size} modules · level ${qr.ecl} · ${chars.toLocaleString()} character${chars === 1 ? '' : 's'}`;
    if (logo && qr.ecl !== 'H') warnings.push('With a logo, use High error correction so the covered middle can be recovered.');
    if (qr.version > 15) warnings.push('That’s a lot of data, so the code is dense. Print it large, or shorten the content.');
    setStatus(status, warnings.join(' '), !warnings.length);
    if (!warnings.length) setStatus(status, 'Ready. Test it with your phone camera before printing.', true);
  } catch (e) {
    current = null;
    preview.innerHTML = EMPTY;
    setStatus(status, e.message, false);
  }
}
const renderSoon = debounce(render, 60);
document.querySelector('.qrg-form').addEventListener('input', renderSoon);
document.querySelector('.qrg-form').addEventListener('change', renderSoon);

// --- logo ------------------------------------------------------------------------------------
const logoInput = $('#logo-input');
$('#logo-btn').addEventListener('click', () => logoInput.click());
logoInput.addEventListener('change', async () => {
  const file = logoInput.files[0];
  logoInput.value = '';
  if (!file) return;
  try {
    logo = await loadLogo(file);
    $('#logo-remove').hidden = false;
    $('#logo-btn').textContent = 'Change logo';
    render();
  } catch (e) {
    toast(e.message);
  }
});
$('#logo-remove').addEventListener('click', () => {
  logo = null;
  $('#logo-remove').hidden = true;
  $('#logo-btn').textContent = 'Add logo';
  render();
});

// --- export ------------------------------------------------------------------------------------
const fileBase = () => `qr-${typeInput.value}`;
function fullSvg(px) {
  const bg = transparent.checked ? null : light.value;
  const svg = qrArt(current.qr, { style: styleInput.value, dark: dark.value, light: bg, margin: Number(margin.value), logo, px });
  return withCaption(svg, caption.value, { dark: dark.value, light: bg, px });
}
async function pngBlob() {
  const px = Number(size.value);
  const bg = transparent.checked ? null : light.value;
  const svg = qrArt(current.qr, { style: styleInput.value, dark: dark.value, light: bg, margin: Number(margin.value), logo, px });
  return svgToPng(svg, { px, caption: caption.value, dark: dark.value, light: bg });
}
$('#png').addEventListener('click', async () => {
  render(); // in case a keystroke is still waiting on the debounce
  if (!current) return toast('Fill in the details first');
  const blob = await pngBlob();
  download(`${fileBase()}.png`, blob, 'image/png');
});
$('#svg').addEventListener('click', () => {
  render(); // in case a keystroke is still waiting on the debounce
  if (!current) return toast('Fill in the details first');
  download(`${fileBase()}.svg`, fullSvg(Number(size.value)), 'image/svg+xml');
});
$('#copy').addEventListener('click', async () => {
  render(); // in case a keystroke is still waiting on the debounce
  if (!current) return toast('Fill in the details first');
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob() })]);
    toast('Image copied');
  } catch {
    toast('Your browser won’t copy images here. Use Download PNG instead.');
  }
});

showType(typeInput.value);
showStyle(styleInput.value);
render();
