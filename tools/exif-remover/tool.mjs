// EXIF & GPS Remover — page content and SEO metadata. Logic lives in ./script.js.
export default {
  slug: 'exif-remover',
  category: 'images',
  order: 4, // position within its category (lower first; unset tools sort by name after)
  name: 'EXIF & GPS Remover',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: 'Remove EXIF Data & GPS Location from Photos — Lossless, Private',
  description: 'See what metadata your photos contain (GPS location, camera, date) and remove it without re-compressing. Works offline in your browser; photos are never uploaded.',
  // One line for tool cards on the home and category pages.
  short: 'See and strip GPS location and camera data, losslessly.',
  data: {mode: 'exif'},
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop images here, paste, or click to choose</strong>
  <span>JPG, PNG, WebP, AVIF, GIF, BMP, SVG (and HEIC in Safari) · batch supported · files stay on your device</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="toolbar">
  
  
  
  
  
</div>
<div class="toolbar"><button class="btn primary" id="download-all" disabled>Download all (ZIP)</button><button class="btn" id="clear" disabled>Clear</button></div>
<div class="status" id="status" aria-live="polite"></div>
<ul class="file-list" id="results"></ul>`,
  content: `<h2>Why remove EXIF data?</h2>
<p>Phones embed metadata in every photo: often the <strong>exact GPS coordinates</strong> where it was taken, the date and time, and the device model. Sharing the original file shares all of that. Many social networks strip it, but email, messaging apps, forums and marketplaces often don't.</p>
<h2>How this tool removes it</h2>
<ul><li><strong>JPG, PNG and WebP</strong>: metadata segments (EXIF, XMP, IPTC, comments, text chunks) are cut out of the file directly. The image data itself is copied byte for byte, so there is <strong>zero quality loss</strong>. The colour profile is kept so colours don't shift.</li><li>Photos whose EXIF says "rotate me" are re-encoded instead, so they don't end up sideways once the orientation tag is gone.</li><li>Other formats are re-encoded, which also drops all metadata.</li></ul>`,
  faq: [
    {
      q: 'Are my photos uploaded?',
      a: 'No. Files are read and rewritten inside this browser tab, which is the whole point of a metadata remover. You can load the page, go offline, and it still works.',
    },
  ],
};
