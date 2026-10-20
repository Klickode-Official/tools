import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPayload, intlPhone, normaliseUrl } from '../tools/qr-code-generator/payloads.js';
import { encodeQr } from '../assets/js/lib/qr.js';
import { qrArt, logoBox, scanWarnings, contrast } from '../assets/js/lib/qr-art.js';

test('phone numbers become international', () => {
  assert.equal(intlPhone('081 234 5678'), '66812345678');
  assert.equal(intlPhone('+44 7700 900123'), '447700900123');
  assert.equal(intlPhone('0044 7700 900123'), '447700900123');
  assert.equal(intlPhone(''), '');
});

test('links get https:// when they have no scheme', () => {
  assert.equal(normaliseUrl('klickode.com'), 'https://klickode.com');
  assert.equal(normaliseUrl('http://x.co'), 'http://x.co');
  assert.equal(normaliseUrl('mailto:a@b.co'), 'mailto:a@b.co');
});

test('Wi-Fi payload escapes special characters', () => {
  assert.equal(buildPayload('wifi', { ssid: 'Café; Guest', password: 'p@ss:w"rd\\', security: 'WPA' }), String.raw`WIFI:T:WPA;S:Café\; Guest;P:p@ss\:w\"rd\\;;`);
  assert.equal(buildPayload('wifi', { ssid: 'Open', security: 'nopass', hidden: true }), 'WIFI:T:nopass;S:Open;H:true;;');
  assert.equal(buildPayload('wifi', { ssid: '' }), '');
});

test('chat and contact payloads', () => {
  assert.equal(buildPayload('whatsapp', { phone: '081-234-5678', message: 'Hi & hello' }), 'https://wa.me/66812345678?text=Hi%20%26%20hello');
  assert.equal(buildPayload('line', { lineId: '@shop' }), 'https://line.me/R/ti/p/%40shop');
  assert.equal(buildPayload('line', { lineId: 'somchai' }), 'https://line.me/ti/p/~somchai');
  assert.equal(buildPayload('email', { email: 'a@b.co', subject: 'Order 1' }), 'mailto:a@b.co?subject=Order%201');
  assert.equal(buildPayload('phone', { phone: '02 123 4567' }), 'tel:+6621234567');
  assert.equal(buildPayload('sms', { phone: '0812345678', message: 'yo' }), 'SMSTO:+66812345678:yo');
  const v = buildPayload('contact', { name: 'Ada King, Countess', org: 'A;B', phone: '0812345678' });
  assert.match(v, /^BEGIN:VCARD\r\nVERSION:3\.0\r\n/);
  assert.match(v, /FN:Ada King\\, Countess/);
  assert.match(v, /ORG:A\\;B/);
  assert.match(v, /TEL;TYPE=CELL:\+66812345678/);
  assert.equal(buildPayload('nope', {}), '');
});

test('qrArt draws every style and keeps the logo safe', () => {
  const qr = encodeQr('https://www.klickode.com/', { ecl: 'H' });
  for (const style of ['square', 'rounded', 'dots']) {
    const svg = qrArt(qr, { style });
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 41 41"/);
    assert.match(svg, /fill-rule="evenodd"/);
  }
  const logo = 'data:image/png;base64,iVBORw0KGgo=';
  assert.match(qrArt(qr, { logo }), /<image href="data:image\/png;base64,iVBORw0KGgo="/);
  assert.doesNotMatch(qrArt(qr, { logo: 'javascript:alert(1)' }), /<image/);
  assert.doesNotMatch(qrArt(qr, { logo: 'data:image/png;base64,x" onload="alert(1)' }), /onload/);
  assert.doesNotMatch(qrArt(qr, { dark: 'red"/><script>' }), /script/);
  assert.doesNotMatch(qrArt(qr, { light: null }), /<rect/);
  assert.equal(logoBox(29) % 2, 1);
  assert.equal(logoBox(30) % 2, 0);
});

test('scan warnings catch low contrast and inverted colours', () => {
  assert.deepEqual(scanWarnings('#000000', '#ffffff'), []);
  assert.equal(scanWarnings('#ffffff', '#000000').length, 1);
  assert.match(scanWarnings('#999999', '#bbbbbb')[0], /contrast/);
  assert.equal(Math.round(contrast('#000000', '#ffffff')), 21);
});
