// URL Encoder / Decoder: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'url-encoder',
  category: 'encoding',
  name: 'URL Encoder / Decoder',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'URL Encoder and Decoder Online',
  description: 'Encode a value for a query string, or decode a URL full of %20s back into something readable. Query parameters are listed out for you.',
  // One line for the tool cards on the home and category pages.
  short: 'Fix %20s and encode query values.',
  body: `<div class="toolbar"><button class="btn primary" id="encode">Encode</button><button class="btn" id="decode">Decode</button><label class="check"><input type="checkbox" id="full"> Full URL (keep <code>:/?&amp;=</code>)</label><button class="btn" id="swap">Swap</button></div>
<div class="status" id="status" aria-live="polite"></div>

<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="input">Input</label><button class="btn small" id="clear">Clear</button></div>
    <textarea id="input" spellcheck="false" placeholder=""></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><label class="label" for="output">Output</label><button class="btn small" data-copy="#output">Copy</button></div>
    <textarea id="output" spellcheck="false" readonly></textarea>
  </div>
</div>
<h2>Query parameters</h2><table class="kv" id="params"></table>`,
  content: `<h2>Which mode do I need?</h2>
<p>Leave “Full URL” off when you’re encoding a single value to put after <code>?q=</code>. Everything that could break the URL gets escaped, including <code>&amp;</code> and <code>=</code>.</p>
<p>Turn it on when you have a whole address and only want spaces and odd characters fixed, leaving the <code>://</code>, <code>?</code> and <code>&amp;</code> alone.</p>
<p>When decoding, a <code>+</code> is read as a space, which is how web forms send them.</p>
<h2>How to decode a URL</h2>
<ol><li>Paste the link into the box.</li><li>Click Decode.</li><li>Copy the readable result. If the link has a query string, each parameter is listed on its own line below.</li></ol>
<h2>Why Thai and emoji links turn into %E0%B8…</h2>
<p>A URL can only carry a small set of characters, so everything else is written as bytes in percent form. Each Thai letter becomes three bytes, which is why a short Thai word turns into a long run of <code>%E0%B8</code> codes when you copy a link. Decoding turns it back into something you can read.</p>`,
  faq: [
    { q: 'What’s the difference between encodeURI and encodeURIComponent?', a: 'With “Full URL” on, this works like <code>encodeURI</code>: it keeps <code>://</code>, <code>?</code>, <code>&amp;</code> and <code>=</code> so the address still works. With it off, it works like <code>encodeURIComponent</code> and escapes those too, which is what you want for a single value.' },
    { q: 'Why is a space sometimes %20 and sometimes +?', a: 'In a URL, a space is <code>%20</code>. Web forms send spaces in a query string as <code>+</code> instead. This tool reads both as a space when decoding, and writes <code>%20</code> when encoding because it works everywhere.' },
    { q: 'Is my URL sent anywhere?', a: 'No. The tool runs entirely in your browser, so your URL never leaves your device. It works offline too once the page has loaded.' },
  ],
};
