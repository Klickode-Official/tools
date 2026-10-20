// Unix Timestamp Converter: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'timestamp-converter',
  category: 'encoding',
  name: 'Unix Timestamp Converter',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Unix Timestamp Converter: Epoch to Date and Back',
  description: 'Convert a Unix timestamp to a readable date in UTC and your local time, or go the other way. Seconds and milliseconds are detected automatically.',
  // One line for the tool cards on the home and category pages.
  short: 'Epoch numbers to real dates and back.',
  body: `<div class="toolbar"><input type="text" id="input" class="mono" style="flex:1;min-width:12em" spellcheck="false" placeholder="1700000000 or 2024-05-01T12:00:00Z" aria-label="Timestamp or date"><button class="btn primary" id="now">Now</button></div>
<div class="toolbar"><label class="check">Also show in <select id="tz" aria-label="Time zone"></select></label></div>
<div class="status" id="status" aria-live="polite"></div>
<table class="kv" id="result"></table>
<p class="check" id="clock"></p>`,
  content: `<h2>Seconds or milliseconds?</h2>
<p>You don’t need to say. It goes by the length of the number: 10 digits is seconds (Unix, PHP, Python’s <code>time.time()</code>), 13 is milliseconds (JavaScript’s <code>Date.now()</code>, Java), and 16 or 19 digits are micro- and nanoseconds.</p>
<p>You can also type a normal date, like <code>2025-03-01 14:30</code>, to get its timestamp. A date without a time zone is read as your own local time; add <code>Z</code> or <code>+07:00</code> to be specific.</p>\n<h2>Time zones and the Thai calendar</h2>\n<p>Pick any time zone to see the same moment there, handy for scheduling with customers abroad. The Thai row shows the date in the Buddhist calendar (พ.ศ.), which is the Western year plus 543, in Bangkok time.</p>
<h2>How to convert a timestamp</h2>
<ol><li>Paste a Unix timestamp, or click Now for the current one.</li><li>Read it as a date in UTC, your local time and any other time zone you add.</li><li>To go the other way, type a date like <code>2025-03-01 14:30</code> and get its timestamp.</li></ol>`,
  faq: [
    { q: 'What is a Unix timestamp?', a: 'The number of seconds since 00:00:00 UTC on 1 January 1970. It’s the same everywhere in the world, which is why servers and databases store time this way.' },
    { q: 'How do I get the current timestamp in code?', a: 'JavaScript: <code>Math.floor(Date.now() / 1000)</code>. Python: <code>int(time.time())</code>. PHP: <code>time()</code>. In a terminal: <code>date +%s</code>.' },
    { q: 'What is the year 2038 problem?', a: 'Systems that store timestamps as 32-bit signed numbers run out at 03:14:07 UTC on 19 January 2038 (2147483647) and wrap around to 1901. 64-bit timestamps, which most systems use now, are fine.' },
    { q: 'How do I convert a date to the Thai Buddhist year (พ.ศ.)?', a: 'Add 543 to the year: 2025 is พ.ศ. 2568. The Thai row does this for you and shows the time in Bangkok.' },
  ],
};
