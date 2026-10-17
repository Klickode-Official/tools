// Regex Tester: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'regex-tester',
  category: 'text',
  order: 1, // position within its category (lower first; unset tools sort by name after)
  name: 'Regex Tester',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Regex Tester for JavaScript with Live Highlighting',
  description: 'Type a regular expression and see what it matches as you go, with capture groups and a replace preview. Uses the same JavaScript engine as your code.',
  // One line for the tool cards on the home and category pages.
  short: 'Try a regex and see what it matches.',
  body: `<div class="regex-field">
  <span class="slash" aria-hidden="true">/</span>
  <input type="text" id="pattern" class="mono" spellcheck="false" placeholder="your pattern here" aria-label="Regular expression">
  <span class="slash" aria-hidden="true">/</span>
  <input type="text" id="flags" class="mono flags" spellcheck="false" value="g" aria-label="Flags">
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
  content: `<h2>Quick reference</h2>
<ul><li><code>\\d</code> a digit, <code>\\w</code> a letter, digit or underscore, <code>\\s</code> a space or tab, <code>.</code> any character except a new line</li><li><code>*</code> zero or more, <code>+</code> one or more, <code>?</code> optional, <code>{2,5}</code> between two and five</li><li><code>^</code> and <code>$</code> match the start and end (of each line, if you add the <code>m</code> flag)</li><li><code>(…)</code> captures a group, <code>(?:…)</code> groups without capturing, <code>(?&lt;name&gt;…)</code> gives the group a name</li><li><code>(?=…)</code> looks ahead, <code>(?&lt;=…)</code> looks behind</li></ul>`,
  faq: [
    {
      q: 'Which regex flavour does this use?',
      a: 'JavaScript’s, straight from your browser, so what you see here is what <code>match</code> and <code>replace</code> will do in your code. Most of it works the same in Python, PHP and Java, but a few features don’t carry over.',
    },
    {
      q: 'Why does it only show one match?',
      a: 'Add the <code>g</code> flag. Without it, a regex stops after the first match.',
    },
    {
      q: 'The page said it “gave up”. Why?',
      a: 'Some patterns, usually ones with nested repeats like <code>(a+)+</code>, can take practically forever on certain text. Rather than freezing your browser, the tester stops after a second and a half. Try making the repeated part more specific.',
    },
  ],
};
