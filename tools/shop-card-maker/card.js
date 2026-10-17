// Shop Card Maker renderer. Pure functions: state in, HTML/CSS strings out, so the live
// preview, the copy-paste code and the PNG export are all the same markup.
import { LOGOS } from './logos.js';
import { PLATFORMS } from './platforms.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Only allow links a visitor can safely follow. Anything else (javascript:, data:) becomes "#".
export function safeUrl(url) {
  const u = String(url ?? '').trim();
  if (!u) return '#';
  try {
    const parsed = new URL(u);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? parsed.href : '#';
  } catch {
    return '#';
  }
}

// Images must be our own data: URLs (from uploads) or plain http(s) links.
export const safeImage = (src) => (/^data:image\/(png|jpe?g|webp|gif|avif);base64,[A-Za-z0-9+/=]+$/.test(src || '') ? src : safeUrl(src) === '#' ? '' : safeUrl(src));

// **bold** in body text; everything else escaped.
export const richText = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

// *word* in the headline gets the accent colour.
export const headlineHtml = (s) => esc(s).replace(/\*(.+?)\*/g, '<span class="ksc-hl">$1</span>');

export function shortUrl(url) {
  try {
    const u = new URL(url);
    return (u.host.replace(/^www\./, '') + u.pathname.replace(/\/$/, '')).slice(0, 60);
  } catch {
    return '';
  }
}

const fill = (s, name) => String(s).replaceAll('{name}', name || 'Your Shop');

export function defaults(platformId, name = 'Your Shop') {
  const p = PLATFORMS[platformId];
  const c = p.copy;
  return {
    platform: platformId,
    name,
    badge: fill(c.badge, name),
    // Mark the platform's name so it picks up the accent colour.
    headline: fill(c.headline, name).replace(p.name, `*${p.name}*`),
    text: fill(c.text, name),
    bullets: fill(c.bullets, name),
    button: fill(c.button, name),
    cardLabel: c.cardLabel,
    cardButton: c.cardButton,
    stats: c.stats.map((s) => [...s]),
  };
}

export function buildUrl(platformId, handle, message) {
  const h = String(handle ?? '').trim();
  if (!h) return '';
  if (/^https?:\/\//i.test(h)) return h;
  return PLATFORMS[platformId].handle.url(h, message);
}

// --- colours -------------------------------------------------------------------

function luminance(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

// Black or white text, whichever reads better on the given colour.
export const textOn = (hex) => ((luminance(hex) ?? 0) > 0.4 ? '#111111' : '#ffffff');

const NEUTRAL = {
  light: { bg: '#ffffff', surface: '#ffffff', text: '#18181b', muted: '#5f5f69', border: '#e4e4e7', cardButton: '#18181b', cardButtonText: '#ffffff' },
  dark: { bg: '#141417', surface: '#1e1e22', text: '#f4f4f5', muted: '#a8a8b3', border: '#2e2e34', cardButton: '#f4f4f5', cardButtonText: '#141417' },
};

export function resolveTheme(state) {
  const p = PLATFORMS[state.platform];
  const t = { ...p.theme };
  if (state.theme === 'light' || state.theme === 'dark') {
    Object.assign(t, NEUTRAL[state.theme], { dark: state.theme === 'dark' });
    if (p.theme.dark && state.theme === 'light') Object.assign(t, { accent: '#FE2C55', button: '#000000', buttonText: '#ffffff' });
  }
  // Logos that are near-white or near-black need flipping to stay visible.
  let logo = p.theme.logoColor || t.accent;
  const lum = luminance(logo);
  if (lum !== null && !t.dark && lum > 0.85) logo = '#000000';
  if (lum !== null && t.dark && lum < 0.03) logo = '#ffffff';
  t.logoColor = logo;
  if (t.dark && state.theme === 'dark' && luminance(t.accent) !== null && luminance(t.accent) < 0.12) t.accent = p.theme.logoColor || '#ffffff';
  // Custom colours come from colour pickers; accept plain hex only.
  const hex = (v) => /^#[0-9a-f]{6}$/i.test(v || '');
  if (hex(state.accent)) {
    t.accent = state.accent;
    t.button = state.accent;
    t.buttonText = textOn(state.accent);
  }
  if (hex(state.background)) t.bg = state.background;
  return t;
}

const FONTS = {
  sans: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  serif: "'Cormorant Garamond', 'Playfair Display', Georgia, 'Times New Roman', serif",
  rounded: "ui-rounded, 'SF Pro Rounded', Nunito, 'Varela Round', Inter, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
};

function cssVars(state, t) {
  const vars = {
    '--ksc-accent': t.accent,
    '--ksc-btn': t.button,
    '--ksc-btn-text': t.buttonText,
    '--ksc-bg': t.bg,
    '--ksc-surface': t.surface,
    '--ksc-text': t.text,
    '--ksc-muted': t.muted,
    '--ksc-border': t.border,
    '--ksc-card-btn': t.cardButton,
    '--ksc-card-btn-text': t.cardButtonText,
    '--ksc-r': `${Number(state.radius ?? 20)}px`,
    '--ksc-font': FONTS.sans,
    '--ksc-head-font': FONTS[state.headingFont] || FONTS.sans,
  };
  return Object.entries(vars)
    .map(([k, v]) => `${k}:${String(v).replace(/[;"<>{}]/g, '')}`)
    .join(';');
}

// --- logos ----------------------------------------------------------------------

let gradientCounter = 0;

// `mono` draws the logo in one flat colour (for logos sitting on a coloured button).
export function logoHtml(state, t, size = 20, mono = null) {
  const p = PLATFORMS[state.platform];
  if (state.customLogo) {
    const src = safeImage(state.customLogo);
    if (src) return `<img class="ksc-logo-img" src="${esc(src)}" alt="" width="${size}" height="${size}" style="width:${size}px;height:${size}px">`;
  }
  if (!p.logo) {
    // No licensed logo available: the platform name, set in its colours.
    const color = mono || (t.dark ? '#ffffff' : null);
    return `<span class="ksc-wordmark" style="${p.wordmark.style}${color ? `;color:${color}` : ''};font-size:${Math.round(size * 0.95)}px">${esc(p.wordmark.text)}</span>`;
  }
  const d = LOGOS[p.logo];
  // Wordmark logos (eBay) are wide and short inside their 24×24 box, so draw them bigger.
  const box = p.wideLogo ? Math.round(size * 1.9) : size;
  const open = `<svg class="ksc-logo" viewBox="0 0 24 24" width="${box}" height="${box}" aria-hidden="true" focusable="false" style="margin:-${(box - size) / 2}px 0">`;
  if (mono) return `${open}<path fill="${mono}" d="${d}"/></svg>`;
  if (p.theme.glitch) {
    // TikTok's cyan/red offset look.
    return `${open}<path fill="#25F4EE" transform="translate(-0.9 -0.7)" d="${d}"/><path fill="#FE2C55" transform="translate(0.9 0.7)" d="${d}"/><path fill="${t.logoColor}" d="${d}"/></svg>`;
  }
  if (p.theme.logoGradient) {
    const id = `ksc-g${++gradientCounter}`;
    const stops = p.theme.logoGradient.map((c, i, a) => `<stop offset="${Math.round((i / (a.length - 1)) * 100)}%" stop-color="${c}"/>`).join('');
    return `${open}<defs><linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0">${stops}</linearGradient></defs><path fill="url(#${id})" d="${d}"/></svg>`;
  }
  return `${open}<path fill="${t.logoColor}" d="${d}"/></svg>`;
}

const ICONS = {
  check: '<svg class="ksc-ico" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrow: '<svg class="ksc-ico" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  image: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="9" r="1.6" fill="currentColor"/><path d="m21 15-5-5L5 21" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
};

function stars(rating) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.round(r);
  return `<span class="ksc-stars" aria-label="${r} out of 5">${'★'.repeat(full)}<span class="ksc-stars-off">${'★'.repeat(5 - full)}</span></span>`;
}

const initials = (name) =>
  esc(
    String(name || '?')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join(''),
  );

// --- markup -------------------------------------------------------------------------

function cardHtml(state, t, url) {
  const p = PLATFORMS[state.platform];
  const show = state.show || {};
  const avatar = safeImage(state.avatar);
  const products = (state.products || []).map(safeImage).filter(Boolean);
  const slots = Math.max(0, Math.min(4, Number(state.productCount ?? 4)));
  // Platforms shown as a text label already spell out their name.
  const brandName = (p.logo && !p.wideLogo) || state.customLogo ? `<span class="ksc-brand-name">${esc(p.name)}</span>` : '';
  const stats = (state.stats || []).filter(([v, l]) => String(v).trim() || String(l).trim());
  return `<div class="ksc-card">
    <div class="ksc-card-head"><span class="ksc-brand">${logoHtml(state, t, 26)}${brandName}</span>${state.cardLabel ? `<span class="ksc-label">${esc(state.cardLabel)}</span>` : ''}</div>
    <div class="ksc-profile">
      ${avatar ? `<img class="ksc-avatar" src="${esc(avatar)}" alt="">` : `<span class="ksc-avatar ksc-avatar-text">${initials(state.shopName || state.name)}</span>`}
      <div class="ksc-who">
        <strong class="ksc-shop">${esc(state.shopName || state.name)}</strong>
        ${state.location ? `<span class="ksc-sub">${esc(state.location)}</span>` : ''}
        ${show.rating !== false && state.rating ? `<span class="ksc-rating">${stars(state.rating)} <b>${esc(state.rating)}</b>${state.reviews ? ` <span class="ksc-sub">(${esc(state.reviews)})</span>` : ''}</span>` : ''}
      </div>
    </div>
    ${show.stats !== false && stats.length ? `<div class="ksc-stats">${stats.map(([v, l]) => `<span><b>${esc(v)}</b> ${esc(l)}</span>`).join('')}</div>` : ''}
    ${
      show.products !== false && slots
        ? `<div class="ksc-products" style="grid-template-columns:repeat(${slots},1fr)">${Array.from({ length: slots }, (_, i) =>
            products[i] ? `<img src="${esc(products[i])}" alt="">` : `<span class="ksc-ph">${ICONS.image}</span>`,
          ).join('')}</div>`
        : ''
    }
    <a class="ksc-card-btn" href="${esc(url)}" target="_blank" rel="noopener">${esc(state.cardButton || 'Visit')} ${ICONS.arrow}</a>
  </div>`;
}

export function renderCard(state, { forExport = false } = {}) {
  const t = resolveTheme(state);
  const url = safeUrl(state.url);
  const show = state.show || {};
  const layout = state.layout || 'banner';
  const style = cssVars(state, t);
  const cls = `ksc ksc-l-${layout}${t.dark ? ' ksc-dark' : ''}${state.shadow === false ? ' ksc-flat' : ''}${forExport && layout === 'banner' && state.stack ? ' ksc-stack' : ''}`;

  if (layout === 'button') {
    return `<a class="${cls}" style="${style}" href="${esc(url)}" target="_blank" rel="noopener"><span class="ksc-pill-logo">${logoHtml(state, t, 20, t.buttonText)}</span>${esc(state.button)} ${ICONS.arrow}</a>`;
  }
  if (layout === 'card') {
    return `<div class="${cls}" style="${style}">${cardHtml(state, t, url)}</div>`;
  }
  const bullets = String(state.bullets || '')
    .split('\n')
    .map((b) => b.trim())
    .filter(Boolean);
  const note = show.note !== false && url !== '#' ? `<p class="ksc-note">Opens ${esc(shortUrl(url))} in a new tab</p>` : '';
  return `<div class="${cls}" style="${style}">
  <div class="ksc-main">
    ${show.badge !== false && state.badge ? `<span class="ksc-badge">${logoHtml(state, t, 16)}<span>${esc(state.badge)}</span></span>` : ''}
    <h2 class="ksc-title">${headlineHtml(state.headline)}</h2>
    ${state.text ? `<p class="ksc-text">${richText(state.text)}</p>` : ''}
    ${show.bullets !== false && bullets.length ? `<ul class="ksc-list">${bullets.map((b) => `<li>${ICONS.check}<span>${richText(b)}</span></li>`).join('')}</ul>` : ''}
    <a class="ksc-btn" href="${esc(url)}" target="_blank" rel="noopener">${esc(state.button)} ${ICONS.arrow}</a>
    ${note}
  </div>
  ${show.card !== false ? `<div class="ksc-side">${cardHtml(state, t, url)}</div>` : ''}
</div>`;
}

// Scoped styles. Every selector starts with .ksc so it won't touch the host site,
// and properties are set explicitly so the host site's own CSS doesn't leak in.
export const CARD_CSS = `.ksc,.ksc *{box-sizing:border-box;margin:0;padding:0;line-height:inherit;font-family:inherit}
.ksc{font-family:var(--ksc-font);color:var(--ksc-text);line-height:1.5;-webkit-font-smoothing:antialiased;text-align:left}
.ksc img{display:block;max-width:none;border:0;box-shadow:none;height:auto}
.ksc a,.ksc a:hover,a.ksc,a.ksc:hover{text-decoration:none;border-bottom:0}
.ksc h2,.ksc p,.ksc ul,.ksc li{text-transform:none;font-style:normal;letter-spacing:normal;text-shadow:none;border:0;background:none}
.ksc h2::before,.ksc h2::after,.ksc li::before,.ksc li::after,.ksc p::before,.ksc p::after{content:none;display:none}
.ksc li::marker{content:none}
.ksc .ksc-ico{flex:none;display:inline-block;vertical-align:middle}
.ksc.ksc-l-banner{display:flex;flex-wrap:wrap;align-items:center;gap:40px;padding:clamp(24px,5vw,56px);background:var(--ksc-bg);border:1px solid var(--ksc-border);border-radius:var(--ksc-r)}
.ksc .ksc-main{flex:1 1 320px;min-width:0}
.ksc .ksc-side{flex:0 1 440px;min-width:280px;width:100%}
.ksc.ksc-stack{flex-direction:column;align-items:stretch}
.ksc.ksc-stack .ksc-side{flex:none;width:100%;min-width:0}
.ksc.ksc-stack .ksc-card{max-width:none}
.ksc .ksc-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px 6px 10px;border:1px solid var(--ksc-border);border-radius:999px;background:var(--ksc-surface);font-size:13px;font-weight:600;color:var(--ksc-text);margin-bottom:18px}
.ksc .ksc-title{display:block;font-family:var(--ksc-head-font);font-size:clamp(28px,4vw,46px);line-height:1.08;font-weight:600;letter-spacing:-0.02em;color:var(--ksc-text);margin:0 0 14px}
.ksc .ksc-hl{color:var(--ksc-accent)}
.ksc .ksc-text{font-size:16px;color:var(--ksc-muted);max-width:52ch;margin:0 0 18px}
.ksc .ksc-text strong{color:var(--ksc-text);font-weight:700}
.ksc .ksc-list{list-style:none;margin:0 0 26px;display:grid;gap:10px}
.ksc .ksc-list li{display:flex;align-items:center;gap:10px;font-size:15px;color:var(--ksc-text)}
.ksc .ksc-list .ksc-ico{color:var(--ksc-accent)}
.ksc .ksc-btn,.ksc.ksc-l-button{display:inline-flex;align-items:center;gap:10px;padding:14px 22px;border-radius:calc(var(--ksc-r) * 0.45);background:var(--ksc-btn);color:var(--ksc-btn-text);font-size:15px;font-weight:600;line-height:1.2;box-shadow:0 8px 20px -10px rgba(0,0,0,.45);transition:transform .15s,filter .15s}
.ksc .ksc-btn:hover,.ksc .ksc-card-btn:hover,.ksc.ksc-l-button:hover{filter:brightness(1.07);transform:translateY(-1px)}
.ksc .ksc-note{font-size:12.5px;color:var(--ksc-muted);margin-top:10px}
.ksc .ksc-card{background:var(--ksc-surface);border:1px solid var(--ksc-border);border-radius:var(--ksc-r);padding:24px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 24px 48px -24px rgba(0,0,0,.25)}
.ksc.ksc-flat .ksc-card,.ksc.ksc-flat .ksc-btn,.ksc.ksc-flat.ksc-l-button{box-shadow:none}
.ksc .ksc-card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:16px;margin-bottom:18px;border-bottom:1px solid var(--ksc-border)}
.ksc .ksc-brand{display:inline-flex;align-items:center;gap:9px;font-weight:700;font-size:19px;letter-spacing:-0.01em;color:var(--ksc-text)}
.ksc .ksc-label{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ksc-muted)}
.ksc .ksc-wordmark{display:inline-block;line-height:1;font-family:Inter,system-ui,sans-serif}
.ksc .ksc-logo-img{border-radius:6px;object-fit:contain}
.ksc .ksc-profile{display:flex;align-items:center;gap:16px}
.ksc .ksc-avatar{width:72px;height:72px;flex:none;border-radius:calc(var(--ksc-r) * 0.5);border:1px solid var(--ksc-border);object-fit:cover;background:var(--ksc-surface)}
.ksc .ksc-avatar-text{display:grid;place-items:center;font-weight:700;font-size:24px;color:var(--ksc-accent);background:color-mix(in srgb,var(--ksc-accent) 12%,var(--ksc-surface))}
.ksc .ksc-who{display:flex;flex-direction:column;gap:2px;min-width:0}
.ksc .ksc-shop{font-size:19px;font-weight:700;color:var(--ksc-text);line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ksc .ksc-sub{font-size:14px;color:var(--ksc-muted)}
.ksc .ksc-rating{font-size:14px;color:var(--ksc-text);display:inline-flex;align-items:center;gap:4px}
.ksc .ksc-stars{color:#F5A524;letter-spacing:1px}
.ksc .ksc-stars-off{color:var(--ksc-border)}
.ksc .ksc-stats{display:flex;flex-wrap:wrap;gap:6px 22px;margin:18px 0;font-size:14px;color:var(--ksc-muted)}
.ksc .ksc-stats b{color:var(--ksc-text);font-weight:700}
.ksc .ksc-products{display:grid;gap:8px;margin:0 0 18px}
.ksc .ksc-products img,.ksc .ksc-ph{width:100%;aspect-ratio:1;border-radius:calc(var(--ksc-r) * 0.45);object-fit:cover}
.ksc .ksc-ph{display:grid;place-items:center;color:var(--ksc-muted);background:color-mix(in srgb,var(--ksc-text) 6%,var(--ksc-surface));border:1px dashed var(--ksc-border)}
.ksc .ksc-card-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px 18px;border-radius:999px;background:var(--ksc-card-btn);color:var(--ksc-card-btn-text);font-size:15px;font-weight:600;transition:transform .15s,filter .15s}
.ksc .ksc-card .ksc-stats:first-child,.ksc .ksc-card .ksc-products:last-child{margin-bottom:0}
.ksc .ksc-card{max-width:460px}
.ksc.ksc-l-button{font-family:var(--ksc-font);border:0}
.ksc.ksc-l-card{display:block;max-width:460px}
.ksc .ksc-pill-logo{display:inline-grid;place-items:center}
@media (max-width:520px){.ksc.ksc-l-banner{gap:28px}.ksc .ksc-card{padding:18px}.ksc .ksc-avatar{width:60px;height:60px}}`;

export function embedCode(state) {
  const html = renderCard(state).replace(/\n\s*\n/g, '\n');
  return `<!-- Shop card made with Klickode Tools. Paste it anywhere that accepts HTML. -->\n<style>\n${CARD_CSS}\n</style>\n${html}\n`;
}
