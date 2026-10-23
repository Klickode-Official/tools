// Compress PDF: page copy and SEO details. What the page does lives in assets/js/shared/pdf-tools.js.
export default {
  slug: 'compress-pdf',
  category: 'pdf',
  order: 4,
  name: 'Compress PDF',
  title: 'Compress PDF: Make a PDF Smaller, Free, No Upload',
  description: 'Shrink a PDF so it fits an email or an upload limit. Scans and photo-heavy PDFs often get 70–90% smaller. Runs in your browser, so the file is never uploaded.',
  short: 'Shrink a PDF to fit an email or form.',
  keywords: ['reduce pdf size', 'shrink pdf', 'ย่อ pdf', 'ลดขนาด pdf'],
  data: { mode: 'compress' },
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop PDF files here, or click to choose</strong>
  <span>Several at once is fine · files stay on your device</span>
  <input type="file" id="files" multiple accept="application/pdf,.pdf">
</label>
<div class="toolbar">
  <label class="check">Compression <select id="level"><option value="light">Light (keeps text selectable)</option><option value="medium" selected>Medium (150 DPI)</option><option value="strong">Strong (smallest)</option></select></label>
  <button class="btn primary" id="download-all" disabled>Download all (ZIP)</button><button class="btn" id="clear" disabled>Clear</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="list" aria-label="PDFs and their compressed size"></ul>`,
  content: `<h2>How to compress a PDF</h2>
<ol><li>Drop in your PDF. It’s compressed straight away and you’ll see the new size.</li><li>Not small enough? Switch to <strong>Strong</strong>. Need the text to stay selectable? Use <strong>Light</strong>.</li><li>Click Download. If the result wouldn’t be smaller, you get your original back.</li></ol>
<h2>Which level should I use?</h2>
<ul><li><strong>Light</strong> rewrites the file more compactly and keeps everything as it is: text, links and vector drawings. Savings are modest, usually 5–30%.</li><li><strong>Medium</strong> redraws each page as a 150 DPI image. Great for scans and photos, and text still reads clearly on screen and in print. You can’t select or search the text afterwards.</li><li><strong>Strong</strong> goes to 110 DPI with more compression. Use it when the file just has to get under a limit.</li></ul>`,
  faq: [
    { q: 'Why did my PDF only get a little smaller?', a: 'PDFs made from text documents are usually small already, and Light can only tidy them up. Medium and Strong make a big difference for scans, photos and PDFs exported from phone apps.' },
    { q: 'Can I still select and search the text after compressing?', a: 'With Light, yes. Medium and Strong turn pages into pictures, so the text can be read but not selected. Keep your original if you’ll need to copy from it.' },
    { q: 'Does it work on password-protected PDFs?', a: 'Medium and Strong ask for the password and give you an unlocked, smaller copy. Light can’t open locked files.' },
    { q: 'Is my PDF uploaded?', a: 'No. It’s compressed in your browser, so the file never leaves your device.' },
  ],
};
