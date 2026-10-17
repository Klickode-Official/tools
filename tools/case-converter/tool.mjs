// Case Converter & Word Counter: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'case-converter',
  category: 'text',
  name: 'Case Converter & Word Counter',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Case Converter: camelCase, snake_case, kebab-case',
  description: 'Paste a name or phrase and copy it as camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE or Title Case. Word and character counts included.',
  // One line for the tool cards on the home and category pages.
  short: 'camelCase, snake_case and friends, plus word count.',
  body: `<div class="panel"><div class="panel-head"><label for="input">Text</label><button class="btn small" id="clear">Clear</button></div><textarea id="input" class="short" spellcheck="false" placeholder="Type or paste text…"></textarea></div>
<div class="status ok" id="stats" aria-live="polite"></div>
<table class="kv" id="cases"></table>`,
  content: `<h2>Which one goes where</h2>
<ul><li><strong>camelCase</strong> for variables in JavaScript and Java</li><li><strong>PascalCase</strong> for class names and React components</li><li><strong>snake_case</strong> for Python, Ruby and database columns</li><li><strong>CONSTANT_CASE</strong> for constants and environment variables</li><li><strong>kebab-case</strong> for URLs, CSS classes and command-line flags</li></ul>
<p>Acronyms are handled the way you’d expect: <code>parseHTTPResponse</code> turns into <code>parse_http_response</code>, not <code>parse_h_t_t_p_response</code>.</p>`,
  faq: [],
};
