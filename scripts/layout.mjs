// Shared HTML shell: <head> SEO tags, header, footer.
import { categoryIcon } from './categories.mjs';
import { COMPANY, CONTACT_URL, BRAND_NOTICE } from './legal.mjs';

export const SITE_NAME = 'Klickode Tools';
export const STUDIO_URL = 'https://www.klickode.com/';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const NAV = [
  ['/business-tools/', 'Business'],
  ['/image-tools/', 'Images'],
  ['/json-tools/', 'JSON'],
  ['/seo-tools/', 'SEO'],
  ['/text-tools/', 'Text'],
  ['/encoding-tools/', 'Encoding'],
];

// Tells search engines who is behind the site and which logo is the brand's.
const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY,
  alternateName: ['Klickode', 'Klickode Studio'],
  url: STUDIO_URL,
  logo: 'https://www.klickode.com/icon-192.png',
  email: 'klickode@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Bangkok', addressCountry: 'TH' },
  brand: { '@type': 'Brand', name: 'Klickode' },
};

const FOOTER_COLUMNS = [
  ['Categories', NAV.map(([href, label]) => [href, label === 'Text' ? 'Regex & text' : label === 'Business' ? 'Business & social' : label])],
  ['Popular', [['/tools/image-converter/', 'Image Converter'], ['/tools/image-compressor/', 'Image Compressor'], ['/tools/json-formatter/', 'JSON Formatter'], ['/tools/shop-card-maker/', 'Shop Card Maker'], ['/tools/qr-code-generator/', 'QR Code Generator']]],
  ['Company', [[STUDIO_URL, 'Klickode Studio'], [CONTACT_URL, 'Contact'], ['mailto:klickode@gmail.com', 'klickode@gmail.com']]],
  ['Legal', [['/terms/', 'Terms of Use'], ['/privacy/', 'Privacy Policy'], ['/disclaimer/', 'Disclaimer'], ['/copyright/', 'Copyright']]],
];

const THEME_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg>';

export function layout({ siteUrl, path, title, description, body, scripts = [], styles = [], bodyAttrs = '', jsonLd, ogImage = '/assets/brand/og.png', active = '' }) {
  const abs = (p) => (siteUrl ? `${siteUrl}${p}` : p);
  return `<!doctype html>
<!-- ${BRAND_NOTICE} -->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${siteUrl ? `<link rel="canonical" href="${abs(path)}">` : ''}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  ${siteUrl ? `<meta property="og:url" content="${abs(path)}">` : ''}
  <meta property="og:image" content="${abs(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#E03131">
  <meta name="copyright" content="© ${new Date().getFullYear()} ${COMPANY} All rights reserved.">
  <meta name="author" content="${COMPANY}">
  <script type="application/ld+json">${JSON.stringify(ORGANIZATION).replace(/</g, '\\u003c')}</script>
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="preload" href="/assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/style.css">
${styles.map((h) => `  <link rel="stylesheet" href="${h}">\n`).join('')}  <script>try{var t=localStorage.getItem('kt-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body${bodyAttrs}>
<!-- Same frame as klickode.com: the site sits in a rounded panel that scrolls inside the window. -->
<div class="app-viewport"><div class="app-frame"><div class="app-scroll" id="scroller" tabindex="-1">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap wrap-wide">
  <a class="brand" href="/" aria-label="${SITE_NAME} home">
    <img src="/assets/brand/mark.svg" alt="" width="36" height="36">
    <span class="brand-text"><span class="brand-name">Klickode</span><span class="brand-tag">Tools</span></span>
  </a>
  <nav aria-label="Categories">
    ${NAV.map(([href, label]) => `<a href="${href}"${active === href ? ' aria-current="page"' : ''}>${label}</a>`).join('\n    ')}
  </nav>
  <div class="header-actions">
    <button class="search-btn" type="button" data-palette aria-label="Find a tool (Ctrl+K)" title="Find a tool"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Find a tool</span><kbd>Ctrl K</kbd></button>
    <button class="icon-btn" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">${THEME_ICON}</button>
    <a class="header-cta" href="${STUDIO_URL}">Klickode Studio <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
  </div>
</div></header>
<main id="main"><div class="wrap">
${body}
</div></main>
<footer class="site-footer"><div class="wrap">
  <div class="footer-grid">
    <div class="footer-about">
      <a class="brand" href="/" aria-label="${SITE_NAME} home">
        <img src="/assets/brand/mark.svg" alt="" width="36" height="36">
        <span class="brand-text"><span class="brand-name">Klickode</span><span class="brand-tag">Tools</span></span>
      </a>
      <p>Free tools that run in your browser. Your files never leave your device.</p>
      <a class="footer-studio" href="${STUDIO_URL}">Need a website? Meet Klickode Studio <span aria-hidden="true">↗</span></a>
    </div>
    ${FOOTER_COLUMNS.map(([title, links]) => `<nav class="footer-col" aria-label="${title}"><h2>${title}</h2><ul>${links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></nav>`).join('\n    ')}
  </div>
  <div class="footer-bottom">
    <span>© ${new Date().getFullYear()} ${COMPANY} All rights reserved.</span>
    <span>No part of this site may be copied without written permission. Made in Bangkok.</span>
  </div>
</div></footer>
</div></div></div>
${(scripts.length ? scripts : ['/assets/js/ui.js']).map((s) => `<script type="module" src="${s}"></script>`).join('\n')}
</body>
</html>
`;
}

export const breadcrumbs = (items) =>
  `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map(([href, label], i) => (i === items.length - 1 ? `<li aria-current="page">${esc(label)}</li>` : `<li><a href="${href}">${esc(label)}</a></li>`)).join('')}</ol></nav>`;

// A tool's own icon.svg, sized for inline use; the category icon if it has none.
export const toolIcon = (t, cat, size = 20) =>
  t.icon ? t.icon.replace('<svg ', `<svg width="${size}" height="${size}" aria-hidden="true" `) : cat ? categoryIcon(cat, size) : '';

// Tool card: an illustration of what the tool does (tools/<slug>/preview.html), then its name.
export const toolCard = (t, cat) =>
  `<a class="tool-card" href="/tools/${t.slug}/" data-search="${esc(`${t.name} ${t.short} ${t.slug} ${cat?.name ?? ''} ${(t.keywords || []).join(' ')}`.toLowerCase())}">${
    t.preview ? `<div class="tc-preview" aria-hidden="true">${t.preview}</div>` : ''
  }<div class="tc-body"><span class="tc-title"><span class="tool-icon">${toolIcon(t, cat, 16)}</span><strong>${esc(t.name)}</strong></span><span class="desc">${esc(t.short)}</span></div></a>`;

export const toolGrid = (list, catOf) => `<div class="tool-grid">${list.map((t) => toolCard(t, catOf(t))).join('')}</div>`;
