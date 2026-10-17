// Text Diff: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'text-diff',
  category: 'text',
  name: 'Text Diff',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Text Diff Checker: Compare Two Texts Line by Line',
  description: 'Compare two versions of a text or code file and see which lines were added or removed. Handy for checking edits before you send them.',
  // One line for the tool cards on the home and category pages.
  short: 'Spot the changed lines between two texts.',
  body: `<div class="toolbar"><button class="btn primary" id="compare">Compare</button><label class="check"><input type="checkbox" id="trim"> Ignore leading/trailing whitespace</label><button class="btn" id="sample">Sample</button><button class="btn" id="clear">Clear</button></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="left">Original</label></div><textarea id="left" spellcheck="false"></textarea></div>
  <div class="panel"><div class="panel-head"><label for="right">Changed</label></div><textarea id="right" spellcheck="false"></textarea></div>
</div>
<h2>Result</h2>
<pre class="output" id="result" style="white-space:normal" tabindex="0"></pre>`,
  content: `<h2>How it works</h2>
<p>It lines the two versions up and marks lines that only exist in the original with a minus, and lines that only exist in the new version with a plus. Everything else stays plain so the changes stand out. For JSON, the <a href="/tools/json-diff/">JSON Diff</a> does a better job because it ignores formatting.</p>`,
  faq: [],
};
