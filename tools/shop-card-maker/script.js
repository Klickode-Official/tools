import { $, toast, download, debounce } from '/assets/js/ui.js';
import { PLATFORMS, PLATFORM_ORDER } from './platforms.js';
import { renderCard, embedCode, defaults, buildUrl, resolveTheme, logoHtml, shortUrl, CARD_CSS, qrReadable, QR_DEFAULT_COLOR } from './card.js';
import { LOOKS, LOOK_ORDER, SEASONS, SEASON_ORDER } from './looks.js';

const STORE_KEY = 'kt:shop-card';
const COPY_FIELDS = ['badge', 'headline', 'text', 'bullets', 'button', 'cardLabel', 'cardButton', 'stats'];

const preview = $('#preview');
const code = $('#code');

// --- state ----------------------------------------------------------------------------

function freshState() {
  return {
    ...defaults('etsy', 'Your Shop'),
    handles: {},
    message: '',
    shopName: 'yourshop',
    location: 'Bangkok, Thailand',
    rating: '4.9',
    reviews: '65',
    avatar: '',
    products: [],
    customLogo: '',
    copies: {},
    layout: 'banner',
    theme: 'brand',
    headingFont: 'sans',
    accent: '',
    background: '',
    radius: 20,
    productCount: 4,
    shadow: true,
    look: 'classic',
    season: 'none',
    seasonBadge: '',
    qr: false,
    qrPos: 'cta',
    qrColor: QR_DEFAULT_COLOR,
    qrCaption: 'Scan to visit',
    show: { badge: true, bullets: true, note: true, card: true, rating: true, stats: true },
  };
}

let state = freshState();
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  if (saved && PLATFORMS[saved.platform]) state = { ...state, ...saved, show: { ...state.show, ...saved.show } };
} catch {
  // Nothing saved, or storage is blocked: start fresh.
}

function saveNow() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Probably over the storage quota because of pictures; the card still works, it just won't be remembered.
  }
}
const save = debounce(saveNow, 400);
// A refresh straight after a change would otherwise beat the debounce.
addEventListener('pagehide', saveNow);

const currentUrl = () => buildUrl(state.platform, state.handles[state.platform] || '', state.message);

// --- rendering --------------------------------------------------------------------------

const cardStyle = document.createElement('style');
cardStyle.textContent = CARD_CSS;
document.head.append(cardStyle);

function render() {
  const url = currentUrl();
  const full = { ...state, url };
  preview.innerHTML = renderCard(full);
  preview.dataset.layout = state.layout;
  code.value = embedCode(full);
  const kb = new Blob([code.value]).size / 1024;
  $('#code-size').textContent = `The code is ${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB${kb > 60 ? '. Pictures make up most of that; remove some if your site limits HTML length.' : '.'}`;
  $('#qr-note').textContent = qrNote(url);
  $('#url-out').innerHTML = url
    ? `Buttons link to <a href="${url.replace(/"/g, '&quot;')}" target="_blank" rel="noopener">${shortUrl(url).replace(/</g, '&lt;')}</a>`
    : 'Add your link above so the buttons go somewhere.';
  save();
}

function qrNote(url) {
  if (!state.qr) return 'The QR code uses the same link as your buttons.';
  if (!url) return 'Add your shop link under “Your business” and the QR code will appear.';
  if (state.layout === 'button') return 'Buttons are too small for a QR code. Switch to Banner or Card to show it.';
  if (state.qrPos === 'card' && state.layout === 'banner' && state.show.card === false) return 'The shop card is hidden, so the QR code sits next to the button instead.';
  if (!qrReadable(state.qrColor)) return 'That colour is too pale for phones to scan reliably, so the code is drawn in black. Pick a darker colour.';
  return 'Scan it with your phone to check it opens the right page, especially before you print.';
}

function renderLooks() {
  $('#look').innerHTML = LOOK_ORDER.map((id) => `<button type="button" data-v="${id}" aria-pressed="${id === state.look}"><span class="look-swatch look-${id}" aria-hidden="true"><i></i><b></b></span>${LOOKS[id].name}</button>`).join('');
  $('#season').innerHTML = SEASON_ORDER.map((id) => {
    const s = SEASONS[id];
    const bg = s.theme ? s.theme.bg : 'repeating-linear-gradient(135deg, var(--mist) 0 6px, var(--surface) 6px 12px)';
    const dot = s.tag ? `<i style="background:${s.tag.bg}"></i>` : '';
    return `<button type="button" data-v="${id}" aria-pressed="${id === state.season}"><span class="season-swatch" style="background:${bg}" aria-hidden="true">${dot}</span>${s.name}</button>`;
  }).join('');
}

function renderPlatforms() {
  $('#platforms').innerHTML = PLATFORM_ORDER.map((id) => {
    const p = PLATFORMS[id];
    const t = resolveTheme({ platform: id, theme: 'brand' });
    const logo = p.chip
      ? `<span class="pf-chip" style="background:${p.chip.bg};color:${p.chip.color}">${p.chip.letter}</span>`
      : logoHtml({ platform: id }, { ...t, dark: false, logoColor: t.dark ? '#000000' : t.logoColor }, p.wideLogo ? 13 : 22);
    return `<button type="button" role="radio" data-p="${id}" aria-checked="${id === state.platform}"><span class="pf-logo${p.wideLogo ? ' wide' : ''}">${logo}</span><span>${p.name}</span></button>`;
  }).join('');
}

// Push state into every form field.
function fillForm() {
  const p = PLATFORMS[state.platform];
  for (const el of document.querySelectorAll('[data-k]')) {
    const v = state[el.dataset.k];
    if (el.type === 'range' || el.tagName === 'SELECT') el.value = String(v);
    else el.value = v ?? '';
  }
  $('#f-handle').value = state.handles[state.platform] || '';
  $('#f-handle').placeholder = p.handle.placeholder;
  $('#handle-label').textContent = p.handle.label;
  $('#msg-field').hidden = !p.handle.message;
  for (const el of document.querySelectorAll('[data-stat]')) {
    const [row, col] = el.dataset.stat.split('.').map(Number);
    el.value = state.stats[row]?.[col] ?? '';
  }
  for (const el of document.querySelectorAll('[data-show]')) el.checked = state.show[el.dataset.show] !== false;
  $('[data-shadow]').checked = state.shadow !== false;
  $('#radius-val').textContent = state.radius;
  const t = resolveTheme({ ...state, accent: '', background: '' });
  $('#f-accent').value = state.accent || (/^#[0-9a-f]{6}$/i.test(t.button) ? t.button : '#e03131');
  $('#f-bg').value = /^#[0-9a-f]{6}$/i.test(state.background) ? state.background : '#ffffff';
  $('#logo-reset').hidden = !state.customLogo;
  for (const seg of ['layout', 'theme', 'headingFont', 'look', 'season', 'qrPos']) setSeg(seg, state[seg]);
  $('#f-qr').checked = !!state.qr;
  $('#f-qr-color').value = /^#[0-9a-f]{6}$/i.test(state.qrColor) ? state.qrColor : QR_DEFAULT_COLOR;
  $('#season-badge-field').hidden = !SEASONS[state.season]?.theme;
  for (const slot of document.querySelectorAll('[data-img]')) {
    const src = getImg(slot.dataset.img);
    slot.style.backgroundImage = src ? `url("${src}")` : '';
    slot.classList.toggle('filled', !!src);
  }
}

function setSeg(id, value) {
  for (const b of document.querySelectorAll(`#${id} [data-v]`)) b.setAttribute('aria-pressed', String(b.dataset.v === value));
}

// --- platform switching -------------------------------------------------------------

const pickCopy = (s) => Object.fromEntries(COPY_FIELDS.map((k) => [k, structuredClone(s[k])]));

function switchPlatform(id) {
  if (id === state.platform) return;
  state.copies[state.platform] = pickCopy(state);
  Object.assign(state, state.copies[id] || pickCopy(defaults(id, state.name)), { platform: id, customLogo: '' });
  renderPlatforms();
  fillForm();
  render();
}

// Changing the business name rewrites any text that's still the untouched default.
function renameBusiness(oldName, newName) {
  const before = defaults(state.platform, oldName);
  const after = defaults(state.platform, newName);
  for (const k of COPY_FIELDS) {
    if (k !== 'stats' && state[k] === before[k]) state[k] = after[k];
  }
  state.copies = {};
}

// --- pictures --------------------------------------------------------------------------

function getImg(key) {
  const [k, i] = key.split('.');
  return i === undefined ? state[k] : state[k]?.[Number(i)];
}
function setImg(key, value) {
  const [k, i] = key.split('.');
  if (i === undefined) state[k] = value;
  else {
    state[k] = [...(state[k] || [])];
    state[k][Number(i)] = value;
  }
}

// Shrink to a small square-ish WebP so the embed code stays light.
async function shrink(file, max, keepAlpha = false) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(bmp.width * scale));
  c.height = Math.max(1, Math.round(bmp.height * scale));
  const ctx = c.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close();
  const webp = c.toDataURL('image/webp', 0.82);
  return webp.startsWith('data:image/webp') ? webp : c.toDataURL(keepAlpha ? 'image/png' : 'image/jpeg', 0.85);
}

let pickingFor = null;
const picInput = $('#pic-input');
document.addEventListener('click', (e) => {
  const slot = e.target.closest('[data-img]');
  if (slot) {
    if (e.target.closest('.pic-remove')) {
      setImg(slot.dataset.img, '');
      fillForm();
      render();
      return;
    }
    pickingFor = slot.dataset.img;
    picInput.click();
  }
});
$('#logo-upload').addEventListener('click', () => {
  pickingFor = 'customLogo';
  picInput.click();
});
$('#logo-reset').addEventListener('click', () => {
  state.customLogo = '';
  fillForm();
  render();
});
picInput.addEventListener('change', async () => {
  const file = picInput.files[0];
  picInput.value = '';
  if (!file || !pickingFor) return;
  try {
    const max = pickingFor === 'customLogo' ? 96 : pickingFor === 'avatar' ? 200 : 320;
    setImg(pickingFor, await shrink(file, max, pickingFor === 'customLogo'));
    fillForm();
    render();
  } catch {
    toast('That file couldn’t be opened as an image');
  }
});
// Small × on filled slots.
for (const slot of document.querySelectorAll('[data-img]')) {
  slot.insertAdjacentHTML('beforeend', '<button type="button" class="pic-remove" aria-label="Remove picture">×</button>');
  slot.tabIndex = 0;
  slot.setAttribute('role', 'button');
  slot.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), slot.click()));
}

// --- form wiring -------------------------------------------------------------------------

$('#platforms').addEventListener('click', (e) => {
  const b = e.target.closest('[data-p]');
  if (b) switchPlatform(b.dataset.p);
});

for (const el of document.querySelectorAll('[data-k]')) {
  el.addEventListener('input', () => {
    const k = el.dataset.k;
    const v = el.type === 'range' || k === 'productCount' ? Number(el.value) : el.value;
    if (k === 'name') renameBusiness(state.name, v);
    state[k] = v;
    if (k === 'radius') $('#radius-val').textContent = v;
    if (k === 'name') {
      // Keep the visible word fields in sync with any rewritten defaults.
      for (const f of document.querySelectorAll('[data-k]')) if (f !== el && COPY_FIELDS.includes(f.dataset.k)) f.value = state[f.dataset.k];
    }
    render();
  });
}
$('#f-handle').addEventListener('input', (e) => {
  state.handles = { ...state.handles, [state.platform]: e.target.value.trim() };
  render();
});
for (const el of document.querySelectorAll('[data-stat]')) {
  el.addEventListener('input', () => {
    const [row, col] = el.dataset.stat.split('.').map(Number);
    state.stats = state.stats.map((r) => [...r]);
    while (state.stats.length <= row) state.stats.push(['', '']);
    state.stats[row][col] = el.value;
    render();
  });
}
for (const el of document.querySelectorAll('[data-show]')) {
  el.addEventListener('change', () => {
    state.show = { ...state.show, [el.dataset.show]: el.checked };
    render();
  });
}
$('[data-shadow]').addEventListener('change', (e) => {
  state.shadow = e.target.checked;
  render();
});
for (const id of ['layout', 'theme', 'headingFont']) {
  $(`#${id}`).addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    state[id] = b.dataset.v;
    setSeg(id, b.dataset.v);
    if (id === 'theme') fillForm();
    render();
  });
}
$('#look').addEventListener('click', (e) => {
  const b = e.target.closest('[data-v]');
  if (!b) return;
  state.look = b.dataset.v;
  Object.assign(state, LOOKS[state.look].settings);
  fillForm();
  render();
});
$('#season').addEventListener('click', (e) => {
  const b = e.target.closest('[data-v]');
  if (!b) return;
  const before = SEASONS[state.season]?.badge || '';
  // Swap the sticker text too, unless it's been reworded.
  if (!state.seasonBadge || state.seasonBadge === before) state.seasonBadge = SEASONS[b.dataset.v].badge || '';
  state.season = b.dataset.v;
  fillForm();
  render();
});
$('#qrPos').addEventListener('click', (e) => {
  const b = e.target.closest('[data-v]');
  if (!b) return;
  state.qrPos = b.dataset.v;
  setSeg('qrPos', state.qrPos);
  render();
});
$('#f-qr').addEventListener('change', (e) => {
  state.qr = e.target.checked;
  render();
});
$('#f-qr-color').addEventListener('input', (e) => {
  state.qrColor = e.target.value;
  render();
});
$('#qr-color-reset').addEventListener('click', () => {
  state.qrColor = QR_DEFAULT_COLOR;
  fillForm();
  render();
});
$('#device').addEventListener('click', (e) => {
  const b = e.target.closest('[data-v]');
  if (!b) return;
  setSeg('device', b.dataset.v);
  preview.classList.toggle('mobile', b.dataset.v === 'mobile');
});
$('#f-accent').addEventListener('input', (e) => {
  state.accent = e.target.value;
  render();
});
$('#accent-reset').addEventListener('click', () => {
  state.accent = '';
  fillForm();
  render();
});
$('#f-bg').addEventListener('input', (e) => {
  state.background = e.target.value;
  render();
});
$('#bg-reset').addEventListener('click', () => {
  state.background = '';
  fillForm();
  render();
});
$('#reset-words').addEventListener('click', () => {
  Object.assign(state, pickCopy(defaults(state.platform, state.name)));
  delete state.copies[state.platform];
  fillForm();
  render();
  toast('Words reset');
});

// Tabs
const tabs = [...document.querySelectorAll('[data-tab]')];
for (const tab of tabs) {
  tab.addEventListener('click', () => {
    for (const t of tabs) t.setAttribute('aria-selected', String(t === tab));
    for (const panel of document.querySelectorAll('[data-panel]')) panel.hidden = panel.dataset.panel !== tab.dataset.tab;
  });
}

// --- export -------------------------------------------------------------------------------

$('#dl-html').addEventListener('click', () => {
  const doc = `<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${state.name} on ${PLATFORMS[state.platform].name}</title></head>\n<body style="margin:0;padding:24px;background:#fff">\n${code.value}</body>\n</html>\n`;
  download(`shop-card-${state.platform}.html`, doc, 'text/html');
});

let fontCssPromise;
// The PNG is drawn from an SVG snapshot, which can't load fonts from the page, so embed them.
function fontCss() {
  fontCssPromise ||= Promise.all(
    [
      ['Inter', '100 900', '/assets/fonts/inter-latin-wght-normal.woff2'],
      ['JetBrains Mono', '100 800', '/assets/fonts/jetbrains-mono-latin-wght-normal.woff2'],
      ['Noto Sans Thai', '100 900', '/assets/fonts/noto-sans-thai-thai-wght-normal.woff2'],
    ].map(async ([family, weight, href]) => {
      const blob = await (await fetch(href)).blob();
      const data = await new Promise((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.readAsDataURL(blob);
      });
      return `@font-face{font-family:'${family}';font-weight:${weight};src:url(${data}) format('woff2')}`;
    }),
  ).then((rules) => rules.join(''));
  return fontCssPromise;
}

async function exportPng() {
  const btn = $('#dl-png');
  btn.disabled = true;
  try {
    const size = $('#png-size').value;
    const behind = $('#png-bg').value;
    const [W0, H0] = size === 'auto' ? [0, 0] : size.split('x').map(Number);
    const tall = H0 > W0 * 1.02;
    const stack = state.layout === 'banner' && size !== 'auto' && (tall || W0 === H0);
    // Tall formats get a narrower stacked layout, so it grows to fill the frame instead of floating in it.
    const stackWidth = H0 / W0 > 1.6 ? 540 : H0 / W0 > 1.15 ? 620 : 700;
    const cardWidth = state.layout === 'banner' ? (stack ? stackWidth : 1100) : state.layout === 'card' ? 440 : null;
    const html = renderCard({ ...state, url: currentUrl(), stack }, { forExport: true });

    // Measure the card at its natural size off-screen.
    const probe = document.createElement('div');
    probe.style.cssText = `position:fixed;left:-20000px;top:0;${cardWidth ? `width:${cardWidth}px` : 'display:inline-block'}`;
    probe.innerHTML = html;
    document.body.append(probe);
    await document.fonts.ready;
    const rect = probe.getBoundingClientRect();
    probe.remove();
    const cw = Math.ceil(rect.width);
    const ch = Math.ceil(rect.height);

    let W = W0;
    let H = H0;
    let scale = 1;
    let ratio = 1;
    if (size === 'auto') {
      const pad = state.shadow !== false ? 40 : 4;
      W = cw + pad * 2;
      H = ch + pad * 2;
      ratio = 2;
    } else {
      const pad = Math.round(W * 0.07);
      scale = Math.min((W - pad * 2) / cw, (H - pad * 2) / ch, 2.4);
    }
    const t = resolveTheme(state);
    const background = behind === 'transparent' ? 'transparent' : behind === 'white' ? '#ffffff' : t.dark ? '#0b0b0f' : t.bg;

    const root = document.createElement('div');
    root.innerHTML = `<style>${await fontCss()}${CARD_CSS}</style><div style="width:${W}px;height:${H}px;display:flex;align-items:center;justify-content:center;background:${background}"><div style="flex:none;${cardWidth ? `width:${cw}px` : ''};transform:scale(${scale})">${html}</div></div>`;
    const xhtml = new XMLSerializer().serializeToString(root);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject x="0" y="0" width="${W}" height="${H}">${xhtml}</foreignObject></svg>`;

    const img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(W * ratio);
    canvas.height = Math.round(H * ratio);
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.drawImage(img, 0, 0, W, H);
    const blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('empty'))), 'image/png'));
    download(`shop-card-${state.platform}${size === 'auto' ? '' : `-${size}`}.png`, blob, 'image/png');
  } catch {
    toast('Your browser couldn’t draw the image. Try Chrome or Edge, or take a screenshot of the preview.');
  } finally {
    btn.disabled = false;
  }
}
$('#dl-png').addEventListener('click', exportPng);

renderPlatforms();
renderLooks();
fillForm();
render();
