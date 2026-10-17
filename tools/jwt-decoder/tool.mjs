// JWT Decoder — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'jwt-decoder',
  category: 'encoding',
  name: 'JWT Decoder',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'JWT Decoder — Decode JSON Web Tokens Safely in Your Browser',
  description: 'Decode a JWT to read its header and payload, with human-readable iat, nbf and exp times and expiry status. Tokens never leave your device.',
  // One line for tool cards on the home and category pages.
  short: 'Read JWT header, payload and expiry without sending the token anywhere.',
  body: `<div class="panel"><div class="panel-head"><label for="input">Encoded token</label><button class="btn small" id="clear">Clear</button></div><textarea id="input" class="short" spellcheck="false" placeholder="eyJhbGciOi…"></textarea></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><span class="label">Header</span><button class="btn small" data-copy="#header">Copy</button></div><pre class="output" id="header" style="min-height:120px" tabindex="0"></pre></div>
  <div class="panel"><div class="panel-head"><span class="label">Payload</span><button class="btn small" data-copy="#payload">Copy</button></div><pre class="output" id="payload" style="min-height:120px" tabindex="0"></pre></div>
</div>
<h2>Timestamps</h2><table class="kv" id="times"></table>`,
  content: `<h2>Decoding is not verifying</h2><p>This tool reads a token's contents; it does not check the signature. Anyone can create a token with any payload, so your server must always verify the signature with the issuer's key before trusting it.</p>`,
  faq: [
    {
      q: 'Is it safe to paste production tokens?',
      a: "The token is decoded with JavaScript on this page and never transmitted. Still, a live token grants access until it expires, so avoid sharing it anywhere you don't control.",
    },
  ],
};
