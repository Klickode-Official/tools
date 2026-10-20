// HEIC to JPG: a page of its own for one of the most searched conversions. It runs the same
// converter as image-converter (assets/js/shared/image-tools.js), with JPG picked by default.
export default {
  slug: 'heic-to-jpg',
  category: 'images',
  order: 1.5,
  name: 'HEIC to JPG Converter',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'HEIC to JPG Converter: Free, No Upload, Batch',
  description: 'Turn iPhone HEIC photos into JPG in your browser. Convert a whole batch at once and download them as a ZIP. Your photos are never uploaded.',
  // One line for the tool cards on the home and category pages.
  short: 'Turn iPhone photos into JPGs that open anywhere.',
  keywords: ['heic', 'heif', 'iphone', 'jpg', 'jpeg', 'convert'],
  data: { mode: 'convert' },
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop your HEIC photos here, or click to choose</strong>
  <span>HEIC and HEIF from iPhone and iPad · as many as you like · photos stay on your device</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="toolbar">
  <label class="check">Format <select id="format"><option value="image/jpeg" selected>JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option><option value="image/avif">AVIF</option></select></label>
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
  content: `<h2>How to convert HEIC to JPG</h2>
<ol><li>Drop your HEIC photos on the box above, or click it to pick them. You can add a whole folder’s worth.</li><li>JPG is already selected. Leave the quality at 90 unless you need smaller files.</li><li>Download each photo, or all of them at once as a ZIP.</li></ol>
<h2>Why does my iPhone save HEIC?</h2>
<p>Since iOS 11, iPhones save photos as HEIC because the files are about half the size of a JPG at the same quality. The catch is that plenty of websites, Windows apps and older phones still can’t open them. Converting to JPG fixes that, at the cost of a bigger file.</p>
<p>If you’d rather your iPhone saved JPGs from now on, go to <strong>Settings → Camera → Formats</strong> and choose <strong>Most Compatible</strong>.</p>
<h2>Your photos stay on your phone or computer</h2>
<p>Most HEIC converters upload your photos to their server. This one doesn’t. The first time you add a HEIC file, your browser downloads a small decoder (about 1.5 MB), then does the whole conversion itself. That makes it fine for private photos, and it keeps working without a connection once it has loaded.</p>`,
  faq: [
    { q: 'Is this HEIC to JPG converter free?', a: 'Yes, with no sign-up, no watermark and no limit on the number of photos.' },
    { q: 'Does it work on Windows and Android?', a: 'Yes. It works in Chrome, Edge, Firefox and Safari on Windows, Mac, Android and iPhone.' },
    { q: 'Will I lose quality?', a: 'Barely, at the default quality of 90. JPG files are bigger than HEIC for the same quality, so expect the JPG to be roughly twice the size.' },
    { q: 'Is the photo rotated correctly?', a: 'Yes. The rotation saved by the camera is applied, so portraits stay upright.' },
    { q: 'What about the location and camera details?', a: 'They aren’t copied into the JPG, so the converted photo doesn’t carry your GPS location. Use the <a href="/tools/exif-remover/">EXIF remover</a> if you also want to clean other photos.' },
    { q: 'Can I convert HEIC to PNG instead?', a: 'Yes. Pick PNG in the Format menu. PNG files are much bigger, so JPG is usually the better choice for photos.' },
  ],
};
