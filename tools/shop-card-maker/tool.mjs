// Shop Card Maker: page copy and SEO details. What the page does lives in ./script.js;
// the card markup itself comes from ./card.js and the platform presets from ./platforms.js.
export default {
  slug: 'shop-card-maker',
  category: 'business',
  order: 1,
  name: 'Shop Card Maker',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Shop Card Maker: Etsy, TikTok, WhatsApp and Shopee Badges',
  description: 'Make a “find us on Etsy” card for your website or a social post. Pick TikTok, WhatsApp, Instagram, Shopee and more, style it, then copy the code or save a PNG.',
  // One line for the tool cards on the home and category pages.
  short: 'Make a “shop us on Etsy/TikTok/WhatsApp” card for your site.',
  body: `<div class="scm">
  <div class="scm-platforms" id="platforms" role="radiogroup" aria-label="Platform"></div>

  <div class="scm-stage">
    <div class="scm-stage-bar">
      <div class="seg" role="radiogroup" aria-label="Layout" id="layout">
        <button type="button" data-v="banner" aria-pressed="true">Banner</button>
        <button type="button" data-v="card" aria-pressed="false">Card</button>
        <button type="button" data-v="button" aria-pressed="false">Button</button>
      </div>
      <div class="seg" role="radiogroup" aria-label="Preview width" id="device">
        <button type="button" data-v="desktop" aria-pressed="true">Desktop</button>
        <button type="button" data-v="mobile" aria-pressed="false">Phone</button>
      </div>
    </div>
    <div class="scm-canvas" id="canvas"><div class="scm-frame" id="preview"></div></div>
  </div>

  <div class="scm-tabs" role="tablist" aria-label="Settings">
    <button type="button" role="tab" aria-selected="true" data-tab="business">Your business</button>
    <button type="button" role="tab" aria-selected="false" data-tab="words">Words</button>
    <button type="button" role="tab" aria-selected="false" data-tab="style">Style</button>
    <button type="button" role="tab" aria-selected="false" data-tab="extras">Season &amp; QR</button>
    <button type="button" role="tab" aria-selected="false" data-tab="export">Get the code or image</button>
  </div>

  <section class="scm-panel" data-panel="business">
    <div class="scm-form">
      <label class="fld"><span>Business name</span><input type="text" id="f-name" data-k="name" maxlength="60"></label>
      <label class="fld"><span id="handle-label">Shop link</span><input type="text" id="f-handle" data-k="handle" maxlength="300" spellcheck="false"></label>
      <label class="fld" id="msg-field" hidden><span>Pre-filled message (optional)</span><input type="text" data-k="message" maxlength="200" placeholder="Hi! I’d like to ask about…"></label>
      <p class="fld-note wide" id="url-out"></p>
      <label class="fld"><span>Name on the card</span><input type="text" data-k="shopName" maxlength="60"></label>
      <label class="fld"><span>Location or tagline</span><input type="text" data-k="location" maxlength="60"></label>
      <label class="fld"><span>Rating (out of 5)</span><input type="text" data-k="rating" maxlength="4" inputmode="decimal"></label>
      <label class="fld"><span>Number of reviews</span><input type="text" data-k="reviews" maxlength="10" inputmode="numeric"></label>
    </div>
    <h2>Pictures</h2>
    <div class="scm-pics">
      <div class="pic-slot avatar" data-img="avatar"><span>Shop logo</span></div>
      <div class="pic-slot" data-img="products.0"><span>Photo 1</span></div>
      <div class="pic-slot" data-img="products.1"><span>Photo 2</span></div>
      <div class="pic-slot" data-img="products.2"><span>Photo 3</span></div>
      <div class="pic-slot" data-img="products.3"><span>Photo 4</span></div>
    </div>
    <input type="file" id="pic-input" accept="image/*" hidden>
    <p class="hint">Click a box to add a picture. They’re shrunk and stored inside the code, so you don’t need to host them anywhere.</p>
  </section>

  <section class="scm-panel" data-panel="words" hidden>
    <div class="scm-form">
      <label class="fld"><span>Small label at the top</span><input type="text" data-k="badge" maxlength="60"></label>
      <label class="fld"><span>Headline <em>wrap a word in *stars* to colour it</em></span><input type="text" data-k="headline" maxlength="90"></label>
      <label class="fld wide"><span>Text <em>use **double stars** for bold</em></span><textarea data-k="text" rows="3" maxlength="400"></textarea></label>
      <label class="fld"><span>Ticked points (one per line)</span><textarea data-k="bullets" rows="3" maxlength="300"></textarea></label>
      <div class="fld"><span>Numbers on the card</span>
        <div class="stat-rows" id="stats">
          <input type="text" data-stat="0.0" maxlength="12" aria-label="Number 1"><input type="text" data-stat="0.1" maxlength="24" aria-label="Label 1">
          <input type="text" data-stat="1.0" maxlength="12" aria-label="Number 2"><input type="text" data-stat="1.1" maxlength="24" aria-label="Label 2">
          <input type="text" data-stat="2.0" maxlength="12" aria-label="Number 3"><input type="text" data-stat="2.1" maxlength="24" aria-label="Label 3">
        </div>
      </div>
      <label class="fld"><span>Main button</span><input type="text" data-k="button" maxlength="50"></label>
      <label class="fld"><span>Card button</span><input type="text" data-k="cardButton" maxlength="30"></label>
      <label class="fld"><span>Label in the card corner</span><input type="text" data-k="cardLabel" maxlength="24"></label>
      <div class="fld"><span>&nbsp;</span><button type="button" class="btn" id="reset-words">Reset words for this platform</button></div>
    </div>
  </section>

  <section class="scm-panel" data-panel="style" hidden>
    <div class="scm-form">
      <div class="fld wide"><span>Look <em>a starting point; everything below still works after you pick one</em></span>
        <div class="scm-looks" id="look" role="radiogroup" aria-label="Look"></div>
      </div>
      <div class="fld"><span>Colours</span>
        <div class="seg" id="theme" role="radiogroup" aria-label="Colours">
          <button type="button" data-v="brand" aria-pressed="true">Platform</button>
          <button type="button" data-v="light" aria-pressed="false">Light</button>
          <button type="button" data-v="dark" aria-pressed="false">Dark</button>
        </div>
      </div>
      <div class="fld"><span>Heading font</span>
        <div class="seg" id="headingFont" role="radiogroup" aria-label="Heading font">
          <button type="button" data-v="sans" aria-pressed="true">Clean</button>
          <button type="button" data-v="serif" aria-pressed="false">Elegant</button>
          <button type="button" data-v="rounded" aria-pressed="false">Friendly</button>
          <button type="button" data-v="mono" aria-pressed="false">Techy</button>
        </div>
      </div>
      <div class="fld"><span>Button colour</span>
        <div class="color-row"><input type="color" id="f-accent" aria-label="Button colour"><button type="button" class="btn small" id="accent-reset">Use platform colour</button></div>
      </div>
      <div class="fld"><span>Background</span>
        <div class="color-row"><input type="color" id="f-bg" aria-label="Background colour"><button type="button" class="btn small" id="bg-reset">Use platform background</button></div>
      </div>
      <label class="fld"><span>Corner roundness <output id="radius-val">20</output></span><input type="range" data-k="radius" min="0" max="36" step="1"></label>
      <label class="fld"><span>Product photos</span>
        <select data-k="productCount"><option value="4">4 photos</option><option value="3">3 photos</option><option value="2">2 photos</option><option value="0">No photos</option></select>
      </label>
      <div class="fld wide"><span>Show</span>
        <div class="checks">
          <label><input type="checkbox" data-show="badge"> Top label</label>
          <label><input type="checkbox" data-show="bullets"> Ticked points</label>
          <label><input type="checkbox" data-show="note"> “Opens in a new tab” line</label>
          <label><input type="checkbox" data-show="card"> Shop card</label>
          <label><input type="checkbox" data-show="rating"> Star rating</label>
          <label><input type="checkbox" data-show="stats"> Numbers</label>
          <label><input type="checkbox" data-shadow> Shadows</label>
        </div>
      </div>
      <div class="fld wide"><span>Platform logo</span>
        <div class="color-row"><button type="button" class="btn small" id="logo-upload">Upload a different logo</button><button type="button" class="btn small" id="logo-reset" hidden>Back to the standard logo</button></div>
      </div>
    </div>
  </section>

  <section class="scm-panel" data-panel="extras" hidden>
    <div class="scm-form">
      <div class="fld wide"><span>Season <em>new colours and decorations; your platform’s logo and button stay the same</em></span>
        <div class="scm-seasons" id="season" role="radiogroup" aria-label="Season"></div>
      </div>
      <label class="fld" id="season-badge-field"><span>Sticker text</span><input type="text" data-k="seasonBadge" maxlength="24" placeholder="e.g. 11.11 SALE"></label>
    </div>
    <h2>QR code</h2>
    <div class="scm-form">
      <div class="fld"><span>&nbsp;</span><div class="checks"><label><input type="checkbox" id="f-qr"> Add a QR code to the card</label></div></div>
      <div class="fld"><span>Where</span>
        <div class="seg" id="qrPos" role="radiogroup" aria-label="QR code position">
          <button type="button" data-v="cta" aria-pressed="true">Next to the button</button>
          <button type="button" data-v="card" aria-pressed="false">On the shop card</button>
        </div>
      </div>
      <label class="fld"><span>Words next to it</span><input type="text" data-k="qrCaption" maxlength="30" placeholder="Scan to visit"></label>
      <div class="fld"><span>QR colour</span>
        <div class="color-row"><input type="color" id="f-qr-color" aria-label="QR code colour"><button type="button" class="btn small" id="qr-color-reset">Black</button></div>
      </div>
      <p class="fld-note wide" id="qr-note" aria-live="polite"></p>
    </div>
  </section>

  <section class="scm-panel" data-panel="export" hidden>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-head"><span class="label">Code for your website</span><span><button type="button" class="btn small" id="dl-html">Download .html</button><button type="button" class="btn small" data-copy="#code">Copy</button></span></div>
        <textarea id="code" readonly spellcheck="false" aria-label="Embed code"></textarea>
      </div>
      <div class="scm-export">
        <h2>Image for social media</h2>
        <div class="toolbar">
          <label class="check">Size
            <select id="png-size">
              <option value="auto">Just the card</option>
              <option value="1080x1080">Square post (1080×1080)</option>
              <option value="1080x1350">Portrait post (1080×1350)</option>
              <option value="1080x1920">Story / Reel (1080×1920)</option>
              <option value="1200x630">Link preview (1200×630)</option>
            </select>
          </label>
          <label class="check">Behind it
            <select id="png-bg">
              <option value="brand">Platform colours</option>
              <option value="white">White</option>
              <option value="transparent">Transparent</option>
            </select>
          </label>
        </div>
        <button type="button" class="btn primary" id="dl-png" data-dl>Download PNG</button>
        <p class="hint" id="code-size"></p>
        <h2>Where to paste the code</h2>
        <ul class="paste-list">
          <li><strong>WordPress:</strong> add a “Custom HTML” block.</li>
          <li><strong>Shopify:</strong> Online Store, Customize, then a “Custom liquid” section.</li>
          <li><strong>Wix:</strong> Add, Embed code, “Embed HTML”.</li>
          <li><strong>Squarespace:</strong> add a “Code” block.</li>
        </ul>
      </div>
    </div>
  </section>
</div>`,
  content: `<h2>What this is for</h2>
<p>If you sell on Etsy, Shopee or TikTok Shop, or take orders over WhatsApp or LINE, your website should send people there in one tap. This makes a tidy block for that, in the platform’s own colours, so visitors recognise it straight away.</p>
<h2>How to make one</h2>
<ol><li>Pick the platform at the top.</li><li>Type your business name and your shop link, username or phone number. The link is worked out for you.</li><li>Change the words, colours and pictures until it looks right.</li><li>Copy the code into your website, or download a PNG for Instagram, Facebook or a story.</li></ol>
<h2>Looks, seasons and QR codes</h2>
<p>Under <strong>Style</strong>, a look gives the card a different feel in one click: Minimal is quiet and airy, Bold has chunky borders and big type, Luxury uses a serif and fine lines, and Festival is rounder and a bit playful. You can still change the font, corners and colours afterwards.</p>
<p>For a sale or holiday, pick a season under <strong>Season &amp; QR</strong>. There are themes for Songkran, Loy Krathong, 11.11, Black Friday, Lunar New Year and Christmas, each with its own decorations and a sticker you can reword. The QR code points to the same link as the buttons, which is handy on posters, menus and Instagram stories where people can’t tap.</p>
<h2>About the logos</h2>
<p>The platform logos come from <a href="https://simpleicons.org" rel="noopener">Simple Icons</a> and belong to their companies. Use them to point people to your own shop or profile on that platform, which is what the brands allow, and don’t change them to look like your own logo. Amazon and Lazada don’t make their logos available for this, so those cards show the name in text instead. If you have permission to use a logo, you can upload it under Style.</p>`,
  faq: [
    {
      q: 'Will the code clash with my website’s design?',
      a: 'It shouldn’t. All the styles are scoped to the card, so your site’s own fonts and colours won’t leak into it and it won’t change anything else on the page. It also stacks neatly on phones.',
    },
    {
      q: 'Where are my pictures stored?',
      a: 'Inside the code itself. Pictures are shrunk to a small size and written into the HTML, so there’s nothing to upload or host. That keeps it simple, but it does make the code longer. The size is shown next to the download button.',
    },
    {
      q: 'Do I need to update the numbers by hand?',
      a: 'Yes. The card shows whatever you type, so it can’t go out of date on its own. Pop back and change your sales or follower count every so often.',
    },
    {
      q: 'Will the QR code scan?',
      a: 'It should. It’s drawn dark on a white square with the blank border scanners need, and it uses the same link as your buttons. If you pick a QR colour that’s too pale to scan, the card uses black instead and tells you. Test it with your own phone before you print anything.',
    },
    {
      q: 'Can I switch the season back off after the sale?',
      a: 'Yes. Set the season to None and the card goes back to your normal colours. Your words and pictures stay as they were.',
    },
    {
      q: 'Is this made by Etsy, TikTok or WhatsApp?',
      a: 'No. It’s an independent tool, and the cards it makes aren’t endorsed by any of those companies.',
    },
  ],
};
