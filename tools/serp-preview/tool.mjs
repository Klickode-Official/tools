// SERP Snippet Preview: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'serp-preview',
  category: 'seo',
  order: 2, // position within its category (lower first; unset tools sort by name after)
  name: 'SERP Snippet Preview',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Google SERP Preview: Check Title and Description Length',
  description: 'See how your page title and meta description will look in Google on desktop and mobile, and where they’ll get cut off.',
  // One line for the tool cards on the home and category pages.
  short: 'See your page the way Google shows it.',
  body: `<div class="grid-2">
  <div class="panel">
    <label for="title" class="label">Title</label>
    <input type="text" id="title" placeholder="Your page title" style="width:100%">
    <div class="meter" id="title-meter"></div><p class="hint"></p>
    <label for="desc" class="label" style="margin-top:12px">Meta description</label>
    <textarea id="desc" class="short" placeholder="Describe the page in a sentence or two"></textarea>
    <div class="meter" id="desc-meter"></div><p class="hint"></p>
    <label for="url" class="label" style="margin-top:12px">URL</label>
    <input type="text" id="url" placeholder="https://example.com/tools/image-converter/" style="width:100%">
    <div class="toolbar"><label class="check">Device <select id="device"><option value="desktop">Desktop</option><option value="mobile">Mobile</option></select></label></div>
  </div>
  <div class="panel"><span class="label">Preview</span><div id="preview" class="serp"></div></div>
</div>`,
  content: `<h2>It’s pixels, not characters</h2>
<p>Google doesn’t cut titles off at 60 characters. It cuts them at roughly 580 pixels wide on desktop, and “WWWW” takes up far more room than “iiii”. The bars measure your text in the font Google uses, so you can see whether it actually fits. Descriptions get about 920 pixels on desktop and less on a phone.</p>
<p>Google sometimes rewrites titles and descriptions when it thinks something else on the page fits a search better. A clear, honest snippet that fits makes that less likely.</p>
<h2>How to preview your Google result</h2>
<ol><li>Type your page title, meta description and URL.</li><li>Switch between Desktop and Mobile.</li><li>The bar under each box shows how much of the available width you’ve used. Past the end, Google cuts the text off with “…”.</li></ol>`,
  faq: [
    { q: 'How long should a title tag be?', a: 'Short enough to fit in about 580 pixels on desktop. In English that’s usually 50 to 60 characters, but wide letters fill it faster, so check it here rather than counting.' },
    { q: 'How long should a meta description be?', a: 'About 920 pixels on desktop, roughly 150 to 160 characters, and less on a phone. Put the important part first so it still makes sense if it gets cut.' },
    { q: 'Why does Google show a different title from mine?', a: 'Google rewrites titles and descriptions when it thinks other text on the page matches the search better, or when yours is too long, vague or stuffed with keywords. A clear title that fits and matches your <code>&lt;h1&gt;</code> is the best way to keep it.' },
    { q: 'Is my text sent anywhere?', a: 'No. The tool runs entirely in your browser, so your text never leaves your device. It works offline too once the page has loaded.' },
  ],
};
