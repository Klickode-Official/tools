// Registry of tools. Each entry renders to /tools/<slug>/index.html at build time.
// `body` is the interactive UI; `content` is the indexable how-to/FAQ copy below it.

const twoPane = ({ inLabel, outLabel, inId = 'input', outId = 'output', placeholder = '', outTag = 'textarea' }) => `
<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="${inId}">${inLabel}</label><button class="btn small" id="clear">Clear</button></div>
    <textarea id="${inId}" spellcheck="false" placeholder="${placeholder}"></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><span class="label">${outLabel}</span><button class="btn small" data-copy="#${outId}">Copy</button></div>
    ${outTag === 'textarea' ? `<textarea id="${outId}" spellcheck="false" readonly></textarea>` : `<pre class="output" id="${outId}" tabindex="0"></pre>`}
  </div>
</div>`;

const faq = (items) =>
  `<h2>FAQ</h2>${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}`;

export const categories = ['JSON & Data', 'Regex & Text', 'Encoding & IDs'];

export const tools = [
  {
    slug: 'json-formatter',
    category: 'JSON & Data',
    name: 'JSON Formatter & Validator',
    title: 'JSON Formatter & Validator — Beautify, Minify, Find Errors',
    description: 'Free online JSON formatter and validator. Pretty-print or minify JSON and get the exact line and column of syntax errors. Runs entirely in your browser.',
    short: 'Pretty-print, minify and validate JSON with exact error locations.',
    body: `
<div class="toolbar">
  <button class="btn primary" id="format">Format</button>
  <button class="btn" id="minify">Minify</button>
  <label class="check">Indent <select id="indent"><option value="2">2 spaces</option><option value="4">4 spaces</option><option value="tab">Tab</option></select></label>
  <label class="check"><input type="checkbox" id="sort"> Sort keys</label>
  <button class="btn" id="sample">Sample</button>
  <button class="btn" id="download">Download</button>
  <button class="btn" id="share">Share link</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
${twoPane({ inLabel: 'Input JSON', outLabel: 'Result', placeholder: 'Paste JSON here…' })}`,
    content: `
<h2>How to format JSON</h2>
<ol><li>Paste or type JSON into the input box.</li><li>Click <strong>Format</strong> to pretty-print, or <strong>Minify</strong> to strip whitespace.</li><li>If the JSON is invalid, the error message tells you the exact line and column, and the cursor jumps there.</li></ol>
<h2>Common JSON errors</h2>
<ul><li><strong>Trailing commas</strong> — <code>[1, 2,]</code> is valid JavaScript but not valid JSON.</li><li><strong>Single quotes</strong> — JSON strings and keys must use double quotes.</li><li><strong>Unquoted keys</strong> — <code>{a: 1}</code> must be <code>{"a": 1}</code>.</li><li><strong>Leading zeros</strong> — <code>01</code> is not a valid JSON number.</li><li><strong>Comments</strong> — standard JSON has no comments.</li></ul>
${faq([
  ['Is my JSON uploaded anywhere?', 'No. Parsing and formatting happen in JavaScript in your browser. Nothing is sent to a server, so it is safe for API responses and config files that contain secrets.'],
  ['Why does the share link not leak my data?', 'Share links store the input in the URL fragment (the part after <code>#</code>), which browsers never send to the web server. Anyone you send the link to can read it, though, so treat it like the data itself.'],
  ['What does "Sort keys" do?', 'It orders object keys alphabetically at every level, which makes two JSON documents easier to compare.'],
])}`,
  },
  {
    slug: 'json-diff',
    category: 'JSON & Data',
    name: 'JSON Diff',
    title: 'JSON Diff — Compare Two JSON Documents Online',
    description: 'Compare two JSON objects and see every added, removed and changed value with its JSON path. Free, private and browser-only.',
    short: 'Compare two JSON documents and list every change by path.',
    body: `
<div class="toolbar"><button class="btn primary" id="compare">Compare</button><button class="btn" id="sample">Sample</button><button class="btn" id="clear">Clear</button></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="left">Original</label></div><textarea id="left" spellcheck="false" placeholder="Original JSON…"></textarea></div>
  <div class="panel"><div class="panel-head"><label for="right">Changed</label></div><textarea id="right" spellcheck="false" placeholder="Changed JSON…"></textarea></div>
</div>
<h2>Differences</h2>
<ul class="list-plain" id="result"></ul>`,
    content: `
<h2>How it works</h2>
<p>The diff is structural, not textual: whitespace and key order don't matter. Each difference is reported with a JSONPath-style location such as <code>$.users[2].email</code>, so you can find it in large API payloads.</p>
${faq([
  ['How are arrays compared?', 'Arrays are compared index by index. Inserting an element at the start of an array shows every following element as changed.'],
  ['Is there a size limit?', 'Only your browser memory. Documents of several megabytes compare in well under a second.'],
])}`,
  },
  {
    slug: 'csv-to-json',
    category: 'JSON & Data',
    name: 'CSV to JSON Converter',
    title: 'CSV to JSON Converter — Convert Spreadsheets to JSON',
    description: 'Convert CSV to a JSON array of objects with automatic number and boolean detection. Handles quoted fields, commas and line breaks. Runs in your browser.',
    short: 'Turn CSV rows into JSON objects with type detection.',
    script: 'csv-json',
    direction: 'csv',
    body: `
<div class="toolbar">
  <button class="btn primary" id="convert">Convert</button>
  <label class="check">Delimiter <select id="delimiter"><option value=",">Comma</option><option value=";">Semicolon</option><option value="\t">Tab</option><option value="|">Pipe</option></select></label>
  <label class="check"><input type="checkbox" id="header" checked> First row is header</label>
  <label class="check"><input type="checkbox" id="types" checked> Detect numbers &amp; booleans</label>
  <button class="btn" id="file">Open file</button><input type="file" id="file-input" accept=".csv,.tsv,.txt,text/csv" hidden>
  <button class="btn" id="sample">Sample</button>
  <button class="btn" id="download">Download</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
${twoPane({ inLabel: 'CSV', outLabel: 'JSON', placeholder: 'name,age\nAda,36' })}`,
    content: `
<h2>Conversion rules</h2>
<ul><li>Quoted fields may contain commas, quotes (written as <code>""</code>) and line breaks, as in RFC 4180.</li><li>With type detection on, <code>42</code> becomes a number and <code>true</code>/<code>false</code>/<code>null</code> become JSON literals. Integers too large for JavaScript are kept as strings so IDs don't lose precision.</li><li>Turn off the header option to get an array of arrays.</li></ul>
${faq([['Can I convert Excel files?', 'Save the sheet as CSV first (File → Save As → CSV), then open it here.'], ['Is my file uploaded?', 'No. The file is read locally with the browser File API.']])}`,
  },
  {
    slug: 'json-to-csv',
    category: 'JSON & Data',
    name: 'JSON to CSV Converter',
    title: 'JSON to CSV Converter — Export JSON Arrays to Spreadsheets',
    description: 'Convert a JSON array to CSV. Nested objects are flattened into dot-notation columns. Free and private: nothing leaves your browser.',
    short: 'Flatten JSON arrays into CSV for Excel or Sheets.',
    script: 'csv-json',
    direction: 'json',
    body: `
<div class="toolbar">
  <button class="btn primary" id="convert">Convert</button>
  <label class="check">Delimiter <select id="delimiter"><option value=",">Comma</option><option value=";">Semicolon</option><option value="\t">Tab</option><option value="|">Pipe</option></select></label>
  <label class="check"><input type="checkbox" id="flatten" checked> Flatten nested objects</label>
  <button class="btn" id="file">Open file</button><input type="file" id="file-input" accept=".json,application/json" hidden>
  <button class="btn" id="sample">Sample</button>
  <button class="btn" id="download">Download</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
${twoPane({ inLabel: 'JSON', outLabel: 'CSV', placeholder: '[{"name":"Ada","age":36}]' })}`,
    content: `
<h2>Conversion rules</h2>
<ul><li>The input should be an array of objects. Columns are the union of all keys, in first-seen order.</li><li>Nested objects become dot-notation columns: <code>{"a":{"b":1}}</code> → column <code>a.b</code>.</li><li>Arrays inside records are written as JSON text in a single cell.</li></ul>
${faq([['Will Excel open the output?', 'Yes. Use the semicolon delimiter if your Excel locale uses commas as decimal separators.']])}`,
  },
  {
    slug: 'json-schema-generator',
    category: 'JSON & Data',
    name: 'JSON Schema Generator',
    title: 'JSON Schema Generator — Infer a Schema from Sample JSON',
    description: 'Generate a JSON Schema (draft 2020-12) from example JSON. Detects types, required fields, nested objects, arrays and common string formats.',
    short: 'Infer a draft 2020-12 JSON Schema from a sample payload.',
    body: `
<div class="toolbar">
  <button class="btn primary" id="generate">Generate</button>
  <label class="check"><input type="checkbox" id="required" checked> Mark fields required</label>
  <label class="check"><input type="checkbox" id="strict"> Disallow extra properties</label>
  <label class="check"><input type="checkbox" id="formats" checked> Detect formats</label>
  <button class="btn" id="sample">Sample</button>
  <button class="btn" id="download">Download</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
${twoPane({ inLabel: 'Sample JSON', outLabel: 'JSON Schema', placeholder: '{"id": 1, "email": "a@b.co"}' })}`,
    content: `
<h2>How the schema is inferred</h2>
<ul><li>Every value's type is recorded; integers and decimals are distinguished.</li><li>For arrays of objects, all items are merged: a field is <code>required</code> only if every item has it, and mixed types become a type union.</li><li>Strings that look like dates, date-times, emails, URIs or UUIDs get a <code>format</code>.</li></ul>
<p>An inferred schema is a starting point. Review it, then tighten it with constraints like <code>minLength</code>, <code>enum</code> or <code>pattern</code>.</p>`,
  },
  {
    slug: 'regex-tester',
    category: 'Regex & Text',
    name: 'Regex Tester',
    title: 'Regex Tester — Test JavaScript Regular Expressions Online',
    description: 'Test regular expressions live with match highlighting, capture groups, named groups and replace preview. Uses your browser’s JavaScript regex engine.',
    short: 'Live regex matching with groups and replace preview.',
    body: `
<div class="toolbar" style="flex-wrap:nowrap">
  <span class="mono" aria-hidden="true">/</span>
  <input type="text" id="pattern" class="mono" style="flex:1;min-width:0" spellcheck="false" placeholder="pattern" aria-label="Regular expression">
  <span class="mono" aria-hidden="true">/</span>
  <input type="text" id="flags" class="mono" style="width:5.5em" spellcheck="false" value="g" aria-label="Flags">
</div>
<p class="hint">Flags: <code>g</code> global · <code>i</code> ignore case · <code>m</code> multiline · <code>s</code> dotAll · <code>u</code> unicode · <code>y</code> sticky</p>
<div class="toolbar">
  <button class="btn" id="sample">Sample</button>
  <button class="btn" id="share">Share link</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="input">Test string</label><button class="btn small" id="clear">Clear</button></div><textarea id="input" spellcheck="false"></textarea></div>
  <div class="panel"><div class="panel-head"><span class="label">Matches highlighted</span></div><pre class="output" id="highlight" tabindex="0"></pre></div>
</div>
<h2>Match details</h2>
<div id="details"></div>
<h2>Replace</h2>
<div class="toolbar"><input type="text" id="replacement" class="mono" style="flex:1" spellcheck="false" placeholder="Replacement, e.g. $1 or $<name>" aria-label="Replacement"></div>
<div class="panel"><div class="panel-head"><span class="label">Result</span><button class="btn small" data-copy="#replaced">Copy</button></div><pre class="output" id="replaced" style="min-height:120px" tabindex="0"></pre></div>`,
    content: `
<h2>Cheat sheet</h2>
<ul><li><code>\\d</code> digit, <code>\\w</code> word character, <code>\\s</code> whitespace, <code>.</code> any character except newline</li><li><code>*</code> 0 or more, <code>+</code> 1 or more, <code>?</code> optional, <code>{2,5}</code> between 2 and 5</li><li><code>^</code> / <code>$</code> start / end (of line with <code>m</code>)</li><li><code>(…)</code> capture group, <code>(?:…)</code> non-capturing, <code>(?&lt;name&gt;…)</code> named group</li><li><code>(?=…)</code> lookahead, <code>(?&lt;=…)</code> lookbehind</li></ul>
${faq([
  ['Which regex flavour is this?', 'JavaScript (ECMAScript), using your browser\'s engine, so results match what <code>String.prototype.match</code> and <code>replace</code> do in your code. Most syntax carries over to PCRE, Python and Java, but some features (like possessive quantifiers) don\'t.'],
  ['Why is only one match shown?', 'Add the <code>g</code> flag to find every match.'],
])}`,
  },
  {
    slug: 'text-diff',
    category: 'Regex & Text',
    name: 'Text Diff',
    title: 'Text Diff Checker — Compare Two Texts Line by Line',
    description: 'Compare two blocks of text or code and highlight added and removed lines. Free, private, no upload.',
    short: 'Line-by-line comparison of two texts or code files.',
    body: `
<div class="toolbar"><button class="btn primary" id="compare">Compare</button><label class="check"><input type="checkbox" id="trim"> Ignore leading/trailing whitespace</label><button class="btn" id="sample">Sample</button><button class="btn" id="clear">Clear</button></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="left">Original</label></div><textarea id="left" spellcheck="false"></textarea></div>
  <div class="panel"><div class="panel-head"><label for="right">Changed</label></div><textarea id="right" spellcheck="false"></textarea></div>
</div>
<h2>Result</h2>
<pre class="output" id="result" style="white-space:normal" tabindex="0"></pre>`,
    content: `<h2>How it works</h2><p>The checker finds the longest common subsequence of lines, then marks lines only in the original as removed (−) and lines only in the changed text as added (+). For JSON, use the <a href="/tools/json-diff/">JSON Diff</a> tool, which ignores formatting.</p>`,
  },
  {
    slug: 'case-converter',
    category: 'Regex & Text',
    name: 'Case Converter & Word Counter',
    title: 'Case Converter — camelCase, snake_case, kebab-case & Word Count',
    description: 'Convert text between camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case, Title Case and more, with live word and character counts.',
    short: 'camelCase, snake_case, kebab-case and word counts.',
    body: `
<div class="panel"><div class="panel-head"><label for="input">Text</label><button class="btn small" id="clear">Clear</button></div><textarea id="input" class="short" spellcheck="false" placeholder="Type or paste text…"></textarea></div>
<div class="status ok" id="stats" aria-live="polite"></div>
<table class="kv" id="cases"></table>`,
    content: `<h2>Naming conventions</h2><ul><li><strong>camelCase</strong> — JavaScript and Java variables</li><li><strong>PascalCase</strong> — classes and React components</li><li><strong>snake_case</strong> — Python, Ruby and SQL columns</li><li><strong>CONSTANT_CASE</strong> — constants and environment variables</li><li><strong>kebab-case</strong> — URLs, CSS classes and CLI flags</li></ul><p>Acronyms are split sensibly: <code>parseHTTPResponse</code> becomes <code>parse_http_response</code>.</p>`,
  },
  {
    slug: 'base64',
    category: 'Encoding & IDs',
    name: 'Base64 Encoder / Decoder',
    title: 'Base64 Encode & Decode Online — UTF-8 and URL-safe',
    description: 'Encode text to Base64 or decode Base64 to text. Supports UTF-8, emoji and URL-safe Base64 (Base64URL). Runs locally in your browser.',
    short: 'UTF-8 safe Base64 and Base64URL, both directions.',
    body: `
<div class="toolbar"><button class="btn primary" id="encode">Encode</button><button class="btn" id="decode">Decode</button><label class="check"><input type="checkbox" id="urlsafe"> URL-safe (Base64URL)</label><button class="btn" id="swap">Swap</button></div>
<div class="status" id="status" aria-live="polite"></div>
${twoPane({ inLabel: 'Input', outLabel: 'Output' })}`,
    content: `<h2>About Base64</h2><p>Base64 represents binary data using 64 printable characters, growing it by about 33%. It is encoding, not encryption: anyone can decode it. Base64URL swaps <code>+</code> and <code>/</code> for <code>-</code> and <code>_</code> and drops padding so the result is safe in URLs and JWTs.</p>${faq([['Why do I get "not valid UTF-8"?', 'The Base64 decodes to binary data (like an image), not text. This tool decodes text only.']])}`,
  },
  {
    slug: 'url-encoder',
    category: 'Encoding & IDs',
    name: 'URL Encoder / Decoder',
    title: 'URL Encode & Decode Online — Percent-Encoding',
    description: 'Percent-encode or decode URLs and query string values. Choose component or full-URL encoding. Free and private.',
    short: 'Percent-encode query values or full URLs.',
    body: `
<div class="toolbar"><button class="btn primary" id="encode">Encode</button><button class="btn" id="decode">Decode</button><label class="check"><input type="checkbox" id="full"> Full URL (keep <code>:/?&amp;=</code>)</label><button class="btn" id="swap">Swap</button></div>
<div class="status" id="status" aria-live="polite"></div>
${twoPane({ inLabel: 'Input', outLabel: 'Output' })}
<h2>Query parameters</h2><table class="kv" id="params"></table>`,
    content: `<h2>Component vs. full URL</h2><p><strong>Component</strong> encoding (<code>encodeURIComponent</code>) escapes everything except letters, digits and <code>-_.!~*'()</code>. Use it for a single query value. <strong>Full URL</strong> encoding (<code>encodeURI</code>) leaves URL structure characters alone. When decoding, <code>+</code> is treated as a space, as in HTML form submissions.</p>`,
  },
  {
    slug: 'jwt-decoder',
    category: 'Encoding & IDs',
    name: 'JWT Decoder',
    title: 'JWT Decoder — Decode JSON Web Tokens Safely in Your Browser',
    description: 'Decode a JWT to read its header and payload, with human-readable iat, nbf and exp times and expiry status. Tokens never leave your device.',
    short: 'Read JWT header, payload and expiry without sending the token anywhere.',
    body: `
<div class="panel"><div class="panel-head"><label for="input">Encoded token</label><button class="btn small" id="clear">Clear</button></div><textarea id="input" class="short" spellcheck="false" placeholder="eyJhbGciOi…"></textarea></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><span class="label">Header</span><button class="btn small" data-copy="#header">Copy</button></div><pre class="output" id="header" style="min-height:120px" tabindex="0"></pre></div>
  <div class="panel"><div class="panel-head"><span class="label">Payload</span><button class="btn small" data-copy="#payload">Copy</button></div><pre class="output" id="payload" style="min-height:120px" tabindex="0"></pre></div>
</div>
<h2>Timestamps</h2><table class="kv" id="times"></table>`,
    content: `<h2>Decoding is not verifying</h2><p>This tool reads a token's contents; it does not check the signature. Anyone can create a token with any payload, so your server must always verify the signature with the issuer's key before trusting it.</p>${faq([['Is it safe to paste production tokens?', 'The token is decoded with JavaScript on this page and never transmitted. Still, a live token grants access until it expires, so avoid sharing it anywhere you don\'t control.']])}`,
  },
  {
    slug: 'uuid-generator',
    category: 'Encoding & IDs',
    name: 'UUID Generator',
    title: 'UUID Generator — Random v4 and Time-Ordered v7 UUIDs',
    description: 'Generate UUID v4 or v7 in bulk using cryptographically secure randomness, and validate or inspect existing UUIDs.',
    short: 'Bulk v4/v7 UUIDs and a UUID validator.',
    body: `
<div class="toolbar">
  <label class="check">Version <select id="version"><option value="4">v4 (random)</option><option value="7">v7 (time-ordered)</option></select></label>
  <label class="check">How many <input type="number" id="count" value="5" min="1" max="1000" style="width:6em"></label>
  <label class="check"><input type="checkbox" id="upper"> Uppercase</label>
  <label class="check"><input type="checkbox" id="nodash"> No hyphens</label>
  <button class="btn primary" id="generate">Generate</button>
  <button class="btn" data-copy="#output">Copy all</button>
</div>
<textarea id="output" spellcheck="false" readonly aria-label="Generated UUIDs" style="min-height:200px"></textarea>
<h2>Validate a UUID</h2>
<div class="toolbar"><input type="text" id="check" class="mono" style="flex:1" spellcheck="false" placeholder="Paste a UUID" aria-label="UUID to validate"></div>
<div class="status" id="status" aria-live="polite"></div>`,
    content: `<h2>v4 or v7?</h2><p><strong>v4</strong> is 122 bits of randomness and the safe default. <strong>v7</strong> (RFC 9562) starts with a millisecond timestamp, so IDs sort by creation time, which keeps database indexes compact. Both use <code>crypto.getRandomValues</code>.</p>`,
  },
  {
    slug: 'timestamp-converter',
    category: 'Encoding & IDs',
    name: 'Unix Timestamp Converter',
    title: 'Unix Timestamp Converter — Epoch to Date and Back',
    description: 'Convert Unix epoch timestamps (seconds, milliseconds, microseconds) to human-readable dates and back. Shows UTC, local time, ISO 8601 and relative time.',
    short: 'Epoch seconds/ms to dates and back, with timezone views.',
    body: `
<div class="toolbar"><input type="text" id="input" class="mono" style="flex:1;min-width:12em" spellcheck="false" placeholder="1700000000 or 2024-05-01T12:00:00Z" aria-label="Timestamp or date"><button class="btn primary" id="now">Now</button></div>
<div class="status" id="status" aria-live="polite"></div>
<table class="kv" id="result"></table>
<p class="check" id="clock"></p>`,
    content: `<h2>Seconds or milliseconds?</h2><p>The unit is detected from the size of the number: 10 digits are seconds (Unix, PHP, Python's <code>time.time()</code>), 13 digits are milliseconds (JavaScript's <code>Date.now()</code>, Java), 16 are microseconds and 19 are nanoseconds. You can also type any date string the browser understands, such as ISO 8601.</p>`,
  },
];
