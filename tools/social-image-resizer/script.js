// Social Media Image Resizer: every image is drawn on a canvas in this tab. Nothing is uploaded.
import { $, persist, setStatus, download, escapeHtml, debounce } from '/assets/js/ui.js';
import { PRESETS, coverRect, containRect, upscaleFactor, outputFileName } from '/assets/js/lib/social.js';
import { formatBytes } from '/assets/js/lib/images.js';
import { createZip } from '/assets/js/lib/zip.js';

const filesInput = $('#files');
const dropzone = $('#dropzone');
const sources = $('#sources');
const status = $('#status');
const mode = $('#mode');
const fill = $('#fill');
const colour = $('#colour');
const format = $('#format');
const quality = $('#quality');
const qualityVal = $('#quality-val');
const downloadAll = $('#download-all');
const clearBtn = $('#clear');
const checks = PRESETS.map((p) => $(`#p-${p.id}`));

const MAX_PIXELS = 100e6;
const MAX_FILES = 20;
// { id, name, src, w, h, url, focus: {x, y}, outputs: Map(presetId → { blob, url, name }), token, error }
const items = [];
let nextId = 0;

persist(mode, fill, colour, format, quality, ...checks);

// --- decoding -----------------------------------------------------------------------------
async function decode(file) {
  try {
    return await createImageBitmap(file);
  } catch {
    // createImageBitmap rejects some formats (SVG; HEIC outside Safari); <img> handles a few more.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      if (!img.naturalWidth) throw new Error();
      return img;
    } catch {
      throw new Error(/\.hei[cf]$/i.test(file.name) ? 'This browser can’t open HEIC. Try Safari, or export the photo as JPG first.' : 'This file couldn’t be opened as an image.');
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

// --- drawing ------------------------------------------------------------------------------
// Scale a region of the source down in halves before the last step, so big reductions stay sharp.
function drawScaled(ctx, src, sx, sy, sw, sh, dx, dy, dw, dh) {
  let cur = src;
  let cx = sx;
  let cy = sy;
  let cw = sw;
  let ch = sh;
  while (cw / 2 >= dw && ch / 2 >= dh) {
    const step = document.createElement('canvas');
    step.width = Math.round(cw / 2);
    step.height = Math.round(ch / 2);
    const sctx = step.getContext('2d');
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(cur, cx, cy, cw, ch, 0, 0, step.width, step.height);
    cur = step;
    cx = cy = 0;
    cw = step.width;
    ch = step.height;
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(cur, cx, cy, cw, ch, dx, dy, dw, dh);
}

// A soft copy of the photo for behind "fit inside": shrink it to a few pixels, then stretch it
// back up. Works in every browser, unlike canvas filters.
function drawBlurred(ctx, item, w, h) {
  const r = coverRect(item.w, item.h, w, h);
  const tiny = document.createElement('canvas');
  tiny.width = Math.max(1, Math.round(w / 40));
  tiny.height = Math.max(1, Math.round(h / 40));
  const tctx = tiny.getContext('2d');
  tctx.imageSmoothingQuality = 'high';
  drawScaled(tctx, item.src, r.sx, r.sy, r.sw, r.sh, 0, 0, tiny.width, tiny.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(tiny, 0, 0, w, h);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.fillRect(0, 0, w, h);
}

function renderCanvas(item, preset, opts) {
  const canvas = document.createElement('canvas');
  canvas.width = preset.w;
  canvas.height = preset.h;
  const ctx = canvas.getContext('2d');
  if (opts.mode === 'crop') {
    const r = coverRect(item.w, item.h, preset.w, preset.h, item.focus);
    if (opts.mime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, preset.w, preset.h);
    }
    drawScaled(ctx, item.src, r.sx, r.sy, r.sw, r.sh, 0, 0, preset.w, preset.h);
  } else {
    const bg = opts.fill === 'transparent' && opts.mime === 'image/jpeg' ? 'colour' : opts.fill;
    if (bg === 'blur') drawBlurred(ctx, item, preset.w, preset.h);
    else if (bg === 'colour') {
      ctx.fillStyle = opts.colour;
      ctx.fillRect(0, 0, preset.w, preset.h);
    }
    const r = containRect(item.w, item.h, preset.w, preset.h);
    drawScaled(ctx, item.src, 0, 0, item.w, item.h, Math.round(r.dx), Math.round(r.dy), Math.round(r.dw), Math.round(r.dh));
  }
  return canvas;
}

const toBlob = (canvas, mime, q) =>
  new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('The browser couldn’t save this image.'))), mime, q));

const options = () => ({ mode: mode.value, fill: fill.value, colour: colour.value, mime: format.value, q: Number(quality.value) / 100 });
const selected = () => PRESETS.filter((p, i) => checks[i].checked);

// --- rendering the page ------------------------------------------------------------------------
function releaseOutputs(item) {
  for (const o of item.outputs.values()) URL.revokeObjectURL(o.url);
  item.outputs.clear();
}

function sourceHtml(item) {
  if (item.error) {
    return `<section class="sr-source" data-id="${item.id}"><div class="sr-source-head"><strong>${escapeHtml(item.name)}</strong><span class="sr-err">${escapeHtml(item.error)}</span><button class="btn small" data-remove="${item.id}">Remove</button></div></section>`;
  }
  const crop = mode.value === 'crop';
  return `<section class="sr-source" data-id="${item.id}">
  <div class="sr-source-head"><strong>${escapeHtml(item.name)}</strong><span class="sr-dim">${item.w} × ${item.h}</span><button class="btn small" data-remove="${item.id}">Remove</button></div>
  <div class="sr-source-body">
    <div class="sr-focus${crop ? '' : ' off'}" data-focus="${item.id}"${crop ? ' tabindex="0" role="group" aria-label="Focus point. Click, drag or use the arrow keys."' : ''}>
      <img src="${item.url}" alt="" draggable="false">
      <span class="sr-dot" style="left:${item.focus.x * 100}%;top:${item.focus.y * 100}%"></span>
      <p class="sr-hint">${crop ? 'Click or drag to set what stays in frame' : 'The whole photo is kept in “Fit inside”'}</p>
    </div>
    <ul class="sr-results" data-results="${item.id}">${selected().map((p) => resultHtml(item, p)).join('')}</ul>
  </div>
</section>`;
}

function resultHtml(item, p) {
  const out = item.outputs.get(p.id);
  const up = upscaleFactor(item.w, item.h, p.w, p.h, mode.value);
  return `<li class="sr-result" data-preset="${p.id}">
  <div class="sr-thumb">${out ? `<img src="${out.url}" alt="${escapeHtml(p.name)} preview" width="${p.w}" height="${p.h}">` : '<span class="sr-wait"></span>'}</div>
  <div class="sr-meta"><b>${escapeHtml(p.name)}</b><small>${p.w} × ${p.h}${out ? ` · ${formatBytes(out.blob.size)}` : ''}</small>${up > 1.25 ? `<small class="sr-warn">Enlarged ${up.toFixed(1)}×, may look soft</small>` : ''}</div>
  <button class="btn small" data-dl="${item.id}:${p.id}"${out ? '' : ' disabled'} aria-label="Download ${escapeHtml(p.name)}">Save</button>
</li>`;
}

function renderAll() {
  sources.innerHTML = items.map(sourceHtml).join('');
  syncButtons();
}

function updateResult(item, p) {
  const li = sources.querySelector(`[data-results="${item.id}"] [data-preset="${p.id}"]`);
  if (li) li.outerHTML = resultHtml(item, p);
}

function syncButtons() {
  const done = items.reduce((n, i) => n + i.outputs.size, 0);
  downloadAll.disabled = !done;
  downloadAll.textContent = done ? `Download all ${done} (ZIP)` : 'Download all (ZIP)';
  clearBtn.disabled = !items.length;
  $('#fill-wrap').hidden = mode.value !== 'fit';
  colour.hidden = fill.value !== 'colour' && !(fill.value === 'transparent' && format.value === 'image/jpeg');
  $('#quality-wrap').hidden = format.value === 'image/png';
}

// Make every selected size for the given items. A newer run for an item cancels its older one.
async function run(only = items) {
  const opts = options();
  const presets = selected();
  for (const item of only) {
    item.token = (item.token || 0) + 1;
    if (!item.error) releaseOutputs(item);
  }
  renderAll();
  if (!items.length) return setStatus(status, '');
  if (!presets.length) return setStatus(status, 'Tick at least one size.', false);
  let stale = false;
  for (const item of only) {
    if (item.error) continue;
    const token = item.token;
    for (const p of presets) {
      if (token !== item.token || !items.includes(item)) {
        stale = true;
        break;
      }
      try {
        const blob = await toBlob(renderCanvas(item, p, opts), opts.mime, opts.q);
        if (token !== item.token) {
          stale = true;
          break;
        }
        item.outputs.set(p.id, { blob, url: URL.createObjectURL(blob), name: outputFileName(item.name, p, opts.mime) });
        updateResult(item, p);
        syncButtons();
      } catch (e) {
        setStatus(status, e.message, false);
      }
      await new Promise((r) => setTimeout(r)); // let the page breathe between images
    }
  }
  if (stale) return;
  syncButtons();
  const total = items.reduce((n, i) => n + i.outputs.size, 0);
  const bad = items.filter((i) => i.error).length;
  setStatus(status, `${total} image${total === 1 ? '' : 's'} ready${bad ? ` · ${bad} file${bad === 1 ? '' : 's'} couldn’t be opened` : ''}`, true);
}

async function add(files) {
  const list = [...files].filter((f) => f.type.startsWith('image/') || /\.(hei[cf]|avif)$/i.test(f.name)).slice(0, MAX_FILES - items.length);
  if (!list.length) return setStatus(status, items.length >= MAX_FILES ? `That’s the limit of ${MAX_FILES} photos at once.` : 'Those don’t look like images.', false);
  setStatus(status, 'Opening…', true);
  const added = [];
  for (const file of list) {
    const item = { id: nextId++, name: file.name, focus: { x: 0.5, y: 0.5 }, outputs: new Map() };
    try {
      item.src = await decode(file);
      item.w = item.src.naturalWidth || item.src.width;
      item.h = item.src.naturalHeight || item.src.height;
      if (item.w * item.h > MAX_PIXELS) throw new Error(`This photo is ${Math.round((item.w * item.h) / 1e6)} megapixels; the limit is ${MAX_PIXELS / 1e6}.`);
      item.url = URL.createObjectURL(file);
    } catch (e) {
      item.error = e.message;
      item.src?.close?.();
      item.src = null;
    }
    items.push(item);
    added.push(item);
  }
  run(added);
}

// --- focus point ------------------------------------------------------------------------------
let dragging = null;
const rerunOne = debounce((item) => run([item]), 120);
function setFocus(e, box) {
  const item = items.find((i) => String(i.id) === box.dataset.focus);
  if (!item || mode.value !== 'crop') return;
  const img = box.querySelector('img').getBoundingClientRect();
  item.focus = { x: Math.min(1, Math.max(0, (e.clientX - img.left) / img.width)), y: Math.min(1, Math.max(0, (e.clientY - img.top) / img.height)) };
  const dot = box.querySelector('.sr-dot');
  dot.style.left = `${item.focus.x * 100}%`;
  dot.style.top = `${item.focus.y * 100}%`;
  return item;
}
sources.addEventListener('pointerdown', (e) => {
  const box = e.target.closest('[data-focus]');
  if (!box || mode.value !== 'crop') return;
  e.preventDefault();
  dragging = box;
  box.setPointerCapture(e.pointerId);
  setFocus(e, box);
});
sources.addEventListener('pointermove', (e) => dragging && setFocus(e, dragging));
sources.addEventListener('pointerup', (e) => {
  if (!dragging) return;
  const item = setFocus(e, dragging);
  dragging = null;
  if (item) rerunOne(item);
});
// Arrow keys move the focus point too.
sources.addEventListener('keydown', (e) => {
  const box = e.target.closest('[data-focus]');
  const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
  if (!box || !d || mode.value !== 'crop') return;
  e.preventDefault();
  const item = items.find((i) => String(i.id) === box.dataset.focus);
  item.focus = { x: Math.min(1, Math.max(0, item.focus.x + d[0] * 0.05)), y: Math.min(1, Math.max(0, item.focus.y + d[1] * 0.05)) };
  const dot = box.querySelector('.sr-dot');
  dot.style.left = `${item.focus.x * 100}%`;
  dot.style.top = `${item.focus.y * 100}%`;
  rerunOne(item);
});

// --- events -----------------------------------------------------------------------------------
sources.addEventListener('click', (e) => {
  const dl = e.target.closest('[data-dl]')?.dataset.dl;
  if (dl) {
    const [id, pid] = dl.split(':');
    const out = items.find((i) => String(i.id) === id)?.outputs.get(pid);
    if (out) download(out.name, out.blob);
    return;
  }
  const rm = e.target.closest('[data-remove]')?.dataset.remove;
  if (rm !== undefined) {
    const i = items.findIndex((it) => String(it.id) === rm);
    if (i >= 0) {
      releaseOutputs(items[i]);
      if (items[i].url) URL.revokeObjectURL(items[i].url);
      items[i].src?.close?.();
      items.splice(i, 1);
    }
    renderAll();
    if (!items.length) setStatus(status, '');
  }
});

downloadAll.addEventListener('click', async () => {
  const outs = items.flatMap((i) => [...i.outputs.values()]);
  if (!outs.length) return;
  const files = await Promise.all(outs.map(async (o) => ({ name: o.name, data: new Uint8Array(await o.blob.arrayBuffer()) })));
  download(`klickode-social-${outs.length}.zip`, createZip(files), 'application/zip');
});

clearBtn.addEventListener('click', () => {
  for (const it of items) {
    releaseOutputs(it);
    if (it.url) URL.revokeObjectURL(it.url);
    it.src?.close?.();
  }
  items.length = 0;
  renderAll();
  setStatus(status, '');
});

$('#all').addEventListener('click', () => {
  checks.forEach((c) => (c.checked = true));
  run();
});
$('#none').addEventListener('click', () => {
  checks.forEach((c) => (c.checked = false));
  run();
});
const rerun = debounce(() => run(), 200);
for (const c of checks) c.addEventListener('change', rerun);
for (const el of [mode, fill, colour, format]) el.addEventListener('change', () => (syncButtons(), rerun()));
colour.addEventListener('input', rerun);
quality.addEventListener('input', () => {
  qualityVal.textContent = quality.value;
  rerun();
});
qualityVal.textContent = quality.value;

filesInput.addEventListener('change', () => {
  add(filesInput.files);
  filesInput.value = '';
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
addEventListener('drop', (e) => e.dataTransfer?.files.length && add(e.dataTransfer.files));
addEventListener('paste', (e) => {
  const files = [...(e.clipboardData?.files || [])];
  if (files.length) add(files);
});
syncButtons();
