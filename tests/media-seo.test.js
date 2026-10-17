import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createZip, crc32, uniqueNames } from '../assets/js/lib/zip.js';
import { inspectMetadata, describeMetadata, detectFormat, stripMetadata } from '../assets/js/lib/metadata.js';
import { parseRobots, isAllowed } from '../assets/js/lib/robots.js';
import { audit, truncateToWidth } from '../assets/js/lib/seo.js';
import { targetSize, outputName, searchQuality } from '../assets/js/lib/images.js';
import { keywordDensity } from '../assets/js/lib/text.js';

test('crc32 matches the reference value', () => {
  assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926);
});

test('createZip output is a valid archive', () => {
  const enc = new TextEncoder();
  const zip = createZip([
    { name: 'a.txt', data: enc.encode('hello') },
    { name: 'a.txt', data: enc.encode('world') },
    { name: 'ünï.txt', data: new Uint8Array(0) },
  ]);
  const dir = mkdtempSync(join(tmpdir(), 'zip-'));
  const file = join(dir, 'out.zip');
  writeFileSync(file, zip);
  const script = 'import sys,zipfile,json\nz=zipfile.ZipFile(sys.argv[1])\nassert z.testzip() is None\nprint(json.dumps({n:z.read(n).decode() for n in z.namelist()}))';
  const out = JSON.parse(execFileSync('python3', ['-I', '-c', script, file]).toString());
  assert.deepEqual(out, { 'a.txt': 'hello', 'a (2).txt': 'world', 'ünï.txt': '' });
  assert.deepEqual(uniqueNames(['x', 'X', 'y.png', 'y.png']), ['x', 'X (2)', 'y.png', 'y (2).png']);
});

// Build a JPEG with an APP1 EXIF segment whose IFD0 has Make (0x010f) and GPS (0x8825) tags.
function jpegWithExif() {
  const tiff = [0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x02, 0x00];
  const entry = (tag) => [tag & 0xff, tag >> 8, 0x02, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
  const ifd = [...tiff, ...entry(0x010f), ...entry(0x8825), 0, 0, 0, 0];
  const payload = [...new TextEncoder().encode('Exif\0\0'), ...ifd];
  const len = payload.length + 2;
  return new Uint8Array([0xff, 0xd8, 0xff, 0xe1, len >> 8, len & 0xff, ...payload, 0xff, 0xda, 0, 2, 0xff, 0xd9]);
}

test('metadata detection finds EXIF GPS and camera tags', () => {
  const m = inspectMetadata(jpegWithExif());
  assert.equal(m.format, 'jpeg');
  assert.ok(m.gps && m.camera);
  assert.deepEqual(describeMetadata(m), ['GPS location', 'camera make/model']);
  assert.deepEqual(describeMetadata(inspectMetadata(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]))), []);
  assert.equal(detectFormat(new TextEncoder().encode('\0\0\0\x18ftypheic')), 'heic');
});

test('robots.txt matching follows RFC 9309', () => {
  const r = parseRobots(`
User-agent: *
Disallow: /private
Allow: /private/public
Disallow: /*.pdf$

User-agent: Googlebot
User-agent: Bingbot
Disallow: /no-google
Sitemap: https://example.com/sitemap.xml
bogus line`);
  assert.equal(r.groups.length, 2);
  assert.deepEqual(r.groups[1].agents, ['googlebot', 'bingbot']);
  assert.deepEqual(r.sitemaps, ['https://example.com/sitemap.xml']);
  assert.equal(r.warnings.length, 1);
  assert.equal(isAllowed(r, 'MyBot', '/private/x').allowed, false);
  assert.equal(isAllowed(r, 'MyBot', '/private/public/x').allowed, true);
  assert.equal(isAllowed(r, 'MyBot', 'https://example.com/a/file.pdf').allowed, false);
  assert.equal(isAllowed(r, 'MyBot', '/a/file.pdf?x=1').allowed, true);
  // Googlebot uses its own group only, so /private is allowed for it.
  assert.equal(isAllowed(r, 'Googlebot/2.1', '/private').allowed, true);
  assert.equal(isAllowed(r, 'Googlebot', '/no-google/page').allowed, false);
  // Equal-length Allow and Disallow: Allow wins.
  assert.equal(isAllowed(parseRobots('User-agent: *\nDisallow: /a\nAllow: /a'), 'x', '/a').allowed, true);
  assert.equal(isAllowed(parseRobots('User-agent: *\nDisallow:'), 'x', '/anything').allowed, true);
});

const base = {
  title: 'A good page title that is long enough here',
  titleCount: 1,
  description: 'x'.repeat(120),
  descriptionCount: 1,
  robots: null,
  viewport: 'width=device-width',
  canonical: 'https://example.com/',
  lang: 'en',
  charset: true,
  headings: [{ level: 1, text: 'Hi' }, { level: 2, text: 'Sub' }],
  images: [{ src: 'a.png', alt: 'A' }],
  og: { 'og:title': 't', 'og:description': 'd', 'og:image': 'i' },
  twitter: { 'twitter:card': 'summary' },
  hreflang: 0,
  ldJson: ['{"@type":"WebSite"}'],
  links: { total: 0, external: 0, nofollow: 0 },
  wordCount: 500,
};

test('seo audit', () => {
  assert.equal(audit(base).score, 100);
  const bad = audit({ ...base, title: null, robots: 'noindex', headings: [{ level: 1, text: 'a' }, { level: 3, text: 'b' }], images: [{ src: 'x', alt: null }], ldJson: ['{bad'] });
  const msgs = bad.checks.filter((c) => c.level !== 'ok').map((c) => c.area);
  for (const area of ['Title', 'Indexing', 'Headings', 'Images', 'Structured data']) assert.ok(msgs.includes(area), area);
  assert.ok(bad.score < 100);
});

test('truncateToWidth cuts on a word boundary', () => {
  const measure = (s) => s.length * 10;
  assert.deepEqual(truncateToWidth('short', 100, measure), { text: 'short', truncated: false });
  const r = truncateToWidth('the quick brown fox jumps over', 150, measure);
  assert.ok(r.truncated && r.text.endsWith(' ...') && measure(r.text) <= 150, r.text);
  assert.equal(r.text, 'the quick ...');
});

test('image sizing, naming and quality search', async () => {
  assert.deepEqual(targetSize(4000, 3000, { mode: 'width', width: 1000 }), { width: 1000, height: 750 });
  assert.deepEqual(targetSize(400, 300, { mode: 'width', width: 1000 }), { width: 400, height: 300 });
  assert.deepEqual(targetSize(4000, 3000, { mode: 'fit', width: 1000, height: 1000 }), { width: 1000, height: 750 });
  assert.deepEqual(targetSize(100, 50, { mode: 'percent', percent: 50 }), { width: 50, height: 25 });
  assert.equal(outputName('holiday.photo.HEIC', 'image/webp'), 'holiday.photo.webp');
  // Size is linear in quality; target 500 bytes of a 1000-byte max.
  const r = await searchQuality(async (q) => ({ size: Math.round(q * 1000) }), 500);
  assert.ok(r.fits && r.result.size <= 500 && r.result.size > 450, JSON.stringify(r));
  const none = await searchQuality(async (q) => ({ size: 1000 + q }), 10);
  assert.equal(none.fits, false);
});

test('keyword density', () => {
  const k = keywordDensity('Image converter. The best image converter converts images. Image converter online! Every image.');
  assert.equal(k.single[0].phrase, 'image');
  assert.equal(k.double[0].phrase, 'image converter');
  assert.equal(k.double[0].count, 3);
});

test('stripMetadata removes EXIF losslessly and refuses rotated JPEGs', () => {
  const src = jpegWithExif();
  const out = stripMetadata(src);
  assert.deepEqual([...out], [0xff, 0xd8, 0xff, 0xda, 0, 2, 0xff, 0xd9]);
  assert.equal(inspectMetadata(out).exif, undefined);
  // Same EXIF but with Orientation (0x0112) = 6.
  const rotated = src.slice();
  rotated.set([0x12, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x06, 0x00], 6 + 6 + 10);
  assert.equal(inspectMetadata(rotated).orientation, 6);
  assert.equal(stripMetadata(rotated), null);
});

test('stripMetadata on PNG drops text and eXIf chunks', () => {
  const chunk = (type, data = []) => {
    const len = data.length;
    return [len >>> 24, (len >> 16) & 255, (len >> 8) & 255, len & 255, ...new TextEncoder().encode(type), ...data, 0, 0, 0, 0];
  };
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...chunk('IHDR', new Array(13).fill(0)), ...chunk('tEXt', [65, 0, 66]), ...chunk('IDAT', [1, 2]), ...chunk('IEND')]);
  assert.ok(inspectMetadata(png).text);
  const out = stripMetadata(png);
  assert.equal(out.length, png.length - 15);
  assert.equal(inspectMetadata(out).text, undefined);
});
