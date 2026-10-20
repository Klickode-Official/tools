// Colour maths for the brand palette tool: picking dominant colours out of pixels, converting
// between colour spaces and checking contrast. Pure functions, no DOM.

export const toHex = ([r, g, b]) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

export function fromHex(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return null;
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** [r, g, b] (0–255) → [h (0–360), s (0–100), l (0–100)], rounded. */
export function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return [Math.round(h) % 360, Math.round(s * 100), Math.round(l * 100)];
}

// WCAG relative luminance and contrast ratio.
export function luminance([r, g, b]) {
  const c = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function contrast(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Black or white, whichever reads better on this colour. */
export const textColour = (rgb) => (contrast(rgb, [255, 255, 255]) >= contrast(rgb, [17, 17, 17]) ? '#FFFFFF' : '#111111');

// CIE Lab, so "near-duplicate" means close to the eye rather than close in RGB numbers.
export function rgbToLab([r, g, b]) {
  const lin = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  const x = (lin[0] * 0.4124 + lin[1] * 0.3576 + lin[2] * 0.1805) / 0.95047;
  const y = lin[0] * 0.2126 + lin[1] * 0.7152 + lin[2] * 0.0722;
  const z = (lin[0] * 0.0193 + lin[1] * 0.1192 + lin[2] * 0.9505) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

export const deltaE = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// How far point p is from the straight line between a and b, in the same units (Lab: ΔE).
function distanceToSegment(p, a, b) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const len = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2;
  if (!len) return deltaE(p, a);
  const t = ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1] + (p[2] - a[2]) * ab[2]) / len;
  if (t <= 0.05 || t >= 0.95) return Infinity; // right next to an end: that's a shade, not a blend
  return deltaE(p, [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t]);
}

// Small seeded random number generator, so the same image always gives the same palette.
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The main colours in an image.
 * @param {Uint8ClampedArray|Uint8Array} data RGBA pixels, as from getImageData
 * @param {{ count?: number, maxSamples?: number, minShare?: number, mergeDistance?: number }} [opts]
 * @returns {{ rgb: number[], hex: string, share: number }[]} most common first; shares add up to 1
 */
export function extractPalette(data, { count = 8, maxSamples = 24000, minShare = 0.004, mergeDistance = 9, ignore = null, ignoreDistance = 12 } = {}) {
  const total = data.length / 4;
  const step = Math.max(1, Math.floor(total / maxSamples));
  const skip = ignore && rgbToLab(ignore);
  const pts = [];
  for (let i = 0; i < total; i += step) {
    if (data[i * 4 + 3] < 128) continue; // ignore see-through pixels
    const lab = rgbToLab([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
    if (skip && deltaE(lab, skip) < ignoreDistance) continue;
    pts.push(lab.concat(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]));
  }
  if (!pts.length) return [];

  // k-means++ start: spread the first centres out, then refine.
  const rand = mulberry32(pts.length * 2654435761);
  const k = Math.min(count + 4, pts.length);
  const centres = [pts[Math.floor(rand() * pts.length)].slice(0, 3)];
  const dist = new Float64Array(pts.length).fill(Infinity);
  while (centres.length < k) {
    const last = centres[centres.length - 1];
    let sum = 0;
    pts.forEach((p, i) => {
      const d = (p[0] - last[0]) ** 2 + (p[1] - last[1]) ** 2 + (p[2] - last[2]) ** 2;
      if (d < dist[i]) dist[i] = d;
      sum += dist[i];
    });
    if (sum === 0) break; // fewer distinct colours than k
    let r = rand() * sum;
    let pick = 0;
    while (pick < pts.length - 1 && (r -= dist[pick]) > 0) pick++;
    centres.push(pts[pick].slice(0, 3));
  }

  const assign = new Int32Array(pts.length);
  for (let iter = 0; iter < 16; iter++) {
    let moved = 0;
    pts.forEach((p, i) => {
      let best = 0;
      let bestD = Infinity;
      centres.forEach((c, j) => {
        const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      });
      if (assign[i] !== best) moved++;
      assign[i] = best;
    });
    const sums = centres.map(() => [0, 0, 0, 0]);
    pts.forEach((p, i) => {
      const s = sums[assign[i]];
      s[0] += p[0];
      s[1] += p[1];
      s[2] += p[2];
      s[3]++;
    });
    sums.forEach((s, j) => s[3] && (centres[j] = [s[0] / s[3], s[1] / s[3], s[2] / s[3]]));
    if (!moved && iter) break;
  }

  // Report each cluster as the average of its real RGB pixels.
  let clusters = centres.map(() => ({ sum: [0, 0, 0], n: 0 }));
  pts.forEach((p, i) => {
    const c = clusters[assign[i]];
    c.sum[0] += p[3];
    c.sum[1] += p[4];
    c.sum[2] += p[5];
    c.n++;
  });
  clusters = clusters.filter((c) => c.n).map((c) => ({ rgb: c.sum.map((v) => v / c.n), n: c.n }));

  // Merge colours the eye would call the same, biggest first.
  clusters.sort((a, b) => b.n - a.n);
  const merged = [];
  for (const c of clusters) {
    const lab = rgbToLab(c.rgb);
    const twin = merged.find((m) => deltaE(m.lab, lab) < mergeDistance);
    if (twin) {
      twin.rgb = twin.rgb.map((v, i) => (v * twin.n + c.rgb[i] * c.n) / (twin.n + c.n));
      twin.n += c.n;
      twin.lab = rgbToLab(twin.rgb);
    } else merged.push({ ...c, lab });
  }
  // Smooth edges leave in-between pixels, like grey-green where a green shape meets white. A small
  // cluster that sits on the line between two bigger colours (or the skipped background) is one of
  // those, not a colour of its own.
  const big = merged.filter((m) => m.n / pts.length >= 0.04);
  const ends = skip ? [...big.map((m) => m.lab), skip] : big.map((m) => m.lab);
  const isBlend = (m) => {
    if (m.n / pts.length >= 0.06) return false;
    for (let a = 0; a < ends.length; a++) {
      for (let b = a + 1; b < ends.length; b++) {
        if (ends[a] === m.lab || ends[b] === m.lab) continue;
        if (distanceToSegment(m.lab, ends[a], ends[b]) < 7) return true;
      }
    }
    return false;
  };
  const kept = merged
    .filter((m) => m.n / pts.length >= minShare && !isBlend(m))
    .sort((a, b) => b.n - a.n)
    .slice(0, count);
  const keptTotal = kept.reduce((s, m) => s + m.n, 0);
  return kept.map((m) => {
    const rgb = m.rgb.map((v) => Math.round(v));
    return { rgb, hex: toHex(rgb), share: m.n / keptTotal };
  });
}

/**
 * The colour around the edge of an image, which for most logos is the background.
 * @returns {number[] | null} [r, g, b], or null when the edge is see-through or mixed
 */
export function edgeColour(data, width, height) {
  const counts = new Map();
  let n = 0;
  const visit = (x, y) => {
    const i = (y * width + x) * 4;
    n++;
    if (data[i + 3] < 128) return;
    // Bucket to 4 bits per channel so slight noise still counts as the same colour.
    const key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
    const c = counts.get(key) || { n: 0, sum: [0, 0, 0] };
    c.n++;
    c.sum[0] += data[i];
    c.sum[1] += data[i + 1];
    c.sum[2] += data[i + 2];
    counts.set(key, c);
  };
  for (let x = 0; x < width; x++) {
    visit(x, 0);
    visit(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    visit(0, y);
    visit(width - 1, y);
  }
  const top = [...counts.values()].sort((a, b) => b.n - a.n)[0];
  if (!top || top.n < n * 0.6) return null;
  return top.sum.map((v) => Math.round(v / top.n));
}

/**
 * Give each colour a job: primary, secondary and accent for the colourful ones, and
 * background / text / neutral for the greys, whites and blacks.
 * @returns {string[]} one role per colour, in the same order
 */
export function assignRoles(colours) {
  const info = colours.map((c, i) => {
    const [, s, l] = rgbToHsl(c.rgb);
    const neutral = s < 12 || l < 8 || l > 94;
    return { i, s, l, neutral, share: c.share };
  });
  const roles = new Array(colours.length).fill('');
  const vivid = info.filter((c) => !c.neutral).sort((a, b) => b.share * (0.5 + b.s / 100) - a.share * (0.5 + a.s / 100));
  const named = ['primary', 'secondary'];
  vivid.forEach((c, n) => (roles[c.i] = named[n] || ''));
  // The most saturated of the rest is the accent.
  const rest = vivid.slice(2).sort((a, b) => b.s - a.s);
  if (rest[0]) roles[rest[0].i] = 'accent';
  let extra = 1;
  vivid.slice(2).forEach((c) => !roles[c.i] && (roles[c.i] = `extra-${extra++}`));
  const neutrals = info.filter((c) => c.neutral);
  const light = [...neutrals].sort((a, b) => b.l - a.l)[0];
  const dark = [...neutrals].sort((a, b) => a.l - b.l)[0];
  if (light && light.l >= 50) roles[light.i] = 'background';
  if (dark && !roles[dark.i] && dark.l < 50) roles[dark.i] = 'text';
  let n = 1;
  neutrals.forEach((c) => !roles[c.i] && (roles[c.i] = `neutral-${n++}`));
  return roles;
}

const named = (colours, roles) => colours.map((c, i) => ({ name: roles[i], hex: c.hex }));

export const toCssVars = (colours, roles, prefix = 'brand') => `:root {\n${named(colours, roles).map((c) => `  --${prefix}-${c.name}: ${c.hex};`).join('\n')}\n}\n`;

export const toTailwind = (colours, roles) =>
  `// tailwind.config.js → theme.extend.colors\nbrand: {\n${named(colours, roles).map((c) => `  '${c.name}': '${c.hex}',`).join('\n')}\n},\n`;

export const toJson = (colours, roles) =>
  JSON.stringify(
    colours.map((c, i) => ({ name: roles[i], hex: c.hex, rgb: c.rgb, hsl: rgbToHsl(c.rgb), share: Math.round(c.share * 1000) / 10 })),
    null,
    2,
  );
