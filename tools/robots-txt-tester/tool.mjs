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
<p>One more thing: robots.txt stops crawling, not indexing. To keep a page out of Google, add a <code>noindex</code> tag and let it be crawled so Google can see it.</p>
<h2>How to test a robots.txt file</h2>
<ol><li>Open <code>yoursite.com/robots.txt</code>, copy it and paste it in.</li><li>Add the URLs or paths you want to check, one per line.</li><li>Pick a crawler such as Googlebot, Bingbot or GPTBot. Each URL shows as allowed or blocked, along with the rule and line that decided it.</li></ol>`,
  faq: [
    { q: 'How do I block AI bots like GPTBot?', a: 'Add a group for each one, for example <code>User-agent: GPTBot</code> followed by <code>Disallow: /</code>, then test it here with GPTBot selected. GPTBot and ClaudeBot collect pages for AI training. AI search crawlers like OAI-SearchBot and Claude-SearchBot are separate, so you can block training and still show up in AI answers.' },
    { q: 'Does robots.txt remove a page from Google?', a: 'No. It stops crawling, not indexing, so a blocked page can still show up if other sites link to it. To keep a page out, let it be crawled and add a <code>noindex</code> meta tag.' },
    { q: 'Where does robots.txt go?', a: 'At the root of the domain, like <code>https://example.com/robots.txt</code>. Every subdomain needs its own: <code>shop.example.com</code> doesn’t follow the one on <code>example.com</code>.' },
    { q: 'Does it match the way Google reads the file?', a: 'Yes. It follows RFC 9309, the robots.txt standard Google and Bing use: the most specific group, the longest matching rule, and <code>*</code> and <code>$</code> wildcards.' },
  ],
};
