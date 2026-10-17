// Meta Tag Analyzer: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'meta-tag-analyzer',
  category: 'seo',
  order: 1, // position within its category (lower first; unset tools sort by name after)
  name: 'Meta Tag Analyzer',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Meta Tag Checker: Free On-Page SEO Audit',
  description: 'Paste a page’s HTML and get a list of SEO problems: a missing description, skipped headings, images without alt text, broken structured data and more.',
  // One line for the tool cards on the home and category pages.
  short: 'Check a page’s title, description and tags.',
  body: `<div class="panel"><div class="panel-head"><label for="input">Page HTML</label><span><button class="btn small" id="sample">Sample</button> <button class="btn small" id="clear">Clear</button></span></div>
<textarea id="input" spellcheck="false" placeholder="Paste the page source here. In most browsers: right-click → View Page Source (Ctrl+U / ⌘⌥U), select all, copy."></textarea></div>
<div class="status" id="status" aria-live="polite"></div>
<div class="grid-2">
  <div class="panel"><h2>Checks</h2><ul class="check-list" id="checks"></ul></div>
  <div class="panel"><h2>Summary</h2><div id="summary"></div><h2>Heading outline</h2><ul class="list-plain" id="headings"></ul></div>
</div>`,
  content: `<h2>Why paste the HTML instead of a link?</h2>
<p>Browsers don’t let one website read another, so checkers that take a URL have to fetch the page through their own servers. Pasting the source keeps everything on your machine. It also means you can check pages that aren’t live yet, like a staging site or something on localhost.</p>
<h2>What it looks at</h2>
<ul><li>Whether the title and meta description exist, and whether they’re long enough without getting cut off</li><li>One clear <code>&lt;h1&gt;</code>, and headings that don’t skip levels</li><li>Canonical link, <code>noindex</code>, the mobile viewport tag, language and character set</li><li>Images without <code>alt</code> text</li><li>Open Graph and Twitter tags for link previews</li><li>Structured data (JSON-LD) that won’t parse</li></ul>
<p>If your site is built with React, Vue or similar, View Source may be nearly empty. Open DevTools instead, right-click the <code>&lt;html&gt;</code> element, choose Copy outerHTML, and paste that.</p>`,
  faq: [],
};
