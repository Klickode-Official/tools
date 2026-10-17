// EXIF & GPS Remover: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: 'exif-remover',
  category: 'images',
  order: 4, // position within its category (lower first; unset tools sort by name after)
  name: 'EXIF & GPS Remover',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Remove EXIF and GPS Location from Photos, Free',
  description: 'Photos from your phone can carry the exact spot they were taken. See what’s hidden in yours and strip it out without touching the image quality.',
  // One line for the tool cards on the home and category pages.
  short: 'Strip GPS location and camera info from photos.',
  data: { mode: 'exif' },
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
  content: `<h2>What’s hiding in your photos</h2>
<p>Most phones save extra details inside every picture: often the GPS coordinates of where you were standing, the date and time, and the phone model. Send someone the original file and they get all of that too. Big social networks usually strip it, but email, WhatsApp documents, forums and marketplace listings often don’t.</p>
<h2>How this tool removes it</h2>
<p>For <strong>JPG, PNG and WebP</strong> files, the tool cuts the metadata out and copies the picture itself across byte for byte, so there’s <strong>no quality loss at all</strong>. The colour profile stays so your colours don’t shift.</p>
<p>Some photos rely on a “rotate this” tag to display the right way up. Those get re-saved instead, otherwise they’d come out sideways. Any other format is re-saved too, which drops the metadata along the way.</p>`,
  faq: [
    {
      q: 'Are my photos uploaded?',
      a: 'No, and for a tool like this that matters. The files are read and cleaned inside this tab. You can load the page, turn off your internet, and it still works.',
    },
    {
      q: 'How do I know it worked?',
      a: 'Drop the cleaned file back onto the page. It should say no metadata was found.',
    },
  ],
};
