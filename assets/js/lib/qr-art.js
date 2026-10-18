// Styled QR code SVG: square, rounded or dot modules, matching corner "eyes", and an optional
// logo in the middle. Used by the QR code and PromptPay tools. Pure string building, no DOM.

const HEX = /^#[0-9a-f]{6}$/i;
const color = (c, fallback) => (HEX.test(c || '') ? c : fallback);
const num = (n) => +n.toFixed(3);

// The three 7×7 finder patterns sit in these corners.
export const isFinder = (x, y, n) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);

// A rounded rectangle as a path, so several can share one <path> element.
function roundRect(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  if (!r) return `M${num(x)} ${num(y)}h${num(w)}v${num(h)}h${num(-w)}z`;
  return `M${num(x + r)} ${num(y)}h${num(w - 2 * r)}a${num(r)} ${num(r)} 0 0 1 ${num(r)} ${num(r)}v${num(h - 2 * r)}a${num(r)} ${num(r)} 0 0 1 ${num(-r)} ${num(r)}h${num(2 * r - w)}a${num(r)} ${num(r)} 0 0 1 ${num(-r)} ${num(-r)}v${num(2 * r - h)}a${num(r)} ${num(r)} 0 0 1 ${num(r)} ${num(-r)}z`;
}
const circle = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`;

function eye(x, y, style) {
  if (style === 'dots') return circle(x + 3.5, y + 3.5, 3.5) + circle(x + 3.5, y + 3.5, 2.5) + circle(x + 3.5, y + 3.5, 1.5);
  const [outer, hole, inner] = style === 'rounded' ? [2.2, 1.5, 1] : [0, 0, 0];
  return roundRect(x, y, 7, 7, outer) + roundRect(x + 1, y + 1, 5, 5, hole) + roundRect(x + 2, y + 2, 3, 3, inner);
}

/** How many modules wide the logo hole is: about a fifth of the code, always odd so it centres. */
export function logoBox(n, fraction = 0.2) {
  let b = Math.round(n * Math.min(0.3, Math.max(0.1, fraction)));
  if (b % 2 !== n % 2) b++;
  return b;
}

/**
 * @param {{ size: number, modules: boolean[][] }} qr from encodeQr()
 * @param {{ style?: 'square'|'rounded'|'dots', dark?: string, light?: string|null, margin?: number,
 *   logo?: string|null, logoSize?: number, px?: number }} [opts]
 *   logo is a data: URL; light null gives a transparent background.
 */
export function qrArt(qr, { style = 'square', dark = '#000000', light = '#ffffff', margin = 4, logo = null, logoSize = 0.2, px = 1024 } = {}) {
  const n = qr.size;
  const m = Math.max(0, Math.min(10, Math.round(margin)));
  const full = n + m * 2;
  dark = color(dark, '#000000');
  light = light === null ? null : color(light, '#ffffff');
  const hasLogo = typeof logo === 'string' && /^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(logo);
  const box = hasLogo ? logoBox(n, logoSize) : 0;
  const lo = (n - box) / 2;
  const inLogo = (x, y) => hasLogo && x >= lo && x < lo + box && y >= lo && y < lo + box;

  let d = '';
  for (let y = 0; y < n; y++) {
    if (style === 'square') {
      // Join runs of dark modules into one rectangle each; it keeps the file small.
      for (let x = 0; x < n; ) {
        if (!qr.modules[y][x] || isFinder(x, y, n) || inLogo(x, y)) {
          x++;
          continue;
        }
        const start = x;
        while (x < n && qr.modules[y][x] && !isFinder(x, y, n) && !inLogo(x, y)) x++;
        d += `M${start + m} ${y + m}h${x - start}v1h${start - x}z`;
      }
      continue;
    }
    for (let x = 0; x < n; x++) {
      if (!qr.modules[y][x] || isFinder(x, y, n) || inLogo(x, y)) continue;
      d += style === 'dots' ? circle(x + m + 0.5, y + m + 0.5, 0.43) : roundRect(x + m + 0.04, y + m + 0.04, 0.92, 0.92, 0.3);
    }
  }
  const eyes = eye(m, m, style) + eye(m + n - 7, m, style) + eye(m, m + n - 7, style);

  let logoSvg = '';
  if (hasLogo) {
    // A light tile behind the logo, then the logo inset half a module from its edges.
    logoSvg = `<path fill="${light ?? '#ffffff'}" d="${roundRect(m + lo, m + lo, box, box, style === 'square' ? 0.5 : 1.2)}"/><image href="${logo}" x="${m + lo + 0.5}" y="${m + lo + 0.5}" width="${box - 1}" height="${box - 1}" preserveAspectRatio="xMidYMid meet"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${full} ${full}" width="${px}" height="${px}"${style === 'square' ? ' shape-rendering="crispEdges"' : ''}>${light ? `<rect width="${full}" height="${full}" fill="${light}"/>` : ''}<path fill="${dark}" fill-rule="evenodd" d="${d}${eyes}"/>${logoSvg}</svg>`;
}

// WCAG contrast between two hex colours.
export function contrast(a, b) {
  const lum = (hex) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Problems that make a QR code hard to scan, in plain words. */
export function scanWarnings(dark, light) {
  const out = [];
  if (!light) return out;
  const c = contrast(dark, light);
  const lum = (hex) => parseInt(hex.slice(1, 3), 16) * 0.299 + parseInt(hex.slice(3, 5), 16) * 0.587 + parseInt(hex.slice(5, 7), 16) * 0.114;
  if (lum(dark) > lum(light)) out.push('The code is lighter than its background. Many phone cameras can’t read that, so swap the colours.');
  else if (c < 4) out.push(`The colours are quite close (contrast ${c.toFixed(1)}:1). Go darker on the code or lighter on the background, and test it with a phone.`);
  return out;
}
