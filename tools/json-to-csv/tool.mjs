// JSON to CSV Converter — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'json-to-csv',
  category: 'json',
  name: 'JSON to CSV Converter',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'JSON to CSV Converter — Export JSON Arrays to Spreadsheets',
  description: 'Convert a JSON array to CSV. Nested objects are flattened into dot-notation columns. Free and private: nothing leaves your browser.',
  // One line for tool cards on the home and category pages.
  short: 'Flatten JSON arrays into CSV for Excel or Sheets.',
  data: {direction: 'json'},
  body: `<div class="toolbar">
  <button class="btn primary" id="convert">Convert</button>
  <label class="check">Delimiter <select id="delimiter"><option value=",">Comma</option><option value=";">Semicolon</option><option value="	">Tab</option><option value="|">Pipe</option></select></label>
  <label class="check"><input type="checkbox" id="flatten" checked> Flatten nested objects</label>
  <button class="btn" id="file">Open file</button><input type="file" id="file-input" accept=".json,application/json" hidden>
  <button class="btn" id="sample">Sample</button>
  <button class="btn" id="download">Download</button>
</div>
<div class="status" id="status" aria-live="polite"></div>

<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="input">JSON</label><button class="btn small" id="clear">Clear</button></div>
    <textarea id="input" spellcheck="false" placeholder="[{"name":"Ada","age":36}]"></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><span class="label">CSV</span><button class="btn small" data-copy="#output">Copy</button></div>
    <textarea id="output" spellcheck="false" readonly></textarea>
  </div>
</div>`,
  content: `<h2>Conversion rules</h2>
<ul><li>The input should be an array of objects. Columns are the union of all keys, in first-seen order.</li><li>Nested objects become dot-notation columns: <code>{"a":{"b":1}}</code> → column <code>a.b</code>.</li><li>Arrays inside records are written as JSON text in a single cell.</li></ul>`,
  faq: [
    {
      q: 'Will Excel open the output?',
      a: 'Yes. Use the semicolon delimiter if your Excel locale uses commas as decimal separators.',
    },
  ],
};
