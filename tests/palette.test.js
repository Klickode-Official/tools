import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toHex, fromHex, rgbToHsl, contrast, textColour, extractPalette, edgeColour, assignRoles, toCssVars, toTailwind, toJson } from '../assets/js/lib/palette.js';

// RGBA pixels: each [rgb, count] block in order, plus optional transparent pixels.
function pixels(blocks, transparent = 0) {
  const n = blocks.reduce((s, [, c]) => s + c, 0) + transparent;
  const data = new Uint8ClampedArray(n * 4);
  let i = 0;
  for (const [[r, g, b], c] of blocks) for (let k = 0; k < c; k++, i++) data.set([r, g, b, 255], i * 4);
  for (let k = 0; k < transparent; k++, i++) data.set([0, 255, 0, 0], i * 4);
  return data;
}

test('hex conversions', () => {
  assert.equal(toHex([224, 49, 49]), '#E03131');
  assert.deepEqual(fromHex('#e03131'), [224, 49, 49]);
  assert.deepEqual(fromHex('fff'), [255, 255, 255]);
  assert.equal(fromHex('nope'), null);
});

test('rgbToHsl', () => {
  assert.deepEqual(rgbToHsl([255, 0, 0]), [0, 100, 50]);
  assert.deepEqual(rgbToHsl([255, 255, 255]), [0, 0, 100]);
  assert.deepEqual(rgbToHsl([0, 128, 128]), [180, 100, 25]);
});

test('contrast matches WCAG', () => {
  assert.equal(Math.round(contrast([0, 0, 0], [255, 255, 255]) * 100) / 100, 21);
  assert.equal(Math.round(contrast([224, 49, 49], [255, 255, 255]) * 100) / 100, 4.51);
  assert.equal(textColour([255, 230, 0]), '#111111');
  assert.equal(textColour([20, 40, 120]), '#FFFFFF');
});

test('extractPalette finds the colours that are there, biggest first', () => {
  const data = pixels([[[255, 255, 255], 6000], [[224, 49, 49], 3000], [[20, 20, 24], 800], [[37, 99, 235], 200]], 5000);
  const p = extractPalette(data);
  assert.deepEqual(p.map((c) => c.hex), ['#FFFFFF', '#E03131', '#141418', '#2563EB']);
  assert.ok(Math.abs(p.reduce((s, c) => s + c.share, 0) - 1) < 1e-9);
  assert.ok(Math.abs(p[0].share - 0.6) < 0.02);
});

test('extractPalette merges near-duplicates and ignores transparency', () => {
  const data = pixels([[[224, 49, 49], 3000], [[226, 51, 50], 3000], [[0, 0, 0], 3000]], 9000);
  const p = extractPalette(data);
  assert.equal(p.length, 2);
  assert.ok(!p.some((c) => c.hex === '#00FF00'));
});

test('extractPalette is deterministic', () => {
  const blocks = [];
  for (let i = 0; i < 40; i++) blocks.push([[(i * 37) % 256, (i * 91) % 256, (i * 53) % 256], 50 + i]);
  const data = pixels(blocks);
  assert.deepEqual(extractPalette(data), extractPalette(data));
  assert.ok(extractPalette(data).length <= 8);
  assert.deepEqual(extractPalette(pixels([], 100)), []);
});

test('assignRoles names colourful and neutral colours', () => {
  const p = extractPalette(pixels([[[255, 255, 255], 6000], [[224, 49, 49], 3000], [[20, 20, 24], 800], [[37, 99, 235], 200], [[250, 204, 21], 150]]));
  const roles = assignRoles(p);
  const byHex = Object.fromEntries(p.map((c, i) => [c.hex, roles[i]]));
  assert.equal(byHex['#FFFFFF'], 'background');
  assert.equal(byHex['#E03131'], 'primary');
  assert.equal(byHex['#141418'], 'text');
  assert.ok(['secondary', 'accent'].includes(byHex['#2563EB']));
  assert.equal(new Set(roles).size, roles.length);
});

test('exports', () => {
  const p = [{ rgb: [224, 49, 49], hex: '#E03131', share: 1 }];
  assert.equal(toCssVars(p, ['primary']), ':root {\n  --brand-primary: #E03131;\n}\n');
  assert.match(toTailwind(p, ['primary']), /'primary': '#E03131'/);
  assert.deepEqual(JSON.parse(toJson(p, ['primary']))[0], { name: 'primary', hex: '#E03131', rgb: [224, 49, 49], hsl: [0, 74, 54], share: 100 });
});

test('edgeColour finds a plain background and ignore drops it', () => {
  // 10×10 white image with a red 4×4 square in the middle.
  const w = 10;
  const data = new Uint8ClampedArray(w * w * 4);
  for (let y = 0; y < w; y++) for (let x = 0; x < w; x++) data.set(x >= 3 && x < 7 && y >= 3 && y < 7 ? [224, 49, 49, 255] : [255, 255, 255, 255], (y * w + x) * 4);
  const edge = edgeColour(data, w, w);
  assert.deepEqual(edge, [255, 255, 255]);
  assert.deepEqual(extractPalette(data, { ignore: edge }).map((c) => c.hex), ['#E03131']);
  assert.equal(edgeColour(new Uint8ClampedArray(w * w * 4), w, w), null); // fully transparent
});

test('extractPalette drops anti-aliasing blends between two colours', () => {
  // Green and white, plus a few in-between pixels where the edges were smoothed, plus a real small accent.
  const data = pixels([[[31, 111, 92], 5000], [[255, 255, 255], 4000], [[143, 183, 173], 150], [[193, 219, 213], 120], [[228, 88, 47], 200]]);
  assert.deepEqual(extractPalette(data).map((c) => c.hex), ['#1F6F5C', '#FFFFFF', '#E4582F']);
  // The same when the white background is skipped.
  assert.deepEqual(extractPalette(data, { ignore: [255, 255, 255] }).map((c) => c.hex), ['#1F6F5C', '#E4582F']);
});
