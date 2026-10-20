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
<p>It lines the two versions up and marks lines that only exist in the original with a minus, and lines that only exist in the new version with a plus. When a line was edited rather than replaced, the exact words that changed are highlighted inside it. Everything else stays plain so the changes stand out. For JSON, the <a href="/tools/json-diff/">JSON Diff</a> does a better job because it ignores formatting.</p>
<h2>How to compare two texts</h2>
<ol><li>Paste the original on the left and the changed version on the right.</li><li>Click Compare.</li><li>Removed lines get a minus, added lines get a plus, and the words that changed inside an edited line are highlighted.</li></ol>
<h2>When it comes in handy</h2>
<ul><li>Checking what a client or colleague changed in a contract, a brief or a translation</li><li>Comparing two versions of a config file or a piece of code</li><li>Seeing what changed between two drafts of a product description or a blog post</li></ul>`,
  faq: [
    { q: 'Can it ignore spaces at the start and end of lines?', a: 'Yes. Tick “Ignore leading/trailing whitespace” and lines that only differ in indentation or trailing spaces count as the same.' },
    { q: 'Does it work with Thai and other languages?', a: 'Yes. It compares line by line, so it works the same for Thai, English, any other language or code.' },
    { q: 'Is my text sent anywhere?', a: 'No. The tool runs entirely in your browser, so your text never leaves your device. It works offline too once the page has loaded.' },
  ],
};
