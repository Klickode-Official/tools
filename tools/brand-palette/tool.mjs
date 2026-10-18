// Brand Colour Palette from an image: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'brand-palette',
  category: 'images',
  order: 6, // position within its category (lower first; unset tools sort by name after)
  name: 'Brand Colour Palette from Logo',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Get a Colour Palette from Your Logo or Any Image',
  description: 'Drop in your logo or a photo and get its main colours as HEX, RGB and HSL, with contrast checks and ready-to-paste CSS, Tailwind and JSON. Nothing is uploaded.',
  // One line for the tool cards on the home and category pages.
  short: 'Pull the main colours out of a logo or photo.',
  body: `<label class="dropzone" id="dropzone" for="file">
  <strong>Drop your logo or an image here, paste, or click to choose</strong>
  <span>PNG, JPG, WebP, SVG, GIF · transparent backgrounds are fine · stays on your device</span>
  <input type="file" id="file" accept="image/*">
</label>
<div class="toolbar">
  <label class="check">Colours <select id="count"><option>4</option><option>5</option><option selected>6</option><option>7</option><option>8</option></select></label>
  <label class="check"><input type="checkbox" id="skip-bg" checked> Skip the background</label>
  <button class="btn primary" id="png" disabled>Download palette PNG</button>
  <button class="btn" id="sample">Try a sample</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
<div class="bp-layout" id="result" hidden>
  <div class="panel bp-image">
    <div class="panel-head"><span class="label">Image</span><span class="bp-dim" id="dims"></span></div>
    <div class="bp-image-box"><img id="preview" alt="The image you added"></div>
    <div class="bp-bar" id="bar" aria-hidden="true"></div>
  </div>
  <div class="panel bp-swatches">
    <div class="panel-head"><span class="label">Palette</span><span class="bp-dim">Click a value to copy it</span></div>
    <ul class="bp-list" id="swatches"></ul>
  </div>
</div>
<div class="panel bp-export" id="export-panel" hidden>
  <div class="panel-head"><span class="bp-tabs" role="tablist" aria-label="Export format"><button class="bp-tab" role="tab" aria-selected="true" data-fmt="css">CSS variables</button><button class="bp-tab" role="tab" aria-selected="false" data-fmt="tailwind">Tailwind</button><button class="bp-tab" role="tab" aria-selected="false" data-fmt="json">JSON</button></span><span><button class="btn small" id="dl-code" data-dl>Download</button> <button class="btn small" data-copy="#code">Copy</button></span></div>
  <textarea id="code" spellcheck="false" readonly aria-label="Palette code"></textarea>
</div>`,
  content: `<h2>How to use it</h2>
<ol><li>Drop in your logo. A PNG or SVG works best, but a screenshot is fine too.</li><li>The main colours appear on the right, biggest first, with a job each: primary, secondary, accent, background and text.</li><li>Click any HEX, RGB or HSL value to copy it, or grab the whole set as CSS, Tailwind or JSON.</li></ol>
<h2>What “skip the background” does</h2>
<p>Most logos sit on a white or coloured square. Left in, that square would be the “main” colour, which isn’t much help. With this on, the colour around the edge of the image is left out. Turn it off if the edge is actually part of your brand, like a solid badge.</p>
<h2>Reading the contrast numbers</h2>
<p>Each colour shows how readable white text and black text would be on top of it. Normal-size text needs at least <strong>4.5:1</strong> to pass WCAG AA, the accessibility level most sites aim for. Large headings can get away with 3:1. The <strong>Aa</strong> on each swatch is drawn in whichever of the two reads better.</p>
<h2>Why the colours are slightly different from my brand guide</h2>
<p>Images are compressed and edges are smoothed, so pixels drift a little from the original colour. The palette averages each group of similar pixels, which gets very close. If you have an official HEX code, that one wins.</p>`,
  faq: [
    {
      q: 'Is my logo uploaded?',
      a: 'No. The colours are worked out in your browser and the image never leaves your device.',
    },
    {
      q: 'Will I get the same colours every time?',
      a: 'Yes. The same image always gives the same palette, so you can come back to it later.',
    },
    {
      q: 'How are primary, secondary and accent chosen?',
      a: 'Primary is the colourful one that covers the most area. Secondary comes next. Accent is the most vivid of the smaller ones. Whites, blacks and greys become background, text and neutrals.',
    },
    {
      q: 'Can I use it on a photo?',
      a: 'Sure. It works on any image, which is handy for building a colour scheme around a product shot or a mood board.',
    },
  ],
};
