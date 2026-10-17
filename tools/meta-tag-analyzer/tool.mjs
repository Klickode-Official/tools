// Meta Tag Analyzer — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'meta-tag-analyzer',
  category: 'seo',
  order: 1, // position within its category (lower first; unset tools sort by name after)
  name: 'Meta Tag Analyzer',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'Meta Tag Analyzer — Free On-Page SEO Checker',
  description: 'Paste a page’s HTML to audit its title, meta description, headings, canonical, Open Graph tags, image alt text and JSON-LD. Free and private.',
  // One line for tool cards on the home and category pages.
  short: 'Audit title, description, headings, OG tags and structured data.',
  body: `<div class="panel"><div class="panel-head"><label for="input">Page HTML</label><span><button class="btn small" id="sample">Sample</button> <button class="btn small" id="clear">Clear</button></span></div>
<textarea id="input" spellcheck="false" placeholder="Paste the page source here. In most browsers: right-click → View Page Source (Ctrl+U / ⌘⌥U), select all, copy."></textarea></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><h2>Checks</h2><ul class="check-list" id="checks"></ul></div>
  <div class="panel"><h2>Summary</h2><div id="summary"></div><h2>Heading outline</h2><ul class="list-plain" id="headings"></ul></div>
</div>`,
  content: `<h2>Why paste HTML instead of a URL?</h2>
<p>Fetching another site from a web page is blocked by browsers unless that site opts in, so URL-based checkers route your request through their own servers. Pasting the source keeps this tool fully private, and it also lets you check pages that aren't public yet: staging sites, drafts and localhost.</p>
<h2>What's checked</h2>
<ul><li>Title and meta description presence, length and estimated pixel width</li><li>A single <code>&lt;h1&gt;</code> and no skipped heading levels</li><li>Canonical URL, <code>noindex</code>, viewport, <code>lang</code> and charset</li><li>Image <code>alt</code> attributes</li><li>Open Graph and Twitter card tags</li><li>JSON-LD structured data that fails to parse</li></ul>
<p>For JavaScript-rendered pages (React, Vue), copy the rendered DOM from DevTools (Elements panel → right-click <code>&lt;html&gt;</code> → Copy outerHTML) instead of View Source.</p>`,
  faq: [
  ],
};
