// Image Resizer — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'image-resizer',
  category: 'images',
  order: 3, // position within its category (lower first; unset tools sort by name after)
  name: 'Image Resizer',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'Image Resizer — Resize Images by Pixels or Percent, in Bulk',
  description: 'Resize images to exact dimensions, a maximum width or height, or a percentage. High-quality downscaling, batch processing and ZIP download, entirely in your browser.',
  // One line for tool cards on the home and category pages.
  short: 'Resize by pixels or percent, in bulk, with high-quality scaling.',
  data: {mode: 'resize'},
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
  content: `<h2>Resize modes</h2>
<ul><li><strong>Fit within</strong>: scales the image down until it fits inside the width × height box, keeping the aspect ratio. Use it for "max 1920×1080".</li><li><strong>Width</strong> / <strong>Height</strong>: sets one side; the other follows the aspect ratio.</li><li><strong>Percentage</strong>: scales both sides equally.</li></ul>
<p>Images are never enlarged, because upscaling adds blur rather than detail. Downscaling uses stepwise halving, so large reductions stay sharp instead of aliased.</p>`,
  faq: [
    {
      q: 'Are my images uploaded?',
      a: 'No. Images are decoded and re-encoded on a canvas in this browser tab. Nothing is sent to a server, which is why there are no file-count limits, queues or watermarks. You can even disconnect from the internet after the page loads.',
    },
  ],
};
