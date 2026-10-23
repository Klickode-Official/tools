import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mmToPx, sheetLayout, clampCrop, PHOTO_SIZES } from '../assets/js/lib/photo.js';

test('mmToPx at 300 DPI', () => {
  assert.equal(mmToPx(35), 413);
  assert.equal(mmToPx(45), 531);
  assert.equal(mmToPx(PHOTO_SIZES['2x2in'].w), 600);
});

test('sheetLayout fills a 6 × 4 inch sheet and stays inside it', () => {
  const w = mmToPx(35);
  const h = mmToPx(45);
  const s = sheetLayout(1800, 1200, w, h);
  assert.equal(s.spots.length, 8); // 4 across, 2 down on a landscape sheet
  for (const { x, y } of s.spots) {
    assert.ok(x >= 30 && y >= 30);
    assert.ok(x + w <= s.width - 30 && y + h <= s.height - 30);
  }
  // A 2 × 2 inch photo: 3 × 2 on landscape.
  assert.equal(sheetLayout(1800, 1200, 600, 600, { margin: 0, gap: 0 }).spots.length, 6);
  // Nothing fits: no spots rather than negative counts.
  assert.equal(sheetLayout(100, 100, 600, 600).spots.length, 0);
});

test('clampCrop keeps the crop inside the picture', () => {
  assert.deepEqual(clampCrop({ cx: 0, cy: 0, cw: 100 }, 1000, 1000, 1.25), { cw: 100, cx: 50, cy: 62.5 });
  const big = clampCrop({ cx: 500, cy: 500, cw: 5000 }, 1000, 800, 1.25);
  assert.equal(big.cw, 640); // limited by height: 800 / 1.25
  assert.equal(big.cy, 400);
});
