// RFC 4180 CSV parsing/serialising and JSON <-> CSV conversion.

export function parseCsv(text, delimiter = ',') {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  if (text.charCodeAt(0) === 0xfeff) i = 1;

  for (; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"' && field === '') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (inQuotes) throw new Error('Unterminated quoted field');
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function inferType(s) {
  if (s === '') return '';
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null') return null;
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(s) && Number.isFinite(Number(s))) {
    // Keep long integers as strings so IDs don't lose precision.
    if (Number.isSafeInteger(Number(s)) || s.includes('.') || /e/i.test(s)) return Number(s);
  }
  return s;
}

export function csvToJson(text, { delimiter = ',', header = true, types = true } = {}) {
  const rows = parseCsv(text, delimiter).filter((r) => !(r.length === 1 && r[0] === ''));
  const cast = types ? inferType : (s) => s;
  if (!header) return rows.map((r) => r.map(cast));
  const [head = [], ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, idx) => [h, cast(r[idx] ?? '')])));
}

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

function cell(v, delimiter) {
  if (v === null || v === undefined) return '';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /["\r\n]/.test(s) || s.includes(delimiter) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function jsonToCsv(data, { delimiter = ',', flattenNested = true } = {}) {
  if (!Array.isArray(data)) data = [data];
  if (data.every(Array.isArray)) {
    return data.map((r) => r.map((v) => cell(v, delimiter)).join(delimiter)).join('\n');
  }
  const records = data.map((r) => {
    if (!r || typeof r !== 'object' || Array.isArray(r)) return { value: r };
    return flattenNested ? flatten(r) : r;
  });
  const columns = [];
  const seen = new Set();
  for (const r of records) {
    for (const k of Object.keys(r)) {
      if (!seen.has(k)) {
        seen.add(k);
        columns.push(k);
      }
    }
  }
  const lines = [columns.map((c) => cell(c, delimiter)).join(delimiter)];
  for (const r of records) lines.push(columns.map((c) => cell(r[c], delimiter)).join(delimiter));
  return lines.join('\n');
}
