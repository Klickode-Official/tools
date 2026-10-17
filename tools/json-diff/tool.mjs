// JSON Diff — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'json-diff',
  category: 'json',
  name: 'JSON Diff',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'JSON Diff — Compare Two JSON Documents Online',
  description: 'Compare two JSON objects and see every added, removed and changed value with its JSON path. Free, private and browser-only.',
  // One line for tool cards on the home and category pages.
  short: 'Compare two JSON documents and list every change by path.',
  body: `<div class="toolbar"><button class="btn primary" id="compare">Compare</button><button class="btn" id="sample">Sample</button><button class="btn" id="clear">Clear</button></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="left">Original</label></div><textarea id="left" spellcheck="false" placeholder="Original JSON…"></textarea></div>
  <div class="panel"><div class="panel-head"><label for="right">Changed</label></div><textarea id="right" spellcheck="false" placeholder="Changed JSON…"></textarea></div>
</div>
<h2>Differences</h2>
<ul class="list-plain" id="result"></ul>`,
  content: `<h2>How it works</h2>
<p>The diff is structural, not textual: whitespace and key order don't matter. Each difference is reported with a JSONPath-style location such as <code>$.users[2].email</code>, so you can find it in large API payloads.</p>`,
  faq: [
    {
      q: 'How are arrays compared?',
      a: 'Arrays are compared index by index. Inserting an element at the start of an array shows every following element as changed.',
    },
    {
      q: 'Is there a size limit?',
      a: 'Only your browser memory. Documents of several megabytes compare in well under a second.',
    },
  ],
};
