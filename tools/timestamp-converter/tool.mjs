// Unix Timestamp Converter — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'timestamp-converter',
  category: 'encoding',
  name: 'Unix Timestamp Converter',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'Unix Timestamp Converter — Epoch to Date and Back',
  description: 'Convert Unix epoch timestamps (seconds, milliseconds, microseconds) to human-readable dates and back. Shows UTC, local time, ISO 8601 and relative time.',
  // One line for tool cards on the home and category pages.
  short: 'Epoch seconds/ms to dates and back, with timezone views.',
  body: `<div class="toolbar"><input type="text" id="input" class="mono" style="flex:1;min-width:12em" spellcheck="false" placeholder="1700000000 or 2024-05-01T12:00:00Z" aria-label="Timestamp or date"><button class="btn primary" id="now">Now</button></div>
<div class="status" id="status" aria-live="polite"></div>
<table class="kv" id="result"></table>
<p class="check" id="clock"></p>`,
  content: `<h2>Seconds or milliseconds?</h2><p>The unit is detected from the size of the number: 10 digits are seconds (Unix, PHP, Python's <code>time.time()</code>), 13 digits are milliseconds (JavaScript's <code>Date.now()</code>, Java), 16 are microseconds and 19 are nanoseconds. You can also type any date string the browser understands, such as ISO 8601.</p>`,
  faq: [
  ],
};
