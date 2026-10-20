import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jsonDiff, textDiff, wordDiff } from '../assets/js/lib/diff.js';
import { generateSchema } from '../assets/js/lib/schema.js';
import { compile, findMatches } from '../assets/js/lib/regex.js';
import { base64Encode, base64Decode, urlDecode } from '../assets/js/lib/encode.js';
import { decodeJwt, describeClaims } from '../assets/js/lib/jwt.js';
import { uuidv4, uuidv7, inspectUuid } from '../assets/js/lib/uuid.js';
import { parseTimestamp } from '../assets/js/lib/time.js';
import { cases, stats } from '../assets/js/lib/text.js';

test('jsonDiff reports added, removed and changed paths', () => {
  const d = jsonDiff({ a: 1, b: { c: [1, 2] }, 'x-y': 1 }, { a: 2, b: { c: [1] }, z: null });
  assert.deepEqual(d, [
    { type: 'changed', path: '$.a', from: 1, to: 2 },
    { type: 'removed', path: '$.b.c[1]', from: 2 },
    { type: 'removed', path: '$["x-y"]', from: 1 },
    { type: 'added', path: '$.z', to: null },
  ]);
});

test('textDiff', () => {
  assert.deepEqual(textDiff('a\nb\nc', 'a\nc\nd').map((o) => o.type[0] + o.text), ['sa', 'rb', 'sc', 'ad']);
});

test('generateSchema merges array items and detects formats', () => {
  const s = generateSchema([{ id: 1, at: '2024-01-01T00:00:00Z' }, { id: 2.5, tag: 'x' }]);
  assert.deepEqual(s.items, {
    type: 'object',
    properties: { id: { type: 'number' }, at: { type: 'string', format: 'date-time' }, tag: { type: 'string' } },
    required: ['id'],
  });
});

test('regex matching handles empty matches and named groups', () => {
  const { re } = compile('(?<d>\\d*)', 'g');
  assert.equal(findMatches(re, 'a1').length, 3);
  assert.equal(findMatches(compile('(?<y>\\d{4})', '').re, 'in 2024')[0].named.y, '2024');
  assert.match(compile('(', 'g').error, /Invalid|Unterminated/);
});

test('base64 and url encoding are UTF-8 safe', () => {
  assert.equal(base64Encode('héllo ✓'), 'aMOpbGxvIOKckw==');
  assert.equal(base64Decode('aMOpbGxvIOKckw'), 'héllo ✓');
  assert.equal(base64Encode('??>', { urlSafe: true }), 'Pz8-');
  assert.throws(() => base64Decode('ab$c'), /not valid/);
  assert.equal(urlDecode('a+b%20c'), 'a b c');
});

test('jwt decoding', () => {
  const tok = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const { header, payload } = decodeJwt(tok);
  assert.equal(header.alg, 'HS256');
  assert.equal(payload.name, 'John Doe');
  assert.equal(describeClaims({ exp: 1 }).status, 'Expired');
  assert.throws(() => decodeJwt('a.b'), /3 dot-separated/);
});

test('uuids', () => {
  assert.equal(inspectUuid(uuidv4()).version, 4);
  const v7 = inspectUuid(uuidv7(Date.UTC(2025, 0, 1)));
  assert.equal(v7.version, 7);
  assert.equal(v7.timestamp, '2025-01-01T00:00:00.000Z');
  assert.equal(inspectUuid('nope').valid, false);
});

test('timestamps guess units', () => {
  assert.equal(parseTimestamp('1700000000').unit, 'seconds');
  assert.equal(parseTimestamp('1700000000000').date.toISOString(), '2023-11-14T22:13:20.000Z');
  assert.equal(parseTimestamp('1700000000000000').unit, 'microseconds');
});

test('case conversion and stats', () => {
  assert.equal(cases.snake('parseHTTPResponse code'), 'parse_http_response_code');
  assert.equal(cases.camel('user-id value'), 'userIdValue');
  assert.equal(cases.constant('maxRetryCount'), 'MAX_RETRY_COUNT');
  assert.deepEqual(stats('Hi there. Bye!').words, 3);
});

test('jsonDiff compares long numbers by their digits', async () => {
  const { parse } = await import('../assets/js/lib/json.js');
  assert.deepEqual(jsonDiff(parse('{"id":12345678901234567890}'), parse('{"id":12345678901234567891}')).map((d) => d.path), ['$.id']);
  assert.deepEqual(jsonDiff(parse('{"id":12345678901234567890}'), parse('{"id":12345678901234567890}')), []);
});

test('Thai text is split into real words', async () => {
  const { stats, keywordDensity } = await import('../assets/js/lib/text.js');
  assert.equal(stats('ร้านขายพลอยในกรุงเทพ ส่งฟรีทั่วประเทศ').words, 9);
  const k = keywordDensity('พลอยไพลินแท้ ร้านพลอยไพลินในกรุงเทพ พลอยไพลินราคาส่ง');
  assert.equal(k.double[0].phrase, 'พลอยไพลิน');
  assert.ok(!k.single.some((w) => w.phrase === 'ใน'), 'Thai stop words are skipped');
});

test('jsonDiff matches list items by id', () => {
  const a = { users: [{ id: 1, name: 'Ada' }, { id: 2, name: 'Alan' }] };
  const b = { users: [{ id: 0, name: 'New' }, { id: 1, name: 'Ada L.' }, { id: 2, name: 'Alan' }] };
  assert.deepEqual(jsonDiff(a, b).map((d) => `${d.type} ${d.path}`), ['changed $.users[id=1].name', 'added $.users[id=0]']);
  // Without an id the old position-by-position comparison still applies.
  assert.equal(jsonDiff([1, 2], [0, 1, 2]).length, 3);
});

test('wordDiff marks the changed words in a line', () => {
  assert.deepEqual(wordDiff('It ships in 5 days.', 'It ships tomorrow.'), [
    { type: 'same', text: 'It ships ' },
    { type: 'removed', text: 'in 5 days' },
    { type: 'added', text: 'tomorrow' },
    { type: 'same', text: '.' },
  ]);
});
