// Image Converter — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'image-converter',
  category: 'images',
  order: 1, // position within its category (lower first; unset tools sort by name after)
  name: 'Image Converter',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'Image Converter — JPG, PNG, WebP & AVIF, No Upload',
  description: 'Convert images between JPG, PNG, WebP and AVIF in your browser. Batch convert, resize and download as ZIP. No upload, no watermark, no limits.',
  // One line for tool cards on the home and category pages.
  short: 'Batch convert JPG, PNG, WebP and AVIF without uploading.',
  data: {mode: 'convert'},
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop images here, paste, or click to choose</strong>
  <span>JPG, PNG, WebP, AVIF, GIF, BMP, SVG (and HEIC in Safari) · batch supported · files stay on your device</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="toolbar">
  <label class="check">Format <select id="format"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp" selected>WebP</option><option value="image/avif">AVIF</option></select></label>
  <label class="check">Quality <input type="range" id="quality" min="1" max="100" value="90"> <output id="quality-val">90</output></label>
  
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
  content: `<h2>How to convert images</h2>
<ol><li>Drop one or more images on the box above, paste from the clipboard, or click to choose files.</li><li>Pick the output format and quality. Every file converts immediately; changing an option re-converts them all.</li><li>Download files one by one, or all at once as a ZIP.</li></ol>
<h2>Which format should I use?</h2>
<ul><li><strong>WebP</strong>: typically 25–35% smaller than JPG at the same quality, supports transparency, works in every modern browser. The best default for the web.</li><li><strong>AVIF</strong>: smaller still, but slower to encode, and not every browser can create it (the option is disabled if yours can't).</li><li><strong>JPG</strong>: universal compatibility for photos. No transparency; transparent areas are filled with the background colour you choose.</li><li><strong>PNG</strong>: lossless. Best for screenshots, logos and images with sharp edges or transparency; large for photos.</li></ul>`,
  faq: [
    {
      q: 'Are my images uploaded?',
      a: 'No. Images are decoded and re-encoded on a canvas in this browser tab. Nothing is sent to a server, which is why there are no file-count limits, queues or watermarks. You can even disconnect from the internet after the page loads.',
    },
    {
      q: 'Can I convert HEIC photos from my iPhone?',
      a: 'Safari can decode HEIC, so the converter works there. Chrome and Firefox can’t read HEIC yet; on those browsers, export the photo as JPG from the Photos app first.',
    },
    {
      q: 'Is metadata kept?',
      a: 'No. Re-encoding through a canvas drops EXIF data, including GPS location. Use the <a href="/tools/exif-remover/">EXIF remover</a> to check what a photo contains.',
    },
  ],
};
