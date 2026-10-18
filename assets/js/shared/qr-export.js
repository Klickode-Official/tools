// Shared by the QR code and PromptPay tools: logo loading, captions and PNG export.
// Everything is drawn on a canvas in this tab.

const CAPTION_FONT = "600 {size}px Inter, 'Noto Sans Thai', system-ui, sans-serif";
const escapeXml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Caption band below the code: 13% of the code's height, text at half of that.
const band = (px) => Math.round(px * 0.13);

/** Add a line of text under a QR SVG (for the preview and SVG downloads). */
export function withCaption(svg, caption, { dark = '#000000', light = '#ffffff', px }) {
  const text = String(caption || '').trim();
  if (!text) return svg;
  const h = band(px);
  const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const viewBox = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
  const unit = viewBox ? Number(viewBox[1]) / px : 1; // QR units per pixel
  const full = viewBox ? Number(viewBox[1]) : px;
  const extra = h * unit;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${full} ${+(full + extra).toFixed(3)}" width="${px}" height="${px + h}">${light ? `<rect width="${full}" height="${+(full + extra).toFixed(3)}" fill="${light}"/>` : ''}${inner}<text x="${full / 2}" y="${+(full + extra * 0.42).toFixed(3)}" text-anchor="middle" dominant-baseline="middle" font-family="Inter, 'Noto Sans Thai', system-ui, sans-serif" font-weight="600" font-size="${+(h * 0.46 * unit).toFixed(3)}" fill="${dark}">${escapeXml(text)}</text></svg>`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('That image couldn’t be opened'));
    img.src = src;
  });
}

/** Draw a QR SVG (and an optional caption) onto a canvas and return a PNG blob. */
export async function svgToPng(svg, { px, caption = '', dark = '#000000', light = '#ffffff' }) {
  const text = String(caption || '').trim();
  const h = text ? band(px) : 0;
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = px;
    canvas.height = px + h;
    const ctx = canvas.getContext('2d');
    if (light) {
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, px, px);
    if (text) {
      const font = CAPTION_FONT.replace('{size}', Math.round(h * 0.46));
      await document.fonts?.load(font, text).catch(() => {});
      ctx.font = font;
      ctx.fillStyle = dark;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, px / 2, px + h * 0.42, px * 0.92);
    }
    return await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Read a logo file into a small PNG data URL (at most 360 px), so the SVG stays light. */
export async function loadLogo(file) {
  if (!/^image\//.test(file.type)) throw new Error('Pick an image file for the logo');
  if (file.size > 15 * 1024 * 1024) throw new Error('That logo is over 15 MB');
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, 360 / Math.max(img.naturalWidth || 360, img.naturalHeight || 360));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round((img.naturalWidth || 360) * scale));
    canvas.height = Math.max(1, Math.round((img.naturalHeight || 360) * scale));
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
}
