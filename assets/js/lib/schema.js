import { BigNum } from './json.js';

// Infer a JSON Schema (draft 2020-12) from a sample document.

function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (v instanceof BigNum) return /[.eE]/.test(v.raw) ? 'number' : 'integer';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return typeof v;
}

function infer(value, opts) {
  const type = typeOf(value);
  if (type === 'object') {
    const properties = {};
    for (const [k, v] of Object.entries(value)) properties[k] = infer(v, opts);
    const schema = { type, properties };
    if (opts.required) schema.required = Object.keys(value);
    if (opts.strict) schema.additionalProperties = false;
    return schema;
  }
  if (type === 'array') {
    if (!value.length) return { type, items: {} };
    return { type, items: value.map((v) => infer(v, opts)).reduce(merge) };
  }
  if (type === 'string' && opts.formats) {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(value)) return { type, format: 'date-time' };
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return { type, format: 'date' };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { type, format: 'email' };
    if (/^https?:\/\/\S+$/.test(value)) return { type, format: 'uri' };
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return { type, format: 'uuid' };
  }
  return { type };
}

const types = (s) => (Array.isArray(s.type) ? s.type : s.type ? [s.type] : []);

// Merge two inferred schemas so array items with varying shapes produce one schema.
export function merge(a, b) {
  const ta = types(a);
  const tb = types(b);
  if (ta.length === 1 && tb.length === 1 && ta[0] === 'object' && tb[0] === 'object') {
    const properties = { ...a.properties };
    for (const [k, v] of Object.entries(b.properties)) properties[k] = properties[k] ? merge(properties[k], v) : v;
    const out = { type: 'object', properties };
    if (a.required && b.required) out.required = a.required.filter((k) => b.required.includes(k));
    if (a.additionalProperties === false) out.additionalProperties = false;
    return out;
  }
  if (ta.length === 1 && tb.length === 1 && ta[0] === 'array' && tb[0] === 'array') {
    return { type: 'array', items: Object.keys(a.items).length ? (Object.keys(b.items).length ? merge(a.items, b.items) : a.items) : b.items };
  }
  if (ta.length === 1 && tb.length === 1 && ta[0] === tb[0]) {
    return a.format === b.format ? a : { type: ta[0] };
  }
  let all = [...new Set([...ta, ...tb])];
  if (all.includes('number')) all = all.filter((t) => t !== 'integer');
  return all.length === 1 ? { type: all[0] } : { type: all };
}

export function generateSchema(value, { required = true, strict = false, formats = true } = {}) {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    ...infer(value, { required, strict, formats }),
  };
}
