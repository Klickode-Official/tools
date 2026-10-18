// Render social preview cards (1200×630 PNG) for every tool, the site default and the
// apple-touch-icon. Needs Playwright (dev only, not needed to build the site):
//   npm i -D playwright && npx playwright install chromium && npm run og
// Commit the generated PNGs; the build picks up tools/<slug>/og.png automatically.
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readdir } from 'node:fs/promises';
import { categoryById } from './categories.mjs';
import { stampPng } from './png-meta.mjs';
import { BRAND_NOTICE, COMPANY } from './legal.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const mark = (await readFile(join(root, 'assets/brand/mark.svg'), 'utf8')).replace(/<\?xml[^>]*>/, '');
const font = (f) => `data:font/woff2;base64,${Buffer.from(f).toString('base64')}`;
const inter = font(await readFile(join(root, 'assets/fonts/inter-latin-wght-normal.woff2')));
const mono = font(await readFile(join(root, 'assets/fonts/jetbrains-mono-latin-wght-normal.woff2')));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const card = ({ eyebrow, title, subtitle, icon = '' }) => `<!doctype html><html><head><style>
@font-face { font-family: Inter; src: url(${inter}); font-weight: 100 900; }
@font-face { font-family: Mono; src: url(${mono}); font-weight: 100 800; }
html, body { margin: 0; width: 1200px; height: 630px; }
body { background: #18181b; color: #f4f4f5; font-family: Inter; position: relative; overflow: hidden; }
.glow { position: absolute; right: -180px; top: -180px; width: 640px; height: 640px; border-radius: 50%; background: radial-gradient(circle, rgba(224,49,49,.45), rgba(224,49,49,0) 70%); }
.mark { position: absolute; right: 90px; top: 150px; width: 330px; height: 330px; transform: rotate(6deg); filter: drop-shadow(0 30px 60px rgba(0,0,0,.45)); }
.mark svg { width: 100%; height: 100%; }
.content { position: absolute; left: 80px; top: 80px; bottom: 112px; width: 640px; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 14px; font-weight: 700; font-size: 30px; letter-spacing: -.02em; }
.brand .tag { font-family: Mono; font-size: 16px; letter-spacing: .14em; color: #e03131; border: 1.5px solid rgba(224,49,49,.5); padding: 2px 10px; border-radius: 7px; font-weight: 500; }
.icon { margin-top: auto; width: 76px; height: 76px; border-radius: 20px; background: rgba(224,49,49,.16); color: #ff6b6b; display: grid; place-items: center; margin-bottom: 22px; }
.icon svg { width: 40px; height: 40px; }
.eyebrow { font-family: Mono; font-size: 20px; letter-spacing: .14em; text-transform: uppercase; color: #ff6b6b; }
h1 { font-size: ${title.length > 26 ? 60 : 72}px; line-height: 1.04; letter-spacing: -.035em; margin: 14px 0 16px; font-weight: 750; }
p { font-size: 26px; line-height: 1.4; color: #a8a8b3; margin: 0; }
.foot { position: absolute; left: 80px; right: 80px; bottom: 44px; display: flex; gap: 28px; font-family: Mono; font-size: 17px; letter-spacing: .08em; text-transform: uppercase; color: #7c7c87; }
.foot b { color: #4ade80; font-weight: 500; }
</style></head><body>
<div class="glow"></div><div class="mark">${mark}</div>
<div class="content">
  <div class="brand">Klickode <span class="tag">TOOLS</span></div>
  ${icon ? `<div class="icon">${icon}</div>` : '<div style="margin-top:auto"></div>'}
  <div class="eyebrow">${esc(eyebrow)}</div>
  <h1>${esc(title)}</h1>
  <p>${esc(subtitle)}</p>
</div>
<div class="foot"><span><b>●</b> Runs in your browser</span><span>No sign-up</span></div>
</body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
async function shot(html, file) {
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, type: 'png' });
  await stampPng(file, { Copyright: BRAND_NOTICE, Author: COMPANY });
  console.log('wrote', file.replace(root + '/', ''));
}

const only = process.argv[2];
for (const dir of (await readdir(join(root, 'tools'))).sort()) {
  if (only && only !== dir) continue;
  const { default: t } = await import(pathToFileURL(join(root, 'tools', dir, 'tool.mjs')).href);
  const icon = await readFile(join(root, 'tools', dir, 'icon.svg'), 'utf8').catch(() => '');
  await shot(card({ eyebrow: categoryById[t.category].name, title: t.name, subtitle: t.short, icon }), join(root, 'tools', dir, 'og.png'));
}
if (!only) {
  await shot(card({ eyebrow: 'Free online tools', title: 'Tools that never see your files.', subtitle: 'Images, JSON, regex and SEO, all handled on your own device.' }), join(root, 'assets/brand/og.png'));
  await page.setViewportSize({ width: 180, height: 180 });
  await page.setContent(`<html><body style="margin:0;background:#E03131">${mark.replace('width="1024" height="1024"', 'width="180" height="180"')}</body></html>`);
  await page.screenshot({ path: join(root, 'assets/brand/apple-touch-icon.png') });
  await stampPng(join(root, 'assets/brand/apple-touch-icon.png'), { Copyright: BRAND_NOTICE, Author: COMPANY });
  console.log('wrote assets/brand/apple-touch-icon.png');
  // App icons for the web manifest. The maskable one keeps the mark inside the safe zone.
  for (const [name, size, pad, bg] of [['icon-192', 192, 0.03, 'transparent'], ['icon-512', 512, 0.03, 'transparent'], ['icon-maskable', 512, 0.16, '#E03131']]) {
    const inner = Math.round(size * (1 - 2 * pad));
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:${bg};display:grid;place-items:center;height:${size}px">${mark.replace('width="1024" height="1024"', `width="${inner}" height="${inner}"`)}</body></html>`);
    const file = join(root, `assets/brand/${name}.png`);
    await page.screenshot({ path: file, omitBackground: true });
    await stampPng(file, { Copyright: BRAND_NOTICE, Author: COMPANY });
    console.log(`wrote assets/brand/${name}.png`);
  }
}
await browser.close();
