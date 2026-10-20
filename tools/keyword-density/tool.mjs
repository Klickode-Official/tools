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
<p>No, and chasing one tends to make writing worse. Search engines understand synonyms and topics now, and stuffing in the same phrase can count against you. Use this the other way round: check that your main topic actually comes through, and that nothing is repeated so often it gets awkward. If a phrase is more than 3 or 4 percent of the text, read that part out loud.</p>
<h2>How to check keyword density</h2>
<ol><li>Paste your article, product description or page text.</li><li>Read the three tables: single words, two-word phrases and three-word phrases, each with a count and its share of all words.</li><li>Leave “Ignore stop words” on to hide filler words like “the” and “and”.</li></ol>
<p>It works for Thai too. Words are split with your browser’s Thai dictionary, and common words like ที่, และ and ของ are skipped when stop words are ignored.</p>`,
  faq: [
    { q: 'How is keyword density calculated?', a: 'The number of times a word or phrase appears, divided by the total number of words, times 100. A phrase used 6 times in a 600-word article has a density of 1%.' },
    { q: 'What’s a good keyword density?', a: 'There isn’t a magic number. If your main topic shows up naturally, you’re fine. If one phrase is more than 3 or 4 percent of the text, read that part out loud and swap some of them for other words.' },
    { q: 'Is my text sent anywhere?', a: 'No. The tool runs entirely in your browser, so your text never leaves your device. It works offline too once the page has loaded.' },
  ],
};
