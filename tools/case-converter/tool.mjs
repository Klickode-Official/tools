// Case Converter & Word Counter — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'case-converter',
  category: 'text',
  name: 'Case Converter & Word Counter',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'Case Converter — camelCase, snake_case, kebab-case & Word Count',
  description: 'Convert text between camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case, Title Case and more, with live word and character counts.',
  // One line for tool cards on the home and category pages.
  short: 'camelCase, snake_case, kebab-case and word counts.',
  body: `<div class="panel"><div class="panel-head"><label for="input">Text</label><button class="btn small" id="clear">Clear</button></div><textarea id="input" class="short" spellcheck="false" placeholder="Type or paste text…"></textarea></div>
<div class="status ok" id="stats" aria-live="polite"></div>
<table class="kv" id="cases"></table>`,
  content: `<h2>Naming conventions</h2><ul><li><strong>camelCase</strong> — JavaScript and Java variables</li><li><strong>PascalCase</strong> — classes and React components</li><li><strong>snake_case</strong> — Python, Ruby and SQL columns</li><li><strong>CONSTANT_CASE</strong> — constants and environment variables</li><li><strong>kebab-case</strong> — URLs, CSS classes and CLI flags</li></ul><p>Acronyms are split sensibly: <code>parseHTTPResponse</code> becomes <code>parse_http_response</code>.</p>`,
  faq: [
  ],
};
