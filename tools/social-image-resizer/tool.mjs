// Social Media Image Resizer: page copy and SEO details. What the page does lives in ./script.js.
import { PRESETS } from '../../assets/js/lib/social.js';

const DEFAULT_ON = ['ig-post', 'ig-portrait', 'story', 'fb-post'];
const ratio = (w, h) => `aspect-ratio:${w}/${h};${w >= h ? 'width:22px' : 'height:22px'}`;

export default {
  slug: 'social-image-resizer',
  category: 'images',
  order: 5, // position within its category (lower first; unset tools sort by name after)
  name: 'Social Media Image Resizer',
  // <title> and meta description, as shown in Google. Keep the title under ~60 characters, the description under ~160.
  title: 'Social Media Image Resizer for Instagram, TikTok and More',
  description: 'Turn one photo into the right sizes for Instagram, TikTok, Facebook, X, YouTube, Shopee and Etsy. Pick what to keep in frame and download them all at once.',
  // One line for the tool cards on the home and category pages.
  short: 'One photo, every social size, cropped where you want.',
  body: `<label class="dropzone" id="dropzone" for="files">
  <strong>Drop images here, paste, or click to choose</strong>
  <span>JPG, PNG, WebP, AVIF, GIF (and HEIC in Safari) · several at once · files stay on your device</span>
  <input type="file" id="files" multiple accept="image/*,.heic,.heif,.avif">
</label>
<div class="sr-presets" role="group" aria-labelledby="sr-presets-label">
  <div class="sr-presets-head"><span class="label" id="sr-presets-label">Sizes</span><span><button class="btn small" type="button" id="all">All</button> <button class="btn small" type="button" id="none">None</button></span></div>
  <div class="sr-grid">
${PRESETS.map((p) => `    <label class="sr-chip"><input type="checkbox" id="p-${p.id}" value="${p.id}"${DEFAULT_ON.includes(p.id) ? ' checked' : ''}><i style="${ratio(p.w, p.h)}"></i><span><b>${p.name}</b><small>${p.w} × ${p.h}</small></span></label>`).join('\n')}
  </div>
</div>
<div class="toolbar">
  <label class="check">Mode <select id="mode"><option value="crop">Crop to fill</option><option value="fit">Fit inside</option></select></label>
  <label class="check" id="fill-wrap">Background <select id="fill"><option value="blur">Blurred photo</option><option value="colour">Colour</option><option value="transparent">Transparent</option></select> <input type="color" id="colour" value="#ffffff" aria-label="Background colour"></label>
  <label class="check">Format <select id="format"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
  <label class="check" id="quality-wrap">Quality <input type="range" id="quality" min="40" max="100" value="88"> <output id="quality-val">88</output></label>
</div>
<div class="toolbar"><button class="btn primary" id="download-all" disabled>Download all (ZIP)</button><button class="btn" id="clear" disabled>Clear</button></div>
<div class="status" id="status" aria-live="polite"></div>
<div id="sources"></div>`,
  content: `<h2>How to use it</h2>
<ol><li>Drop in a photo, or a few.</li><li>Tick the sizes you need. Instagram post, portrait and story are a good start.</li><li>In <strong>Crop to fill</strong>, click or drag on your photo to mark what matters, like a face or your product. Every size keeps that spot in frame.</li><li>Download each one, or grab them all as a ZIP.</li></ol>
<h2>Crop or fit?</h2>
<p><strong>Crop to fill</strong> fills the whole frame and trims the edges. It looks best, but a tall story cut from a wide photo loses a lot from the sides, so set the focus point.</p>
<p><strong>Fit inside</strong> keeps the whole photo and fills the gaps around it. A blurred copy of the photo behind it looks much nicer than plain bars, and it’s what most apps do themselves. Pick a colour instead if you want it to match your brand.</p>
<h2>The sizes</h2>
<p>These are the sizes each platform recommends right now. They all accept other sizes too, but uploading the exact size means nothing gets cropped or squashed by the app.</p>
<ul>${PRESETS.map((p) => `<li><strong>${p.name}</strong>: ${p.w} × ${p.h} px</li>`).join('')}</ul>`,
  faq: [
    {
      q: 'Are my photos uploaded?',
      a: 'No. The resizing happens in your browser and nothing leaves your device.',
    },
    {
      q: 'Why does it say a size will be enlarged?',
      a: 'Your photo is smaller than that size, so it has to be blown up a little, which can look soft. Use a bigger original if you have one.',
    },
    {
      q: 'Which format should I pick?',
      a: 'JPG for photos, it’s small and every app takes it. PNG for graphics with text or sharp edges. WebP is smaller still, but not every app accepts it yet.',
    },
    {
      q: 'Can I do several photos at once?',
      a: 'Yes. Each photo gets its own focus point, and “Download all” puts every size of every photo in one ZIP.',
    },
  ],
};
