// JSON Diff: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'json-diff',
  category: 'json',
  name: 'JSON Diff',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'JSON Diff: Compare Two JSON Files and See What Changed',
  description: 'Paste two JSON documents and see every value that was added, removed or changed, with the path to find it. Key order and spacing are ignored.',
  // One line for the tool cards on the home and category pages.
  short: 'See what changed between two JSON files.',
  body: `<div class="toolbar"><button class="btn primary" id="compare">Compare</button><button class="btn" id="sample">Sample</button><button class="btn" id="clear">Clear</button></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="left">Original</label></div><textarea id="left" spellcheck="false" placeholder="Original JSON…"></textarea></div>
  <div class="panel"><div class="panel-head"><label for="right">Changed</label></div><textarea id="right" spellcheck="false" placeholder="Changed JSON…"></textarea></div>
</div>
<h2>Differences</h2>
<ul class="list-plain" id="result"></ul>`,
  content: `<h2>How it works</h2>
<p>This compares the data, not the text. Spacing, line breaks and the order of keys don’t count as changes. Each difference comes with a path like <code>$.users[2].email</code>, so you can find it even in a huge API response.</p>`,
  faq: [
    {
      q: 'How are lists compared?',
      a: 'If every item in a list has a unique id field (id, _id, uuid, key, sku, slug or code), items are matched by that id, so adding or reordering items only reports what really changed. Otherwise items are compared in order.',
    },
    {
      q: 'How big can the files be?',
      a: 'That depends on your computer’s memory rather than on us. Files of a few megabytes compare in under a second.',
    },
  ],
};
