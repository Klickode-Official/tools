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
<div class="status" id="status" aria-live="polite"></div>
<table class="kv" id="result"></table>
<p class="check" id="clock"></p>`,
  content: `<h2>Seconds or milliseconds?</h2>
<p>You don’t need to say. It goes by the length of the number: 10 digits is seconds (Unix, PHP, Python’s <code>time.time()</code>), 13 is milliseconds (JavaScript’s <code>Date.now()</code>, Java), and 16 or 19 digits are micro- and nanoseconds.</p>
<p>You can also type a normal date, like <code>2025-03-01 14:30</code>, to get its timestamp.</p>`,
  faq: [],
};
