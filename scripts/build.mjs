// Static site generator. Every folder in tools/ becomes its own page at /tools/<slug>/:
//   tools/<slug>/tool.mjs   page copy + SEO metadata (required)
//   tools/<slug>/script.js  page behaviour (required)
//   tools/<slug>/style.css  extra styles for this tool's page only (optional)
//   tools/<slug>/preview.html  small illustration shown on the tool's card (optional; see .pv-* styles)
//   tools/<slug>/icon.svg   24×24 line icon, stroked with currentColor (optional; falls back to the category icon)
//   tools/<slug>/og.png     1200×630 social preview (optional, `npm run og` makes them)
//   tools/<slug>/*          anything else (workers, images) is copied alongside
//
//   SITE_URL=https://tools.example.com npm run build
//
// SITE_URL enables canonical links, absolute og:image URLs and sitemap.xml.
import { cp, mkdir, readdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { categories, categoryById, categoryIcon } from './categories.mjs';
import { layout, breadcrumbs, toolGrid, toolIcon, esc, SITE_NAME } from './layout.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '');
const warnings = [];

const exists = (p) => stat(p).then(() => true, () => false);

export async function loadTools() {
  const dirs = (await readdir(join(root, 'tools'), { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  const tools = [];
  for (const dir of dirs) {
    const { default: t } = await import(pathToFileURL(join(root, 'tools', dir, 'tool.mjs')).href);
    for (const key of ['slug', 'category', 'name', 'title', 'description', 'short', 'body']) {
      if (!t[key]) throw new Error(`tools/${dir}/tool.mjs is missing "${key}"`);
    }
    if (t.slug !== dir) throw new Error(`tools/${dir}/tool.mjs has slug "${t.slug}"; it must match the folder name`);
    if (!categoryById[t.category]) throw new Error(`tools/${dir}: unknown category "${t.category}" (see scripts/categories.mjs)`);
    if (!(await exists(join(root, 'tools', dir, 'script.js')))) throw new Error(`tools/${dir}/script.js is missing`);
    // Add the brand only when it still fits, so the keyword part is never truncated.
    const fullTitle = t.title.length + SITE_NAME.length + 3 <= 62 ? `${t.title} | ${SITE_NAME}` : t.title;
    if (t.title.length > 65) warnings.push(`${dir}: title is ${t.title.length} chars; Google shows about 60`);
    if (t.description.length > 165) warnings.push(`${dir}: description is ${t.description.length} chars; Google shows about 160`);
    const iconFile = join(root, 'tools', dir, 'icon.svg');
    const icon = (await exists(iconFile)) ? (await readFile(iconFile, 'utf8')).trim() : null;
    const previewFile = join(root, 'tools', dir, 'preview.html');
    const preview = (await exists(previewFile)) ? (await readFile(previewFile, 'utf8')).trim() : null;
    tools.push({ ...t, fullTitle, icon, preview, hasCss: await exists(join(root, 'tools', dir, 'style.css')), hasOg: await exists(join(root, 'tools', dir, 'og.png')) });
  }
  return tools.sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name));
}

const tools = await loadTools();
const catOf = (t) => categoryById[t.category];
const byCategory = (id) => tools.filter((t) => t.category === id);

async function page(path, html) {
  const file = path.endsWith('.html') ? join(out, path) : join(out, path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

const faqHtml = (faq = []) =>
  faq.length ? `<h2>Frequently asked questions</h2><div class="faq">${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${f.a}</p></details>`).join('')}</div>` : '';

const stripTags = (s) => s.replace(/<[^>]+>/g, '');
const abs = (p) => `${siteUrl}${p}`;

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, 'assets'), join(out, 'assets'), { recursive: true });

// --- tool pages ---------------------------------------------------------------
for (const t of tools) {
  const cat = catOf(t);
  const path = `/tools/${t.slug}/`;
  await cp(join(root, 'tools', t.slug), join(out, 'tools', t.slug), { recursive: true, filter: (src) => !/(tool\.mjs|icon\.svg|preview\.html)$/.test(src) });
  const related = tools.filter((o) => o.category === t.category && o.slug !== t.slug);
  const graph = [
    {
      '@type': 'WebApplication',
      name: t.name,
      description: t.description,
      applicationCategory: t.category === 'images' ? 'MultimediaApplication' : 'DeveloperApplication',
      operatingSystem: 'Any (web browser)',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      ...(siteUrl && { url: abs(path) }),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        ['/', 'Tools'],
        [`/${cat.slug}/`, cat.name],
        [path, t.name],
      ].map(([p, name], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(siteUrl && { item: abs(p) }) })),
    },
  ];
  if (t.faq?.length) {
    graph.push({ '@type': 'FAQPage', mainEntity: t.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) } })) });
  }
  await page(
    path,
    layout({
      siteUrl,
      path,
      title: t.fullTitle,
      description: t.description,
      active: `/${cat.slug}/`,
      ogImage: t.hasOg ? `${path}og.png` : undefined,
      scripts: [`${path}script.js`],
      styles: t.hasCss ? [`${path}style.css`] : [],
      bodyAttrs: Object.entries(t.data || {}).map(([k, v]) => ` data-${k}="${esc(v)}"`).join(''),
      jsonLd: { '@context': 'https://schema.org', '@graph': graph },
      body: `${breadcrumbs([['/', 'Tools'], [`/${cat.slug}/`, cat.name], [path, t.name]])}
<header class="page-head">
  <div class="title-row"><span class="tool-icon lg">${toolIcon(t, cat, 24)}</span><h1>${esc(t.name)}</h1></div>
  <p class="lede">${esc(t.description)}</p>
</header>
<section class="tool" aria-label="${esc(t.name)}">
  <div class="tool-bar">
    <span class="tool-bar-name">${toolIcon(t, cat, 16)}${esc(t.name)}</span>
    <span class="tool-bar-note"><span class="live-dot" aria-hidden="true"></span>Runs locally · No sign-up</span>
  </div>
  <div class="tool-body">
${t.body}
  </div>
</section>
<section class="content">
${t.content || ''}
${faqHtml(t.faq)}
</section>
${related.length ? `<section class="related"><h2>More ${esc(cat.name.toLowerCase())}</h2>${toolGrid(related, catOf)}</section>` : ''}`,
    }),
  );
}

// --- category hubs -------------------------------------------------------------
for (const c of categories) {
  const list = byCategory(c.id);
  if (!list.length) continue;
  const path = `/${c.slug}/`;
  await page(
    path,
    layout({
      siteUrl,
      path,
      title: `${c.title} | ${SITE_NAME}`,
      description: c.description,
      active: path,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: c.name,
        description: c.description,
        hasPart: list.map((t) => ({ '@type': 'WebApplication', name: t.name, ...(siteUrl && { url: abs(`/tools/${t.slug}/`) }) })),
      },
      body: `${breadcrumbs([['/', 'Tools'], [path, c.name]])}
<header class="page-head"><div class="title-row"><span class="tool-icon lg">${categoryIcon(c, 24)}</span><h1>${esc(c.name)}</h1></div><p class="lede">${esc(c.description)}</p></header>
${toolGrid(list, catOf)}`,
    }),
  );
}

// --- home ------------------------------------------------------------------------
await page(
  '/',
  layout({
    siteUrl,
    path: '/',
    title: `${SITE_NAME}: Free Online Tools for Images, JSON and SEO`,
    description: `Free tools for converting images, tidying JSON, testing regex and checking SEO. They run in your browser, so your files stay on your computer.`,
    scripts: ['/assets/js/home.js'],
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, ...(siteUrl && { url: abs('/') }) },
    body: `<div class="hero-wrap"><section class="hero">
  <p class="eyebrow">${tools.length} free tools · no sign-up</p>
  <h1>Online tools that never see your files.</h1>
  <p class="lede">Convert an image, tidy up some JSON, test a regex or check a page’s SEO. It all runs right here in your browser, so nothing you drop in gets uploaded.</p>
  <div class="search"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    <input type="search" id="tool-search" placeholder="Search tools, e.g. “webp” or “json”" aria-label="Search tools" autocomplete="off"></div>
</section>
<div class="hero-art" aria-hidden="true">
  <img src="/assets/brand/mark.svg" alt="" width="220" height="220" class="hero-mark">
  <span class="chip c1">PNG → WebP <b>−68%</b></span>
  <span class="chip c2">{ "valid": <b>true</b> }</span>
  <span class="chip c3">/^[\\w.]+@/ <b>2 matches</b></span>
  <span class="chip c4">GPS data <b>removed</b></span>
</div></div>
<div id="all-tools">
${categories
  .filter((c) => byCategory(c.id).length)
  .map((c) => `<section class="cat-section" data-cat><div class="cat-head"><h2>${esc(c.name)} <span class="count">${byCategory(c.id).length}</span></h2><a href="/${c.slug}/">View all</a></div>${toolGrid(byCategory(c.id), catOf)}</section>`)
  .join('\n')}
<p class="empty" id="no-results" hidden>No tools match that search.</p>
</div>
<section class="why">
  <h2>Why your files stay put</h2>
  <p>Most online converters upload your file, process it on a server somewhere and send it back. These tools skip that trip. The work happens in this browser tab, so there’s no waiting in a queue, no cap on how many files you do, and no copy of your photo left on someone else’s computer afterwards.</p>
  <p>That’s also why the tools keep working if your connection drops once the page has loaded.</p>
</section>`,
  }),
);

// --- legal + 404 --------------------------------------------------------------------
await page(
  '/privacy/',
  layout({
    siteUrl,
    path: '/privacy/',
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `How ${SITE_NAME} handles your data.`,
    body: `<section class="content"><h1>Privacy Policy</h1>
<p><strong>Short version:</strong> the tools process everything in your browser. We don't receive, store or sell the files or text you use them with.</p>
<h2>Files and text you enter</h2><p>Images, files, text and tokens you put into a tool are processed by JavaScript on the page and never transmitted to our servers. Some tools save your last text input in your browser's local storage so it survives a refresh; clear it with the tool's Clear button or your browser's site-data settings. The JWT decoder deliberately does not save input. Images are never stored.</p>
<h2>Share links</h2><p>Share links put the tool's input in the URL fragment (after <code>#</code>). Browsers don't send the fragment to web servers, but anyone who has the link can read its contents.</p>
<h2>Fonts and third parties</h2><p>Fonts and all other assets are served from this site. Pages load nothing from third-party domains.</p>
<h2>Hosting logs</h2><p>Like any website, our hosting provider may log standard request data (IP address, user agent, requested URL) for security and operations. These logs never include tool input.</p>
<h2>Cookies and tracking</h2><p>We use no advertising cookies or third-party trackers. If we add analytics, it will be cookieless and aggregate-only, and this page will be updated first.</p>
<h2>Contact</h2><p>Questions: open an issue on <a href="https://github.com/faiqworkstudio/klickode-tools/issues">GitHub</a>.</p></section>`,
  }),
);
await page(
  '/terms/',
  layout({
    siteUrl,
    path: '/terms/',
    title: `Terms of Use | ${SITE_NAME}`,
    description: `Terms of use for ${SITE_NAME}.`,
    body: `<section class="content"><h1>Terms of Use</h1>
<p>${SITE_NAME} is provided free of charge, as is, without warranty of any kind. Verify results before relying on them in production; you use the tools at your own risk.</p>
<p>You keep all rights to content you process. Only process files and data you are authorised to use. The source code is available under the MIT License.</p></section>`,
  }),
);
await page(
  '404.html',
  layout({ siteUrl, path: '/404', title: `Page not found | ${SITE_NAME}`, description: 'Page not found.', body: `<header class="page-head"><h1>Page not found</h1><p class="lede">That page doesn't exist. Try one of these:</p></header>${toolGrid(tools, catOf)}` }),
);

// --- sitemap + robots -------------------------------------------------------------------
const urls = ['/', ...categories.filter((c) => byCategory(c.id).length).map((c) => `/${c.slug}/`), ...tools.map((t) => `/tools/${t.slug}/`), '/privacy/', '/terms/'];
if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10);
  await writeFile(
    join(out, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${abs(u)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`,
  );
}
await writeFile(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${abs('/sitemap.xml')}\n` : ''}`);

for (const w of warnings) console.warn(`SEO warning: ${w}`);
console.log(`Built ${urls.length} pages (${tools.length} tools) into dist/${siteUrl ? ` for ${siteUrl}` : ' (set SITE_URL to emit canonical URLs and sitemap.xml)'}`);
