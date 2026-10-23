# pdf.js (PDF reader and renderer)

Unmodified files from the [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) package,
version 6.3.289, by Mozilla: the legacy build (`legacy/build/pdf.min.mjs` and
`legacy/build/pdf.worker.min.mjs`, which work in browsers from the last few years, not only the
newest; renamed to `.js` so every host serves them as JavaScript) and the `cmaps/`,
`standard_fonts/`, `wasm/` and `iccs/` folders. `wasm/quickjs-eval.*` (runs JavaScript inside
PDFs) is left out on purpose; the tools never run a PDF's scripts.

pdf.js is licensed under the Apache License 2.0 (`LICENSE.txt`). The WebAssembly decoders keep
their own permissive licences, next to them in `wasm/`: PDFium's JBIG2 (BSD-style), OpenJPEG
(BSD 2-clause) and qcms (MIT). They are loaded by `assets/js/shared/pdf.js` only when someone
uses a PDF tool. The build copies these files as they are.
