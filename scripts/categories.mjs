// Tool categories, in display order. Each gets a hub page at /<slug>/ that links
// its tools together, which helps both visitors and search engines.
export const categories = [
  {
    id: 'business',
    intro: `<p>If you sell on Etsy, Shopee, TikTok Shop or through WhatsApp, your website and your social posts should point people to the place they can actually buy. These tools make the cards, QR codes, pay signs and link pages that do that, in your colours, without a designer.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["I want a “shop us on Etsy” box for my website", 'shop-card-maker'],
      ["I need an image for an Instagram or Facebook post that links to my shop", 'shop-card-maker'],
      ["I want WhatsApp or LINE buttons on my contact page", 'shop-card-maker'],
      ["I need a QR code for my menu, Wi-Fi or LINE account", 'qr-code-generator'],
      ["Customers should be able to pay me by PromptPay", 'promptpay-qr'],
      ["I want one page with all my links for my Instagram or TikTok bio", 'link-in-bio'],
    ],
    icon: '<path d="M3 10.5 4.6 4h14.8l1.6 6.5"/><path d="M3 10.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12.5V20h14v-7.5"/><path d="M10 20v-4.5h4V20"/>',
    slug: 'business-tools',
    name: 'Business & social',
    title: 'Free Tools for Small Businesses and Social Media',
    description: 'Shop cards, QR codes, PromptPay pay signs and link-in-bio pages for small businesses on Etsy, TikTok, Shopee, LINE and Instagram. Free, no account needed.',
  },
  {
    id: 'images',
    intro: `<p>Most image problems come down to three things: the wrong format, a file that’s too big, or dimensions that don’t fit. A fourth one people forget about is the hidden data in photos, like where they were taken. Every tool here works on your device, so you can use them on private photos too.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["A form won’t take my file because it’s HEIC, AVIF or WebP", 'image-converter'],
      ["My photo is over the upload limit (say 200 KB or 2 MB)", 'image-compressor'],
      ["I need exact pixel sizes, like 1080 × 1080", 'image-resizer'],
      ["I want to post a photo without giving away where I live", 'exif-remover'],
      ["My website is slow because the images are huge", 'image-compressor'],
      ["One photo needs to fit Instagram, Facebook and a story", 'social-image-resizer'],
      ["What are the exact colours in my logo?", 'brand-palette'],
    ],
    icon: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="m21 15-5-5L5 21"/>',
    slug: 'image-tools',
    name: 'Image tools',
    title: 'Free Image Tools: Convert, Compress and Resize Online',
    description: 'Convert, shrink and resize images, or strip the location data out of your photos. It all happens in your browser, so nothing gets uploaded.',
  },
  {
    id: 'json',
    intro: `<p>JSON is how most apps and APIs pass data around, and it’s strict: one stray comma and nothing works. These tools help you read it, fix it, compare versions and move it in and out of spreadsheets. Long ID numbers are kept exactly as written, which many online formatters get wrong.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["An API sent back one long unreadable line", 'json-formatter'],
      ["Something says “Unexpected token” and I can’t find it", 'json-formatter'],
      ["What changed between yesterday’s response and today’s?", 'json-diff'],
      ["I have a spreadsheet and need JSON", 'csv-to-json'],
      ["I have JSON and need to open it in Excel or Google Sheets", 'json-to-csv'],
      ["I need a schema to validate responses or document an API", 'json-schema-generator'],
    ],
    icon: '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/>',
    slug: 'json-tools',
    name: 'JSON & data',
    title: 'Free JSON Tools: Format, Compare and Convert',
    description: 'Tidy up and check JSON, compare two files, switch between CSV and JSON, and get a schema from a sample response.',
  },
  {
    id: 'seo',
    intro: `<p>A lot of SEO is getting the basics right on every page: a title that fits, a description worth clicking, nothing blocked by mistake, and text that’s about what people search for. These tools check those basics from the HTML or text you paste in. Nothing is fetched or sent anywhere.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["Is my title or description too long for Google?", 'serp-preview'],
      ["Does this page have the tags it needs (canonical, Open Graph, alt text)?", 'meta-tag-analyzer'],
      ["Did I block Google from part of my site?", 'robots-txt-tester'],
      ["Am I repeating one word too often?", 'keyword-density'],
    ],
    icon: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/>',
    slug: 'seo-tools',
    name: 'SEO tools',
    title: 'Free SEO Tools: Meta Tags, SERP Preview and robots.txt',
    description: 'Check your meta tags, see how a page looks in Google, test robots.txt rules and count your keywords. No account needed.',
  },
  {
    id: 'text',
    intro: `<p>Small text jobs that come up every day: checking a pattern before it goes into code, spotting what someone changed in a document, or renaming a list of fields from one style to another. Thai text is counted properly, word by word.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["Does my regex match what I think it matches?", 'regex-tester'],
      ["What changed between two versions of this text?", 'text-diff'],
      ["I need these names in camelCase or snake_case", 'case-converter'],
      ["How many words and characters is this?", 'case-converter'],
    ],
    icon: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    slug: 'text-tools',
    name: 'Regex & text',
    title: 'Free Regex and Text Tools',
    description: 'Test regular expressions, compare two versions of a text, and switch between naming styles like camelCase and snake_case.',
  },
  {
    id: 'encoding',
    intro: `<p>The small conversions developers look up constantly: decoding a Base64 string, fixing a URL full of %20s, reading what’s inside a login token, making test IDs or turning an epoch number into a date you can read. Tokens and keys stay in your browser.</p>`,
    // “Which tool do I need?”: a question people actually have, and the tool that answers it.
    guide: [
      ["What does this Base64 string say?", 'base64'],
      ["My link has %20 and %26 all over it", 'url-encoder'],
      ["What’s inside this JWT, and has it expired?", 'jwt-decoder'],
      ["I need a batch of UUIDs for test data", 'uuid-generator'],
      ["What date is 1700000000?", 'timestamp-converter'],
    ],
    icon: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    slug: 'encoding-tools',
    name: 'Encoding & IDs',
    title: 'Free Encoding Tools: Base64, URL, JWT and UUID',
    description: 'Encode and decode Base64 and URLs, read what’s inside a JWT, make UUIDs and turn Unix timestamps into dates.',
  },
];

// Wrap a category's icon paths in an <svg> (24×24, stroked with currentColor).
export const categoryIcon = (c, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c.icon}</svg>`;

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
