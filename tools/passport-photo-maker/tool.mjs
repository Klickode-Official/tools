// Passport & ID Photo Maker: page copy and SEO details. What the page does lives in ./script.js.
import { PHOTO_SIZES } from '../../assets/js/lib/photo.js';

export const sizeOptions = (custom) =>
  Object.entries(PHOTO_SIZES)
    .map(([k, s]) => `<option value="${k}">${s.label}</option>`)
    .join('') + `<option value="custom">${custom}</option>`;

export default {
  slug: 'passport-photo-maker',
  category: 'images',
  order: 7,
  name: 'Passport & ID Photo Maker',
  title: 'Passport & ID Photo Maker: 35×45 mm, 2×2 inch, Free',
  description: 'Crop a photo to passport, visa or ID size (35×45 mm, 2×2 inch or your own), then download it or a 6×4 inch sheet to print. Your photo is never uploaded.',
  short: 'Crop to passport size and print a sheet.',
  keywords: ['passport photo', 'visa photo', 'id photo', 'รูปติดบัตร', '2x2', '35x45'],
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop a photo here, paste, or click to choose</strong>
  <span>JPG, PNG, HEIC from iPhone · your photo stays on your device</span>
  <input type="file" id="files" accept="image/*,.heic,.heif">
</label>
<div class="toolbar">
  <label class="check">Size <select id="size">${sizeOptions('Custom size')}</select></label>
  <label class="check" id="custom" hidden>W <input type="number" id="w-mm" value="35" min="10" max="150" step="0.5" style="width:5em"> × H <input type="number" id="h-mm" value="45" min="10" max="150" step="0.5" style="width:5em"> mm</label>
</div>
<div class="status" id="status" aria-live="polite"></div>
<div class="photo-editor" id="editor" hidden>
  <div class="photo-frame"><canvas id="frame" tabindex="0" aria-label="Photo crop. Drag, or use the arrow keys, to move the photo."></canvas></div>
  <div class="photo-side">
    <label class="check photo-zoom">Zoom <input type="range" id="zoom" min="100" max="400" value="100"></label>
    <p class="hint">Drag the photo, or use the arrow keys, to move it. For a passport photo, put the chin on the bottom of the oval and the top of the head near the top, looking straight at the camera.</p>
    <div class="toolbar"><button class="btn primary" id="dl-photo">Download photo</button><button class="btn" id="dl-sheet">Download 6×4″ print sheet</button></div>
    <p class="hint" id="out-info"></p>
  </div>
</div>`,
  content: `<h2>How to make a passport or ID photo</h2>
<ol><li>Take a photo against a plain, light wall, facing the camera, with even light and no shadows. Have someone else take it from about a metre away.</li><li>Drop it in and pick the size your form or embassy asks for.</li><li>Drag and zoom until the face sits in the oval, then download the photo for an online form, or the print sheet to print at a photo shop.</li></ol>
<h2>Which size do I need?</h2>
<ul><li><strong>35 × 45 mm</strong>: passports and visas for the UK, the Schengen area and the rest of the EU, Australia, India and many other countries.</li><li><strong>2 × 2 inch (51 × 51 mm)</strong>: US passports and visas. Online forms usually want it as a 600 × 600 pixel JPG, which is exactly what you get here.</li><li><strong>Thai ID-style photos</strong> are often asked for as “1 inch” or “2 inch”, but shops and offices use slightly different measurements. Check the exact centimetres on the form and pick that size, or type it in as a custom size.</li></ul>
<h2>Printing the sheet</h2>
<p>The sheet is a 6 × 4 inch (10 × 15 cm) photo at 300 DPI, with as many copies as fit and thin lines to cut along. Print it at a photo kiosk or shop as a normal 4R photo, at 100% size, not “fit to page”.</p>`,
  faq: [
    { q: 'Can it make the background white?', a: 'Not yet. Stand in front of a plain white or light grey wall when you take the photo; that’s what most passport offices want anyway.' },
    { q: 'Will my photo be accepted?', a: 'The size and resolution will be right. Acceptance also depends on things only the photo itself can get right: a neutral expression, eyes open, no glasses glare, even lighting and the right background. Check the rules of the office you’re applying to.' },
    { q: 'What resolution is the download?', a: '300 DPI, the standard for printed photos. A 35 × 45 mm photo comes out at 413 × 531 pixels.' },
    { q: 'Is my photo uploaded?', a: 'No. The cropping happens in your browser and nothing leaves your device.' },
  ],
};
