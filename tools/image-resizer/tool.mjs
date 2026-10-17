// Image Resizer: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'image-resizer',
  category: 'images',
  order: 3, // position within its category (lower first; unset tools sort by name after)
  name: 'Image Resizer',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Resize Images Online by Pixels or Percent, Free',
  description: 'Make images smaller by width, height or percentage, or fit them inside a box like 1920×1080. Resize a whole batch at once and download them as a ZIP.',
  // One line for the tool cards on the home and category pages.
  short: 'Make images smaller by pixels or percent.',
  data: { mode: 'resize' },
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop images here, paste, or click to choose</strong>
  <span>JPG, PNG, WebP, AVIF, GIF, BMP, SVG (and HEIC in Safari) · batch supported · files stay on your device</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="toolbar">
  <label class="check">Format <select id="format"><option value="keep">Same as original</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option><option value="image/avif">AVIF</option></select></label>
  <label class="check">Quality <input type="range" id="quality" min="1" max="100" value="90"> <output id="quality-val">90</output></label>
  
  <label class="check">Resize <select id="resize-mode">
      <option value="none">Original size</option><option value="fit" selected>Fit within</option><option value="width">Width</option><option value="height">Height</option><option value="percent">Percentage</option>
    </select></label>
    <label class="check">W <input type="number" id="width" min="1" value="1920" style="width:6em"> px</label>
    <label class="check">H <input type="number" id="height" min="1" value="1080" style="width:6em"> px</label>
    <label class="check"><input type="number" id="percent" min="1" max="100" value="50" style="width:5em"> %</label>
  <label class="check">JPG background <input type="color" id="bg" value="#ffffff"></label>
</div>
<div class="toolbar"><button class="btn primary" id="download-all" disabled>Download all (ZIP)</button><button class="btn" id="clear" disabled>Clear</button></div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="results"></ul>`,
  content: `<h2>Ways to resize</h2>
<p><strong>Fit within</strong> shrinks the image until it fits inside the width and height you set, without stretching it. This is what you want for “no bigger than 1920×1080”.</p>
<p><strong>Width</strong> or <strong>Height</strong> sets one side and works out the other for you.</p>
<p><strong>Percentage</strong> scales the whole thing down, so 50% gives you half the width and half the height.</p>
<p>Images are never made bigger than they already are. Blowing up a small image just makes it blurry, and that’s rarely what anyone wants. Big reductions are done in steps, which keeps fine detail like text and hair from going jagged.</p>`,
  faq: [
    {
      q: 'Are my images uploaded?',
      a: 'No. They’re resized in your browser and stay on your device.',
    },
    {
      q: 'Will resizing change the format?',
      a: 'Not unless you ask it to. Leave the format on “Same as original”, or pick a different one if you want to convert at the same time.',
    },
  ],
};
