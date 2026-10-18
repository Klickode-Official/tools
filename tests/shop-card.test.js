import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderCard, embedCode, cardCss, CARD_CSS, defaults, buildUrl, safeUrl, safeImage, resolveTheme, textOn, contrast, qrSvg, qrReadable, QR_DEFAULT_COLOR } from '../tools/shop-card-maker/card.js';
import { LOOKS, LOOK_ORDER, LOOK_CSS, SEASONS, SEASON_ORDER, SEASON_CSS, QR_CSS, seasonDeco } from '../tools/shop-card-maker/looks.js';
import { encodeQr, qrToSvg } from '../assets/js/lib/qr.js';
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

// Every rule in the card's CSS must be scoped to .ksc so it can't restyle the host page.
function assertScoped(css, label) {
  const body = css.replace(/@media[^{]+\{/g, '').replace(/\{[^}]*\}/g, '\n');
  for (const sel of body.split('\n').flatMap((l) => l.split(',')).map((x) => x.trim()).filter((x) => x && x !== '}')) {
    assert.match(sel, /^(a)?\.ksc/, `${label}: unscoped selector "${sel}"`);
  }
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length, `${label}: unbalanced braces`);
}

test('looks and seasons add only scoped CSS', () => {
  assertScoped(CARD_CSS, 'all');
  for (const id of Object.keys(LOOK_CSS)) assertScoped(LOOK_CSS[id], id);
  assertScoped(SEASON_CSS, 'season');
  assertScoped(QR_CSS, 'qr');
  for (const id of LOOK_ORDER) assert.ok(LOOKS[id].settings && typeof LOOKS[id].settings.radius === 'number', id);
});

test('every look and season renders for every layout, with the brand button kept', () => {
  for (const look of LOOK_ORDER) {
    for (const season of SEASON_ORDER) {
      for (const layout of ['banner', 'card', 'button']) {
        const state = base('etsy', { layout, look, season, qr: true });
        const html = renderCard(state);
        assert.match(html, /href="https:\/\/example\.com\/shop"/, `${look} ${season} ${layout}`);
        if (look !== 'classic') assert.ok(html.includes(`ksc-k-${look}`), `${look} class`);
        assert.ok(!/<script|on\w+=/i.test(html), `${look} ${season} ${layout} has no scripts or handlers`);
        // The platform's own button colour survives the season.
        assert.ok(html.includes('--ksc-btn:#C2410C'), `${season} keeps Etsy's button`);
      }
    }
  }
  // The season's own colours and sticker are applied.
  const html = renderCard(base('etsy', { season: 'blackfriday' }));
  assert.ok(html.includes('ksc-seasonal') && html.includes('ksc-deco') && html.includes('BLACK FRIDAY'));
  assert.equal(resolveTheme(base('tiktok', { season: 'songkran' })).logoColor, '#000000', 'white TikTok logo flips on a light season');
  assert.equal(seasonDeco('none'), '');
});

test('the season sticker is the user’s text, escaped', () => {
  const html = renderCard(base('etsy', { season: '1111', seasonBadge: '<img src=x onerror=alert(1)>' }));
  assert.ok(!html.includes('<img src=x') && html.includes('&lt;img src=x'));
  assert.ok(!renderCard(base('etsy', { season: '1111', seasonBadge: '' })).includes('class="ksc-tag"'), 'empty sticker is left out');
  assert.ok(!renderCard(base('etsy', { season: 'nope' })).includes('ksc-seasonal'), 'unknown season is ignored');
});

test('QR code appears only when switched on, and encodes the shop link', () => {
  const url = 'https://example.com/shop';
  const path = (svg) => /<path fill="[^"]+"(?: style="[^"]*")? d="([^"]+)"/.exec(svg)[1];
  const expected = path(qrToSvg(encodeQr(url, { ecl: 'M' }), { margin: 4 }));
  assert.equal(path(qrSvg(url)), expected);
  assert.ok(!renderCard(base('etsy')).includes('aria-label="QR code"'));
  for (const [layout, qrPos] of [['banner', 'cta'], ['banner', 'card'], ['card', 'cta']]) {
    const html = renderCard(base('etsy', { layout, qr: true, qrPos }));
    assert.ok(html.includes(`d="${expected}"`), `${layout}/${qrPos}`);
    assert.equal(html.includes('ksc-card-foot'), layout === 'card' || qrPos === 'card', `${layout}/${qrPos} position`);
  }
  assert.ok(!renderCard(base('etsy', { layout: 'button', qr: true })).includes('QR code'), 'no QR on a button');
  assert.ok(!renderCard(base('etsy', { qr: true, url: 'javascript:alert(1)' })).includes('QR code'), 'no QR for an unsafe link');
  assert.ok(embedCode(base('etsy', { qr: true })).includes('.ksc .ksc-qr'), 'QR styles ship with the code');
  assert.ok(!embedCode(base('etsy')).includes('.ksc .ksc-qr'), 'and only when used');
});

test('QR colours must stay dark enough to scan', () => {
  assert.ok(contrast('#000000', '#ffffff') > 20);
  assert.equal(qrReadable('#ffcc99'), false);
  assert.equal(qrReadable('#C2410C'), true);
  const pale = renderCard(base('etsy', { qr: true, qrColor: '#ffcc99' }));
  assert.ok(pale.includes(`fill="${QR_DEFAULT_COLOR}"`) && !pale.includes('fill="#ffcc99"'), 'pale colour falls back to black');
  const hostile = renderCard(base('etsy', { qr: true, qrColor: '#000" onload="x', qrCaption: '<b onclick=x>hi</b>' }));
  assert.ok(!hostile.includes('onload') && !hostile.includes('<b onclick'));
});

test('embed code carries only the CSS the card uses', () => {
  const plain = cardCss(base('etsy'));
  const fancy = cardCss(base('etsy', { look: 'luxury', season: 'cny', qr: true }));
  assert.ok(!plain.includes('ksc-k-') && !plain.includes('ksc-deco'));
  assert.ok(fancy.includes('ksc-k-luxury') && !fancy.includes('ksc-k-bold') && fancy.includes('ksc-deco') && fancy.includes('ksc-qr'));
  const code = embedCode(base('etsy', { look: 'festival', season: 'loykrathong', qr: true }));
  assert.ok(!/<script/i.test(code));
  assert.ok(!/https?:\/\/(?!example\.com|www\.w3)/.test(code), 'no external resources');
});
