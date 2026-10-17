// Structural JSON diff and line-based text diff.

const kind = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);

const segment = (key) => (typeof key === 'number' ? `[${key}]` : /^[A-Za-z_$][\w$]*$/.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`);

export function jsonDiff(a, b, path = '$', out = []) {
  const ka = kind(a);
  const kb = kind(b);
  if (ka !== kb) {
    out.push({ type: 'changed', path, from: a, to: b });
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
  } else if (a !== b) {
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
