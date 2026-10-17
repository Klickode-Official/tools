// robots.txt Tester — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'robots-txt-tester',
  category: 'seo',
  name: 'robots.txt Tester',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'robots.txt Tester — Check Which URLs Are Blocked',
  description: 'Test robots.txt rules against URLs for Googlebot, Bingbot, GPTBot or any user agent. Follows RFC 9309: longest match wins, wildcards and $ anchors supported.',
  // One line for tool cards on the home and category pages.
  short: 'Test URLs against robots.txt rules for any crawler.',
  body: `<div class="toolbar"><label class="check">User agent <input type="text" id="ua" value="Googlebot" list="agents" style="width:12em"></label>
<datalist id="agents"><option value="Googlebot"><option value="Bingbot"><option value="GPTBot"><option value="ClaudeBot"><option value="CCBot"><option value="Applebot"><option value="*"></datalist>
<button class="btn" id="sample">Sample</button><button class="btn" id="clear">Clear</button></div>
<div class="grid-2">
  <div class="panel"><div class="panel-head"><label for="input">robots.txt</label></div><textarea id="input" spellcheck="false" placeholder="User-agent: *&#10;Disallow: /admin/"></textarea></div>
  <div class="panel"><div class="panel-head"><label for="urls">URLs or paths to test (one per line)</label></div><textarea id="urls" spellcheck="false" placeholder="/&#10;/admin/login&#10;https://example.com/blog/post"></textarea></div>
</div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="list-plain" id="results"></ul>
<h2>Parsed file</h2><div id="summary"></div>`,
  content: `<h2>How crawlers read robots.txt</h2>
<ul><li>A crawler uses only the <strong>most specific</strong> <code>User-agent</code> group that names it, and falls back to <code>*</code> only if none does. A Googlebot group therefore replaces, rather than adds to, the <code>*</code> rules.</li><li>Within a group, the <strong>longest matching path</strong> wins; on a tie, <code>Allow</code> beats <code>Disallow</code>.</li><li><code>*</code> matches any characters and <code>$</code> anchors the end of the URL.</li><li>An empty <code>Disallow:</code> allows everything.</li></ul>
<p>robots.txt controls crawling, not indexing. To keep a page out of search results, use a <code>noindex</code> meta tag and leave it crawlable.</p>`,
  faq: [
  ],
};
