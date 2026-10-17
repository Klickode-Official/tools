// robots.txt Tester: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'robots-txt-tester',
  category: 'seo',
  name: 'robots.txt Tester',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'robots.txt Tester: Check if a URL Is Blocked',
  description: 'Paste your robots.txt and a list of URLs to see which ones Googlebot, Bingbot, GPTBot or any other crawler is allowed to visit.',
  // One line for the tool cards on the home and category pages.
  short: 'Find out if a crawler can reach a URL.',
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
  content: `<h2>How crawlers read the file</h2>
<p>A crawler looks for the group that names it most specifically and follows only that one. It falls back to the <code>*</code> group only if nothing names it. That catches people out: once you add a Googlebot section, Google ignores your <code>*</code> rules completely.</p>
<p>Inside a group, the longest matching rule wins. If an Allow and a Disallow are the same length, Allow wins. <code>*</code> matches anything and <code>$</code> means “ends here”. An empty <code>Disallow:</code> line allows everything.</p>
<p>One more thing: robots.txt stops crawling, not indexing. To keep a page out of Google, add a <code>noindex</code> tag and let it be crawled so Google can see it.</p>`,
  faq: [],
};
