// Merge PDF: page copy and SEO details. What the page does lives in assets/js/shared/pdf-tools.js.
export default {
  slug: 'merge-pdf',
  category: 'pdf',
  order: 1,
  name: 'Merge PDF',
  title: 'Merge PDF Files Online, Free and Without Uploading',
  description: 'Combine several PDFs into one in your browser. Put them in the order you want and download a single file. No upload, no sign-up and no limit on files.',
  short: 'Join several PDFs into one file.',
  keywords: ['combine pdf', 'join pdf', 'รวม pdf'],
  data: { mode: 'merge' },
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop PDF files here, or click to choose</strong>
  <span>Add as many as you like · files stay on your device</span>
  <input type="file" id="files" multiple accept="application/pdf,.pdf">
</label>
<div class="toolbar"><button class="btn primary" id="run" disabled>Merge PDF</button><button class="btn" id="clear" disabled>Clear</button></div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="list" aria-label="Files to merge, in order"></ul>`,
  content: `<h2>How to merge PDF files</h2>
<ol><li>Drop in the PDFs you want to combine, or click the box to pick them.</li><li>Put them in order with the ↑ and ↓ buttons. The first file’s pages come first.</li><li>Click <strong>Merge PDF</strong> and the combined file downloads straight away.</li></ol>
<h2>Why merge here instead of an online PDF site?</h2>
<p>Contracts, payslips and ID scans are exactly the files you shouldn’t upload to a stranger’s server. This tool joins them inside your browser, so they never leave your computer or phone. There’s also no daily cap: merge as many files as you like, as often as you like.</p>`,
  faq: [
    { q: 'Does merging lower the quality?', a: 'No. Pages are copied as they are, so text stays sharp and selectable and images aren’t recompressed.' },
    { q: 'Can I merge a password-protected PDF?', a: 'Not directly. Open it with the password, save or print a copy without one, then add that copy.' },
    { q: 'Is there a limit on files or size?', a: 'No set limit. Very large files depend on your device’s memory; a phone handles a few hundred pages comfortably.' },
    { q: 'Are my files uploaded?', a: 'No. Everything happens in this browser tab, and the PDFs never leave your device.' },
  ],
};
