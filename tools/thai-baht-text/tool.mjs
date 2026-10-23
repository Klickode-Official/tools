// Thai Baht Text: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'thai-baht-text',
  category: 'business',
  order: 5,
  name: 'Thai Baht Text Converter',
  title: 'Thai Baht Text: Write Amounts in Words (บาทถ้วน)',
  description: 'Type an amount and get it in Thai words, like “หนึ่งพันบาทถ้วน”, plus the English version for invoices, receipts and cheques. Works like Excel’s BAHTTEXT.',
  short: 'Amounts in Thai and English words for invoices.',
  keywords: ['bahttext', 'baht text', 'number to words', 'บาทถ้วน', 'invoice'],
  body: `<div class="toolbar">
  <label class="check">Amount <input type="text" id="amount" inputmode="decimal" autocomplete="off" placeholder="1,234.50" style="width:12em"></label>
  <span class="baht-figure" id="figure" aria-live="polite"></span>
</div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel">
    <div class="panel-head"><span class="label">Thai</span><button class="btn small" data-copy="#thai">Copy</button></div>
    <p class="baht-out" id="thai" lang="th"></p>
  </div>
  <div class="panel">
    <div class="panel-head"><span class="label">English</span><button class="btn small" data-copy="#english">Copy</button></div>
    <p class="baht-out" id="english"></p>
  </div>
</div>`,
  content: `<h2>How to write an amount in Thai words</h2>
<ol><li>Type the amount, with or without commas. Satang after the decimal point are included.</li><li>Copy the Thai wording for your invoice, receipt or cheque.</li><li>Need it in English too? It’s right next to it, ending in “Baht Only”.</li></ol>
<h2>The rules it follows</h2>
<ul><li>A whole amount ends in <strong>ถ้วน</strong>: 100 is หนึ่งร้อยบาทถ้วน.</li><li>Satang are written after บาท: 50.25 is ห้าสิบบาทยี่สิบห้าสตางค์.</li><li>10 is สิบ (not หนึ่งสิบ), 20 is ยี่สิบ, and a 1 at the end of 11, 21 or 101 is เอ็ด.</li><li>Big numbers repeat ล้าน: a trillion is หนึ่งล้านล้าน.</li></ul>
<p>Satang are rounded to two places, half up, the way accounting software does it.</p>`,
  faq: [
    { q: 'Is it the same as Excel’s BAHTTEXT?', a: 'Yes, for everyday amounts you’ll get the same wording as <code>=BAHTTEXT()</code> in Excel, so it matches invoices made there.' },
    { q: 'When is 1 written “เอ็ด” instead of “หนึ่ง”?', a: 'At the end of a number that has tens or hundreds before it: 11 is สิบเอ็ด, 21 is ยี่สิบเอ็ด and 101 is หนึ่งร้อยเอ็ด. On its own, 1 is หนึ่ง.' },
    { q: 'How should I write the amount on a cheque?', a: 'Write the Thai words on the line, end with ถ้วน for a whole amount, and draw a line through any space left so nothing can be added.' },
    { q: 'Is the amount sent anywhere?', a: 'No. It’s worked out in your browser and nothing leaves your device.' },
  ],
};
