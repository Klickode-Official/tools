// Keyword Density Checker — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'keyword-density',
  category: 'seo',
  name: 'Keyword Density Checker',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'Keyword Density Checker — Word & Phrase Frequency Counter',
  description: 'Count the most frequent words and two- and three-word phrases in your text, with density percentages and stop-word filtering. Free and private.',
  // One line for tool cards on the home and category pages.
  short: 'Top words and phrases with density percentages.',
  body: `<div class="panel"><div class="panel-head"><label for="input">Text</label><span><label class="check"><input type="checkbox" id="stopwords" checked> Ignore stop words</label> <button class="btn small" id="clear">Clear</button></span></div>
<textarea id="input" class="short" placeholder="Paste an article or page copy…"></textarea></div>
<div class="status ok" id="stats" aria-live="polite"></div>
<div id="result"></div>`,
  content: `<h2>Is there an ideal keyword density?</h2>
<p>No. Modern search engines understand topics and synonyms, and repeating a phrase unnaturally ("keyword stuffing") can hurt. Use this tool the other way round: to check that your main topic actually stands out, and that no phrase is repeated so often it reads awkwardly. If a phrase is above 3–4% of the text, read the passage aloud.</p>`,
  faq: [
  ],
};
