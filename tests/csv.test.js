import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, csvToJson, jsonToCsv } from '../assets/js/lib/csv.js';

test('parses quoted fields, escaped quotes and CRLF', () => {
  assert.deepEqual(parseCsv('a,"b,c","say ""hi"""\r\n1,"multi\nline",3\n'), [
    ['a', 'b,c', 'say "hi"'],
    ['1', 'multi\nline', '3'],
  ]);
  assert.throws(() => parseCsv('"open'), /Unterminated/);
});

test('csvToJson infers types but keeps unsafe integers as strings', () => {
  assert.deepEqual(csvToJson('id,name,active,score\n12345678901234567890,Ann,true,1.5\n2,Bo,false,'), [
    { id: '12345678901234567890', name: 'Ann', active: true, score: 1.5 },
    { id: 2, name: 'Bo', active: false, score: '' },
  ]);
  assert.deepEqual(csvToJson('a;b\n1;2', { delimiter: ';', types: false }), [{ a: '1', b: '2' }]);
});

test('jsonToCsv flattens nested objects and unions columns', () => {
  const csv = jsonToCsv([{ a: 1, n: { x: 'q,r' } }, { b: 'say "hi"', tags: [1, 2] }]);
  assert.equal(csv, 'a,n.x,b,tags\n1,"q,r",,\n,,"say ""hi""","[1,2]"');
});

test('round-trips', () => {
  const data = [{ a: 'x', b: 2 }, { a: 'y\nz', b: 3 }];
  assert.deepEqual(csvToJson(jsonToCsv(data)), data);
});

test('jsonToCsv keeps long numbers exact', async () => {
  const { parse } = await import('../assets/js/lib/json.js');
  assert.equal(jsonToCsv(parse('[{"id":12345678901234567890,"n":{"x":1}}]')), 'id,n.x\n12345678901234567890,1');
});
