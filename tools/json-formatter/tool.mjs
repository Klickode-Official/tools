// JSON Formatter & Validator — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'json-formatter',
  category: 'json',
  order: 1, // position within its category (lower first; unset tools sort by name after)
  name: 'JSON Formatter & Validator',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'JSON Formatter & Validator — Beautify, Minify, Find Errors',
  description: 'Free online JSON formatter and validator. Pretty-print or minify JSON and get the exact line and column of syntax errors. Runs entirely in your browser.',
  // One line for tool cards on the home and category pages.
  short: 'Pretty-print, minify and validate JSON with exact error locations.',
  body: `<div class="toolbar">
  <button class="btn primary" id="format">Format</button>
  <button class="btn" id="minify">Minify</button>
  <label class="check">Indent <select id="indent"><option value="2">2 spaces</option><option value="4">4 spaces</option><option value="tab">Tab</option></select></label>
  <label class="check"><input type="checkbox" id="sort"> Sort keys</label>
  <button class="btn" id="sample">Sample</button>
  <button class="btn" id="download">Download</button>
  <button class="btn" id="share">Share link</button>
</div>
<div class="status" id="status" aria-live="polite"></div>

<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="input">Input JSON</label><button class="btn small" id="clear">Clear</button></div>
    <textarea id="input" spellcheck="false" placeholder="Paste JSON here…"></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><span class="label">Result</span><button class="btn small" data-copy="#output">Copy</button></div>
    <textarea id="output" spellcheck="false" readonly></textarea>
  </div>
</div>`,
  content: `<h2>How to format JSON</h2>
<ol><li>Paste or type JSON into the input box.</li><li>Click <strong>Format</strong> to pretty-print, or <strong>Minify</strong> to strip whitespace.</li><li>If the JSON is invalid, the error message tells you the exact line and column, and the cursor jumps there.</li></ol>
<h2>Common JSON errors</h2>
<ul><li><strong>Trailing commas</strong> — <code>[1, 2,]</code> is valid JavaScript but not valid JSON.</li><li><strong>Single quotes</strong> — JSON strings and keys must use double quotes.</li><li><strong>Unquoted keys</strong> — <code>{a: 1}</code> must be <code>{"a": 1}</code>.</li><li><strong>Leading zeros</strong> — <code>01</code> is not a valid JSON number.</li><li><strong>Comments</strong> — standard JSON has no comments.</li></ul>`,
  faq: [
    {
      q: 'Is my JSON uploaded anywhere?',
      a: 'No. Parsing and formatting happen in JavaScript in your browser. Nothing is sent to a server, so it is safe for API responses and config files that contain secrets.',
    },
    {
      q: 'Why does the share link not leak my data?',
      a: 'Share links store the input in the URL fragment (the part after <code>#</code>), which browsers never send to the web server. Anyone you send the link to can read it, though, so treat it like the data itself.',
    },
    {
      q: 'What does "Sort keys" do?',
      a: 'It orders object keys alphabetically at every level, which makes two JSON documents easier to compare.',
    },
  ],
};
