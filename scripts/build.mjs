// Static site generator: renders every tool page plus home, privacy, terms, 404,
// sitemap.xml and robots.txt into dist/. No dependencies.
//
//   SITE_URL=https://tools.example.com npm run build
//
// SITE_URL enables canonical links and the sitemap; without it they are omitted.
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools, categories } from './tools.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const SITE_NAME = 'Klickode Tools';
const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function layout({ path, title, description, body, script, bodyAttrs = '', jsonLd }) {
  const canonical = SITE_URL ? `<link rel="canonical" href="${SITE_URL}${path}">\n  <meta property="og:url" content="${SITE_URL}${path}">` : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  ${canonical}
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/css/style.css">
  <script>try{var t=localStorage.getItem('kt-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body${bodyAttrs}>
<header class="site-header"><div class="wrap">
  <a class="brand" href="/">Klickode<span>.</span>tools</a>
  <nav aria-label="Main">
    <a href="/tools/json-formatter/" class="hide-sm">JSON</a>
    <a href="/tools/regex-tester/" class="hide-sm">Regex</a>
    <a href="/#all-tools">All tools</a>
    <button class="icon-btn" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg></button>
  </nav>
</div></header>
<main><div class="wrap">
${body}
</div></main>
<footer class="site-footer"><div class="wrap">
  <span>All tools run in your browser. Your data never leaves your device.</span>
  <span><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · <a href="https://github.com/faiqworkstudio/klickode-tools">Source</a></span>
</div></footer>
${script ? `<script type="module" src="/assets/js/pages/${script}.js"></script>` : '<script type="module" src="/assets/js/ui.js"></script>'}
</body>
</html>
`;
}

const toolGrid = (list) =>
  `<div class="tool-grid">${list.map((t) => `<a class="tool-card" href="/tools/${t.slug}/"><strong>${t.name}</strong><span>${t.short}</span></a>`).join('')}</div>`;

const related = (tool) => {
  const others = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug);
  return others.length ? `<h2>Related tools</h2>${toolGrid(others)}` : '';
};

async function page(path, html) {
  const file = join(out, path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, 'assets'), join(out, 'assets'), { recursive: true });

for (const t of tools) {
  await page(
    `/tools/${t.slug}/`,
    layout({
      path: `/tools/${t.slug}/`,
      title: `${t.title} | ${SITE_NAME}`,
      description: t.description,
      script: t.script || t.slug,
      bodyAttrs: t.direction ? ` data-direction="${t.direction}"` : '',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t.name,
        description: t.description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any (web browser)',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        ...(SITE_URL && { url: `${SITE_URL}/tools/${t.slug}/` }),
      },
      body: `<h1>${t.name}</h1>
<p class="lede">${t.description}</p>
<div class="privacy-note">🔒 Runs locally. Nothing is uploaded.</div>
${t.body}
<section class="content">${t.content}${related(t)}</section>`,
    }),
  );
}

await page(
  '/',
  layout({
    path: '/',
    title: `${SITE_NAME} — Free, Private Developer Tools`,
    description: 'Free online developer tools that run entirely in your browser: JSON formatter, JSON diff, CSV to JSON, regex tester, Base64, JWT decoder, UUID generator and more. No sign-up, no uploads.',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, ...(SITE_URL && { url: SITE_URL }) },
    body: `<h1>Developer tools that never see your data</h1>
<p class="lede">Format JSON, test regexes, decode tokens and convert data: fast, free, no sign-up. Every tool runs in your browser, so API keys, tokens and customer data stay on your machine.</p>
<div id="all-tools">${categories.map((c) => `<h2>${c}</h2>${toolGrid(tools.filter((t) => t.category === c))}`).join('')}</div>`,
  }),
);

await page(
  '/privacy/',
  layout({
    path: '/privacy/',
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `How ${SITE_NAME} handles your data.`,
    body: `<section class="content"><h1>Privacy Policy</h1>
<p><strong>Short version:</strong> the tools process everything in your browser. We don't receive, store or sell the content you paste.</p>
<h2>Data you enter</h2><p>Text, files and tokens you enter into a tool are processed by JavaScript on the page and never transmitted to our servers. Some tools save your last input in your browser's local storage so it survives a refresh; you can clear it with the tool's Clear button or your browser's site-data settings. The JWT decoder deliberately does not save input.</p>
<h2>Share links</h2><p>Share links put the tool's input in the URL fragment (after <code>#</code>). Browsers don't send the fragment to web servers, but anyone who has the link can read its contents.</p>
<h2>Hosting logs</h2><p>Like any website, our hosting provider may log standard request data (IP address, user agent, requested URL) for security and operations. These logs never include tool input.</p>
<h2>Cookies and tracking</h2><p>We use no advertising cookies or third-party trackers. If we add analytics, it will be cookieless and aggregate-only, and this page will be updated first.</p>
<h2>Contact</h2><p>Questions: open an issue on <a href="https://github.com/faiqworkstudio/klickode-tools/issues">GitHub</a>.</p></section>`,
  }),
);

await page(
  '/terms/',
  layout({
    path: '/terms/',
    title: `Terms of Use | ${SITE_NAME}`,
    description: `Terms of use for ${SITE_NAME}.`,
    body: `<section class="content"><h1>Terms of Use</h1>
<p>${SITE_NAME} is provided free of charge, as is, without warranty of any kind. Verify results before relying on them in production; you use the tools at your own risk.</p>
<p>You keep all rights to content you process. Only process data you are authorised to use. The source code is available under the MIT License.</p></section>`,
  }),
);

await writeFile(
  join(out, '404.html'),
  layout({ path: '/404', title: `Page not found | ${SITE_NAME}`, description: 'Page not found.', body: `<h1>Page not found</h1><p class="lede">That page doesn't exist. Try one of these:</p>${toolGrid(tools)}` }),
);

const urls = ['/', ...tools.map((t) => `/tools/${t.slug}/`), '/privacy/', '/terms/'];
if (SITE_URL) {
  await writeFile(
    join(out, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}\n</urlset>\n`,
  );
}
await writeFile(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n${SITE_URL ? `Sitemap: ${SITE_URL}/sitemap.xml\n` : ''}`);

console.log(`Built ${urls.length} pages into dist/${SITE_URL ? ` for ${SITE_URL}` : ' (set SITE_URL to emit canonical URLs and sitemap.xml)'}`);
