// Strict, lossless JSON parsing with exact line/column error reporting.
// JSON.parse error messages differ between browsers, and JSON.parse rounds numbers it can't hold
// exactly (a 19-digit order ID loses its last digits), so we parse ourselves. Numbers that a
// JavaScript number can't represent exactly come back as BigNum, which keeps the original text.

// A number kept exactly as written because a JavaScript number would change it.
export class BigNum {
  constructor(raw) {
    this.raw = raw;
  }
  toString() {
    return this.raw;
  }
  valueOf() {
    return Number(this.raw);
  }
}

// True when converting the text to a JavaScript number would lose digits.
function isLossy(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return true; // 1e400 would become Infinity
  if (n === 0 && /[1-9]/.test(raw.replace(/[eE].*$/, ''))) return true; // 1e-400 would become 0
  if (!/[.eE]/.test(raw)) return !Number.isSafeInteger(n);
  const digits = raw.replace(/^-/, '').replace(/[eE].*$/, '').replace('.', '').replace(/^0+/, '').replace(/0+$/, '');
  return digits.length > 15;
}

export class JsonSyntaxError extends Error {
  constructor(message, index, text) {
    const { line, column } = lineCol(text, index);
    super(`${message} at line ${line}, column ${column}`);
    this.name = 'JsonSyntaxError';
    this.index = index;
    this.line = line;
    this.column = column;
  }
}

export function lineCol(text, index) {
  let line = 1;
  let lineStart = 0;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text[i] === '\n') {
      line++;
      lineStart = i + 1;
    }
  }
  return { line, column: index - lineStart + 1 };
}

export function parseValue(text) {
  let i = 0;
  const fail = (msg, at = i) => {
    throw new JsonSyntaxError(msg, at, text);
  };
  const describe = (ch) => (ch === undefined ? 'end of input' : `'${ch}'`);
  const ws = () => {
    while (i < text.length && ' \t\n\r'.includes(text[i])) i++;
  };

  const value = () => {
    ws();
    const ch = text[i];
    if (ch === '{') return object();
    if (ch === '[') return array();
    if (ch === '"') return string();
    if (ch === '-' || (ch >= '0' && ch <= '9')) return number();
    for (const [lit, v] of [['true', true], ['false', false], ['null', null]]) {
      if (text.startsWith(lit, i)) {
        i += lit.length;
        return v;
      }
    }
    if (ch === "'") fail('Strings must use double quotes');
    fail(`Unexpected ${describe(ch)}, expected a value`);
  };

  const object = () => {
    const obj = {};
    i++;
    ws();
    if (text[i] === '}') {
      i++;
      return obj;
    }
    for (;;) {
      ws();
      if (text[i] !== '"') {
        if (text[i] === '}') fail('Trailing comma is not allowed');
        fail(`Unexpected ${describe(text[i])}, expected a double-quoted property name`);
      }
      const key = string();
      ws();
      if (text[i] !== ':') fail(`Unexpected ${describe(text[i])}, expected ':'`);
      i++;
      // defineProperty so a "__proto__" key becomes plain data, as with JSON.parse.
      Object.defineProperty(obj, key, { value: value(), enumerable: true, writable: true, configurable: true });
      ws();
      if (text[i] === ',') {
        i++;
        continue;
      }
      if (text[i] === '}') {
        i++;
        return obj;
      }
      fail(`Unexpected ${describe(text[i])}, expected ',' or '}'`);
    }
  };

  const array = () => {
    const arr = [];
    i++;
    ws();
    if (text[i] === ']') {
      i++;
      return arr;
    }
    for (;;) {
      ws();
      if (text[i] === ']') fail('Trailing comma is not allowed');
      arr.push(value());
      ws();
      if (text[i] === ',') {
        i++;
        continue;
      }
      if (text[i] === ']') {
        i++;
        return arr;
      }
      fail(`Unexpected ${describe(text[i])}, expected ',' or ']'`);
    }
  };

  const string = () => {
    const start = i;
    i++;
    while (i < text.length) {
      const ch = text[i];
      if (ch === '"') {
        i++;
        return JSON.parse(text.slice(start, i));
      }
      if (ch === '\\') {
        const esc = text[i + 1];
        if (esc === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) fail('Invalid unicode escape');
          i += 6;
          continue;
        }
        if (esc === undefined || !'"\\/bfnrt'.includes(esc)) fail(`Invalid escape sequence '\\${esc ?? ''}'`);
        i += 2;
        continue;
      }
      if (ch < ' ') fail('Unescaped control character in string');
      i++;
    }
    fail('Unterminated string', start);
  };

  const number = () => {
    const m = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(text.slice(i));
    if (!m) fail('Invalid number');
    i += m[0].length;
    return isLossy(m[0]) ? new BigNum(m[0]) : Number(m[0]);
  };

  const result = value();
  ws();
  if (i < text.length) fail(`Unexpected ${describe(text[i])} after the end of the JSON value`);
  return result;
}

export const validate = (text) => void parseValue(text);

export function parse(text) {
  if (!text.trim()) throw new JsonSyntaxError('Input is empty', 0, text);
  return parseValue(text);
}

// How many numbers in a parsed value were kept as BigNum.
export function countBigNums(value) {
  if (value instanceof BigNum) return 1;
  if (Array.isArray(value)) return value.reduce((n, v) => n + countBigNums(v), 0);
  if (value && typeof value === 'object') return Object.values(value).reduce((n, v) => n + countBigNums(v), 0);
  return 0;
}

// JSON.stringify that writes BigNum values back out exactly as they were written.
export function stringify(value, indent = 0) {
  const pad = typeof indent === 'string' ? indent : ' '.repeat(Math.max(0, Math.min(10, Number(indent) || 0)));
  const walk = (v, depth) => {
    if (v instanceof BigNum) return v.raw;
    if (v === null || typeof v === 'boolean') return String(v);
    if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'null';
    if (typeof v === 'string') return JSON.stringify(v);
    const inner = pad ? `\n${pad.repeat(depth + 1)}` : '';
    const outer = pad ? `\n${pad.repeat(depth)}` : '';
    const sep = pad ? ': ' : ':';
    if (Array.isArray(v)) {
      if (!v.length) return '[]';
      return `[${inner}${v.map((x) => walk(x, depth + 1)).join(`,${inner}`)}${outer}]`;
    }
    const keys = Object.keys(v);
    if (!keys.length) return '{}';
    return `{${inner}${keys.map((k) => `${JSON.stringify(k)}${sep}${walk(v[k], depth + 1)}`).join(`,${inner}`)}${outer}}`;
  };
  return walk(value, 0);
}

export function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object' && !(value instanceof BigNum)) {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, sortKeys(value[k])]),
    );
  }
  return value;
}

export function format(text, { indent = 2, sort = false } = {}) {
  let value = parse(text);
  if (sort) value = sortKeys(value);
  return stringify(value, indent);
}

export function minify(text) {
  return stringify(parse(text));
}
