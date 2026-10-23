// PDF helpers for the PDF tools. pdf.js (reading, rendering) and pdf-lib (writing) are big, so
// they load from this site the first time a tool needs them. See assets/vendor/*/README.md.
const V = '/assets/vendor/';
let libPromise;
let jsPromise;

export const loadPdfLib = () => (libPromise ??= import(`${V}pdf-lib/pdf-lib.esm.min.js`));

export const loadPdfjs = () =>
  (jsPromise ??= import(`${V}pdfjs/pdf.min.js`).then((m) => {
    m.GlobalWorkerOptions.workerSrc = `${V}pdfjs/pdf.worker.min.js`;
    return m;
  }));

export class CancelledError extends Error {}

/**
 * Opens a PDF for reading with pdf.js. If it has a password, askPassword(retry) is called and
 * should return the password, or null to give up (which rejects with CancelledError).
 */
export async function openPdf(bytes, askPassword) {
  const m = await loadPdfjs();
  const task = m.getDocument({
    data: bytes.slice(), // pdf.js takes ownership of the buffer; keep ours usable
    cMapUrl: `${V}pdfjs/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${V}pdfjs/standard_fonts/`,
    wasmUrl: `${V}pdfjs/wasm/`,
    iccUrl: `${V}pdfjs/iccs/`,
  });
  let cancelled = false;
  task.onPassword = (update, reason) => {
    const pw = askPassword?.(reason === m.PasswordResponses.INCORRECT_PASSWORD);
    if (pw == null) {
      cancelled = true;
      task.destroy();
    } else update(pw);
  };
  try {
    return await task.promise;
  } catch (e) {
    if (cancelled) throw new CancelledError();
    throw e;
  }
}

// Keep a rendered page under this many pixels so big pages don't run a phone out of memory.
const MAX_PIXELS = 25_000_000;

/** Renders page n (1-based) at the given DPI on a white background. Sizes are in PDF points. */
export async function renderPage(pdf, n, dpi) {
  const page = await pdf.getPage(n);
  const base = page.getViewport({ scale: 1 });
  const scale = Math.min(dpi / 72, Math.sqrt(MAX_PIXELS / (base.width * base.height)));
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, canvas, viewport, background: 'white' }).promise;
  page.cleanup();
  return { canvas, width: base.width, height: base.height };
}

export const canvasToBlob = (canvas, type, quality) => new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), type, quality));

export function saveBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 30_000);
}

export const isPdf = (file) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
export const baseName = (name) => name.replace(/\.[^.]+$/, '') || 'document';
