// PDF to JPG: page copy and SEO details. What the page does lives in assets/js/shared/pdf-tools.js.
export default {
  slug: 'pdf-to-jpg',
  category: 'pdf',
  order: 3,
  name: 'PDF to JPG',
  title: 'PDF to JPG: Save PDF Pages as Images, Free, No Upload',
  description: 'Turn every page of a PDF into a JPG or PNG image at the resolution you need, then download one page or all of them as a ZIP. Your PDF is never uploaded.',
  short: 'Save each PDF page as a JPG or PNG.',
  keywords: ['pdf to image', 'pdf to png', 'pdf เป็นรูป'],
  data: { mode: 'to-images' },
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop a PDF here, or click to choose</strong>
  <span>One PDF at a time · it stays on your device</span>
  <input type="file" id="files" accept="application/pdf,.pdf">
</label>
<div class="toolbar">
  <label class="check">Format <select id="format"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></label>
  <label class="check">Quality <select id="dpi"><option value="72">Screen (72 DPI)</option><option value="150" selected>Standard (150 DPI)</option><option value="300">Print (300 DPI)</option></select></label>
  <button class="btn primary" id="download-all" disabled>Download all (ZIP)</button><button class="btn" id="clear" disabled>Clear</button>
</div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="list" aria-label="PDF and its pages"></ul>`,
  content: `<h2>How to convert a PDF to JPG</h2>
<ol><li>Drop in your PDF. Each page turns into an image straight away.</li><li>Pick JPG or PNG and the quality you need. Changing them redoes the pages.</li><li>Download the pages you want, or all of them in one ZIP.</li></ol>
<h2>Which quality should I pick?</h2>
<ul><li><strong>Screen (72 DPI)</strong> for a quick look or a chat message. Small files.</li><li><strong>Standard (150 DPI)</strong> for posting online or inserting into slides. Text stays readable.</li><li><strong>Print (300 DPI)</strong> when the picture will be printed or zoomed into. Large files.</li></ul>
<p>Choose PNG for pages that are mostly text or diagrams: the edges stay perfectly crisp. JPG is smaller for pages full of photos.</p>`,
  faq: [
    { q: 'Can I open a password-protected PDF?', a: 'Yes. You’ll be asked for the password, and it’s only used in your browser to open the file.' },
    { q: 'Why do some fonts look slightly different?', a: 'If a PDF doesn’t include its fonts, a close standard font is used instead, the same way most PDF viewers do it.' },
    { q: 'Is my PDF uploaded?', a: 'No. The pages are drawn in your browser, so the file never leaves your device.' },
  ],
};
