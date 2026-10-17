// CSV to JSON Converter: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'csv-to-json',
  category: 'json',
  name: 'CSV to JSON Converter',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'CSV to JSON Converter, Free and Runs in Your Browser',
  description: 'Paste a CSV or open a file and get a JSON array back. Numbers and true/false values are detected for you, and commas inside quotes don’t trip it up.',
  // One line for the tool cards on the home and category pages.
  short: 'Turn spreadsheet rows into JSON.',
  data: { direction: 'csv' },
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
  content: `<h2>How it handles your data</h2>
<ul><li>Fields in quotes can contain commas, line breaks and quotes (written as <code>""</code>), the way Excel and Google Sheets export them.</li><li>With type detection on, <code>42</code> becomes a number and <code>true</code>, <code>false</code> and <code>null</code> become real JSON values. Very long numbers like order IDs stay as text so they aren’t rounded.</li><li>Untick “First row is header” if your file has no header row. You’ll get a list of lists instead of objects.</li></ul>`,
  faq: [
    {
      q: 'Can I use an Excel file?',
      a: 'Save it as CSV first (File, then Save As, then CSV) and open that here.',
    },
    {
      q: 'Is my file uploaded?',
      a: 'No. Your browser reads the file directly and nothing leaves your computer.',
    },
  ],
};
