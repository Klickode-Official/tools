// Image Compressor — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'image-compressor',
  category: 'images',
  order: 2, // position within its category (lower first; unset tools sort by name after)
  name: 'Image Compressor',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'Image Compressor — Shrink JPG, PNG & WebP to a Target Size',
  description: 'Compress images in your browser. Set a quality or a target file size in KB, batch process, and download as ZIP. Private: images are never uploaded.',
  // One line for tool cards on the home and category pages.
  short: 'Shrink images, optionally to an exact target size in KB.',
  data: {mode: 'compress'},
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop images here, paste, or click to choose</strong>
  <span>JPG, PNG, WebP, AVIF, GIF, BMP, SVG (and HEIC in Safari) · batch supported · files stay on your device</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="toolbar">
  <label class="check">Format <select id="format"><option value="keep">Same as original</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option><option value="image/avif">AVIF</option></select></label>
  <label class="check">Quality <input type="range" id="quality" min="1" max="100" value="75"> <output id="quality-val">75</output></label>
  <label class="check">Target size <input type="number" id="target-kb" min="0" step="10" placeholder="optional" style="width:7em"> KB</label>
  <label class="check">Resize <select id="resize-mode">
      <option value="none" selected>Original size</option><option value="fit">Fit within</option><option value="width">Width</option><option value="height">Height</option><option value="percent">Percentage</option>
    </select></label>
    <label class="check">W <input type="number" id="width" min="1" value="1920" style="width:6em"> px</label>
    <label class="check">H <input type="number" id="height" min="1" value="1080" style="width:6em"> px</label>
    <label class="check"><input type="number" id="percent" min="1" max="100" value="50" style="width:5em"> %</label>
  <label class="check">JPG background <input type="color" id="bg" value="#ffffff"></label>
</div>
<div class="toolbar"><button class="btn primary" id="download-all" disabled>Download all (ZIP)</button><button class="btn" id="clear" disabled>Clear</button></div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="results"></ul>`,
  content: `<h2>Hitting a target file size</h2>
<p>Many upload forms cap images at a size like 200 KB. Enter a <strong>target size</strong> and the compressor binary-searches the highest JPG or WebP quality that fits, so you lose as little detail as possible. If even the lowest quality is too big, reduce the dimensions with the resize option as well.</p>
<h2>Tips</h2>
<ul><li>Converting a photo to <strong>WebP</strong> usually saves more than lowering JPG quality.</li><li>PNG is lossless, so "quality" doesn't apply. For PNG photos, switch to WebP or JPG.</li><li>If a file comes out larger than the original, the original is kept, since it's already well optimised.</li></ul>`,
  faq: [
    {
      q: 'Are my images uploaded?',
      a: 'No. Images are decoded and re-encoded on a canvas in this browser tab. Nothing is sent to a server, which is why there are no file-count limits, queues or watermarks. You can even disconnect from the internet after the page loads.',
    },
  ],
};
