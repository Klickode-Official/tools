// Strict JSON validation with exact line/column error reporting.
// JSON.parse error messages differ between browsers, so we run our own
// recursive-descent pass to locate errors, then let JSON.parse build the value.

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

export function validate(text) {
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
    for (const lit of ['true', 'false', 'null']) {
      if (text.startsWith(lit, i)) {
        i += lit.length;
        return;
      }
    }
    if (ch === "'") fail('Strings must use double quotes');
    fail(`Unexpected ${describe(ch)}, expected a value`);
  };

  const object = () => {
    i++;
    ws();
    if (text[i] === '}') {
      i++;
      return;
    }
    for (;;) {
      ws();
      if (text[i] !== '"') {
        if (text[i] === '}') fail('Trailing comma is not allowed');
        fail(`Unexpected ${describe(text[i])}, expected a double-quoted property name`);
      }
      string();
      ws();
      if (text[i] !== ':') fail(`Unexpected ${describe(text[i])}, expected ':'`);
      i++;
      value();
      ws();
      if (text[i] === ',') {
        i++;
        continue;
      }
      if (text[i] === '}') {
        i++;
        return;
      }
      fail(`Unexpected ${describe(text[i])}, expected ',' or '}'`);
    }
  };

  const array = () => {
    i++;
    ws();
    if (text[i] === ']') {
      i++;
      return;
    }
    for (;;) {
      ws();
      if (text[i] === ']') fail('Trailing comma is not allowed');
      value();
      ws();
      if (text[i] === ',') {
        i++;
        continue;
      }
      if (text[i] === ']') {
        i++;
        return;
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
        return;
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
  };

  value();
  ws();
  if (i < text.length) fail(`Unexpected ${describe(text[i])} after the end of the JSON value`);
}

export function parse(text) {
  if (!text.trim()) throw new JsonSyntaxError('Input is empty', 0, text);
  validate(text);
  return JSON.parse(text);
}

export function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
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
  return JSON.stringify(value, null, indent);
}

export function minify(text) {
  return JSON.stringify(parse(text));
}
