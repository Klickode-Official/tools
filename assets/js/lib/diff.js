import { BigNum } from './json.js';

// Structural JSON diff and line-based text diff.

const kind = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : v instanceof BigNum ? 'number' : typeof v);
// Compare numbers by value, including ones kept exactly as BigNum text.
const same = (a, b) => (a instanceof BigNum || b instanceof BigNum ? String(a) === String(b) : a === b);

const segment = (key) => (typeof key === 'number' ? `[${key}]` : /^[A-Za-z_$][\w$]*$/.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`);

const ID_KEYS = ['id', '_id', 'uuid', 'key', 'sku', 'slug', 'code'];

// The id field to match two lists of objects by, if every item in both has a unique simple value for it.
function matchKey(a, b) {
  if (!a.length || !b.length) return null;
  const items = [...a, ...b];
  if (!items.every((x) => x && typeof x === 'object' && !Array.isArray(x))) return null;
  return (
    ID_KEYS.find((k) =>
      [a, b].every((list) => {
        const vals = list.map((x) => x[k]);
        return vals.every((v) => ['string', 'number'].includes(typeof v) || v instanceof BigNum) && new Set(vals.map(String)).size === vals.length;
      }),
    ) || null
  );
}

export function jsonDiff(a, b, path = '$', out = []) {
  const ka = kind(a);
  const kb = kind(b);
  if (ka !== kb) {
    out.push({ type: 'changed', path, from: a, to: b });
  } else if (ka === 'array' && matchKey(a, b)) {
    // Lists of records with an id: match items by id, so an insertion doesn't shift everything after it.
    const key = matchKey(a, b);
    const seg = (v) => `[${key}=${typeof v === 'string' ? JSON.stringify(v) : String(v)}]`;
    const byId = new Map(b.map((item) => [String(item[key]), item]));
    const seen = new Set();
    for (const item of a) {
      const id = String(item[key]);
      if (byId.has(id)) jsonDiff(item, byId.get(id), path + seg(item[key]), out);
      else out.push({ type: 'removed', path: path + seg(item[key]), from: item });
      seen.add(id);
    }
    for (const item of b) if (!seen.has(String(item[key]))) out.push({ type: 'added', path: path + seg(item[key]), to: item });
  } else if (ka === 'array') {
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) {
      const p = path + segment(i);
      if (i >= a.length) out.push({ type: 'added', path: p, to: b[i] });
      else if (i >= b.length) out.push({ type: 'removed', path: p, from: a[i] });
      else jsonDiff(a[i], b[i], p, out);
    }
  } else if (ka === 'object') {
    for (const k of Object.keys(a)) {
      const p = path + segment(k);
      if (!Object.hasOwn(b, k)) out.push({ type: 'removed', path: p, from: a[k] });
      else jsonDiff(a[k], b[k], p, out);
    }
    for (const k of Object.keys(b)) {
      if (!Object.hasOwn(a, k)) out.push({ type: 'added', path: path + segment(k), to: b[k] });
    }
  } else if (!same(a, b)) {
    out.push({ type: 'changed', path, from: a, to: b });
  }
  return out;
}

// Myers-free LCS diff; fine for the few-thousand-line inputs a browser tool sees.
export function textDiff(left, right) {
  const a = left.split('\n');
  const b = right.split('\n');
  const n = a.length;
  const m = b.length;
  if (n * m > 25_000_000) throw new Error('Inputs are too large to diff in the browser');
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: 'same', text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'removed', text: a[i++] });
    } else {
      ops.push({ type: 'added', text: b[j++] });
    }
  }
  while (i < n) ops.push({ type: 'removed', text: a[i++] });
  while (j < m) ops.push({ type: 'added', text: b[j++] });
  return ops;
}

// Word-level diff between two versions of one line: which pieces were kept, removed or added.
// Tokens are words and the spaces/punctuation between them, so joining them gives back the line.
export function wordDiff(before, after) {
  const split = (t) => t.match(/\s+|[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]/gu) || [];
  const a = split(before);
  const b = split(after);
  if (a.length * b.length > 250000) return null; // very long lines: line-level marking is enough
  const dp = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops = [];
  const push = (type, text) => (ops.length && ops[ops.length - 1].type === type ? (ops[ops.length - 1].text += text) : ops.push({ type, text }));
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      push('same', a[i]);
      i++;
      j++;
    }
    else if (dp[i + 1][j] >= dp[i][j + 1]) push('removed', a[i++]);
    else push('added', b[j++]);
  }
  while (i < a.length) push('removed', a[i++]);
  while (j < b.length) push('added', b[j++]);
  return ops;
}
