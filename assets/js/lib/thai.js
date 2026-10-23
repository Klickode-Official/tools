// Thai business helpers: amounts in words (บาทถ้วน), VAT and withholding tax, and Thai ID numbers.
// Amounts are handled as whole satang in BigInt, so long numbers and .005 rounding stay exact.

const DIGITS = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const PLACES = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];

// Parses "1,234.567" into satang, rounding half up. Returns null if it isn't a number.
export function toSatang(input) {
  const s = String(input).replace(/[,\s฿]/g, '').replace(/บาท$/, '');
  const m = /^(-)?(\d*)(?:\.(\d*))?$/.exec(s);
  if (!m || (!m[2] && !m[3])) return null;
  const frac = (m[3] || '').padEnd(3, '0');
  let satang = BigInt(m[2] || '0') * 100n + BigInt(frac.slice(0, 2));
  if (Number(frac[2]) >= 5) satang += 1n;
  return m[1] && satang ? -satang : satang;
}

// Up to 999,999 in Thai. A final 1 is เอ็ด when the group has tens or more (11, 101), else หนึ่ง.
function sixDigits(n) {
  const s = String(n);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const d = Number(s[i]);
    const place = s.length - 1 - i;
    if (d === 0) continue;
    if (place === 1 && d === 1) out += 'สิบ';
    else if (place === 1 && d === 2) out += 'ยี่สิบ';
    else if (place === 0 && d === 1 && n > 9) out += 'เอ็ด';
    else out += DIGITS[d] + PLACES[place];
  }
  return out;
}

function thaiNumber(n) {
  if (n === 0n) return '';
  const millions = n / 1000000n;
  const rest = Number(n % 1000000n);
  return (millions ? `${thaiNumber(millions)}ล้าน` : '') + sixDigits(rest);
}

// 1234.5 → "หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์"; 100 → "หนึ่งร้อยบาทถ้วน".
export function bahtText(input) {
  const satang = typeof input === 'bigint' ? input : toSatang(input);
  if (satang === null) return null;
  if (satang === 0n) return 'ศูนย์บาทถ้วน';
  const neg = satang < 0n;
  const abs = neg ? -satang : satang;
  const baht = abs / 100n;
  const st = abs % 100n;
  const words = (baht ? `${thaiNumber(baht)}บาท` : '') + (st ? `${thaiNumber(st)}สตางค์` : 'ถ้วน');
  return (neg ? 'ลบ' : '') + words;
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const SCALES = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion'];

function hundreds(n) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts = [];
  if (h) parts.push(`${ONES[h]} Hundred`);
  if (r >= 20) parts.push(TENS[Math.floor(r / 10)] + (r % 10 ? `-${ONES[r % 10]}` : ''));
  else if (r) parts.push(ONES[r]);
  return parts.join(' ');
}

function englishNumber(n) {
  if (n === 0n) return 'Zero';
  const groups = [];
  for (let i = 0; n > 0n; i++, n /= 1000n) {
    const g = Number(n % 1000n);
    if (g) groups.unshift(`${hundreds(g)}${SCALES[i] ? ` ${SCALES[i]}` : ''}`);
  }
  return groups.join(' ');
}

// 1234.5 → "One Thousand Two Hundred Thirty-Four Baht and Fifty Satang"; 100 → "One Hundred Baht Only".
export function bahtTextEnglish(input) {
  const satang = typeof input === 'bigint' ? input : toSatang(input);
  if (satang === null) return null;
  const neg = satang < 0n;
  const abs = neg ? -satang : satang;
  const baht = abs / 100n;
  const st = abs % 100n;
  if (abs / 100n >= 10n ** 21n) return null;
  let words;
  if (!st) words = `${englishNumber(baht)} Baht Only`;
  else if (!baht) words = `${englishNumber(st)} Satang`;
  else words = `${englishNumber(baht)} Baht and ${englishNumber(st)} Satang`;
  return (neg ? 'Minus ' : '') + words;
}

// Formats satang as "1,234.50".
export function formatBaht(satang) {
  const neg = satang < 0n;
  const abs = neg ? -satang : satang;
  return `${neg ? '-' : ''}${(abs / 100n).toLocaleString('en-US')}.${String(abs % 100n).padStart(2, '0')}`;
}

// Percentage of an amount in satang, rounded half up to the satang. rate is a number like 7 or 1.5.
const percentOf = (satang, rate) => {
  const bp = BigInt(Math.round(rate * 100)); // basis points
  const x = satang * bp;
  return (x + (x >= 0n ? 5000n : -5000n)) / 10000n;
};

/**
 * VAT and withholding tax for a Thai invoice.
 * mode 'add': amount is before VAT. mode 'remove': amount already includes VAT.
 * Withholding tax is worked out on the amount before VAT, as the Revenue Department requires.
 */
export function vatBreakdown(amount, { rate = 7, mode = 'add', withholding = 0 } = {}) {
  const satang = toSatang(amount);
  if (satang === null) return null;
  let base;
  let vat;
  if (mode === 'remove') {
    const bp = BigInt(Math.round(rate * 100));
    const x = satang * 10000n;
    const d = 10000n + bp;
    base = (x + d / 2n) / d;
    vat = satang - base;
  } else {
    base = satang;
    vat = percentOf(base, rate);
  }
  const total = base + vat;
  const wht = percentOf(base, withholding);
  return { base, vat, total, wht, payable: total - wht };
}

// Who a Thai ID number's first digit says the holder is (Department of Provincial Administration).
export const ID_TYPES = {
  0: 'Person without Thai nationality, registered under a special scheme',
  1: 'Thai national born in 1984 or later, registered on time',
  2: 'Thai national born in 1984 or later, registered late',
  3: 'Thai national or foreign resident in a house register before 1984',
  4: 'Thai national or foreign resident who moved in before 1984 without an ID number yet',
  5: 'Thai national added to the register later (for example after a missed census)',
  6: 'Foreign national living in Thailand temporarily, or who entered without a permit',
  7: 'Child of a type 6 resident, born in Thailand',
  8: 'Foreign national with permanent residence, or naturalised as Thai, from 1984 on',
};

/** Checks a 13-digit Thai ID number. Dashes and spaces are ignored. */
export function checkThaiId(input) {
  const digits = String(input).replace(/[\s-]/g, '');
  if (!/^\d+$/.test(digits)) return { valid: false, reason: 'digits' };
  if (digits.length !== 13) return { valid: false, reason: 'length', length: digits.length };
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(digits[i]) * (13 - i);
  const expected = (11 - (sum % 11)) % 10;
  const formatted = `${digits[0]}-${digits.slice(1, 5)}-${digits.slice(5, 10)}-${digits.slice(10, 12)}-${digits[12]}`;
  if (expected !== Number(digits[12])) return { valid: false, reason: 'checksum', expected, formatted };
  return { valid: true, formatted, type: Number(digits[0]) };
}
