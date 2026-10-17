// Tool categories, in display order. Each gets a hub page at /<slug>/ that links
// its tools together, which helps both visitors and search engines.
export const categories = [
  {
    id: 'images',
    slug: 'image-tools',
    name: 'Image tools',
    title: 'Free Online Image Tools — Convert, Compress, Resize, No Upload',
    description: 'Convert, compress and resize images, and strip EXIF location data, directly in your browser. No uploads, no watermarks, no limits.',
  },
  {
    id: 'json',
    slug: 'json-tools',
    name: 'JSON & data',
    title: 'Free JSON Tools — Format, Validate, Diff, Convert CSV',
    description: 'Format and validate JSON, compare documents, convert CSV to JSON and back, and generate JSON Schema. Private and browser-only.',
  },
  {
    id: 'seo',
    slug: 'seo-tools',
    name: 'SEO tools',
    title: 'Free SEO Tools — Meta Tags, SERP Preview, robots.txt, Keywords',
    description: 'Audit meta tags, preview Google snippets, test robots.txt rules and check keyword density. Free on-page SEO tools that run in your browser.',
  },
  {
    id: 'text',
    slug: 'text-tools',
    name: 'Regex & text',
    title: 'Free Regex & Text Tools — Regex Tester, Diff, Case Converter',
    description: 'Test regular expressions, compare texts line by line and convert between camelCase, snake_case and more. Free and private.',
  },
  {
    id: 'encoding',
    slug: 'encoding-tools',
    name: 'Encoding & IDs',
    title: 'Free Encoding Tools — Base64, URL, JWT, UUID, Timestamps',
    description: 'Encode and decode Base64 and URLs, inspect JWTs, generate UUIDs and convert Unix timestamps, all in your browser.',
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
