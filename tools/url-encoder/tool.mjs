// URL Encoder / Decoder — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'url-encoder',
  category: 'encoding',
  name: 'URL Encoder / Decoder',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'URL Encode & Decode Online — Percent-Encoding',
  description: 'Percent-encode or decode URLs and query string values. Choose component or full-URL encoding. Free and private.',
  // One line for tool cards on the home and category pages.
  short: 'Percent-encode query values or full URLs.',
  body: `<div class="toolbar"><button class="btn primary" id="encode">Encode</button><button class="btn" id="decode">Decode</button><label class="check"><input type="checkbox" id="full"> Full URL (keep <code>:/?&amp;=</code>)</label><button class="btn" id="swap">Swap</button></div>
<div class="status" id="status" aria-live="polite"></div>

<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><label for="input">Input</label><button class="btn small" id="clear">Clear</button></div>
    <textarea id="input" spellcheck="false" placeholder=""></textarea>
  </div>
  <div class="panel">
    <div class="panel-head"><span class="label">Output</span><button class="btn small" data-copy="#output">Copy</button></div>
    <textarea id="output" spellcheck="false" readonly></textarea>
  </div>
</div>
<h2>Query parameters</h2><table class="kv" id="params"></table>`,
  content: `<h2>Component vs. full URL</h2><p><strong>Component</strong> encoding (<code>encodeURIComponent</code>) escapes everything except letters, digits and <code>-_.!~*'()</code>. Use it for a single query value. <strong>Full URL</strong> encoding (<code>encodeURI</code>) leaves URL structure characters alone. When decoding, <code>+</code> is treated as a space, as in HTML form submissions.</p>`,
  faq: [
  ],
};
