// JSON Schema Generator: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'json-schema-generator',
  category: 'json',
  name: 'JSON Schema Generator',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'JSON Schema Generator from Sample JSON',
  description: 'Paste a sample API response and get a JSON Schema (draft 2020-12) to start from, with types, required fields and formats like email and date filled in.',
  // One line for the tool cards on the home and category pages.
  short: 'Get a JSON Schema from a sample response.',
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
  content: `<h2>What it figures out</h2>
<ul><li>The type of every value, including whether a number is a whole number or not.</li><li>For a list of objects, it looks at every item. A field is only marked required if all of them have it.</li><li>Strings that look like dates, emails, links or UUIDs get the matching <code>format</code>.</li></ul>
<p>Think of the result as a first draft. Read through it, then tighten it with things like <code>minLength</code>, <code>enum</code> or <code>pattern</code> where you know more than one sample can tell you.</p>`,
  faq: [],
};
