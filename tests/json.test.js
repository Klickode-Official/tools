import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse, format, minify, JsonSyntaxError } from '../assets/js/lib/json.js';

test('formats and minifies valid JSON', () => {
  assert.equal(format('{"b":1,"a":[1,2]}'), '{\n  "b": 1,\n  "a": [\n    1,\n    2\n  ]\n}');
  assert.equal(format('{"b":1,"a":2}', { sort: true, indent: 0 }), '{"a":2,"b":1}');
  assert.equal(minify('{ "a" : [ 1 , true , null ] }'), '{"a":[1,true,null]}');
});

test('reports line and column for errors', () => {
  const cases = [
    ['{\n  "a": 1,\n}', 3, 1, /Trailing comma/],
    ['[1, 2,]', 1, 7, /Trailing comma/],
    ["{'a': 1}", 1, 2, /double-quoted property/],
    ['{"a": 01}', 1, 8, /expected ',' or '}'/],
    ['{"a": "x', 1, 7, /Unterminated string/],
    ['[1] [2]', 1, 5, /after the end/],
    ['{"a": tru}', 1, 7, /expected a value/],
    ['"bad \\x"', 1, 6, /Invalid escape/],
  ];
  for (const [input, line, column, msg] of cases) {
    assert.throws(() => parse(input), (e) => e instanceof JsonSyntaxError && e.line === line && e.column === column && msg.test(e.message), input);
  }
});

test('accepts every value JSON.parse accepts', () => {
  for (const s of ['0', '-1.5e+10', '"\\u00e9\\n"', '[]', '{}', ' null ', '{"a":{"b":[{"c":false}]}}']) {
    assert.deepEqual(parse(s), JSON.parse(s));
  }
});
