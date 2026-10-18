import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, coverRect, containRect, upscaleFactor, outputFileName } from '../assets/js/lib/social.js';

test('every preset has a unique id and a real size', () => {
  assert.equal(new Set(PRESETS.map((p) => p.id)).size, PRESETS.length);
  for (const p of PRESETS) assert.ok(p.w > 0 && p.h > 0 && p.name, p.id);
});

test('coverRect keeps the output shape and stays inside the source', () => {
  // 4000×3000 landscape into a 1080×1920 story: full height, a narrow centre strip.
  const r = coverRect(4000, 3000, 1080, 1920);
  assert.equal(r.sh, 3000);
  assert.ok(Math.abs(r.sw / r.sh - 1080 / 1920) < 1e-9);
  assert.ok(Math.abs(r.sx - (4000 - r.sw) / 2) < 1e-9);
  assert.equal(r.sy, 0);
});

test('coverRect follows the focus point but never leaves the image', () => {
  const left = coverRect(4000, 3000, 1080, 1080, { x: 0, y: 0.5 });
  assert.equal(left.sx, 0);
  const right = coverRect(4000, 3000, 1080, 1080, { x: 1, y: 0.5 });
  assert.equal(right.sx, 4000 - right.sw);
  // A 3000-wide square window centred on x = 2400 starts at 900.
  assert.equal(coverRect(4000, 3000, 1080, 1080, { x: 0.6, y: 0.5 }).sx, 900);
  // Too close to the edge to centre on, so it stops at the edge.
  assert.equal(coverRect(4000, 3000, 1080, 1080, { x: 0.3, y: 0.5 }).sx, 0);
});

test('containRect centres the whole image', () => {
  assert.deepEqual(containRect(1000, 500, 1080, 1080), { dx: 0, dy: 270, dw: 1080, dh: 540, scale: 1.08 });
  const tall = containRect(500, 1000, 1200, 630);
  assert.equal(tall.dh, 630);
  assert.equal(tall.dx, (1200 - 315) / 2);
});

test('upscaleFactor warns about small sources', () => {
  assert.ok(upscaleFactor(540, 540, 1080, 1080, 'crop') === 2);
  assert.ok(upscaleFactor(4000, 3000, 1080, 1080, 'crop') < 1);
  assert.ok(upscaleFactor(2000, 1000, 1080, 1080, 'fit') < 1);
});

test('outputFileName says what the file is for', () => {
  assert.equal(outputFileName('holiday photo.HEIC', PRESETS[0], 'image/jpeg'), 'holiday photo-instagram-post-1080x1080.jpg');
  assert.equal(outputFileName('a.png', PRESETS.find((p) => p.id === 'x-post'), 'image/webp'), 'a-x-twitter-post-1600x900.webp');
});
