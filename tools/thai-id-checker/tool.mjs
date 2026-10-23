// Thai ID Number Checker: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'thai-id-checker',
  category: 'business',
  order: 7,
  name: 'Thai ID Number Checker',
  title: 'Thai ID Card Number Checker (13-Digit Check Digit)',
  description: 'Check whether a 13-digit Thai national ID number is valid, one at a time or a whole list from a spreadsheet. Uses the official check digit. Nothing is uploaded.',
  short: 'Is this 13-digit Thai ID number valid?',
  keywords: ['เลขบัตรประชาชน', 'citizen id', 'national id', 'validate', 'tax id'],
  body: `<div class="panel">
  <div class="panel-head"><label for="input">ID numbers, one per line</label><button class="btn small" id="clear">Clear</button></div>
  <textarea id="input" class="mono" spellcheck="false" inputmode="numeric" autocomplete="off" placeholder="1-1037-00012-34-6" style="min-height:140px"></textarea>
</div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="id-results" id="results"></ul>`,
  content: `<h2>How to check a Thai ID number</h2>
<ol><li>Type or paste the number. Dashes and spaces are fine.</li><li>For a list, paste a whole column from Excel or Google Sheets, one number per line.</li><li>Each number shows as valid or not. If the last digit is wrong, you’ll see what it should be, which usually means a typo.</li></ol>
<h2>How the check digit works</h2>
<p>The 13th digit is worked out from the first 12. Multiply them by 13, 12, 11 and so on down to 2, add the results, take the remainder after dividing by 11, and subtract it from 11. The last digit of that is the check digit. A single mistyped digit, or two swapped neighbours, almost always breaks it.</p>
<p>A valid check digit only means the number is well formed. It doesn’t prove the number belongs to a real person, or to the person who gave it to you.</p>`,
  faq: [
    { q: 'Does this look the number up anywhere?', a: 'No. It only does the maths on the digits, in your browser. Nothing is sent to any government system or to us, which matters under Thailand’s PDPA.' },
    { q: 'What does the first digit mean?', a: 'It says how the person was registered: 1 and 2 for Thai nationals born from 1984 on, 3 to 5 for people registered before then or added later, 6 and 7 for foreign residents and their children, and 8 for permanent residents and naturalised citizens.' },
    { q: 'Does it work for a company tax ID?', a: 'Yes. Thai company tax IDs are also 13 digits with the same check digit, so a typo shows up the same way.' },
  ],
};
