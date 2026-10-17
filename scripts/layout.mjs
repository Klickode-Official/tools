// Shared HTML shell: <head> SEO tags, header, footer.
import { categoryIcon } from './categories.mjs';

export const SITE_NAME = 'Klickode Tools';
export const REPO_URL = 'https://github.com/faiqworkstudio/klickode-tools';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const NAV = [
  ['/business-tools/', 'Business'],
  ['/image-tools/', 'Images'],
  ['/json-tools/', 'JSON'],
  ['/seo-tools/', 'SEO'],
  ['/text-tools/', 'Text'],
  ['/encoding-tools/', 'Encoding'],
];

const THEME_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg>';

export function layout({ siteUrl, path, title, description, body, scripts = [], styles = [], bodyAttrs = '', jsonLd, ogImage = '/assets/brand/og.png', active = '' }) {
  const abs = (p) => (siteUrl ? `${siteUrl}${p}` : p);
  return `<!doctype html>
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
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
  <link rel="preload" href="/assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/style.css">
${styles.map((h) => `  <link rel="stylesheet" href="${h}">\n`).join('')}  <script>try{var t=localStorage.getItem('kt-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body${bodyAttrs}>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap">
  <a class="brand" href="/" aria-label="${SITE_NAME} home">
    <img src="/assets/brand/mark.svg" alt="" width="32" height="32">
    <span class="brand-name">Klickode</span><span class="brand-tag">Tools</span>
  </a>
  <nav aria-label="Categories">
    ${NAV.map(([href, label]) => `<a href="${href}"${active === href ? ' aria-current="page"' : ''}>${label}</a>`).join('\n    ')}
  </nav>
  <button class="icon-btn" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">${THEME_ICON}</button>
</div></header>
<main id="main"><div class="wrap">
${body}
</div></main>
<footer class="site-footer"><div class="wrap">
  <div class="footer-brand">
    <img src="/assets/brand/mark.svg" alt="" width="28" height="28">
    <div><strong>Klickode Tools</strong><span>Made by Klickode. Free to use, and your files stay on your device.</span></div>
  </div>
  <nav aria-label="Footer">
    ${NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join(' ')}
    <a href="/privacy/">Privacy</a> <a href="/terms/">Terms</a> <a href="${REPO_URL}">Source</a>
  </nav>
</div></footer>
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

export const toolCard = (t, cat) =>
  `<a class="tool-card" href="/tools/${t.slug}/" data-search="${esc(`${t.name} ${t.short} ${t.slug} ${cat?.name ?? ''}`.toLowerCase())}"><span class="tool-icon">${toolIcon(t, cat)}</span><strong>${esc(t.name)}</strong><span class="desc">${esc(t.short)}</span></a>`;

export const toolGrid = (list, catOf) => `<div class="tool-grid">${list.map((t) => toolCard(t, catOf(t))).join('')}</div>`;
