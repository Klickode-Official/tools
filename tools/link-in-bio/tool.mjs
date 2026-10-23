// Link in Bio Page Builder: page copy and SEO details. What the page does lives in ./script.js;
// the page it makes comes from ./page.js, reusing the Shop Card Maker's platforms and logos.
export default {
  slug: 'link-in-bio',
  category: 'business',
  order: 4,
  name: 'Link in Bio Page Builder',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Free Link in Bio Page Builder, No Account Needed',
  description: 'Make a link in bio page for Instagram or TikTok with all your shops and socials in one place. Download it as one HTML file you own. No sign-up, no monthly fee.',
  // One line for the tool cards on the home and category pages.
  short: 'One page for all your links. You keep the file.',
  body: `<div class="lib">
  <div class="lib-edit">
    <div class="lib-tabs" role="tablist" aria-label="Settings">
      <button type="button" role="tab" aria-selected="true" data-tab="profile">Profile</button>
      <button type="button" role="tab" aria-selected="false" data-tab="links">Links</button>
      <button type="button" role="tab" aria-selected="false" data-tab="style">Style</button>
      <button type="button" role="tab" aria-selected="false" data-tab="publish">Download</button>
    </div>

    <section class="lib-panel" data-panel="profile">
      <div class="lib-profile">
        <div class="lib-avatar" id="avatar-slot" role="button" tabindex="0" aria-label="Add a profile picture"><span>Add photo</span></div>
        <div class="lib-avatar-actions">
          <button type="button" class="btn small" id="avatar-pick">Upload a photo</button>
          <button type="button" class="btn small" id="avatar-remove" hidden>Use initials instead</button>
          <p class="hint">It’s shrunk and saved inside the page, so there’s nothing to host.</p>
        </div>
      </div>
      <input type="file" id="avatar-input" accept="image/*" hidden>
      <label class="lib-fld"><span>Name</span><input type="text" data-k="name" maxlength="60" placeholder="Mali’s Handmade"></label>
      <label class="lib-fld"><span>Short bio <em>a line or two</em></span><textarea data-k="bio" rows="3" maxlength="240" placeholder="Handmade silver jewellery from Chiang Mai. Ships worldwide."></textarea></label>
    </section>

    <section class="lib-panel" data-panel="links" hidden>
      <ul class="lib-links" id="links" aria-label="Your links"></ul>
      <div class="lib-add">
        <label class="lib-fld"><span>Add a link</span>
          <select id="add-platform" aria-label="Link type"></select>
        </label>
        <button type="button" class="btn" id="add-link">Add link</button>
      </div>
      <p class="hint">Drag the handle or use the arrows to change the order. Links without an address are left out of the downloaded page.</p>
      <fieldset class="lib-pay">
        <legend>PromptPay <em>optional · Thai customers scan to pay you</em></legend>
        <div class="lib-row">
          <label class="lib-fld"><span>Phone number or ID</span><input type="text" data-pay="id" inputmode="numeric" maxlength="20" spellcheck="false" placeholder="081 234 5678"></label>
          <label class="lib-fld"><span>Fixed amount <em>baht, optional</em></span><input type="text" data-pay="amount" inputmode="decimal" maxlength="12" placeholder="Any amount"></label>
        </div>
        <p class="hint" id="pay-note">Adds a “Pay with PromptPay” button that opens a QR code. Anyone who scans it can see this number, so use the one you take payments on.</p>
      </fieldset>
    </section>

    <section class="lib-panel" data-panel="style" hidden>
      <div class="lib-fld"><span>Look</span><div class="lib-themes" id="themes" role="radiogroup" aria-label="Look"></div></div>
      <div class="lib-row">
        <div class="lib-fld"><span>Button shape</span>
          <div class="lib-seg" id="shape" role="radiogroup" aria-label="Button shape">
            <button type="button" data-v="rounded" aria-pressed="true">Rounded</button>
            <button type="button" data-v="pill" aria-pressed="false">Pill</button>
            <button type="button" data-v="square" aria-pressed="false">Square</button>
          </div>
        </div>
        <div class="lib-fld"><span>Font</span>
          <div class="lib-seg" id="font" role="radiogroup" aria-label="Font">
            <button type="button" data-v="sans" aria-pressed="true">Clean</button>
            <button type="button" data-v="serif" aria-pressed="false">Elegant</button>
            <button type="button" data-v="rounded" aria-pressed="false">Friendly</button>
            <button type="button" data-v="mono" aria-pressed="false">Techy</button>
          </div>
        </div>
        <div class="lib-fld"><span>Icons</span>
          <div class="lib-seg" id="icons" role="radiogroup" aria-label="Icons">
            <button type="button" data-v="brand" aria-pressed="true">Brand colours</button>
            <button type="button" data-v="mono" aria-pressed="false">Plain</button>
            <button type="button" data-v="none" aria-pressed="false">None</button>
          </div>
        </div>
      </div>
      <div class="lib-fld"><span>Your own colours <em>leave them alone to keep the look’s colours</em></span>
        <div class="lib-colors">
          <label><input type="color" data-color="bg"> Background</label>
          <label><input type="color" data-color="button"> Buttons</label>
          <label><input type="color" data-color="buttonText"> Button text</label>
          <label><input type="color" data-color="text"> Text</label>
          <button type="button" class="btn small" id="colors-reset">Reset colours</button>
        </div>
      </div>
    </section>

    <section class="lib-panel" data-panel="publish" hidden>
      <div class="toolbar">
        <button type="button" class="btn primary" id="download">Download page</button>
        <button type="button" class="btn" data-copy="#html-out">Copy HTML</button>
        <label class="check"><input type="checkbox" id="credit"> “Made with Klickode Tools” link</label>
      </div>
      <p class="hint" id="size-note"></p>
      <h2>How it looks when shared</h2>
      <label class="lib-fld"><span>Page title</span><input type="text" data-meta="title" maxlength="70" placeholder="Same as your name"></label>
      <label class="lib-fld"><span>Description</span><input type="text" data-meta="description" maxlength="200" placeholder="Same as your bio"></label>
      <label class="lib-fld"><span>Page address <em>where you’ll put it, e.g. https://links.yourshop.com</em></span><input type="text" data-meta="url" maxlength="300" spellcheck="false" placeholder="https://"></label>
      <label class="lib-fld"><span>Share image <em>a picture already online, 1200×630 works best</em></span><input type="text" data-meta="image" maxlength="500" spellcheck="false" placeholder="https://"></label>
      <details class="lib-code"><summary>See the HTML</summary><textarea id="html-out" readonly spellcheck="false" aria-label="Page HTML"></textarea></details>
    </section>
  </div>

  <div class="lib-stage">
    <div class="lib-phone"><div class="lib-screen" id="preview"></div></div>
  </div>
</div>`,
  content: `<h2>What it’s for</h2>
<p>Instagram and TikTok give you one link in your profile. A link in bio page turns that one link into a little menu: your Shopee store, your Etsy shop, WhatsApp, LINE, your website, whatever you want people to find.</p>
<p>Most link in bio services keep your page on their site, show their logo, and charge monthly for the good bits. This one gives you the page as a file. Put it on any web host (Netlify, GitHub Pages, Cloudflare Pages and plenty of others host a single page for free) and it’s yours.</p>
<h2>How to make one</h2>
<ol><li>Add your name, a short bio and a photo.</li><li>Add your links. Pick a platform and type your username or phone number, and the link is worked out for you. Or add any web address.</li><li>Choose a look, then tweak colours, button shape and font until it feels like you.</li><li>Download the page and upload it to your host. Then paste its address into your Instagram or TikTok profile.</li></ol>
<h2>Putting it online for free</h2>
<p>The quickest way: go to Netlify Drop, drag the downloaded file onto the page and you get a web address in seconds. Rename the file to <code>index.html</code> first so the address works without the file name on the end. If you already have a website, upload it there as something like <code>/links</code>.</p>`,
  faq: [
    {
      q: 'Do I need an account?',
      a: 'No. Everything is saved in your browser while you work on it, and the finished page is a file you download. We never see it.',
    },
    {
      q: 'Can I change it later?',
      a: 'Yes. Come back to this page in the same browser and your page will still be here. Change what you need, download it again and replace the old file on your host.',
    },
    {
      q: 'Does the page have tracking or ads?',
      a: 'None. It’s plain HTML and CSS with no scripts, so it loads fast and doesn’t follow your visitors around. If you want visitor numbers, your web host can usually show them.',
    },
    {
      q: 'Is it OK to use the Instagram, TikTok and Shopee logos?',
      a: 'The logos belong to their companies. Using them on a button that links to your own profile on that platform is generally fine. Don’t change them or use them as your own logo. Amazon and Lazada don’t share their logos, so those buttons show a letter instead.',
    },
  ],
};
