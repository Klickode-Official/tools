// Base64 Encoder / Decoder: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'base64',
  category: 'encoding',
  name: 'Base64 Encoder / Decoder',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Base64 Encode and Decode Online (UTF-8 Safe)',
  description: 'Encode text to Base64 or decode it back. Handles accents and emoji properly, and has a URL-safe mode for tokens and links.',
  // One line for the tool cards on the home and category pages.
  short: 'Encode or decode Base64, emoji included.',
  body: `<div class="toolbar"><button class="btn primary" id="encode">Encode</button><button class="btn" id="decode">Decode</button><label class="check"><input type="checkbox" id="urlsafe"> URL-safe (Base64URL)</label><button class="btn" id="swap">Swap</button></div>
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
</div>`,
  content: `<h2>What Base64 is for</h2>
<p>Base64 turns any data into plain letters and numbers so it can travel through places that only accept text, like JSON, email or a URL. It makes things about a third bigger, and it isn’t encryption. Anyone can decode it, so don’t use it to hide anything.</p>
<p>The URL-safe version swaps <code>+</code> and <code>/</code> for <code>-</code> and <code>_</code> and drops the <code>=</code> padding. That’s the flavour JWTs use.</p>`,
  faq: [
    {
      q: 'Why does it say “not valid UTF-8”?',
      a: 'What you pasted decodes to binary data, like an image or a zip file, rather than text. This tool only shows text.',
    },
  ],
};
