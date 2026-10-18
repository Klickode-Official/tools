// JSON Formatter & Validator: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'json-formatter',
  category: 'json',
  order: 1, // position within its category (lower first; unset tools sort by name after)
  name: 'JSON Formatter & Validator',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'JSON Formatter and Validator with Exact Error Lines',
  description: 'Paste messy JSON and get it tidy and readable. If it’s broken, you’ll see the exact line and column where it went wrong. Your data stays in your browser.',
  // One line for the tool cards on the home and category pages.
  short: 'Tidy up JSON and find the broken bit.',
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
    <textarea id="output" spellcheck="false" readonly data-send-to="json-to-csv,json-schema-generator"></textarea>
  </div>
</div>`,
  content: `<h2>How to use it</h2>
<ol><li>Paste your JSON into the left box.</li><li>Hit <strong>Format</strong> to make it readable, or <strong>Minify</strong> to squash it onto one line.</li><li>If something’s wrong, you’ll get the line and column, and the cursor jumps right to it.</li></ol>
<h2>The usual suspects</h2>
<p>Most broken JSON comes down to a handful of mistakes:</p>
<ul><li>A <strong>trailing comma</strong> like <code>[1, 2,]</code>. JavaScript allows it, JSON doesn’t.</li><li><strong>Single quotes</strong>. Keys and strings need double quotes.</li><li><strong>Keys without quotes</strong>, so <code>{a: 1}</code> has to be <code>{"a": 1}</code>.</li><li><strong>Leading zeros</strong>. <code>01</code> isn’t a valid number.</li><li><strong>Comments</strong>. Plain JSON doesn’t have them, so remove any <code>//</code> lines.</li></ul>`,
  faq: [
    {
      q: 'Is my JSON sent anywhere?',
      a: 'No. It’s formatted in your browser, so it’s fine to paste API responses or config files with keys in them.',
    },
    {
      q: 'Is the share link private?',
      a: 'The JSON sits in the part of the link after the <code>#</code>, which browsers never send to a server. But anyone you give the link to can see it, so share it like you’d share the data itself.',
    },
    {
      q: 'What does “Sort keys” do?',
      a: 'It puts the keys in alphabetical order at every level. Handy when you want to compare two documents by eye.',
    },
  ],
};
