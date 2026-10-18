// QR Code Generator: page copy and SEO details. What the page does lives in ./script.js;
// the QR encoder is /assets/js/lib/qr.js and the styled drawing is /assets/js/lib/qr-art.js.
export default {
  slug: 'qr-code-generator',
  category: 'business',
  order: 2,
  name: 'QR Code Generator',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Free QR Code Generator with Logo: No Sign-Up, No Expiry',
  description: 'Make QR codes for links, Wi-Fi, WhatsApp, LINE and contact cards. Add your logo and colours, then save a PNG or SVG. Codes never expire or track anyone.',
  // One line for the tool cards on the home and category pages.
  short: 'QR codes for links, Wi-Fi, WhatsApp and LINE, with your logo.',
  keywords: ['qr', 'qrcode', 'wifi', 'barcode', 'vcard'],
  body: `<div class="qrg">
  <div class="qrg-form">
    <div class="qrg-types" id="types" role="radiogroup" aria-label="What the code opens"></div>
    <input type="hidden" id="qr-type" value="url">

    <div class="qrg-fields">
      <div data-type="url"><label class="fld wide"><span>Link</span><input type="text" id="f-url" placeholder="https://www.example.com" spellcheck="false" inputmode="url"></label></div>
      <div data-type="text" hidden><label class="fld wide"><span>Text</span><textarea id="f-text" rows="4" placeholder="Anything you like. Phones show it as plain text."></textarea></label></div>
      <div data-type="wifi" hidden>
        <label class="fld"><span>Network name</span><input type="text" id="f-ssid" placeholder="Café Guest" spellcheck="false"></label>
        <label class="fld"><span>Password</span><input type="text" id="f-pass" spellcheck="false" autocomplete="off"></label>
        <label class="fld"><span>Security</span><select id="f-sec"><option value="WPA">WPA / WPA2 / WPA3</option><option value="WEP">WEP (old routers)</option><option value="nopass">No password</option></select></label>
        <label class="fld chk"><input type="checkbox" id="f-hidden"> <span>Hidden network</span></label>
      </div>
      <div data-type="whatsapp" hidden>
        <label class="fld"><span>WhatsApp number</span><input type="text" id="f-wa" placeholder="081 234 5678 or +44 7700 900123" inputmode="tel"></label>
        <label class="fld"><span>Message they start with <em>optional</em></span><input type="text" id="f-wa-msg" placeholder="Hi! I saw your shop…"></label>
      </div>
      <div data-type="line" hidden><label class="fld wide"><span>LINE ID or official account <em>@ for official accounts</em></span><input type="text" id="f-line" placeholder="@yourshop" spellcheck="false"></label></div>
      <div data-type="email" hidden>
        <label class="fld"><span>Email address</span><input type="text" id="f-email" placeholder="hello@example.com" inputmode="email" spellcheck="false"></label>
        <label class="fld"><span>Subject <em>optional</em></span><input type="text" id="f-subject"></label>
        <label class="fld wide"><span>Message <em>optional</em></span><textarea id="f-body" rows="2"></textarea></label>
      </div>
      <div data-type="phone" hidden><label class="fld wide"><span>Phone number</span><input type="text" id="f-tel" placeholder="02 123 4567" inputmode="tel"></label></div>
      <div data-type="sms" hidden>
        <label class="fld"><span>Phone number</span><input type="text" id="f-sms" inputmode="tel"></label>
        <label class="fld"><span>Message</span><input type="text" id="f-sms-msg"></label>
      </div>
      <div data-type="contact" hidden>
        <label class="fld"><span>Name</span><input type="text" id="f-c-name"></label>
        <label class="fld"><span>Company</span><input type="text" id="f-c-org"></label>
        <label class="fld"><span>Job title</span><input type="text" id="f-c-title"></label>
        <label class="fld"><span>Phone</span><input type="text" id="f-c-tel" inputmode="tel"></label>
        <label class="fld"><span>Email</span><input type="text" id="f-c-email" inputmode="email" spellcheck="false"></label>
        <label class="fld"><span>Website</span><input type="text" id="f-c-url" spellcheck="false"></label>
        <label class="fld wide"><span>Address</span><input type="text" id="f-c-adr"></label>
      </div>
    </div>

    <h2 class="qrg-h">Design</h2>
    <div class="qrg-design">
      <div class="fld"><span>Style</span><div class="seg" id="style" role="radiogroup" aria-label="Style"><button type="button" data-v="square" aria-pressed="true">Square</button><button type="button" data-v="rounded" aria-pressed="false">Rounded</button><button type="button" data-v="dots" aria-pressed="false">Dots</button></div><input type="hidden" id="qr-style" value="square"></div>
      <div class="fld"><span>Colours</span><div class="qrg-colours">
        <label class="swatch" title="Code colour"><input type="color" id="dark" value="#111111"><span>Code</span></label>
        <label class="swatch" title="Background colour"><input type="color" id="light" value="#ffffff"><span>Background</span></label>
        <label class="fld chk"><input type="checkbox" id="transparent"> <span>See-through</span></label>
      </div></div>
      <div class="fld"><span>Logo in the middle <em>optional</em></span><div class="qrg-logo"><button type="button" class="btn small" id="logo-btn">Add logo</button><button type="button" class="btn small" id="logo-remove" hidden>Remove</button><input type="file" id="logo-input" accept="image/*" hidden></div></div>
      <label class="fld"><span>Words under the code <em>optional</em></span><input type="text" id="caption" maxlength="40" placeholder="Scan for the menu"></label>
      <label class="fld"><span>Error correction <em>higher survives scratches and logos</em></span><select id="ecl"><option value="auto">Automatic</option><option value="L">Low (7%)</option><option value="M">Medium (15%)</option><option value="Q">Quartile (25%)</option><option value="H">High (30%)</option></select></label>
      <label class="fld"><span>Border <em id="margin-val">4 modules</em></span><input type="range" id="margin" min="0" max="8" value="4"></label>
    </div>
  </div>

  <aside class="qrg-side">
    <div class="qrg-preview" id="preview" aria-live="polite"></div>
    <div class="status" id="status" aria-live="polite"></div>
    <div class="qrg-actions">
      <button class="btn primary" id="png">Download PNG</button>
      <button class="btn" id="svg">SVG</button>
      <button class="btn" id="copy">Copy image</button>
      <label class="check qrg-size">Size <select id="size"><option value="512">512 px</option><option value="1024" selected>1024 px</option><option value="2048">2048 px</option><option value="4096">4096 px</option></select></label>
    </div>
    <p class="qrg-meta" id="meta"></p>
    <details class="qrg-inside"><summary>What’s inside the code</summary><pre id="payload"></pre></details>
  </aside>
</div>`,
  content: `<h2>How to make a QR code</h2>
<ol><li>Pick what the code should open: a link, your Wi-Fi, a WhatsApp chat, your LINE account, a contact card and so on.</li><li>Fill in the details. The preview updates as you type.</li><li>Choose a style and colours, and add your logo if you like.</li><li>Download a PNG for posts and screens, or an SVG for print. SVGs stay sharp at any size.</li></ol>
<p>Always scan the finished code with your own phone before you print a few hundred menus.</p>
<h2>These codes never stop working</h2>
<p>A lot of “free” QR sites hand you a short link that goes through their server. It lets them count scans, and it also lets them switch your code off when the free trial ends. The codes made here contain your actual link or details, so there’s nothing in the middle to expire, track people or break.</p>
<p>The flip side: once printed, a code can’t be edited. If the link might change, point the code at a page you control, like your own website.</p>
<h2>Tips for codes that scan first time</h2>
<ul><li>Keep it dark on light. Light codes on dark backgrounds trip up plenty of phones.</li><li>Leave the border. Scanners need a quiet strip around the code, so don’t crop it off.</li><li>Shorter is easier. A short link makes a simpler code that scans from further away.</li><li>Print it big enough: about 2 × 2 cm for something held in the hand, much bigger for a poster across the room.</li></ul>`,
  faq: [
    { q: 'Is this QR code generator really free?', a: 'Yes. No account, no watermark, no limits on how many codes you make or how often they’re scanned.' },
    { q: 'Do the QR codes expire?', a: 'No. The code holds your link or details directly, so it works for as long as the link itself does.' },
    { q: 'Can I put my logo in the middle?', a: 'Yes. Add a logo and the error correction goes up to High, which lets phones read the code even with the middle covered. Keep logos simple and test the code before printing.' },
    { q: 'How do Wi-Fi QR codes work?', a: 'Phones read the network name and password from the code and offer to join. It works with the camera app on iPhone and most Android phones. The details are only inside the image you download; nothing is sent to us.' },
    { q: 'PNG or SVG?', a: 'PNG for social posts, websites and screens. SVG for printing, especially big things like posters and banners, because it never goes blurry.' },
    { q: 'Can I track how many people scan it?', a: 'Not with these codes, because there’s no tracking server in between. If you need numbers, use a link with UTM tags and check your website analytics.' },
  ],
};
