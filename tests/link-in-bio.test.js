import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderPage, pageBody, pageCss, resolveTheme, linkUrl, linkTitle, THEMES, THEME_ORDER } from '../tools/link-in-bio/page.js';

const base = (extra = {}) => ({ name: 'Mali', bio: 'Silver jewellery', links: [], theme: 'light', colors: {}, ...extra });

test('platform links are built from the handle', () => {
  assert.equal(linkUrl({ type: 'platform', platform: 'instagram', handle: '@mali' }), 'https://www.instagram.com/mali/');
  assert.equal(linkUrl({ type: 'platform', platform: 'instagram', handle: '' }), '');
  assert.match(linkTitle({ type: 'platform', platform: 'tiktok' }), /TikTok/);
});

test('custom links accept bare domains and reject unsafe schemes', () => {
  assert.equal(linkUrl({ type: 'custom', url: 'myshop.com/sale' }), 'https://myshop.com/sale');
  assert.equal(linkUrl({ type: 'custom', url: 'mailto:hi@myshop.com' }), 'mailto:hi@myshop.com');
  for (const bad of ['javascript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'vbscript:x', 'not a url']) {
    assert.equal(linkUrl({ type: 'custom', url: bad }), '', bad);
  }
  // A platform "handle" pasted as a javascript: URL is not trusted either.
  assert.equal(linkUrl({ type: 'platform', platform: 'etsy', handle: 'javascript:alert(1)' }).startsWith('https://www.etsy.com/'), true);
});

test('links without a safe address are left out of the download but shown in the preview', () => {
  const s = base({ links: [{ type: 'custom', title: 'Bad', url: 'javascript:alert(1)' }, { type: 'custom', title: 'Good', url: 'https://ok.example' }] });
  const html = renderPage(s);
  assert.doesNotMatch(html, /javascript:/i);
  assert.doesNotMatch(html, />Bad</);
  assert.match(html, /href="https:\/\/ok\.example\/"/);
  assert.match(pageBody(s, { preview: true }), /kb-off[^>]*>.*Bad/s);
});

test('user text is escaped everywhere, including the title and meta tags', () => {
  const evil = '</style><script>alert(1)</script>"\'<img src=x onerror=alert(1)>';
  const html = renderPage(base({ name: evil, bio: evil, meta: { description: evil }, links: [{ type: 'custom', title: evil, url: 'https://ok.example' }] }));
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<img src=x/i);
  assert.equal((html.match(/<\/style>/g) || []).length, 1);
  assert.match(html, /&lt;\/style&gt;&lt;script&gt;/);
});

test('custom colours must be hex; anything else falls back to the theme', () => {
  const t = resolveTheme(base({ colors: { bg: 'red;}</style><script>', button: 'url(javascript:x)', text: 'expression(1)' } }));
  assert.equal(t.bg, THEMES.light.bg);
  assert.equal(t.button, THEMES.light.button);
  assert.equal(t.text, THEMES.light.text);
  const css = pageCss(base({ colors: { bg: '#123456', button: '#ffcc00' } }));
  assert.match(css, /--kb-bg:#123456/);
  assert.match(css, /--kb-btn:#ffcc00;--kb-btn-text:#111111/);
  assert.match(css, /--kb-text:#ffffff/); // dark custom background gets light text
});

test('avatars must be image data URLs or http(s)', () => {
  assert.doesNotMatch(renderPage(base({ avatar: 'javascript:alert(1)' })), /javascript/);
  assert.doesNotMatch(renderPage(base({ avatar: 'data:text/html;base64,PHNjcmlwdD4=' })), /data:text/);
  assert.match(renderPage(base({ avatar: 'data:image/png;base64,iVBORw0KGgo=' })), /<img class="kb-avatar" src="data:image\/png/);
});

test('meta tags: og image and url only when they are web addresses; credit can be turned off', () => {
  const html = renderPage(base({ meta: { image: 'https://x.example/og.png', url: 'https://links.example/' } }), { creditUrl: 'https://tools.example/tools/link-in-bio/' });
  assert.match(html, /<meta property="og:image" content="https:\/\/x\.example\/og\.png">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/links\.example\/">/);
  assert.match(html, /Made with Klickode Tools/);
  const off = renderPage(base({ credit: false, meta: { image: 'javascript:x', url: 'ftp://x' } }), { creditUrl: 'https://tools.example/' });
  assert.doesNotMatch(off, /og:image|canonical|Made with/);
});

test('the page needs no scripts or outside requests', () => {
  for (const theme of THEME_ORDER) {
    const html = renderPage(base({ theme, links: [{ type: 'platform', platform: 'instagram', handle: 'x' }, { type: 'platform', platform: 'lazada', handle: 'x' }] }));
    assert.doesNotMatch(html, /<script|<link rel="stylesheet"|@import|url\(/i, theme);
  }
  assert.match(renderPage(base({ name: 'ร้านมะลิ' })), /<html lang="th">/);
});
