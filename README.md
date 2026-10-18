# Klickode Tools

Free online tools that run entirely in the browser: images, JSON, regex, SEO and encoding.
No sign-up, no uploads, no trackers. Each tool has its own search-optimised page at
`/tools/<slug>/` and lives in its own folder, so it can be edited, marketed and reviewed on its own.

## Tools (27)

| Category | Tools |
| --- | --- |
| **Business & social** `/business-tools/` | Shop Card Maker (“find us on Etsy / TikTok / WhatsApp / Shopee…” banners, cards and buttons for 14 platforms, with looks, seasonal themes and an optional QR), QR Code Generator (links, Wi-Fi, WhatsApp, LINE, contact cards; logo, styles, PNG/SVG), PromptPay QR Generator (printable pay card), Link in Bio Page Builder (one self-contained HTML file) |
| **Image tools** `/image-tools/` | Image Converter (JPG/PNG/WebP/AVIF), Image Compressor (with target KB), Image Resizer, EXIF & GPS Remover (lossless), Social Media Image Resizer (every platform size, focus-point crop, ZIP), Brand Colour Palette from Logo |
| **JSON & data** `/json-tools/` | JSON Formatter & Validator, JSON Diff, CSV → JSON, JSON → CSV, JSON Schema Generator |
| **SEO tools** `/seo-tools/` | Meta Tag Analyzer, SERP Snippet Preview, robots.txt Tester, Keyword Density Checker |
| **Regex & text** `/text-tools/` | Regex Tester, Text Diff, Case Converter & Word Counter |
| **Encoding & IDs** `/encoding-tools/` | Base64, URL Encoder, JWT Decoder, UUID Generator, Unix Timestamp Converter |

## Project layout

```
tools/
  image-converter/
    tool.mjs        ← page copy + SEO: title, description, how-to, FAQ, category, order
    script.js       ← what the page does
    icon.svg        ← the tool's own 24×24 line icon (falls back to the category icon)
    preview.html    ← the little illustration on the tool's card (uses the .pv-* styles)
    style.css       ← optional styles for this tool's page only
    *.js            ← any other modules or workers the tool needs, copied alongside
    og.png          ← social preview card (generated)
  json-formatter/
    …               ← one folder per tool, same shape
assets/
  js/lib/           ← pure logic shared by tools, unit-tested in Node
  js/shared/        ← page code shared by several tools (image tools, CSV↔JSON, SERP width)
  js/ui.js          ← copy/download/persist/share helpers, theme toggle
  css/style.css     ← Klickode design system (colour tokens, light + dark)
  fonts/            ← Inter + JetBrains Mono, self-hosted (OFL)
  brand/            ← logo mark, default social card, touch icon
scripts/
  build.mjs         ← finds every tools/*/tool.mjs and renders the site to dist/
  layout.mjs        ← shared <head>, header, footer
  categories.mjs    ← category names, URLs and SEO copy
  new-tool.mjs      ← scaffolds a new tool folder
  og-images.mjs     ← renders the social cards
tests/              ← node:test suites for assets/js/lib
```

The build discovers tools automatically: there's no central list to edit. A tool's folder name is its URL.

## Writing copy

Write tool text the way you'd explain it to a friend: short sentences, contractions, real examples ("Got a form that says max 200 KB?"). Skip em dashes, stacked adjectives and three-item slogans. The FAQ is a good place for the questions people actually ask.

## What every tool page gets for SEO

- Its own URL (`/tools/<slug>/`), `<title>`, meta description and canonical link
- Breadcrumbs (`Tools / Image tools / Image Converter`) plus `BreadcrumbList` structured data
- `WebApplication` structured data (free offer) and `FAQPage` structured data built from the tool's `faq`
- A branded 1200×630 Open Graph / Twitter card (`tools/<slug>/og.png`)
- Indexable how-to copy and an FAQ below the tool, and links to related tools in the same category
- A category hub page (`/image-tools/` etc.) linking all tools in that category, plus sitemap.xml
- Build-time warnings when a title or description is too long for Google to show in full

## Adding a tool

```sh
npm run new-tool -- color-picker images   # creates tools/color-picker/{tool.mjs,script.js}
# edit the two files, add logic to assets/js/lib/ with a test if it's non-trivial
# add tools/color-picker/icon.svg: a 24×24 line icon using stroke="currentColor", like the others
npm test && npm run build
npm run og -- color-picker                 # render its social card (needs Playwright, see below)
```

Categories are `business`, `images`, `json`, `seo`, `text` and `encoding` (see `scripts/categories.mjs` to add more).

## Development

Requires Node 20+. The site itself has no dependencies.

```sh
npm test                                   # unit tests
SITE_URL=https://tools.klickode.com npm run build   # → dist/ (use your real domain)
npx serve dist                             # preview locally
```

`SITE_URL` enables canonical links, absolute `og:image` URLs and `sitemap.xml`. Set it in your host's environment variables.

Social cards: `npm i -D playwright && npx playwright install chromium && npm run og`, then commit the PNGs.

## Site-wide features

- **Find a tool**: `Ctrl/⌘ K` on any page (or `/`) opens a search over every tool, built from `assets/tools-index.json`, which the build writes.
- **Ctrl/⌘ Enter** clicks the tool's main button (the first `.btn.primary` in the tool).
- **Send to…**: add `data-send-to="slug,slug"` to an output in `tool.mjs` and a menu appears in its panel header. The text goes through `sessionStorage` and lands in the target tool's `[data-receive]` field (or its first editable textarea), which is then run.
- **Drop a text file** on any editable textarea to load it.
- **Recently used** tools are listed on the home page (`localStorage`).
- **Works offline / installable**: the build writes `manifest.webmanifest` and `sw.js` (from `scripts/sw.js`) with a list of every file and a content hash, so each deploy replaces the cache.

## Privacy by design

- All processing is client-side. Pages make no requests beyond their own static files; fonts are self-hosted rather than loaded from Google Fonts.
- Image tools decode and encode on a canvas in the tab. The EXIF remover cuts metadata out of JPG/PNG/WebP files without touching the pixel data.
- The regex tester runs patterns in a Web Worker and stops it after 1.5s, so a runaway pattern can't freeze the tab.
- Share links keep state in the URL fragment (`#s=…`), which browsers never send to the server.
- Text inputs are remembered in `localStorage`, except in the JWT decoder (tokens are credentials). Images are never stored.
- `netlify.toml` / `vercel.json` set a strict Content-Security-Policy (`connect-src 'self'`).

## Deploying (free tiers)

- **Netlify**: import the repo; `netlify.toml` sets the build command, publish dir and security headers.
- **Vercel**: import the repo; `vercel.json` does the same.
- **Cloudflare Pages**: build command `npm run build`, output `dist`; copy the CSP from `netlify.toml` into a `_headers` file.

## Roadmap

- [x] JSON/data toolkit, regex & text suite, encoding tools
- [x] Image converter, compressor, resizer, EXIF remover (client-side, batch, ZIP)
- [x] On-page SEO tools (meta tags, SERP preview, robots.txt, keyword density)
- [ ] Cookieless analytics to see which tools to invest in
- [x] QR code generator (own encoder, tested module for module against segno), PromptPay QR, link-in-bio pages, social image sizes, brand palettes
- [ ] PDF merge/compress (pdf-lib, in-browser), YAML ↔ JSON, SQL/CSS formatter
- [ ] In-browser background remover (ONNX model, cached after first load)
- [ ] URL-based SEO audit (needs a small fetch proxy) and AI tools (need a backend)

## Brand logos

The Shop Card Maker uses platform logos from [Simple Icons](https://simpleicons.org) (CC0 data, v16.35.0), stored in `tools/shop-card-maker/logos.js`. The logos remain trademarks of their owners and are only offered for linking to the user's own page on that platform. Amazon and Lazada aren't in Simple Icons, so their cards use a text label. To refresh the logos, regenerate `logos.js` from a newer `simple-icons` package.

## Copyright

© 2026 Klickode Studio Ltd. All rights reserved. This is proprietary code: see `LICENSE`. It may not be copied, reused or redistributed without written permission. Fonts (SIL OFL 1.1) and Simple Icons logo data (CC0) keep their own licences, listed in `LICENSE`.

The site's legal pages (terms, privacy, disclaimer, copyright) live in `scripts/legal.mjs`, along with `BRAND_NOTICE`: the copyright line the build writes, out of sight of visitors, into every page's source, the top of every shipped CSS/JS file and the site's own PNGs (`scripts/png-meta.mjs`). The browser console also shows a signature (`assets/js/ui.js`). Nothing is hidden in the visible page itself, because hidden text counts as spam to search engines.
