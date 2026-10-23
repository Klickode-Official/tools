import { $, setStatus, t, persist } from '/assets/js/ui.js';
import { PHOTO_SIZES, mmToPx, sheetLayout, clampCrop } from '/assets/js/lib/photo.js';
import { isHeic, decodeHeic } from '/assets/js/shared/heic.js';

const filesInput = $('#files');
const dropzone = $('#dropzone');
const sizeSel = $('#size');
const custom = $('#custom');
const wIn = $('#w-mm');
const hIn = $('#h-mm');
const editor = $('#editor');
const frame = $('#frame');
const zoom = $('#zoom');
const info = $('#out-info');
const status = $('#status');
persist(sizeSel, wIn, hIn);

const DPI = 300;
const VIEW_W = 300; // CSS pixels across the on-screen crop frame
let img = null; // ImageBitmap
let name = 'photo';
let crop = null; // { cx, cy, cw } in source pixels

function size() {
  if (sizeSel.value === 'custom') {
    const w = Math.min(150, Math.max(10, Number(wIn.value) || 35));
    const h = Math.min(150, Math.max(10, Number(hIn.value) || 45));
    return { w, h, label: `${w} × ${h} mm`, guide: false };
  }
  return PHOTO_SIZES[sizeSel.value] || PHOTO_SIZES['35x45'];
}
const aspect = () => size().h / size().w;
// Widest crop that fits, which zoom 100% shows.
const fullWidth = () => Math.min(img.width, img.height / aspect());

function setCrop(next) {
  crop = clampCrop(next, img.width, img.height, aspect());
  zoom.value = String(Math.round((fullWidth() / crop.cw) * 100));
  draw();
}

function draw() {
  if (!img) return;
  const ratio = devicePixelRatio || 1;
  const vw = VIEW_W;
  const vh = Math.round(VIEW_W * aspect());
  frame.style.width = `${vw}px`;
  frame.style.height = `${vh}px`;
  frame.width = Math.round(vw * ratio);
  frame.height = Math.round(vh * ratio);
  const ctx = frame.getContext('2d');
  paint(ctx, frame.width, frame.height);
  if (size().guide) {
    // Face guide: head (chin to crown) about 70–80% of the height, centred a little above middle.
    ctx.save();
    ctx.setLineDash([6 * ratio, 5 * ratio]);
    ctx.lineWidth = 2 * ratio;
    ctx.strokeStyle = 'rgba(255,255,255,.95)';
    ctx.shadowColor = 'rgba(0,0,0,.6)';
    ctx.shadowBlur = 3 * ratio;
    ctx.beginPath();
    ctx.ellipse(frame.width / 2, frame.height * 0.46, frame.width * 0.27, frame.height * 0.36, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  const s = size();
  const pw = mmToPx(s.w, DPI);
  const ph = mmToPx(s.h, DPI);
  info.textContent = t('{w} × {h} pixels at 300 DPI · sheet fits {n}', { w: pw, h: ph, n: sheetLayout(1800, 1200, pw, ph).spots.length });
}

function paint(ctx, w, h) {
  const ch = crop.cw * aspect();
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, crop.cx - crop.cw / 2, crop.cy - ch / 2, crop.cw, ch, 0, 0, w, h);
}

function photoCanvas() {
  const s = size();
  const c = document.createElement('canvas');
  c.width = mmToPx(s.w, DPI);
  c.height = mmToPx(s.h, DPI);
  paint(c.getContext('2d'), c.width, c.height);
  return c;
}

function save(canvas, file) {
  canvas.toBlob(
    (blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = file;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 30_000);
    },
    'image/jpeg',
    0.95,
  );
}

const sizeTag = () => (sizeSel.value === 'custom' ? `${size().w}x${size().h}mm` : sizeSel.value.replace(/^(\d+)x(\d+)$/, '$1x$2mm'));

$('#dl-photo').addEventListener('click', () => save(photoCanvas(), `${name}-${sizeTag()}.jpg`));
$('#dl-sheet').addEventListener('click', () => {
  const photo = photoCanvas();
  const layout = sheetLayout(1800, 1200, photo.width, photo.height);
  const sheet = document.createElement('canvas');
  sheet.width = layout.width;
  sheet.height = layout.height;
  const ctx = sheet.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, sheet.width, sheet.height);
  ctx.strokeStyle = '#c8c8cc';
  ctx.lineWidth = 2;
  for (const { x, y } of layout.spots) {
    ctx.drawImage(photo, x, y);
    ctx.strokeRect(x - 1, y - 1, photo.width + 2, photo.height + 2); // cut line
  }
  save(sheet, `${name}-${sizeTag()}-print-6x4.jpg`);
});

// --- moving and zooming ----------------------------------------------------------------------

let drag = null;
frame.addEventListener('pointerdown', (e) => {
  if (!img) return;
  frame.setPointerCapture(e.pointerId);
  drag = { x: e.clientX, y: e.clientY, cx: crop.cx, cy: crop.cy };
});
frame.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const k = crop.cw / frame.clientWidth; // source pixels per screen pixel
  setCrop({ cw: crop.cw, cx: drag.cx - (e.clientX - drag.x) * k, cy: drag.cy - (e.clientY - drag.y) * k });
});
for (const ev of ['pointerup', 'pointercancel']) frame.addEventListener(ev, () => (drag = null));
frame.addEventListener('keydown', (e) => {
  const step = crop.cw * 0.03;
  const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
  if (!d) return;
  e.preventDefault();
  setCrop({ cw: crop.cw, cx: crop.cx + d[0], cy: crop.cy + d[1] });
});
frame.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    setCrop({ ...crop, cw: crop.cw * (e.deltaY > 0 ? 1.06 : 1 / 1.06) });
  },
  { passive: false },
);
zoom.addEventListener('input', () => setCrop({ ...crop, cw: fullWidth() / (Number(zoom.value) / 100) }));

function refit() {
  custom.hidden = sizeSel.value !== 'custom';
  if (img) setCrop({ ...crop, cw: crop.cw }); // keeps the centre, adjusts to the new shape
}
sizeSel.addEventListener('change', refit);
for (const el of [wIn, hIn]) el.addEventListener('input', refit);

// --- loading a photo -------------------------------------------------------------------------

async function open(file) {
  if (!file) return;
  try {
    const bitmap = (await isHeic(file)) ? await decodeHeic(file) : await createImageBitmap(file);
    img?.close?.();
    img = bitmap;
  } catch {
    return setStatus(status, t('That file isn’t a photo this tool can open.'), false);
  }
  setStatus(status, '');
  name = file.name.replace(/\.[^.]+$/, '') || 'photo';
  editor.hidden = false;
  // Start zoomed to the full width, a little above centre, where faces usually are.
  const cw = fullWidth();
  setCrop({ cw, cx: img.width / 2, cy: img.height * 0.42 });
  frame.focus({ preventScroll: true });
}

filesInput.addEventListener('change', () => {
  open(filesInput.files[0]);
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
addEventListener('drop', (e) => open(e.dataTransfer?.files[0]));
addEventListener('paste', (e) => open(e.clipboardData?.files[0]));
addEventListener('resize', draw);
refit();
