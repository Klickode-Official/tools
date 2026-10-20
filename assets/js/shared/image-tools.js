// Shared by the image converter, compressor, resizer and EXIF remover pages.
// Everything happens on a canvas in this tab; files are never uploaded.
import { $, persist, setStatus, download, escapeHtml, debounce, t } from '/assets/js/ui.js';
import { FORMATS, targetSize, outputName, formatBytes, searchQuality } from '/assets/js/lib/images.js';
import { inspectMetadata, describeMetadata, stripMetadata } from '/assets/js/lib/metadata.js';
import { createZip } from '/assets/js/lib/zip.js';
import { isHeic, decodeHeic } from '/assets/js/shared/heic.js';

const mode = document.body.dataset.mode; // convert | compress | resize | exif
const filesInput = $('#files');
const dropzone = $('#dropzone');
const list = $('#results');
const status = $('#status');
const format = $('#format');
const quality = $('#quality');
const qualityVal = $('#quality-val');
const targetKb = $('#target-kb');
const resizeMode = $('#resize-mode');
const widthIn = $('#width');
const heightIn = $('#height');
const percentIn = $('#percent');
const bg = $('#bg');
const downloadAll = $('#download-all');
const clearBtn = $('#clear');

const MAX_PIXELS = 100e6;
const items = []; // { id, file, bytes, meta, out?: { blob, name, width, height, note }, error?, thumb }
let nextId = 0;
let runToken = 0;

persist(...[format, quality, targetKb, resizeMode, widthIn, heightIn, percentIn, bg].filter(Boolean));

// --- capability detection -------------------------------------------------

const supported = {};
async function detectEncoders() {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  for (const mime of Object.keys(FORMATS)) {
    const blob = await new Promise((r) => c.toBlob(r, mime, 0.8));
    supported[mime] = blob?.type === mime;
  }
  if (format) {
    for (const opt of [...format.options]) {
      if (opt.value !== 'keep' && !supported[opt.value]) {
        opt.disabled = true;
        opt.textContent += t(' (not supported by this browser)');
      }
    }
    if (format.selectedOptions[0]?.disabled) format.value = supported['image/webp'] ? 'image/webp' : 'image/png';
  }
}

// --- decode / encode ------------------------------------------------------

async function decode(file) {
  try {
    return await createImageBitmap(file);
  } catch {
    // Fallback for formats createImageBitmap rejects (e.g. SVG); <img> can also decode HEIC in Safari.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      if (!img.naturalWidth) throw new Error();
      return img;
    } catch {
      // Not something the browser can open itself. iPhone photos (HEIC) go to our own decoder.
      if (await isHeic(file)) {
        try {
          return await decodeHeic(file);
        } catch {
          throw new Error(t('This HEIC photo couldn’t be decoded. Try exporting it as JPG from the Photos app.'));
        }
      }
      throw new Error(t('This file couldn’t be decoded as an image.'));
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

function sourceSize(src) {
  return { w: src.naturalWidth || src.width, h: src.naturalHeight || src.height };
}

function draw(src, width, height, fill) {
  const { w, h } = sourceSize(src);
  // Halve repeatedly before the final draw: one big downscale step looks aliased.
  let cur = src;
  let cw = w;
  let ch = h;
  while (cw / 2 >= width && ch / 2 >= height) {
    const step = document.createElement('canvas');
    step.width = cw = Math.round(cw / 2);
    step.height = ch = Math.round(ch / 2);
    const sctx = step.getContext('2d');
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(cur, 0, 0, cw, ch);
    cur = step;
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(cur, 0, 0, width, height);
  return canvas;
}

const toBlob = (canvas, mime, q) =>
  new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error(t('The browser could not encode this image (it may be too large).')))), mime, q));

function chooseMime(file) {
  const pick = format?.value ?? 'keep';
  if (pick !== 'keep') return pick;
  if (supported[file.type]) return file.type;
  return /heic|heif/i.test(file.type + file.name) ? 'image/jpeg' : 'image/png';
}

async function process(item) {
  const { file } = item;
  const sameFormatName = (mime, suffix) => outputName(file.name, mime, suffix);

  if (mode === 'exif') {
    const stripped = stripMetadata(item.bytes);
    if (stripped) {
      const mime = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[item.meta.format];
      return { blob: new Blob([stripped], { type: mime }), name: sameFormatName(mime, '-clean'), ...(await dims(item)), note: t('Removed losslessly; pixels untouched') };
    }
  }

  const src = await decode(file);
  try {
    const { w, h } = sourceSize(src);
    if (w * h > MAX_PIXELS) throw new Error(t('Image is {n} megapixels; the limit is {max} MP.', { n: Math.round((w * h) / 1e6), max: MAX_PIXELS / 1e6 }));
    const resize = resizeMode
      ? { mode: resizeMode.value, width: Number(widthIn.value) || 0, height: Number(heightIn.value) || 0, percent: Number(percentIn.value) || 100 }
      : { mode: 'none' };
    const size = targetSize(w, h, resize);
    const mime = chooseMime(file);
    const fill = FORMATS[mime].alpha ? null : bg?.value || '#ffffff';
    const canvas = draw(src, size.width, size.height, fill);
    const q = quality ? Number(quality.value) / 100 : 0.92;
    const name = sameFormatName(mime, mode === 'exif' ? '-clean' : mode === 'resize' ? `-${size.width}x${size.height}` : '');
    let blob;
    let note = mode === 'exif' ? t('Re-encoded to apply rotation; metadata removed') : '';

    const target = (Number(targetKb?.value) || 0) * 1024;
    if (target && FORMATS[mime].lossy) {
      const r = await searchQuality(async (qq) => ({ size: (await toBlob(canvas, mime, qq)).size }), target);
      blob = await toBlob(canvas, mime, r.quality);
      note = r.fits ? t('Quality {q} to fit {size}', { q: Math.round(r.quality * 100), size: formatBytes(target) }) : t('Couldn’t reach {size}; try a smaller size', { size: formatBytes(target) });
    } else {
      blob = await toBlob(canvas, mime, q);
      if (target) note = t('{format} is lossless, so a target size can’t apply; choose JPG or WebP', { format: FORMATS[mime].label });
    }

    // Compressing can make an already-optimised file bigger; never hand back a worse file.
    if (mode === 'compress' && blob.size >= file.size && mime === file.type && size.width === w && size.height === h) {
      return { blob: file, name: file.name, width: w, height: h, note: t('Already well compressed; original kept') };
    }
    return { blob, name, width: size.width, height: size.height, note };
  } finally {
    src.close?.();
  }
}

async function dims(item) {
  const src = await decode(item.file);
  const { w, h } = sourceSize(src);
  src.close?.();
  return { width: w, height: h };
}

// --- UI -------------------------------------------------------------------

function render() {
  list.innerHTML = items
    .map((it) => {
      const metaList = describeMetadata(it.meta).map((m) => t(m));
      const metaHtml = metaList.length
        ? `<span class="badge ${it.meta.gps ? 'removed' : 'changed'}">${escapeHtml(t(mode === 'exif' && it.out ? 'removed: {list}' : 'contains: {list}', { list: metaList.join(', ') }))}</span>`
        : mode === 'exif'
          ? `<span class="badge added">${t('no metadata found')}</span>`
          : '';
      let result = `<span class="check">${t('Processing…')}</span>`;
      if (it.error) result = `<span class="err-text">${escapeHtml(it.error)}</span>`;
      else if (it.out) {
        const delta = it.out.blob.size - it.file.size;
        const pct = Math.round((100 * delta) / it.file.size);
        result = `${it.out.width}×${it.out.height} · ${formatBytes(it.out.blob.size)} <span class="${delta <= 0 ? 'ok-text' : 'err-text'}">(${delta <= 0 ? '' : '+'}${pct}%)</span>${it.out.note ? `<br><span class="check">${escapeHtml(it.out.note)}</span>` : ''}`;
      }
      return `<li class="file-row">
        <img src="${it.thumb}" alt="" class="thumb" loading="lazy">
        <div class="file-info"><strong>${escapeHtml(it.file.name)}</strong><span class="check">${formatBytes(it.file.size)}</span>${metaHtml}<div>${result}</div></div>
        <button class="btn small" data-dl="${it.id}" ${it.out ? '' : 'disabled'}>${t('Download')}</button>
      </li>`;
    })
    .join('');
  const done = items.filter((i) => i.out);
  downloadAll.disabled = done.length < 2;
  clearBtn.disabled = !items.length;
  if (!items.length) return setStatus(status, '');
  const before = done.reduce((n, i) => n + i.file.size, 0);
  const after = done.reduce((n, i) => n + i.out.blob.size, 0);
  const errors = items.filter((i) => i.error).length;
  const pending = items.length - done.length - errors;
  setStatus(
    status,
    pending
      ? t('Processing {i} of {n}…', { i: done.length + errors + 1, n: items.length })
      : `${done.length === 1 ? t('1 file ready') : t('{n} files ready', { n: done.length })} · ${formatBytes(before)} → ${formatBytes(after)}${before ? ` (${after <= before ? '−' : '+'}${Math.abs(Math.round((100 * (after - before)) / before))}%)` : ''}${errors ? ` · ${t('{n} failed', { n: errors })}` : ''}`,
    !errors,
  );
}

async function runAll() {
  const token = ++runToken;
  for (const it of items) {
    it.out = it.error = undefined;
  }
  render();
  for (const it of items) {
    try {
      const out = await process(it);
      if (token !== runToken) return; // options changed mid-run; a newer run owns the list
      it.out = out;
      // Browsers that can't show HEIC can't show its thumbnail either, so use the converted copy.
      if (it.meta.format === 'heic' && !it.heicThumb && /^image\/(jpeg|png|webp)$/.test(out.blob.type)) {
        URL.revokeObjectURL(it.thumb);
        it.thumb = URL.createObjectURL(out.blob);
        it.heicThumb = true;
      }
    } catch (e) {
      if (token !== runToken) return;
      it.error = e.message;
    }
    render();
  }
}

async function add(files) {
  const images = [...files].filter((f) => f.type.startsWith('image/') || /\.(heic|heif|avif)$/i.test(f.name));
  if (!images.length) return setStatus(status, t('No image files found in that selection.'), false);
  for (const file of images) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    items.push({ id: nextId++, file, bytes, meta: inspectMetadata(bytes), thumb: URL.createObjectURL(file) });
  }
  runAll();
}

filesInput.addEventListener('change', () => {
  add(filesInput.files);
  filesInput.value = '';
});
for (const ev of ['dragenter', 'dragover']) {
  addEventListener(ev, (e) => {
    e.preventDefault();
    dropzone.classList.add('over');
  });
}
for (const ev of ['dragleave', 'drop']) {
  addEventListener(ev, (e) => {
    e.preventDefault();
    if (ev === 'drop' || !e.relatedTarget) dropzone.classList.remove('over');
  });
}
addEventListener('drop', (e) => e.dataTransfer?.files.length && add(e.dataTransfer.files));
addEventListener('paste', (e) => {
  const files = [...(e.clipboardData?.files || [])];
  if (files.length) add(files);
});

list.addEventListener('click', (e) => {
  const id = e.target.closest('[data-dl]')?.dataset.dl;
  const it = items.find((i) => String(i.id) === id);
  if (it?.out) download(it.out.name, it.out.blob);
});
downloadAll.addEventListener('click', async () => {
  const done = items.filter((i) => i.out);
  try {
    const files = await Promise.all(done.map(async (i) => ({ name: i.out.name, data: new Uint8Array(await i.out.blob.arrayBuffer()) })));
    download(`klickode-images-${done.length}.zip`, createZip(files), 'application/zip');
  } catch (e) {
    setStatus(status, e.message, false);
  }
});
clearBtn.addEventListener('click', () => {
  runToken++;
  for (const it of items) URL.revokeObjectURL(it.thumb);
  items.length = 0;
  render();
});

const rerun = debounce(() => items.length && runAll(), 300);
for (const el of [format, quality, targetKb, resizeMode, widthIn, heightIn, percentIn, bg].filter(Boolean)) {
  el.addEventListener('input', rerun);
  el.addEventListener('change', rerun);
}

function syncControls() {
  if (quality) qualityVal.textContent = quality.value;
  if (resizeMode) {
    const m = resizeMode.value;
    widthIn.closest('label').hidden = !['width', 'fit'].includes(m);
    heightIn.closest('label').hidden = !['height', 'fit'].includes(m);
    percentIn.closest('label').hidden = m !== 'percent';
  }
  if (bg) bg.closest('label').hidden = !!(format && format.value !== 'image/jpeg');
}
for (const el of [quality, resizeMode, format].filter(Boolean)) el.addEventListener('input', syncControls);
syncControls();

detectEncoders().then(syncControls);
render();
