// JPG to PDF: page copy and SEO details. What the page does lives in assets/js/shared/pdf-tools.js.
export default {
  slug: 'jpg-to-pdf',
  category: 'pdf',
  order: 2,
  name: 'JPG to PDF',
  title: 'JPG to PDF: Turn Photos into One PDF, Free, No Upload',
  description: 'Turn photos, scans and screenshots (JPG, PNG, HEIC) into one PDF on A4, Letter or the photo’s own size. Put them in order and download. Nothing is uploaded.',
  short: 'Turn photos into one PDF, in order.',
  keywords: ['image to pdf', 'png to pdf', 'heic to pdf', 'รูปเป็น pdf'],
  data: { mode: 'images' },
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop images here, paste, or click to choose</strong>
  <span>JPG, PNG, WebP, HEIC · as many as you like · files stay on your device</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif">
</label>
<div class="toolbar">
  <label class="check">Page size <select id="page-size"><option value="a4">A4</option><option value="letter">Letter</option><option value="fit">Same as the image</option></select></label>
  <label class="check">Margin <select id="margin"><option value="0">None</option><option value="10" selected>Small (10 mm)</option><option value="20">Large (20 mm)</option></select></label>
  <button class="btn primary" id="run" disabled>Make PDF</button><button class="btn" id="clear" disabled>Clear</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="list" aria-label="Images, in page order"></ul>`,
  content: `<h2>How to turn photos into a PDF</h2>
<ol><li>Drop in your photos, or paste a screenshot. iPhone HEIC photos work too.</li><li>Put them in page order with ↑ and ↓, and choose a page size.</li><li>Click <strong>Make PDF</strong> to download one PDF with a page per photo.</li></ol>
<h2>Good for</h2>
<ul><li>Photos of receipts, forms or ID cards that someone wants “as a PDF”</li><li>Turning a set of screenshots into one document</li><li>Sending several pages of handwritten notes as a single file</li></ul>
<p>Each photo is placed upright, as your phone showed it, and turned sideways onto a landscape page when it’s wider than it is tall.</p>`,
  faq: [
    { q: 'Will my photos lose quality?', a: 'Barely. Photos are kept at up to 3,600 pixels on their long side, which prints sharply on A4, and saved at high JPG quality. PNGs stay lossless.' },
    { q: 'Can I make the PDF smaller?', a: 'Yes. Make the PDF here, then run it through <a href="/tools/compress-pdf/">Compress PDF</a>, or shrink the photos first with the <a href="/tools/image-compressor/">Image Compressor</a>.' },
    { q: 'Are my photos uploaded?', a: 'No. The PDF is made in your browser and nothing leaves your device.' },
  ],
};
