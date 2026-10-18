// PromptPay QR Generator: page copy and SEO details. What the page does lives in ./script.js;
// the payload is built by /assets/js/lib/promptpay.js (checked against promptpay-qr).
export default {
  slug: 'promptpay-qr',
  category: 'business',
  order: 3,
  name: 'PromptPay QR Generator',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'PromptPay QR Code Generator: Free, With or Without Amount',
  description: 'Make a PromptPay QR code from your phone number or ID, with a fixed amount or an open one. Get a printable pay card or a plain QR. Nothing leaves your browser.',
  // One line for the tool cards on the home and category pages.
  short: 'A PromptPay QR and printable pay card for your shop.',
  keywords: ['promptpay', 'พร้อมเพย์', 'thai qr', 'qr payment', 'thailand'],
  body: `<div class="ppq">
  <div class="ppq-form">
    <label class="fld wide"><span>PromptPay number <em>mobile number, 13-digit ID or tax number, or e-wallet ID</em></span><input type="text" id="target" placeholder="081 234 5678" inputmode="numeric" autocomplete="off" spellcheck="false"></label>
    <p class="ppq-detect" id="detect"></p>
    <label class="fld"><span>Amount in baht <em>leave empty to let the customer type it</em></span><input type="text" id="amount" placeholder="350.00" inputmode="decimal" autocomplete="off"></label>
    <label class="fld"><span>Shop name on the card <em>optional</em></span><input type="text" id="shop" maxlength="40" placeholder="Bangkok Gems"></label>
    <label class="fld"><span>Account name to check <em>optional</em></span><input type="text" id="account" maxlength="40" placeholder="Somchai J."></label>
    <label class="fld"><span>Card colour</span><span class="ppq-colours" id="colours" role="radiogroup" aria-label="Card colour"></span><input type="hidden" id="accent" value="#0f3b62"></label>
    <label class="fld chk"><input type="checkbox" id="mask" checked> <span>Hide the middle of the number on the card</span></label>
    <div class="ppq-note">
      <strong>Before you print:</strong> scan the code with your own banking app and check the name and amount it shows. We can’t see or check which account the number belongs to.
    </div>
  </div>
  <div class="ppq-side">
    <div class="ppq-preview"><canvas id="card" width="1200" height="1460" aria-label="PromptPay pay card preview"></canvas></div>
    <div class="status" id="status" aria-live="polite"></div>
    <div class="ppq-actions">
      <button class="btn primary" id="png">Download pay card</button>
      <button class="btn" id="qr-png">QR only</button>
      <button class="btn" id="copy">Copy QR text</button>
    </div>
  </div>
</div>`,
  content: `<h2>How to make a PromptPay QR code</h2>
<ol><li>Type the mobile number or ID your PromptPay is registered to.</li><li>Add an amount if every customer pays the same, or leave it empty so they type it in their app.</li><li>Download the pay card to print and stand by the till, or the plain QR for your own designs.</li><li>Scan it with your own banking app first and check the name it shows.</li></ol>
<h2>Fixed amount or open amount?</h2>
<p>With an amount, the customer’s app fills it in and they just confirm. That suits a fixed price, a deposit or an invoice. Without one, the code works for any purchase: customers scan and type the amount themselves, which is what most market stalls and cafés use.</p>
<h2>Is it safe to share my PromptPay QR?</h2>
<p>A PromptPay QR can only receive money. It contains your registered number or ID, the currency and, if you set one, the amount. Anyone who scans it sees your account name in their banking app before paying, which is also how customers know they’re paying the right person.</p>
<p>Your number stays in this browser tab while you make the code. Nothing is sent to us or to any bank.</p>`,
  faq: [
    { q: 'Which banks can scan it?', a: 'Any Thai banking app that supports PromptPay and Thai QR Payment, which is all the major ones (K PLUS, SCB EASY, Krungthai NEXT, Bangkok Bank, Krungsri and others). The code follows the EMVCo QR format the banks use.' },
    { q: 'Can I use a citizen ID instead of a phone number?', a: 'Yes, if your PromptPay is registered to your ID card number. Companies can use their 13-digit tax number. We check the last digit of 13-digit numbers to catch typos.' },
    { q: 'Is this an official PromptPay tool?', a: 'No. Klickode Tools isn’t connected to PromptPay, the Bank of Thailand or any bank. It builds the standard QR text in your browser, so always test the code with your own banking app before you use it.' },
    { q: 'Does the code expire?', a: 'No. It keeps working for as long as the number stays registered to PromptPay.' },
    { q: 'Do you charge a fee or take a cut?', a: 'No. Money goes straight from the customer’s bank to yours. We never see the payment.' },
  ],
};
