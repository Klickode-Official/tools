import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderCard, embedCode, defaults, buildUrl, safeUrl, safeImage, resolveTheme, textOn } from '../tools/shop-card-maker/card.js';
import { PLATFORMS, PLATFORM_ORDER } from '../tools/shop-card-maker/platforms.js';
import { LOGOS } from '../tools/shop-card-maker/logos.js';

const base = (platform, extra = {}) => ({ ...defaults(platform, 'TZ GEMS'), layout: 'banner', theme: 'brand', url: 'https://example.com/shop', shopName: 'TZGemsCo', rating: '4.9', reviews: '65', show: {}, ...extra });

test('every platform has a logo or a text label, and renders', () => {
  assert.deepEqual(new Set(PLATFORM_ORDER), new Set(Object.keys(PLATFORMS)));
  for (const id of PLATFORM_ORDER) {
    const p = PLATFORMS[id];
    assert.ok(p.logo ? LOGOS[p.logo] : p.wordmark, id);
    for (const layout of ['banner', 'card', 'button']) assert.match(renderCard(base(id, { layout })), /href="https:\/\/example\.com\/shop"/, `${id} ${layout}`);
  }
});

test('links are built from handles', () => {
  assert.equal(buildUrl('etsy', 'TZGemsCo'), 'https://www.etsy.com/shop/TZGemsCo');
  assert.equal(buildUrl('tiktok', '@tz.gems'), 'https://www.tiktok.com/@tz.gems');
  assert.equal(buildUrl('whatsapp', '+66 81-234 5678', 'Hi there'), 'https://wa.me/66812345678?text=Hi%20there');
  assert.equal(buildUrl('line', 'shop'), 'https://line.me/R/ti/p/%40shop');
  assert.equal(buildUrl('shopee', 'https://shopee.co.th/abc'), 'https://shopee.co.th/abc');
  assert.equal(buildUrl('etsy', ''), '');
});

test('user text is escaped and unsafe links are dropped', () => {
  const html = renderCard(base('etsy', { headline: '<script>alert(1)</script> *Etsy*', text: '<img src=x onerror=alert(1)> **bold**', url: 'javascript:alert(1)', avatar: 'javascript:alert(1)' }));
  assert.ok(!html.includes('<script>') && !html.includes('<img src=x'));
  assert.ok(html.includes('&lt;script&gt;') && html.includes('<span class="ksc-hl">Etsy</span>') && html.includes('<strong>bold</strong>'));
  assert.ok(!html.includes('javascript:'));
  assert.equal(safeUrl('javascript:alert(1)'), '#');
  assert.equal(safeUrl('https://a.b/c?d=1'), 'https://a.b/c?d=1');
  assert.equal(safeImage('data:image/webp;base64,AAAA'), 'data:image/webp;base64,AAAA');
  assert.equal(safeImage('data:text/html;base64,AAAA'), '');
  // CSS values can't break out of the style attribute.
  assert.ok(!renderCard(base('etsy', { accent: '#fff";onclick="x' })).includes('onclick'));
});

test('defaults fill in the business name and mark the platform word', () => {
  const d = defaults('etsy', 'TZ GEMS');
  assert.equal(d.headline, 'Shop TZ GEMS on *Etsy*.');
  assert.equal(d.badge, 'Official TZ GEMS shop');
});

test('themes and contrast', () => {
  assert.equal(textOn('#FFD814'), '#111111');
  assert.equal(textOn('#0866FF'), '#ffffff');
  assert.equal(resolveTheme({ platform: 'tiktok', theme: 'brand' }).dark, true);
  // TikTok's white logo turns black on a light theme so it stays visible.
  assert.equal(resolveTheme({ platform: 'tiktok', theme: 'light' }).logoColor, '#000000');
  const t = resolveTheme({ platform: 'etsy', theme: 'brand', accent: '#123456' });
  assert.equal(t.button, '#123456');
  assert.equal(t.buttonText, '#ffffff');
});

test('embed code is self-contained', () => {
  const code = embedCode(base('instagram'));
  assert.match(code, /^<!--[^]*<style>[^]*\.ksc[^]*<\/style>/);
  assert.ok(!/https?:\/\/(?!example\.com|www\.w3)/.test(code.replace(/simpleicons\.org/g, '')), 'no external resources');
});
