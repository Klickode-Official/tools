// Unix timestamp <-> date conversion.

export function parseTimestamp(input) {
  const s = input.trim();
  if (!s) throw new Error('Enter a timestamp or date');
  if (/^-?\d+(\.\d+)?$/.test(s)) {
    const n = Number(s);
    const abs = Math.abs(n);
    // Guess the unit from magnitude: seconds, milliseconds, microseconds, nanoseconds.
    let ms = n * 1000;
    let unit = 'seconds';
    if (abs >= 1e17) [ms, unit] = [n / 1e6, 'nanoseconds'];
    else if (abs >= 1e14) [ms, unit] = [n / 1e3, 'microseconds'];
    else if (abs >= 1e11) [ms, unit] = [n, 'milliseconds'];
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) throw new Error('Timestamp is out of range');
    return { date: d, unit };
  }
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) throw new Error('Could not parse that date');
  return { date: d, unit: 'date string' };
}

export function relative(date, now = Date.now()) {
  const diff = (date.getTime() - now) / 1000;
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [u, secs] of units) {
    if (Math.abs(diff) >= secs || u === 'second') return rtf.format(Math.round(diff / secs), u);
  }
}

const fmt = (date, locale, opts) => new Intl.DateTimeFormat(locale, opts).format(date);

export function describe(date, timeZone) {
  const ms = date.getTime();
  const out = {
    seconds: String(Math.floor(ms / 1000)),
    milliseconds: String(ms),
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: fmt(date, 'en-GB', { dateStyle: 'full', timeStyle: 'long' }),
  };
  if (timeZone) {
    try {
      out.zone = fmt(date, 'en-GB', { dateStyle: 'full', timeStyle: 'long', timeZone });
    } catch {
      // Unknown zone name: leave the row out.
    }
  }
  // Thai Buddhist calendar (พ.ศ. = C.E. + 543), Bangkok time.
  try {
    out.thai = fmt(date, 'th-TH-u-ca-buddhist', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Bangkok' });
  } catch {
    // Older browsers without the Buddhist calendar.
  }
  out.relative = relative(date);
  return out;
}

export const COMMON_ZONES = ['Asia/Bangkok', 'UTC', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Asia/Dubai', 'Australia/Sydney'];

export function allZones() {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return COMMON_ZONES;
  }
}
