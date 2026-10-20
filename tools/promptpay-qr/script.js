import { $, persist, setStatus, download, copyText, toast, debounce, t } from '/assets/js/ui.js';
import { encodeQr } from '/assets/js/lib/qr.js';
import { qrArt } from '/assets/js/lib/qr-art.js';
import { promptPayPayload, parseTarget, validThaiId } from '/assets/js/lib/promptpay.js';
import { svgToPng } from '/assets/js/shared/qr-export.js';

const target = $('#target');
const amount = $('#amount');
const shop = $('#shop');
const account = $('#account');
const accent = $('#accent');
const mask = $('#mask');
const canvas = $('#card');
const status = $('#status');
const detect = $('#detect');

persist(target, amount, shop, account, accent, mask);

const COLOURS = [
  ['#0f3b62', t('Navy')],
  ['#0f766e', t('Teal')],
  ['#15803d', t('Green')],
  ['#e03131', t('Red')],
  ['#6d28d9', t('Purple')],
  ['#18181b', t('Black')],
];
const colours = $('#colours');
colours.innerHTML = COLOURS.map(([c, name]) => `<button type="button" role="radio" data-c="${c}" aria-label="${name}" title="${name}" style="--c:${c}"></button>`).join('');
const showColour = () => {
  for (const b of colours.children) b.setAttribute('aria-checked', String(b.dataset.c === accent.value));
};
colours.addEventListener('click', (e) => {
  const b = e.target.closest('[data-c]');
  if (!b) return;
  accent.value = b.dataset.c;
  showColour();
  render();
});

// 0066812345678 → 081-234-5678 (or 081-xxx-5678 when hidden)
function displayNumber(t, hide) {
  if (t.type === 'phone') {
    const local = `0${t.value.slice(4)}`;
    return `${local.slice(0, 3)}-${hide ? 'xxx' : local.slice(3, 6)}-${local.slice(6)}`;
  }
  if (t.type === 'id') {
    const v = t.value;
    return hide ? `${v[0]}-xxxx-xxxxx-${v.slice(10, 12)}-${v[12]}` : `${v[0]}-${v.slice(1, 5)}-${v.slice(5, 10)}-${v.slice(10, 12)}-${v[12]}`;
  }
  return hide ? `xxxxxxxxxxx${t.value.slice(-4)}` : t.value;
}

function parseAmount() {
  const raw = amount.value.replace(/[,\s฿]/g, '');
  if (!raw) return { value: undefined };
  if (!/^\d+(\.\d{1,2})?$/.test(raw) || Number(raw) <= 0) return { error: t('Type the amount as a number, like 350 or 99.50') };
  return { value: Number(raw) };
}

const W = 1200;
const H = 1460;
const QR = 760;
let state = null; // { payload, qr, target }
let qrImage = null;
let qrKey = '';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const font = (weight, size) => `${weight} ${size}px Inter, 'Noto Sans Thai', 'Leelawadee UI', Tahoma, system-ui, sans-serif`;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

async function drawCard() {
  const ctx = canvas.getContext('2d');
  const colour = accent.value;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Header band
  ctx.fillStyle = colour;
  ctx.fillRect(0, 0, W, 300);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = font(800, 76);
  ctx.fillText(shop.value.trim() || t('Scan to pay'), W / 2, 150, W - 120);
  ctx.font = font(500, 38);
  ctx.globalAlpha = 0.85;
  ctx.fillText('PromptPay · สแกนจ่ายด้วยแอปธนาคาร', W / 2, 222, W - 120);
  ctx.globalAlpha = 1;

  // QR on a white tile overlapping the band
  const tile = QR + 80;
  const tx = (W - tile) / 2;
  const ty = 250;
  ctx.shadowColor = 'rgba(15, 23, 42, 0.18)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, tx, ty, tile, tile, 36);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  if (qrImage) ctx.drawImage(qrImage, tx + 40, ty + 40, QR, QR);
  else {
    ctx.fillStyle = '#f1f5f9';
    roundRect(ctx, tx + 40, ty + 40, QR, QR, 16);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.font = font(500, 36);
    ctx.fillText(t('Your QR code appears here'), W / 2, ty + 40 + QR / 2);
  }

  // Amount
  let y = ty + tile + 120;
  const amt = parseAmount();
  ctx.fillStyle = '#0f172a';
  if (amt.value) {
    ctx.font = font(800, 104);
    ctx.fillText(`฿${amt.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, W / 2, y);
  } else {
    ctx.font = font(600, 44);
    ctx.fillStyle = '#475569';
    ctx.fillText(t('Type the amount in your banking app'), W / 2, y - 24);
  }

  // Account details
  y += 76;
  if (state?.target) {
    ctx.font = font(500, 38);
    ctx.fillStyle = '#334155';
    const name = account.value.trim();
    ctx.fillText(name ? `${name} · ${displayNumber(state.target, mask.checked)}` : displayNumber(state.target, mask.checked), W / 2, y, W - 120);
  }

  // Footer
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, H - 110, W, 110);
  ctx.fillStyle = '#475569';
  ctx.font = font(500, 30);
  ctx.fillText('Check the account name before you pay · ตรวจสอบชื่อบัญชีก่อนโอน', W / 2, H - 46, W - 80);
}

async function render() {
  const tg = parseTarget(target.value);
  const amt = parseAmount();
  state = null;
  if (!target.value.trim()) {
    detect.textContent = '';
    setStatus(status, '');
  } else if (!tg) {
    detect.textContent = '';
    setStatus(status, t('That doesn’t look like a PromptPay number. Use a 10-digit mobile number, a 13-digit ID or tax number, or a 15-digit e-wallet ID.'), false);
  } else if (amt.error) {
    setStatus(status, amt.error, false);
  } else {
    const label = { phone: t('Mobile number {n}', { n: displayNumber(tg, false) }), id: t('Citizen ID or tax number'), ewallet: t('e-Wallet ID') }[tg.type];
    detect.textContent = `✓ ${label}`;
    const payload = promptPayPayload(target.value, { amount: amt.value });
    state = { payload, target: tg, qr: encodeQr(payload, { ecl: 'M', boostEcl: true }) };
    if (tg.type === 'id' && !validThaiId(tg.value)) setStatus(status, t('The last digit of that ID doesn’t check out. Look for a typo, then test the code with your banking app.'), false);
    else setStatus(status, amt.value ? t('Customers will see this amount filled in.') : t('Customers type the amount themselves.'), true);
  }
  const key = state?.payload ?? '';
  if (key !== qrKey) {
    qrKey = key;
    qrImage = null;
    if (state) {
      const url = URL.createObjectURL(new Blob([qrArt(state.qr, { margin: 0, px: QR })], { type: 'image/svg+xml' }));
      try {
        qrImage = await loadImage(url);
      } finally {
        URL.revokeObjectURL(url);
      }
      if (qrKey !== key) return; // a newer render took over while the image loaded
    }
  }
  await Promise.all([font(800, 76), font(500, 38)].map((f) => document.fonts?.load(f, 'Aก฿'))).catch(() => {});
  drawCard();
}
const renderSoon = debounce(render, 80);
document.querySelector('.ppq-form').addEventListener('input', renderSoon);
document.querySelector('.ppq-form').addEventListener('change', renderSoon);

async function ready() {
  await render();
  if (!state) toast(t('Type a PromptPay number first'));
  return state;
}

$('#png').addEventListener('click', async () => {
  if (!(await ready())) return;
  canvas.toBlob((blob) => download('promptpay-card.png', blob, 'image/png'), 'image/png');
});
$('#qr-png').addEventListener('click', async () => {
  if (!(await ready())) return;
  download('promptpay-qr.png', await svgToPng(qrArt(state.qr, { margin: 4, px: 1024 }), { px: 1024 }), 'image/png');
});
$('#copy').addEventListener('click', async () => {
  if (await ready()) copyText(state.payload);
});

showColour();
render();
