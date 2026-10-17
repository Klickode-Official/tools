// UUID Generator: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'uuid-generator',
  category: 'encoding',
  name: 'UUID Generator',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'UUID Generator: v4 and v7 UUIDs in Bulk',
  description: 'Generate up to 1,000 UUIDs at once, either random v4 or time-sortable v7, or paste one to check its version and when it was made.',
  // One line for the tool cards on the home and category pages.
  short: 'Fresh v4 or v7 UUIDs, up to 1,000 at a time.',
  body: `<div class="toolbar">
  <label class="check">Version <select id="version"><option value="4">v4 (random)</option><option value="7">v7 (time-ordered)</option></select></label>
  <label class="check">How many <input type="number" id="count" value="5" min="1" max="1000" style="width:6em"></label>
  <label class="check"><input type="checkbox" id="upper"> Uppercase</label>
  <label class="check"><input type="checkbox" id="nodash"> No hyphens</label>
  <button class="btn primary" id="generate">Generate</button>
  <button class="btn" data-copy="#output">Copy all</button>
</div>
<textarea id="output" spellcheck="false" readonly aria-label="Generated UUIDs" style="min-height:200px"></textarea>
<h2>Validate a UUID</h2>
<div class="toolbar"><input type="text" id="check" class="mono" style="flex:1" spellcheck="false" placeholder="Paste a UUID" aria-label="UUID to validate"></div>
<div class="status" id="status" aria-live="polite"></div>`,
  content: `<h2>v4 or v7?</h2>
<p><strong>v4</strong> is completely random and the safe default if you’re not sure.</p>
<p><strong>v7</strong> starts with the time it was created, so new IDs sort after old ones. Databases like that, because new rows land at the end of the index instead of all over it. Both are made with your browser’s secure random number generator.</p>`,
  faq: [],
};
