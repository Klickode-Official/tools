// JSON Schema Generator — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'json-schema-generator',
  category: 'json',
  name: 'JSON Schema Generator',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'JSON Schema Generator — Infer a Schema from Sample JSON',
  description: 'Generate a JSON Schema (draft 2020-12) from example JSON. Detects types, required fields, nested objects, arrays and common string formats.',
  // One line for tool cards on the home and category pages.
  short: 'Infer a draft 2020-12 JSON Schema from a sample payload.',
  body: `<div class="toolbar">
  <button class="btn primary" id="generate">Generate</button>
  <label class="check"><input type="checkbox" id="required" checked> Mark fields required</label>
  <label class="check"><input type="checkbox" id="strict"> Disallow extra properties</label>
  <label class="check"><input type="checkbox" id="formats" checked> Detect formats</label>
  <button class="btn" id="sample">Sample</button>
  <button class="btn" id="download">Download</button>
</div>
<div class="status" id="status" aria-live="polite"></div>

<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="input">Sample JSON</label><button class="btn small" id="clear">Clear</button></div>
    <textarea id="input" spellcheck="false" placeholder="{"id": 1, "email": "a@b.co"}"></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><span class="label">JSON Schema</span><button class="btn small" data-copy="#output">Copy</button></div>
    <textarea id="output" spellcheck="false" readonly></textarea>
  </div>
</div>`,
  content: `<h2>How the schema is inferred</h2>
<ul><li>Every value's type is recorded; integers and decimals are distinguished.</li><li>For arrays of objects, all items are merged: a field is <code>required</code> only if every item has it, and mixed types become a type union.</li><li>Strings that look like dates, date-times, emails, URIs or UUIDs get a <code>format</code>.</li></ul>
<p>An inferred schema is a starting point. Review it, then tighten it with constraints like <code>minLength</code>, <code>enum</code> or <code>pattern</code>.</p>`,
  faq: [
  ],
};
