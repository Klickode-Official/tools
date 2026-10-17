// Regex Tester — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'regex-tester',
  category: 'text',
  order: 1, // position within its category (lower first; unset tools sort by name after)
  name: 'Regex Tester',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'Regex Tester — Test JavaScript Regular Expressions Online',
  description: 'Test regular expressions live with match highlighting, capture groups, named groups and replace preview. Uses your browser’s JavaScript regex engine.',
  // One line for tool cards on the home and category pages.
  short: 'Live regex matching with groups and replace preview.',
  body: `<div class="toolbar" style="flex-wrap:nowrap">
  <span class="mono" aria-hidden="true">/</span>
  <input type="text" id="pattern" class="mono" style="flex:1;min-width:0" spellcheck="false" placeholder="pattern" aria-label="Regular expression">
  <span class="mono" aria-hidden="true">/</span>
  <input type="text" id="flags" class="mono" style="width:5.5em" spellcheck="false" value="g" aria-label="Flags">
</div>
<p class="hint">Flags: <code>g</code> global · <code>i</code> ignore case · <code>m</code> multiline · <code>s</code> dotAll · <code>u</code> unicode · <code>y</code> sticky</p>
<div class="toolbar">
  <button class="btn" id="sample">Sample</button>
  <button class="btn" id="share">Share link</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="input">Test string</label><button class="btn small" id="clear">Clear</button></div><textarea id="input" spellcheck="false"></textarea></div>
  <div class="panel"><div class="panel-head"><span class="label">Matches highlighted</span></div><pre class="output" id="highlight" tabindex="0"></pre></div>
</div>
<h2>Match details</h2>
<div id="details"></div>
<h2>Replace</h2>
<div class="toolbar"><input type="text" id="replacement" class="mono" style="flex:1" spellcheck="false" placeholder="Replacement, e.g. $1 or $<name>" aria-label="Replacement"></div>
<div class="panel"><div class="panel-head"><span class="label">Result</span><button class="btn small" data-copy="#replaced">Copy</button></div><pre class="output" id="replaced" style="min-height:120px" tabindex="0"></pre></div>`,
  content: `<h2>Cheat sheet</h2>
<ul><li><code>\\d</code> digit, <code>\\w</code> word character, <code>\\s</code> whitespace, <code>.</code> any character except newline</li><li><code>*</code> 0 or more, <code>+</code> 1 or more, <code>?</code> optional, <code>{2,5}</code> between 2 and 5</li><li><code>^</code> / <code>$</code> start / end (of line with <code>m</code>)</li><li><code>(…)</code> capture group, <code>(?:…)</code> non-capturing, <code>(?&lt;name&gt;…)</code> named group</li><li><code>(?=…)</code> lookahead, <code>(?&lt;=…)</code> lookbehind</li></ul>`,
  faq: [
    {
      q: 'Which regex flavour is this?',
      a: "JavaScript (ECMAScript), using your browser's engine, so results match what <code>String.prototype.match</code> and <code>replace</code> do in your code. Most syntax carries over to PCRE, Python and Java, but some features (like possessive quantifiers) don't.",
    },
    {
      q: 'Why is only one match shown?',
      a: 'Add the <code>g</code> flag to find every match.',
    },
  ],
};
