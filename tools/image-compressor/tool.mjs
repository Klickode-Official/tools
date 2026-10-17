// Image Compressor: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'image-compressor',
  category: 'images',
  order: 2, // position within its category (lower first; unset tools sort by name after)
  name: 'Image Compressor',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Compress Images to a Target Size in KB, Free',
  description: 'Got a form that says “max 200 KB”? Type the size you need and we’ll find the best quality that fits. Works with JPG, PNG and WebP, all on your device.',
  // One line for the tool cards on the home and category pages.
  short: 'Shrink photos to fit an upload limit.',
  data: { mode: 'compress' },
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
  content: `<h2>Getting under a size limit</h2>
<p>Job portals, visa forms and some email clients reject images over a certain size. Put that number in <strong>Target size</strong> and the compressor tries a few quality levels until it finds the highest one that still fits. If even the lowest quality is too big, shrink the dimensions too with the resize option.</p>
<h2>A few tips</h2>
<ul><li>Switching a photo to WebP usually saves more than turning JPG quality down.</li><li>PNG doesn’t have a quality setting, because it never throws detail away. For photos saved as PNG, pick JPG or WebP instead.</li><li>If the compressed file would come out bigger than your original, you get the original back. It was already as small as it was going to get.</li></ul>`,
  faq: [
    {
      q: 'Are my images uploaded?',
      a: 'No. Everything happens in this browser tab, so your photos never leave your device. There’s no limit on how many you do at once either.',
    },
    {
      q: 'What quality should I use without a target size?',
      a: 'Around 75 is a good starting point for photos. Most people can’t tell it apart from the original, and the file is usually a fraction of the size.',
    },
  ],
};
