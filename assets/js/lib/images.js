// Pure helpers for the image tools; the canvas work lives in pages/image-tools.js.

export const FORMATS = {
  'image/jpeg': { ext: 'jpg', label: 'JPG', lossy: true, alpha: false },
  'image/png': { ext: 'png', label: 'PNG', lossy: false, alpha: true },
  'image/webp': { ext: 'webp', label: 'WebP', lossy: true, alpha: true },
  'image/avif': { ext: 'avif', label: 'AVIF', lossy: true, alpha: true },
};

// resize: { mode: 'none' | 'percent' | 'width' | 'height' | 'fit', percent, width, height }
export function targetSize(w, h, resize = { mode: 'none' }, { upscale = false } = {}) {
  let scale = 1;
  const { mode } = resize;
  if (mode === 'percent') scale = (Number(resize.percent) || 100) / 100;
  else if (mode === 'width' && resize.width) scale = resize.width / w;
  else if (mode === 'height' && resize.height) scale = resize.height / h;
  else if (mode === 'fit' && (resize.width || resize.height)) scale = Math.min(resize.width ? resize.width / w : Infinity, resize.height ? resize.height / h : Infinity);
  if (!upscale) scale = Math.min(scale, 1);
  return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) };
}

export function outputName(name, mime, suffix = '') {
  const base = name.replace(/\.[^./\\]+$/, '') || 'image';
  return `${base}${suffix}.${FORMATS[mime]?.ext ?? 'img'}`;
}

export function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

// Binary-search the highest quality whose output fits under targetBytes.
// encode(quality) → Promise<{ size }>. Returns the best result, or the smallest if none fit.
export async function searchQuality(encode, targetBytes, { min = 0.05, max = 0.95, steps = 7 } = {}) {
  let lo = min;
  let hi = max;
  let best = null;
  let smallest = null;
  for (let i = 0; i < steps; i++) {
    const q = (lo + hi) / 2;
    const r = await encode(q);
    if (!smallest || r.size < smallest.result.size) smallest = { quality: q, result: r };
    if (r.size <= targetBytes) {
      best = { quality: q, result: r };
      lo = q;
    } else {
      hi = q;
    }
  }
  if (!best) {
    const r = await encode(min);
    if (r.size < smallest.result.size) smallest = { quality: min, result: r };
    return { ...smallest, fits: smallest.result.size <= targetBytes };
  }
  return { ...best, fits: true };
}
