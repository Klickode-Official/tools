// VAT Calculator (Thailand): page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'vat-calculator',
  category: 'business',
  order: 6,
  name: 'Thai VAT & Withholding Tax Calculator',
  title: 'VAT 7% Calculator for Thailand, with Withholding Tax',
  description: 'Add or take out 7% VAT, then subtract 1%, 3% or 5% withholding tax to see what to invoice and what you’ll actually be paid, with the amount in words.',
  short: 'Add or remove 7% VAT and withholding tax.',
  keywords: ['vat', 'ภาษีมูลค่าเพิ่ม', 'withholding tax', 'หัก ณ ที่จ่าย', 'invoice'],
  body: `<div class="toolbar">
  <label class="check">Amount <input type="text" id="amount" inputmode="decimal" autocomplete="off" placeholder="10,000" style="width:10em"></label>
  <label class="check">The amount is <select id="mode"><option value="add">before VAT</option><option value="remove">including VAT</option></select></label>
  <label class="check">VAT <input type="number" id="rate" value="7" min="0" max="100" step="0.5" style="width:4.5em"> %</label>
  <label class="check">Withholding tax <select id="wht"><option value="0">None</option><option value="1">1% (transport)</option><option value="2">2% (advertising)</option><option value="3">3% (services, fees)</option><option value="5">5% (rent, prizes)</option></select></label>
</div>
<div class="status" id="status" aria-live="polite"></div>
<div class="panel">
  <div class="panel-head"><span class="label">Breakdown</span><button class="btn small" data-copy="#summary">Copy</button></div>
  <table class="kv vat-table" id="table"></table>
  <pre class="vat-summary" id="summary" hidden></pre>
</div>`,
  content: `<h2>How to work out VAT</h2>
<ol><li>Type the amount and say whether it already includes VAT.</li><li>If your customer is a company that withholds tax, pick the rate for your kind of work.</li><li>Read off the price before VAT, the VAT, the invoice total and what you’ll receive after withholding.</li></ol>
<h2>The formulas</h2>
<ul><li><strong>Adding VAT:</strong> VAT = price × 7%. Total = price + VAT. 10,000 becomes 10,700.</li><li><strong>Taking VAT out:</strong> price = total ÷ 1.07. 10,700 becomes 10,000 plus 700 VAT.</li><li><strong>Withholding tax</strong> is worked out on the price <em>before</em> VAT, never on the total. On a 10,000 service with 3% withheld, the customer pays you 10,700 − 300 = 10,400 and gives you a withholding certificate (50 ทวิ) for the 300.</li></ul>
<p>Every figure is rounded to the satang, half up.</p>`,
  faq: [
    { q: 'Who has to charge VAT in Thailand?', a: 'Businesses registered for VAT, which is required once income goes over 1.8 million baht a year. If you aren’t registered, don’t add VAT to your invoices.' },
    { q: 'Is withholding tax worked out before or after VAT?', a: 'Before. It’s a percentage of the amount excluding VAT, so the VAT itself is never taxed again.' },
    { q: 'Which withholding rate applies to me?', a: 'The common rates are 1% for transport, 2% for advertising, 3% for services and professional fees, and 5% for rent. Check with your accountant or the Revenue Department for your exact case, because rates change for some payers and periods.' },
    { q: 'Is my data sent anywhere?', a: 'No. Everything is worked out in your browser.' },
  ],
};
