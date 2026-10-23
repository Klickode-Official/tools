// The PDF tools: merge, images to PDF, PDF to images, compress. Which one a page is comes from
// data-mode on <body> (set by `data` in tool.mjs). Everything happens in this tab; files are
// never uploaded.
import { $, setStatus, t, escapeHtml } from '/assets/js/ui.js';
import { formatBytes } from '/assets/js/lib/images.js';
import { createZip } from '/assets/js/lib/zip.js';
import { isHeic, decodeHeic } from '/assets/js/shared/heic.js';
import { loadPdfLib, openPdf, renderPage, canvasToBlob, saveBlob, isPdf, baseName, CancelledError } from '/assets/js/shared/pdf.js';

const mode = document.body.dataset.mode; // merge | images | to-images | compress
const dropzone = $('#dropzone');
const filesInput = $('#files');
const list = $('#list');
const status = $('#status');
const runBtn = $('#run');
const clearBtn = $('#clear');
const downloadAll = $('#download-all');
const opt = (id) => $(`#${id}`)?.value;

const ordered = mode === 'merge' || mode === 'images';
const single = mode === 'to-images';
let items = []; // { id, file, bytes, pages, thumb, out: [{ blob, name, label }], error }
let results = []; // pages from PDF to images
let nextId = 1;
let busy = false;

const accepts = (file) => (mode === 'images' ? file.type.startsWith('image/') || /\.(heic|heif|avif)$/i.test(file.name) : isPdf(file));

function askPassword(name) {
  return (retry) => prompt(retry ? t('Wrong password for {name}. Try again:', { name }) : t('{name} is password-protected. Enter its password:', { name }));
}

// pdf-lib refuses encrypted files; this turns its error into something a person can act on.
function pdfError(e, name) {
  if (e instanceof CancelledError) return t('Skipped: no password given');
  if (/encrypt/i.test(e?.message || '') || e?.name === 'PasswordException') return t('{name} is password-protected. Open it, save a copy without the password, and try again.', { name });
  return t('This doesn’t look like a PDF this tool can read.');
}

async function add(fileList) {
  let files = [...fileList].filter(accepts);
  const skipped = fileList.length - files.length;
  if (!files.length) return setStatus(status, mode === 'images' ? t('Those aren’t images.') : t('Those aren’t PDF files.'), false);
  if (single) {
    files = files.slice(0, 1);
    items = [];
    results = [];
  }
  for (const file of files) {
    const item = { id: nextId++, file, out: [] };
    items.push(item);
    if (mode === 'images') item.thumb = (await isHeic(file)) ? null : URL.createObjectURL(file);
    else {
      item.bytes = new Uint8Array(await file.arrayBuffer());
      if (mode === 'merge') {
        try {
          const { PDFDocument } = await loadPdfLib();
          item.pages = (await PDFDocument.load(item.bytes, { updateMetadata: false })).getPageCount();
        } catch (e) {
          item.error = pdfError(e, file.name);
        }
      }
    }
  }
  render();
  if (skipped) setStatus(status, t('{n} file(s) skipped: wrong type', { n: skipped }), false);
  if (mode === 'compress' || single) run();
}

// --- the four jobs --------------------------------------------------------------------------------

async function merge() {
  const { PDFDocument } = await loadPdfLib();
  const out = await PDFDocument.create();
  const usable = items.filter((i) => !i.error);
  for (const [n, item] of usable.entries()) {
    setStatus(status, t('Adding {name} ({n} of {total})…', { name: item.file.name, n: n + 1, total: usable.length }));
    const src = await PDFDocument.load(item.bytes, { updateMetadata: false });
    for (const page of await out.copyPages(src, src.getPageIndices())) out.addPage(page);
  }
  const blob = new Blob([await out.save()], { type: 'application/pdf' });
  saveBlob(blob, 'merged.pdf');
  setStatus(status, t('Merged {n} files into one PDF with {pages} pages ({size}).', { n: usable.length, pages: out.getPageCount(), size: formatBytes(blob.size) }), true);
}

const PAGE_SIZES = { a4: [595.28, 841.89], letter: [612, 792] };
const MM = 72 / 25.4;

async function imageToBitmap(file) {
  if (await isHeic(file)) return decodeHeic(file);
  return createImageBitmap(file); // applies the photo's rotation (EXIF orientation)
}

async function imagesToPdf() {
  const { PDFDocument } = await loadPdfLib();
  const doc = await PDFDocument.create();
  const margin = Number(opt('margin') || 0) * MM;
  for (const [n, item] of items.entries()) {
    setStatus(status, t('Adding image {n} of {total}…', { n: n + 1, total: items.length }));
    let bitmap;
    try {
      bitmap = await imageToBitmap(item.file);
    } catch {
      item.error = t('This file couldn’t be decoded as an image.');
      continue;
    }
    // Keep enough pixels to print sharply on A4 (about 300 DPI) without making huge files.
    const scale = Math.min(1, 3600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    const alpha = /png|webp|gif/.test(item.file.type);
    if (!alpha) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const bytes = new Uint8Array(await (await canvasToBlob(canvas, alpha ? 'image/png' : 'image/jpeg', 0.92)).arrayBuffer());
    const img = alpha ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    const size = opt('page-size');
    const landscape = canvas.width > canvas.height;
    let [pw, ph] = size === 'fit' ? [canvas.width * 0.75 + margin * 2, canvas.height * 0.75 + margin * 2] : PAGE_SIZES[size];
    if (size !== 'fit' && landscape) [pw, ph] = [ph, pw];
    const fit = Math.min((pw - margin * 2) / canvas.width, (ph - margin * 2) / canvas.height);
    const w = canvas.width * fit;
    const h = canvas.height * fit;
    doc.addPage([pw, ph]).drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
  }
  if (!doc.getPageCount()) return setStatus(status, t('None of these images could be read.'), false);
  const blob = new Blob([await doc.save()], { type: 'application/pdf' });
  saveBlob(blob, items.length === 1 ? `${baseName(items[0].file.name)}.pdf` : 'images.pdf');
  render();
  setStatus(status, t('Made a {pages}-page PDF ({size}).', { pages: doc.getPageCount(), size: formatBytes(blob.size) }), true);
}

async function pdfToImages() {
  const item = items[0];
  const type = opt('format') || 'image/jpeg';
  const ext = type === 'image/png' ? 'png' : 'jpg';
  const dpi = Number(opt('dpi') || 150);
  results = [];
  let pdf;
  try {
    pdf = await openPdf(item.bytes, askPassword(item.file.name));
  } catch (e) {
    item.error = pdfError(e, item.file.name);
    return render();
  }
  item.pages = pdf.numPages;
  for (let n = 1; n <= pdf.numPages; n++) {
    setStatus(status, t('Converting page {n} of {total}…', { n, total: pdf.numPages }));
    const { canvas } = await renderPage(pdf, n, dpi);
    const blob = await canvasToBlob(canvas, type, 0.9);
    results.push({ blob, name: `${baseName(item.file.name)}-page-${n}.${ext}`, label: t('Page {n}', { n }), dims: `${canvas.width}×${canvas.height}`, url: URL.createObjectURL(blob) });
    canvas.width = 0; // free the pixels straight away
    render();
  }
  await pdf.loadingTask?.destroy(); // frees the worker’s copy of the file
  setStatus(status, t('{n} pages converted.', { n: results.length }), true);
}

const LEVELS = { medium: { dpi: 150, q: 0.7 }, strong: { dpi: 110, q: 0.55 } };

async function compressOne(item) {
  const { PDFDocument } = await loadPdfLib();
  const level = opt('level') || 'medium';
  let bytes;
  if (level === 'light') {
    // Keeps text and vectors: rewrites the file compactly and drops unused objects.
    const doc = await PDFDocument.load(item.bytes, { updateMetadata: false });
    bytes = await doc.save({ useObjectStreams: true });
  } else {
    // Re-draws every page as a JPEG at a lower resolution. Much smaller for scans and photos,
    // but text can no longer be selected or searched.
    const pdf = await openPdf(item.bytes, askPassword(item.file.name));
    const doc = await PDFDocument.create();
    const { dpi, q } = LEVELS[level];
    for (let n = 1; n <= pdf.numPages; n++) {
      setStatus(status, t('{name}: page {n} of {total}…', { name: item.file.name, n, total: pdf.numPages }));
      const { canvas, width, height } = await renderPage(pdf, n, dpi);
      const jpg = await doc.embedJpg(new Uint8Array(await (await canvasToBlob(canvas, 'image/jpeg', q)).arrayBuffer()));
      canvas.width = 0;
      doc.addPage([width, height]).drawImage(jpg, { x: 0, y: 0, width, height });
    }
    await pdf.loadingTask?.destroy(); // frees the worker’s copy of the file
    bytes = await doc.save({ useObjectStreams: true });
  }
  const smaller = bytes.length < item.bytes.length;
  item.out = [{ blob: new Blob([smaller ? bytes : item.bytes], { type: 'application/pdf' }), name: smaller ? `${baseName(item.file.name)}-compressed.pdf` : item.file.name, note: smaller ? '' : t('Already as small as this level gets; original kept') }];
}

async function compress() {
  for (const item of items.filter((i) => !i.out.length && !i.error)) {
    try {
      await compressOne(item);
    } catch (e) {
      item.error = pdfError(e, item.file.name);
    }
    render();
  }
  const done = items.filter((i) => i.out.length);
  const before = done.reduce((n, i) => n + i.file.size, 0);
  const after = done.reduce((n, i) => n + i.out[0].blob.size, 0);
  if (done.length) setStatus(status, t('{before} → {after} ({pct}% smaller)', { before: formatBytes(before), after: formatBytes(after), pct: Math.max(0, Math.round(100 - (100 * after) / before)) }), after < before);
}

async function run() {
  if (busy || !items.length) return;
  busy = true;
  runBtn && (runBtn.disabled = true);
  try {
    await { merge, images: imagesToPdf, 'to-images': pdfToImages, compress }[mode]();
  } catch (e) {
    console.error(e);
    setStatus(status, t('Something went wrong: {msg}', { msg: e.message || e }), false);
  } finally {
    busy = false;
    render();
  }
}

// --- list ----------------------------------------------------------------------------------------

function render() {
  const rows = items.map((it, i) => {
    const info = [formatBytes(it.file.size), it.pages && t(it.pages === 1 ? '1 page' : '{n} pages', { n: it.pages })].filter(Boolean).join(' · ');
    const out = it.out[0];
    const result = it.error
      ? `<span class="err-text">${escapeHtml(it.error)}</span>`
      : out
        ? `${formatBytes(out.blob.size)} <span class="${out.blob.size < it.file.size ? 'ok-text' : 'check'}">(${Math.round((100 * (out.blob.size - it.file.size)) / it.file.size)}%)</span>${out.note ? `<br><span class="check">${escapeHtml(out.note)}</span>` : ''}`
        : mode === 'compress'
          ? `<span class="check">${t('Processing…')}</span>`
          : '';
    const thumb = it.thumb ? `<img src="${it.thumb}" alt="" class="thumb" loading="lazy">` : `<span class="thumb pdf-thumb" aria-hidden="true">${mode === 'images' ? 'IMG' : 'PDF'}</span>`;
    const moves = ordered
      ? `<span class="row-moves"><button class="btn small" data-move="${it.id}" data-by="-1" ${i === 0 ? 'disabled' : ''} aria-label="${t('Move up')}">↑</button><button class="btn small" data-move="${it.id}" data-by="1" ${i === items.length - 1 ? 'disabled' : ''} aria-label="${t('Move down')}">↓</button></span>`
      : '';
    const action = mode === 'compress' ? `<button class="btn small" data-dl="${it.id}" ${out ? '' : 'disabled'}>${t('Download')}</button>` : '';
    return `<li class="file-row">${thumb}<div class="file-info"><strong>${escapeHtml(it.file.name)}</strong><span class="check">${info}</span><div>${result}</div></div>${moves}${action}<button class="btn small" data-remove="${it.id}" aria-label="${t('Remove {name}', { name: it.file.name })}">✕</button></li>`;
  });
  const pages = results.map((r, i) => `<li class="file-row"><img src="${r.url}" alt="" class="thumb" loading="lazy"><div class="file-info"><strong>${escapeHtml(r.label)}</strong><span class="check">${r.dims} · ${formatBytes(r.blob.size)}</span></div><button class="btn small" data-page="${i}">${t('Download')}</button></li>`);
  list.innerHTML = rows.join('') + pages.join('');
  const usable = items.filter((i) => !i.error).length;
  if (runBtn) runBtn.disabled = busy || !usable || (mode === 'merge' && usable < 2);
  if (clearBtn) clearBtn.disabled = busy || !items.length;
  if (downloadAll) downloadAll.disabled = busy || (mode === 'to-images' ? results.length < 2 : items.filter((i) => i.out.length).length < 2);
  if (!items.length) setStatus(status, '');
}

list.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b || busy) return;
  if (b.dataset.move) {
    const i = items.findIndex((x) => x.id === Number(b.dataset.move));
    const j = i + Number(b.dataset.by);
    [items[i], items[j]] = [items[j], items[i]];
    render();
    list.querySelector(`[data-move="${b.dataset.move}"][data-by="${b.dataset.by}"]:not([disabled])`)?.focus();
  } else if (b.dataset.remove) {
    items = items.filter((x) => x.id !== Number(b.dataset.remove));
    if (single) results = [];
    render();
  } else if (b.dataset.dl) {
    const out = items.find((x) => x.id === Number(b.dataset.dl))?.out[0];
    if (out) saveBlob(out.blob, out.name);
  } else if (b.dataset.page) {
    const r = results[Number(b.dataset.page)];
    saveBlob(r.blob, r.name);
  }
});

downloadAll?.addEventListener('click', async () => {
  const files = mode === 'to-images' ? results : items.filter((i) => i.out.length).map((i) => i.out[0]);
  const zip = createZip(await Promise.all(files.map(async (f) => ({ name: f.name, data: new Uint8Array(await f.blob.arrayBuffer()) }))));
  saveBlob(new Blob([zip], { type: 'application/zip' }), mode === 'to-images' ? `${baseName(items[0].file.name)}-pages.zip` : 'compressed-pdfs.zip');
});

runBtn?.addEventListener('click', run);
clearBtn?.addEventListener('click', () => {
  items = [];
  results = [];
  render();
});
for (const id of ['format', 'dpi', 'level']) {
  $(`#${id}`)?.addEventListener('change', () => {
    if (mode === 'compress') items.forEach((i) => ((i.out = []), (i.error = undefined)));
    if (mode === 'compress' || single) run();
  });
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
addEventListener('paste', (e) => e.clipboardData?.files.length && add(e.clipboardData.files));
render();
