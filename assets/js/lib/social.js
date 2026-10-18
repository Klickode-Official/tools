// Sizes and crop maths for the social media image resizer. Pure functions, no DOM.

export const PRESETS = [
  { id: 'ig-post', name: 'Instagram post', w: 1080, h: 1080 },
  { id: 'ig-portrait', name: 'Instagram portrait', w: 1080, h: 1350 },
  { id: 'story', name: 'Story / Reel / TikTok', w: 1080, h: 1920 },
  { id: 'fb-post', name: 'Facebook post / link', w: 1200, h: 630 },
  { id: 'x-post', name: 'X (Twitter) post', w: 1600, h: 900 },
  { id: 'linkedin', name: 'LinkedIn post', w: 1200, h: 627 },
  { id: 'yt-thumb', name: 'YouTube thumbnail', w: 1280, h: 720 },
  { id: 'pinterest', name: 'Pinterest pin', w: 1000, h: 1500 },
  { id: 'marketplace', name: 'Shopee / Lazada product', w: 1024, h: 1024 },
  { id: 'etsy', name: 'Etsy listing', w: 2000, h: 1500 },
  { id: 'line-rich', name: 'LINE OA rich message', w: 1040, h: 1040 },
];

export const presetById = Object.fromEntries(PRESETS.map((p) => [p.id, p]));

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * The part of the source to keep so it fills outW × outH without stretching.
 * focus is where the important bit is, as fractions of the source (0.5, 0.5 = centre).
 * @returns {{ sx: number, sy: number, sw: number, sh: number, scale: number }}
 */
export function coverRect(srcW, srcH, outW, outH, focus = { x: 0.5, y: 0.5 }) {
  const scale = Math.max(outW / srcW, outH / srcH);
  const sw = Math.min(srcW, outW / scale);
  const sh = Math.min(srcH, outH / scale);
  const sx = clamp(focus.x * srcW - sw / 2, 0, srcW - sw);
  const sy = clamp(focus.y * srcH - sh / 2, 0, srcH - sh);
  return { sx, sy, sw, sh, scale };
}

/**
 * Where the whole source goes inside outW × outH, centred, keeping its shape.
 * @returns {{ dx: number, dy: number, dw: number, dh: number, scale: number }}
 */
export function containRect(srcW, srcH, outW, outH) {
  const scale = Math.min(outW / srcW, outH / srcH);
  const dw = srcW * scale;
  const dh = srcH * scale;
  return { dx: (outW - dw) / 2, dy: (outH - dh) / 2, dw, dh, scale };
}

/** How much the source has to be enlarged for this size (1 or less means no enlarging). */
export function upscaleFactor(srcW, srcH, outW, outH, mode) {
  return mode === 'fit' ? containRect(srcW, srcH, outW, outH).scale : coverRect(srcW, srcH, outW, outH).scale;
}

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

/** photo.heic + Instagram post + JPG → photo-instagram-post-1080x1080.jpg */
export function outputFileName(name, preset, mime) {
  const base = String(name).replace(/\.[^.]+$/, '') || 'image';
  const slug = preset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${base}-${slug}-${preset.w}x${preset.h}.${EXT[mime] || 'png'}`;
}
