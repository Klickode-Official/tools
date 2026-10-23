import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toSatang, bahtText, bahtTextEnglish, formatBaht, vatBreakdown, checkThaiId } from '../assets/js/lib/thai.js';

test('toSatang parses amounts and rounds half up', () => {
  assert.equal(toSatang('1,234.56'), 123456n);
  assert.equal(toSatang('฿ 0.5'), 50n);
  assert.equal(toSatang('10.005'), 1001n);
  assert.equal(toSatang('10.004'), 1000n);
  assert.equal(toSatang('.25'), 25n);
  assert.equal(toSatang('-3'), -300n);
  assert.equal(toSatang('abc'), null);
  assert.equal(toSatang(''), null);
});

test('bahtText follows the usual Thai rules', () => {
  assert.equal(bahtText('0'), 'ศูนย์บาทถ้วน');
  assert.equal(bahtText('1'), 'หนึ่งบาทถ้วน');
  assert.equal(bahtText('11'), 'สิบเอ็ดบาทถ้วน');
  assert.equal(bahtText('21'), 'ยี่สิบเอ็ดบาทถ้วน');
  assert.equal(bahtText('101'), 'หนึ่งร้อยเอ็ดบาทถ้วน');
  assert.equal(bahtText('120'), 'หนึ่งร้อยยี่สิบบาทถ้วน');
  assert.equal(bahtText('1234.5'), 'หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์');
  assert.equal(bahtText('0.25'), 'ยี่สิบห้าสตางค์');
  assert.equal(bahtText('1000000'), 'หนึ่งล้านบาทถ้วน');
  assert.equal(bahtText('1000001'), 'หนึ่งล้านหนึ่งบาทถ้วน');
  assert.equal(bahtText('11000000'), 'สิบเอ็ดล้านบาทถ้วน');
  assert.equal(bahtText('21500000.01'), 'ยี่สิบเอ็ดล้านห้าแสนบาทหนึ่งสตางค์');
  assert.equal(bahtText('1000000000000'), 'หนึ่งล้านล้านบาทถ้วน');
  assert.equal(bahtText('-5'), 'ลบห้าบาทถ้วน');
});

test('bahtTextEnglish', () => {
  assert.equal(bahtTextEnglish('100'), 'One Hundred Baht Only');
  assert.equal(bahtTextEnglish('1234.5'), 'One Thousand Two Hundred Thirty-Four Baht and Fifty Satang');
  assert.equal(bahtTextEnglish('0.07'), 'Seven Satang');
  assert.equal(bahtTextEnglish('2000015'), 'Two Million Fifteen Baht Only');
});

test('vatBreakdown adds and removes 7% VAT with withholding on the base', () => {
  const add = vatBreakdown('10000', { mode: 'add', withholding: 3 });
  assert.deepEqual([add.base, add.vat, add.total, add.wht, add.payable].map(formatBaht), ['10,000.00', '700.00', '10,700.00', '300.00', '10,400.00']);
  const rem = vatBreakdown('107', { mode: 'remove' });
  assert.deepEqual([rem.base, rem.vat, rem.total].map(formatBaht), ['100.00', '7.00', '107.00']);
  const odd = vatBreakdown('99.99', { mode: 'remove' });
  assert.equal(odd.base + odd.vat, odd.total);
  assert.equal(formatBaht(odd.base), '93.45');
  assert.equal(vatBreakdown('nope'), null);
});

test('checkThaiId validates the check digit', () => {
  // 1·13 + 1·12 + 0·11 + 3·10 + 7·9 + 0 + 0 + 0 + 1·5 + 2·4 + 3·3 + 4·2 = 148; 148 mod 11 = 5; 11 − 5 = 6
  const ok = checkThaiId('1-1037-00012-34-6');
  assert.equal(ok.valid, true);
  assert.equal(ok.type, 1);
  assert.equal(ok.formatted, '1-1037-00012-34-6');
  const bad = checkThaiId('1103700012345');
  assert.equal(bad.valid, false);
  assert.equal(bad.reason, 'checksum');
  assert.equal(bad.expected, 6);
  assert.equal(checkThaiId('12345').reason, 'length');
  assert.equal(checkThaiId('12a45').reason, 'digits');
});
