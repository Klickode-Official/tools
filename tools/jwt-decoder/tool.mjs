// JWT Decoder: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'jwt-decoder',
  category: 'encoding',
  name: 'JWT Decoder',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'JWT Decoder: Read Token Payload and Expiry',
  description: 'Paste a JSON Web Token to read its header and payload and see when it expires. The token is decoded on this page and never sent anywhere.',
  // One line for the tool cards on the home and category pages.
  short: 'Peek inside a token and check if it’s expired.',
  body: `<div class="panel"><div class="panel-head"><label for="input">Encoded token</label><button class="btn small" id="clear">Clear</button></div><textarea id="input" class="short" spellcheck="false" placeholder="eyJhbGciOi…"></textarea></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><span class="label">Header</span><button class="btn small" data-copy="#header">Copy</button></div><pre class="output" id="header" style="min-height:120px" tabindex="0"></pre></div>
  <div class="panel"><div class="panel-head"><span class="label">Payload</span><button class="btn small" data-copy="#payload">Copy</button></div><pre class="output" id="payload" style="min-height:120px" tabindex="0"></pre></div>
</div>
<h2>Timestamps</h2><table class="kv" id="times"></table>`,
  content: `<h2>Reading a token isn’t the same as trusting it</h2>
<p>This shows you what’s inside a token. It doesn’t check the signature, and it can’t, because that needs the issuer’s secret key. Anyone can make a token that says anything, so your server should always verify the signature before believing what’s in it.</p>`,
  faq: [
    {
      q: 'Is it safe to paste a real token?',
      a: 'It’s decoded right here on the page and never sent anywhere, and unlike our other tools this page doesn’t remember what you typed. Still, a live token works like a password until it expires, so be careful where else you paste it.',
    },
  ],
};
