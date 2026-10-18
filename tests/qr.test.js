import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { encodeQr, qrToSvg, QrTooLongError } from '../assets/js/lib/qr.js';
import { crc16, promptPayPayload, parseTarget, parseEmv, validThaiId } from '../assets/js/lib/promptpay.js';

// Matrices made by segno (see fixtures/qr-segno.py), covering every mode and level.
const fixtures = JSON.parse(readFileSync(new URL('./fixtures/qr-segno.json', import.meta.url), 'utf8'));

test('QR codes match the reference encoder module for module', () => {
  for (const f of fixtures) {
    const q = encodeQr(f.text, { ecl: f.ecl, boostEcl: f.boost });
    const label = `${f.text.slice(0, 24)} ${f.ecl} boost=${f.boost}`;
    assert.equal(q.version, f.version, label);
    assert.equal(q.ecl, f.refEcl, label);
    assert.equal(q.mask, f.mask, label);
    assert.deepEqual(q.modules.map((r) => r.map((v) => (v ? '1' : '0')).join('')), f.rows, label);
  }
});

test('QR picks the smallest version and the right mode', () => {
  assert.equal(encodeQr('12345').mode, 'numeric');
  assert.equal(encodeQr('HELLO WORLD').mode, 'alphanumeric');
  assert.equal(encodeQr('hello').mode, 'byte');
  assert.equal(encodeQr('hello').version, 1);
  assert.equal(encodeQr('hello', { ecl: 'L', boostEcl: true }).ecl, 'H');
  assert.throws(() => encodeQr('x'.repeat(3000), { ecl: 'H' }), QrTooLongError);
});

test('qrToSvg draws a square with a quiet zone', () => {
  const svg = qrToSvg(encodeQr('hi'), { margin: 4 });
  assert.match(svg, /viewBox="0 0 29 29"/);
  assert.match(svg, /<path fill="#000000" d="M4 4h7v1h-7z/);
  assert.doesNotMatch(qrToSvg(encodeQr('hi'), { light: 'transparent' }), /<rect/);
});

test('crc16 is CRC-16/CCITT-FALSE', () => {
  assert.equal(crc16('123456789'), '29B1');
});

test('PromptPay payloads match promptpay-qr', () => {
  // Expected values from the promptpay-qr npm package and the promptpay PyPI package.
  assert.equal(promptPayPayload('0812345678'), '00020101021129370016A000000677010111011300668123456785802TH530376463045D82');
  assert.equal(promptPayPayload('0899999999', { amount: 1500 }), '00020101021229370016A000000677010111011300668999999995802TH530376454071500.00630414F7');
  assert.equal(promptPayPayload('1234567890123'), '00020101021129370016A000000677010111021312345678901235802TH53037646304EC40');
  assert.equal(promptPayPayload('000-000-0000', { amount: 4.22 }), '00020101021229370016A000000677010111011300660000000005802TH530376454044.226304E469');
});

test('PromptPay accepts the usual ways of writing a number', () => {
  for (const n of ['0812345678', '081-234-5678', '+66 81 234 5678', '66812345678', '0066812345678']) {
    assert.deepEqual(parseTarget(n), { type: 'phone', value: '0066812345678' }, n);
  }
  assert.equal(parseTarget('12345'), null);
  assert.equal(parseTarget('abc'), null);
  assert.throws(() => promptPayPayload('0812345678', { amount: -5 }));
  const fields = parseEmv(promptPayPayload('0812345678', { amount: 50 }));
  assert.equal(fields['54'], '50.00');
  assert.equal(fields['58'], 'TH');
});

test('validThaiId checks the last digit', () => {
  assert.equal(validThaiId('1101700230708'), true);
  assert.equal(validThaiId('1101700230709'), false);
});
