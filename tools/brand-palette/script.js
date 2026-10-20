// Brand colour palette: the image is read on a canvas in this tab. Nothing is uploaded.
import { isHeic, decodeHeic } from '/assets/js/shared/heic.js';
import { $, setStatus, download, copyText, escapeHtml, persist, t } from '/assets/js/ui.js';
import { extractPalette, edgeColour, assignRoles, rgbToHsl, contrast, textColour, toCssVars, toTailwind, toJson } from '/assets/js/lib/palette.js';

const fileInput = $('#file');
const dropzone = $('#dropzone');
const status = $('#status');
const count = $('#count');
const skipBg = $('#skip-bg');
const pngBtn = $('#png');
const result = $('#result');
const exportPanel = $('#export-panel');
const preview = $('#preview');
const swatches = $('#swatches');
const bar = $('#bar');
const code = $('#code');

const SIDE = 200; // pixels are read from a copy this size: plenty for colours, and quick
let pixels = null; // { data, width, height }
let fileName = 'palette';
let colours = [];
let roles = [];
let fmt = 'css';

persist(count, skipBg);

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#ffffff"/><circle cx="200" cy="160" r="110" fill="#1f6f5c"/><path d="M135 175l40-70 30 45 25-30 40 55z" fill="#f2c14e"/><circle cx="250" cy="110" r="16" fill="#f2c14e"/><rect x="90" y="300" width="220" height="34" rx="8" fill="#1d1d24"/><rect x="140" y="346" width="120" height="14" rx="7" fill="#e4572e"/></svg>`;

// --- loading --------------------------------------------------------------------------------
async function loadImage(src) {
  const img = new Image();
  img.src = src;
  await img.decode();
  if (!img.naturalWidth && !img.width) throw new Error();
  return img;
}

async function open(blobOrUrl, name) {
  setStatus(status, t('Reading colours…'), true);
  // iPhone photos (HEIC) are turned into a PNG first by the shared decoder.
  if (typeof blobOrUrl !== 'string' && (await isHeic(blobOrUrl).catch(() => false)) && !(await createImageBitmap(blobOrUrl).then(() => true, () => false))) {
    try {
      const bmp = await decodeHeic(blobOrUrl);
      const c = Object.assign(document.createElement('canvas'), { width: bmp.width, height: bmp.height });
      c.getContext('2d').drawImage(bmp, 0, 0);
      blobOrUrl = await new Promise((r) => c.toBlob(r, 'image/png'));
    } catch {
      // fall through to the normal error below
    }
  }
  const url = typeof blobOrUrl === 'string' ? blobOrUrl : URL.createObjectURL(blobOrUrl);
  try {
    const img = await loadImage(url);
    // SVGs without a size report 0×0 in some browsers; give them one.
    const w = img.naturalWidth || 400;
    const h = img.naturalHeight || 400;
    const scale = Math.min(1, SIDE / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    pixels = { data: ctx.getImageData(0, 0, canvas.width, canvas.height).data, width: canvas.width, height: canvas.height };
    if (preview.dataset.url) URL.revokeObjectURL(preview.dataset.url);
    preview.src = url;
    preview.dataset.url = typeof blobOrUrl === 'string' ? '' : url;
    $('#dims').textContent = `${w} × ${h}`;
    fileName = (name || 'palette').replace(/\.[^.]+$/, '') || 'palette';
    analyse();
  } catch {
    if (typeof blobOrUrl !== 'string') URL.revokeObjectURL(url);
    setStatus(status, t('That file couldn’t be opened as an image. Try a PNG, JPG or SVG.'), false);
  }
}

// --- analysis -------------------------------------------------------------------------------
function analyse() {
  if (!pixels) return;
  const edge = skipBg.checked ? edgeColour(pixels.data, pixels.width, pixels.height) : null;
  colours = extractPalette(pixels.data, { count: Number(count.value), ignore: edge });
  // An image that's all background: fall back to including it.
  if (!colours.length && edge) colours = extractPalette(pixels.data, { count: Number(count.value) });
  if (!colours.length) {
    result.hidden = exportPanel.hidden = true;
    pngBtn.disabled = true;
    return setStatus(status, t('No solid colours found. Is the image fully transparent?'), false);
  }
  roles = assignRoles(colours);
  render();
  const note = edge ? ` · ${t('skipped the {hex} background', { hex: hex(edge) })}` : '';
  setStatus(status, (colours.length === 1 ? t('Found 1 colour') : t('Found {n} colours', { n: colours.length })) + note, true);
}

const hex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
const ratio = (n) => `${(Math.floor(n * 10) / 10).toFixed(1)}:1`;
// Role names stay English in the exported code; on the page they're shown in the page's language.
const roleLabel = (role) => role.replace(/^([a-z]+)(-\d+)?$/, (m, base, n) => t(base) + (n ? ` ${n.slice(1)}` : ''));

function contrastBadge(rgb, against, label) {
  const r = contrast(rgb, against);
  const grade = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? t('Large') : t('Fail');
  return `<span class="bp-cr ${r >= 4.5 ? 'ok' : r >= 3 ? 'mid' : 'bad'}" title="${escapeHtml(t(label === 'White' ? 'White text: {r}' : 'Black text: {r}', { r: ratio(r) }))}"><i style="background:${label === 'White' ? '#fff' : '#111'}"></i>${ratio(r)} <b>${grade}</b></span>`;
}

function render() {
  result.hidden = exportPanel.hidden = false;
  pngBtn.disabled = false;
  bar.innerHTML = colours.map((c) => `<i style="background:${c.hex};flex:${c.share}" title="${c.hex} · ${Math.round(c.share * 100)}%"></i>`).join('');
  swatches.innerHTML = colours
    .map((c, i) => {
      const [h, s, l] = rgbToHsl(c.rgb);
      const values = [c.hex, `rgb(${c.rgb.join(', ')})`, `hsl(${h}, ${s}%, ${l}%)`];
      return `<li class="bp-swatch">
  <span class="bp-chip" style="background:${c.hex};color:${textColour(c.rgb)}">Aa</span>
  <div class="bp-info">
    <div class="bp-top"><b class="bp-role">${escapeHtml(roleLabel(roles[i]))}</b><span class="bp-share">${Math.max(1, Math.round(c.share * 100))}%</span></div>
    <div class="bp-values">${values.map((v, k) => `<button type="button" class="bp-val${k ? '' : ' hex'}" data-val="${escapeHtml(v)}">${escapeHtml(v)}</button>`).join('')}</div>
    <div class="bp-contrast">${contrastBadge(c.rgb, [255, 255, 255], 'White')}${contrastBadge(c.rgb, [17, 17, 17], 'Black')}</div>
  </div>
</li>`;
    })
    .join('');
  renderCode();
}

function renderCode() {
  code.value = fmt === 'css' ? toCssVars(colours, roles) : fmt === 'tailwind' ? toTailwind(colours, roles) : toJson(colours, roles);
}

// --- the PNG strip --------------------------------------------------------------------------------
async function palettePng() {
  const W = 1600;
  const H = 520;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  await document.fonts?.ready;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  const pad = 48;
  const gap = 16;
  const colW = (W - pad * 2 - gap * (colours.length - 1)) / colours.length;
  colours.forEach((c, i) => {
    const x = pad + i * (colW + gap);
    ctx.fillStyle = c.hex;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, pad, colW, 330, 20) : ctx.rect(x, pad, colW, 330);
    ctx.fill();
    if (Math.max(...c.rgb) > 235 && Math.min(...c.rgb) > 225) {
      ctx.strokeStyle = '#e4e4e7';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.fillStyle = textColour(c.rgb);
    ctx.font = "600 22px Inter, 'Noto Sans Thai', system-ui, sans-serif";
    ctx.fillText(roleLabel(roles[i]), x + 22, pad + 44);
    ctx.fillStyle = '#18181b';
    ctx.font = '700 30px Inter, system-ui, sans-serif';
    ctx.fillText(c.hex, x + 4, pad + 330 + 52);
    ctx.fillStyle = '#5f5f69';
    ctx.font = '400 19px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillText(`rgb ${c.rgb.join(' ')}`, x + 4, pad + 330 + 84);
  });
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

// --- events ---------------------------------------------------------------------------------------
swatches.addEventListener('click', (e) => {
  const v = e.target.closest('[data-val]')?.dataset.val;
  if (v) copyText(v);
});
$('.bp-tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('[data-fmt]');
  if (!tab) return;
  fmt = tab.dataset.fmt;
  for (const el of document.querySelectorAll('.bp-tab')) el.setAttribute('aria-selected', String(el === tab));
  renderCode();
});
$('#dl-code').addEventListener('click', () => {
  const [ext, type] = { css: ['css', 'text/css'], tailwind: ['js', 'text/javascript'], json: ['json', 'application/json'] }[fmt];
  download(`${fileName}-palette.${ext}`, code.value, type);
});
pngBtn.addEventListener('click', async () => {
  if (!colours.length) return;
  const blob = await palettePng();
  if (blob) download(`${fileName}-palette.png`, blob, 'image/png');
});
$('#sample').addEventListener('click', () => open(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(SAMPLE)}`, 'sample-logo'));
count.addEventListener('change', analyse);
skipBg.addEventListener('change', analyse);

fileInput.addEventListener('change', () => {
  const f = fileInput.files[0];
  if (f) open(f, f.name);
  fileInput.value = '';
});
for (const ev of ['dragenter', 'dragover']) {
  addEventListener(ev, (e) => {
    if (!e.dataTransfer?.types.includes('Files')) return;
    e.preventDefault();
    dropzone.classList.add('over');
  });
}
for (const ev of ['dragleave', 'drop']) {
  addEventListener(ev, (e) => {
    if (ev === 'drop') e.preventDefault();
    if (ev === 'drop' || !e.relatedTarget) dropzone.classList.remove('over');
  });
}
addEventListener('drop', (e) => {
  const f = [...(e.dataTransfer?.files || [])].find((x) => x.type.startsWith('image/'));
  if (f) open(f, f.name);
});
addEventListener('paste', (e) => {
  const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith('image/'));
  if (f) open(f, f.name);
});
