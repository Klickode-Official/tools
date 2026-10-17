// Keyword Density Checker: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'keyword-density',
  category: 'seo',
  name: 'Keyword Density Checker',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Keyword Density Checker and Phrase Counter',
  description: 'Paste an article to see which words and phrases you use most and how often. Useful for spotting the phrase you’ve accidentally used ten times.',
  // One line for the tool cards on the home and category pages.
  short: 'Count your most repeated words and phrases.',
  body: `<div class="panel"><div class="panel-head"><label for="input">Text</label><span><label class="check"><input type="checkbox" id="stopwords" checked> Ignore stop words</label> <button class="btn small" id="clear">Clear</button></span></div>
<textarea id="input" class="short" placeholder="Paste an article or page copy…"></textarea></div>
<div class="status ok" id="stats" aria-live="polite"></div>
<div id="result"></div>`,
  content: `<h2>Is there a perfect keyword density?</h2>
<p>No, and chasing one tends to make writing worse. Search engines understand synonyms and topics now, and stuffing in the same phrase can count against you. Use this the other way round: check that your main topic actually comes through, and that nothing is repeated so often it gets awkward. If a phrase is more than 3 or 4 percent of the text, read that part out loud.</p>`,
  faq: [],
};
