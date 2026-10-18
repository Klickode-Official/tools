// JSON to CSV Converter: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'json-to-csv',
  category: 'json',
  name: 'JSON to CSV Converter',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'JSON to CSV Converter for Excel and Google Sheets',
  description: 'Turn a JSON array into a CSV you can open in Excel or Google Sheets. Nested objects get their own columns, like address.city.',
  // One line for the tool cards on the home and category pages.
  short: 'Turn JSON into a spreadsheet.',
  data: { direction: 'json' },
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
    <textarea id="output" spellcheck="false" readonly data-send-to="csv-to-json"></textarea>
  </div>
</div>`,
  content: `<h2>How it handles your data</h2>
<ul><li>Give it a list of objects. Every key it finds becomes a column, in the order it first shows up.</li><li>Nested objects are spread into columns with dotted names, so <code>{"address":{"city":"Leeds"}}</code> becomes an <code>address.city</code> column.</li><li>Lists inside a record are kept as JSON text in one cell, so nothing gets lost.</li></ul>`,
  faq: [
    {
      q: 'Excel shows everything in one column. What now?',
      a: 'Your Excel probably expects semicolons, which is common in Europe. Pick “Semicolon” as the delimiter and download again.',
    },
  ],
};
