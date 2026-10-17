// UUID Generator — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'uuid-generator',
  category: 'encoding',
  name: 'UUID Generator',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'UUID Generator — Random v4 and Time-Ordered v7 UUIDs',
  description: 'Generate UUID v4 or v7 in bulk using cryptographically secure randomness, and validate or inspect existing UUIDs.',
  // One line for tool cards on the home and category pages.
  short: 'Bulk v4/v7 UUIDs and a UUID validator.',
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
  content: `<h2>v4 or v7?</h2><p><strong>v4</strong> is 122 bits of randomness and the safe default. <strong>v7</strong> (RFC 9562) starts with a millisecond timestamp, so IDs sort by creation time, which keeps database indexes compact. Both use <code>crypto.getRandomValues</code>.</p>`,
  faq: [
  ],
};
