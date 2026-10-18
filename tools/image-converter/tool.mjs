// Image Converter: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'image-converter',
  category: 'images',
  order: 1, // position within its category (lower first; unset tools sort by name after)
  name: 'Image Converter',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Image Converter: JPG, PNG, WebP and AVIF in Your Browser',
  description: 'Convert JPG, PNG, WebP and AVIF images right in your browser. Drop in as many as you like and download them all as a ZIP. Nothing gets uploaded.',
  // One line for the tool cards on the home and category pages.
  short: 'Switch between JPG, PNG, WebP and AVIF.',
  data: { mode: 'convert' },
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop images here, paste, or click to choose</strong>
  <span>JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, SVG · batch supported · files stay on your device</span>
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
<ol><li>Drop your images on the box above. You can also paste one or click to pick files.</li><li>Choose a format and quality. Each file converts straight away, and if you change a setting they all update.</li><li>Download them one at a time, or grab the lot as a ZIP.</li></ol>
<h2>Which format should I pick?</h2>
<p><strong>WebP</strong> is the one to use for websites. It's usually a quarter to a third smaller than JPG at the same quality, it supports transparency, and every current browser can show it.</p>
<p><strong>AVIF</strong> is smaller again but slower to make, and not every browser can create it yet. If yours can't, the option is greyed out.</p>
<p><strong>JPG</strong> works everywhere, which makes it the safe choice for sending photos to people. It has no transparency, so see-through areas get filled with the background colour you choose.</p>
<p><strong>PNG</strong> keeps every pixel exactly as it was. Use it for screenshots, logos and anything with sharp edges or transparency. For photos the files get big.</p>`,
  faq: [
    {
      q: 'Are my images uploaded?',
      a: 'No. Your images are converted inside this browser tab and never sent to a server. That’s also why there are no file limits, queues or watermarks. Once the page has loaded you can even switch off your Wi-Fi and it keeps working.',
    },
    {
      q: 'Can I convert HEIC photos from my iPhone?',
      a: 'Yes, in any browser. Safari opens them itself; in Chrome, Edge and Firefox the page loads a HEIC decoder the first time you add one (about 1.5 MB, and it stays in your browser). The photo is still never uploaded. There’s also a page just for <a href="/tools/heic-to-jpg/">HEIC to JPG</a>.',
    },
    {
      q: 'Does it keep the photo’s location and camera info?',
      a: 'No. Converting drops that data, GPS location included. If you want to see what a photo contains first, use the <a href="/tools/exif-remover/">EXIF remover</a>.',
    },
  ],
};
