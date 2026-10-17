// CSV to JSON Converter — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'csv-to-json',
  category: 'json',
  name: 'CSV to JSON Converter',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'CSV to JSON Converter — Convert Spreadsheets to JSON',
  description: 'Convert CSV to a JSON array of objects with automatic number and boolean detection. Handles quoted fields, commas and line breaks. Runs in your browser.',
  // One line for tool cards on the home and category pages.
  short: 'Turn CSV rows into JSON objects with type detection.',
  data: {direction: 'csv'},
  body: `<div class="toolbar">
  <button class="btn primary" id="convert">Convert</button>
  <label class="check">Delimiter <select id="delimiter"><option value=",">Comma</option><option value=";">Semicolon</option><option value="	">Tab</option><option value="|">Pipe</option></select></label>
  <label class="check"><input type="checkbox" id="header" checked> First row is header</label>
  <label class="check"><input type="checkbox" id="types" checked> Detect numbers &amp; booleans</label>
  <button class="btn" id="file">Open file</button><input type="file" id="file-input" accept=".csv,.tsv,.txt,text/csv" hidden>
  <button class="btn" id="sample">Sample</button>
  <button class="btn" id="download">Download</button>
</div>
<div class="status" id="status" aria-live="polite"></div>

<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="input">CSV</label><button class="btn small" id="clear">Clear</button></div>
    <textarea id="input" spellcheck="false" placeholder="name,age
Ada,36"></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><span class="label">JSON</span><button class="btn small" data-copy="#output">Copy</button></div>
    <textarea id="output" spellcheck="false" readonly></textarea>
  </div>
</div>`,
  content: `<h2>Conversion rules</h2>
<ul><li>Quoted fields may contain commas, quotes (written as <code>""</code>) and line breaks, as in RFC 4180.</li><li>With type detection on, <code>42</code> becomes a number and <code>true</code>/<code>false</code>/<code>null</code> become JSON literals. Integers too large for JavaScript are kept as strings so IDs don't lose precision.</li><li>Turn off the header option to get an array of arrays.</li></ul>`,
  faq: [
    {
      q: 'Can I convert Excel files?',
      a: 'Save the sheet as CSV first (File → Save As → CSV), then open it here.',
    },
    {
      q: 'Is my file uploaded?',
      a: 'No. The file is read locally with the browser File API.',
    },
  ],
};
