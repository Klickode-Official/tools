// Tool categories, in display order. Each gets a hub page at /<slug>/ that links
// its tools together, which helps both visitors and search engines.
export const categories = [
  {
    id: 'images',
    icon: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="m21 15-5-5L5 21"/>',
    slug: 'image-tools',
    name: 'Image tools',
    title: 'Free Online Image Tools — Convert, Compress, Resize, No Upload',
    description: 'Convert, compress and resize images, and strip EXIF location data, directly in your browser. No uploads, no watermarks, no limits.',
  },
  {
    id: 'json',
    icon: '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/>',
    slug: 'json-tools',
    name: 'JSON & data',
    title: 'Free JSON Tools — Format, Validate, Diff, Convert CSV',
    description: 'Format and validate JSON, compare documents, convert CSV to JSON and back, and generate JSON Schema. Private and browser-only.',
  },
  {
    id: 'seo',
    icon: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/>',
    slug: 'seo-tools',
    name: 'SEO tools',
    title: 'Free SEO Tools — Meta Tags, SERP Preview, robots.txt, Keywords',
    description: 'Audit meta tags, preview Google snippets, test robots.txt rules and check keyword density. Free on-page SEO tools that run in your browser.',
  },
  {
    id: 'text',
    icon: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    slug: 'text-tools',
    name: 'Regex & text',
    title: 'Free Regex & Text Tools — Regex Tester, Diff, Case Converter',
    description: 'Test regular expressions, compare texts line by line and convert between camelCase, snake_case and more. Free and private.',
  },
  {
    id: 'encoding',
    icon: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    slug: 'encoding-tools',
    name: 'Encoding & IDs',
    title: 'Free Encoding Tools — Base64, URL, JWT, UUID, Timestamps',
    description: 'Encode and decode Base64 and URLs, inspect JWTs, generate UUIDs and convert Unix timestamps, all in your browser.',
  },
];

// Wrap a category's icon paths in an <svg> (24×24, stroked with currentColor).
export const categoryIcon = (c, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c.icon}</svg>`;

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
