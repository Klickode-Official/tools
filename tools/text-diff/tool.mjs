// Text Diff — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'text-diff',
  category: 'text',
  name: 'Text Diff',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'Text Diff Checker — Compare Two Texts Line by Line',
  description: 'Compare two blocks of text or code and highlight added and removed lines. Free, private, no upload.',
  // One line for tool cards on the home and category pages.
  short: 'Line-by-line comparison of two texts or code files.',
  body: `<div class="toolbar"><button class="btn primary" id="compare">Compare</button><label class="check"><input type="checkbox" id="trim"> Ignore leading/trailing whitespace</label><button class="btn" id="sample">Sample</button><button class="btn" id="clear">Clear</button></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="left">Original</label></div><textarea id="left" spellcheck="false"></textarea></div>
  <div class="panel"><div class="panel-head"><label for="right">Changed</label></div><textarea id="right" spellcheck="false"></textarea></div>
</div>
<h2>Result</h2>
<pre class="output" id="result" style="white-space:normal" tabindex="0"></pre>`,
  content: `<h2>How it works</h2><p>The checker finds the longest common subsequence of lines, then marks lines only in the original as removed (−) and lines only in the changed text as added (+). For JSON, use the <a href="/tools/json-diff/">JSON Diff</a> tool, which ignores formatting.</p>`,
  faq: [
  ],
};
