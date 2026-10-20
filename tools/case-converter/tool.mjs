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
<p>Acronyms are handled the way you’d expect: <code>parseHTTPResponse</code> turns into <code>parse_http_response</code>, not <code>parse_h_t_t_p_response</code>.</p>
<h2>How to convert text case</h2>
<ol><li>Paste or type a name, a phrase or a whole paragraph.</li><li>Every style shows up in the table at once, from camelCase to Sentence case.</li><li>Click Copy next to the one you need.</li></ol>
<h2>Word and character counter</h2>
<p>The line above the table counts words, characters with and without spaces, sentences, lines and reading time as you type. That’s handy for limits on product titles, bios, tweets and meta descriptions. Thai is counted properly too: words are split the way a Thai reader would split them, not by spaces.</p>`,
  faq: [
    { q: 'What is camelCase?', a: 'Words joined with no spaces, where every word after the first starts with a capital letter: <code>userName</code>, <code>totalPrice</code>. It’s the usual style for variables in JavaScript, Java and Swift.' },
    { q: 'What’s the difference between snake_case and kebab-case?', a: 'Both are all lowercase. snake_case joins words with underscores (<code>user_name</code>) and kebab-case with hyphens (<code>user-name</code>). Use underscores in Python and databases, hyphens in URLs, file names and CSS classes.' },
    { q: 'Does the word counter work for Thai?', a: 'Yes. Thai has no spaces between words, so it uses your browser’s Thai dictionary to find where each word ends. A few loanwords may be counted as two words.' },
    { q: 'Is my text sent anywhere?', a: 'No. The tool runs entirely in your browser, so your text never leaves your device. It works offline too once the page has loaded.' },
  ],
};
