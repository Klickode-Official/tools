// Base64 Encoder / Decoder — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'base64',
  category: 'encoding',
  name: 'Base64 Encoder / Decoder',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'Base64 Encode & Decode Online — UTF-8 and URL-safe',
  description: 'Encode text to Base64 or decode Base64 to text. Supports UTF-8, emoji and URL-safe Base64 (Base64URL). Runs locally in your browser.',
  // One line for tool cards on the home and category pages.
  short: 'UTF-8 safe Base64 and Base64URL, both directions.',
  body: `<div class="toolbar"><button class="btn primary" id="encode">Encode</button><button class="btn" id="decode">Decode</button><label class="check"><input type="checkbox" id="urlsafe"> URL-safe (Base64URL)</label><button class="btn" id="swap">Swap</button></div>
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
</div>`,
  content: `<h2>About Base64</h2><p>Base64 represents binary data using 64 printable characters, growing it by about 33%. It is encoding, not encryption: anyone can decode it. Base64URL swaps <code>+</code> and <code>/</code> for <code>-</code> and <code>_</code> and drops padding so the result is safe in URLs and JWTs.</p>`,
  faq: [
    {
      q: 'Why do I get "not valid UTF-8"?',
      a: 'The Base64 decodes to binary data (like an image), not text. This tool decodes text only.',
    },
  ],
};
