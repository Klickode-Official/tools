// SERP Snippet Preview — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'serp-preview',
  category: 'seo',
  order: 2, // position within its category (lower first; unset tools sort by name after)
  name: 'SERP Snippet Preview',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'SERP Preview Tool — See Your Title & Meta Description in Google',
  description: 'Preview your title and meta description in Google results on desktop and mobile, with pixel-width meters that show where text gets cut off.',
  // One line for tool cards on the home and category pages.
  short: 'Preview titles and descriptions with pixel-accurate truncation.',
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
  content: `<h2>Pixels, not characters</h2>
<p>Google truncates titles at roughly <strong>580 pixels</strong> on desktop, not at a fixed number of characters: "WWWW" is far wider than "iiii". The meters measure your text in the same font Google uses, so you can see whether it fits. Descriptions are cut at about 920px on desktop and less on mobile.</p>
<p>Google may also rewrite your title or description when it thinks another part of the page answers the query better; a well-sized, accurate snippet makes that less likely.</p>`,
  faq: [
  ],
};
