// Tool categories, in display order. Each gets a hub page at /<slug>/ that links
// its tools together, which helps both visitors and search engines.
export const categories = [
  {
    id: 'business',
    icon: '<path d="M3 10.5 4.6 4h14.8l1.6 6.5"/><path d="M3 10.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12.5V20h14v-7.5"/><path d="M10 20v-4.5h4V20"/>',
    slug: 'business-tools',
    name: 'Business & social',
    title: 'Free Tools for Small Businesses and Social Media',
    description: 'Make shop cards, buttons and social images that send people to your Etsy, TikTok, WhatsApp, Shopee or Instagram page. Free, no account needed.',
  },
  {
    id: 'images',
    icon: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="m21 15-5-5L5 21"/>',
    slug: 'image-tools',
    name: 'Image tools',
    title: 'Free Image Tools: Convert, Compress and Resize Online',
    description: 'Convert, shrink and resize images, or strip the location data out of your photos. It all happens in your browser, so nothing gets uploaded.',
  },
  {
    id: 'json',
    icon: '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/>',
    slug: 'json-tools',
    name: 'JSON & data',
    title: 'Free JSON Tools: Format, Compare and Convert',
    description: 'Tidy up and check JSON, compare two files, switch between CSV and JSON, and get a schema from a sample response.',
  },
  {
    id: 'seo',
    icon: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/>',
    slug: 'seo-tools',
    name: 'SEO tools',
    title: 'Free SEO Tools: Meta Tags, SERP Preview and robots.txt',
    description: 'Check your meta tags, see how a page looks in Google, test robots.txt rules and count your keywords. No account needed.',
  },
  {
    id: 'text',
    icon: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    slug: 'text-tools',
    name: 'Regex & text',
    title: 'Free Regex and Text Tools',
    description: 'Test regular expressions, compare two versions of a text, and switch between naming styles like camelCase and snake_case.',
  },
  {
    id: 'encoding',
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
