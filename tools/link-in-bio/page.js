// Link in Bio page renderer. Pure functions: state in, HTML out, so the live preview and the
// downloaded file are the same markup. The downloaded page needs no JavaScript and makes no
// requests: styles are inline and pictures are data: URLs.
import { LOGOS } from '../shop-card-maker/logos.js';
import { PLATFORMS, PLATFORM_ORDER } from '../shop-card-maker/platforms.js';
import { esc, safeUrl, safeImage, buildUrl } from '../shop-card-maker/card.js';

export { PLATFORMS, PLATFORM_ORDER, esc, safeUrl };

// Preset looks. Values are fixed CSS written here, never user input; custom colours are hex only.
export const THEMES = {
  light: { name: 'Clean', bg: '#f6f6f7', text: '#18181b', muted: '#5f5f69', button: '#ffffff', buttonText: '#18181b', border: '#e4e4e7', shadow: '0 1px 2px rgba(0,0,0,.04),0 6px 18px -8px rgba(0,0,0,.12)' },
  dark: { name: 'Night', bg: 'radial-gradient(120% 80% at 50% 0%, #26262d 0%, #121215 70%)', text: '#f4f4f5', muted: '#a8a8b3', button: '#1f1f24', buttonText: '#f4f4f5', border: '#34343c', shadow: '0 8px 24px -12px rgba(0,0,0,.6)' },
  klickode: { name: 'Klickode red', bg: 'linear-gradient(180deg, #fff5f5 0%, #ffffff 55%)', text: '#18181b', muted: '#5f5f69', button: '#e03131', buttonText: '#ffffff', border: '#e03131', shadow: '0 10px 22px -12px rgba(224,49,49,.55)' },
  pastel: { name: 'Pastel', bg: 'linear-gradient(160deg, #fde2f3 0%, #e4ecff 50%, #dff7ef 100%)', text: '#2b2540', muted: '#5d5675', button: 'rgba(255,255,255,.72)', buttonText: '#2b2540', border: 'rgba(255,255,255,.9)', shadow: '0 8px 20px -12px rgba(80,60,140,.35)' },
  sunset: { name: 'Sunset', bg: 'linear-gradient(165deg, #ff8a5b 0%, #f2547d 48%, #7b3fbf 100%)', text: '#ffffff', muted: 'rgba(255,255,255,.82)', button: 'rgba(255,255,255,.16)', buttonText: '#ffffff', border: 'rgba(255,255,255,.45)', shadow: '0 10px 24px -14px rgba(40,0,60,.6)' },
  gold: { name: 'Thai gold', bg: 'radial-gradient(130% 90% at 50% 0%, #3a1d14 0%, #1c0f0b 75%)', text: '#f7e7c1', muted: '#d2b98a', button: 'linear-gradient(180deg, #e9c46a 0%, #c8962e 100%)', buttonText: '#2a160e', border: '#e9c46a', shadow: '0 10px 24px -14px rgba(233,196,106,.55)' },
};
export const THEME_ORDER = ['light', 'dark', 'klickode', 'pastel', 'sunset', 'gold'];

// System font stacks only, so the page never has to download a font.
export const FONTS = {
  sans: { name: 'Clean', css: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans Thai', 'Leelawadee UI', Tahoma, Helvetica, Arial, sans-serif" },
  serif: { name: 'Elegant', css: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Noto Serif Thai', 'Times New Roman', serif" },
  rounded: { name: 'Friendly', css: "ui-rounded, 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Quicksand, Comfortaa, 'Arial Rounded MT Bold', 'Noto Sans Thai', system-ui, sans-serif" },
  mono: { name: 'Techy', css: "ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" },
};

const RADIUS = { rounded: '14px', pill: '999px', square: '4px' };
const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v || '');

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
const readableOn = (hex) => (luminance(hex) > 0.4 ? '#111111' : '#ffffff');

/** The theme with any custom colours applied. Custom colours must be #rrggbb. */
export function resolveTheme(state) {
  const t = { ...(THEMES[state.theme] || THEMES.light) };
  const c = state.colors || {};
  if (isHex(c.bg)) {
    t.bg = c.bg;
    // Keep text readable when only the background was changed.
    if (!isHex(c.text)) {
      t.text = readableOn(c.bg);
      t.muted = t.text === '#ffffff' ? 'rgba(255,255,255,.78)' : 'rgba(17,17,17,.68)';
    }
  }
  if (isHex(c.button)) {
    t.button = c.button;
    t.border = c.button;
    t.buttonText = isHex(c.buttonText) ? c.buttonText : readableOn(c.button);
  } else if (isHex(c.buttonText)) t.buttonText = c.buttonText;
  if (isHex(c.text)) {
    t.text = c.text;
    t.muted = c.text;
  }
  return t;
}

/** Where a link points, or '' if it doesn't point anywhere safe yet. */
export function linkUrl(link) {
  if (!link) return '';
  const raw = link.type === 'platform' && PLATFORMS[link.platform] ? buildUrl(link.platform, link.handle) : link.url;
  // Bare domains are common ("myshop.com"); assume https.
  const fixed = /^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(String(raw || '').trim()) ? `https://${String(raw).trim()}` : raw;
  const u = safeUrl(fixed);
  return u === '#' ? '' : u;
}

export function linkTitle(link) {
  if (link.title && String(link.title).trim()) return String(link.title).trim();
  const p = link.type === 'platform' && PLATFORMS[link.platform];
  if (p) {
    const text = p.copy.button.replace(/\{name\}/g, '').replace(/\s+/g, ' ').trim();
    // "Add us as a friend" needs to say where.
    return text.toLowerCase().includes(p.name.toLowerCase()) ? text : `${text} on ${p.name}`;
  }
  return link.url ? String(link.url).replace(/^https?:\/\//, '').replace(/\/$/, '') : 'My link';
}

// Brand colour behind a platform logo, for the round icon on each button.
function brandBg(p) {
  if (p.chip) return p.chip.bg;
  if (p.theme.logoGradient) return `linear-gradient(45deg, ${p.theme.logoGradient.join(', ')})`;
  const c = p.theme.logoColor || p.theme.accent;
  return /^#fff(fff)?$/i.test(c) ? '#000000' : c;
}

/** The small icon at the start of a button: a brand logo, or a link symbol for custom links. */
export function linkIcon(link, style = 'brand', color = 'currentColor') {
  const p = link.type === 'platform' ? PLATFORMS[link.platform] : null;
  if (!p) {
    return `<span class="kb-ico kb-ico-plain" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg></span>`;
  }
  const brand = style === 'brand';
  const fill = brand ? (p.chip ? p.chip.color : '#ffffff') : color;
  const inner = p.logo
    ? `<svg viewBox="0 0 24 24" width="${p.wideLogo ? 26 : 18}" height="${p.wideLogo ? 26 : 18}"><path fill="${fill}" d="${LOGOS[p.logo]}"/></svg>`
    : `<b style="color:${fill}">${esc(p.chip?.letter || p.name[0])}</b>`;
  return `<span class="kb-ico${brand ? '' : ' kb-ico-plain'}" aria-hidden="true"${brand ? ` style="background:${brandBg(p)}"` : ''}>${inner}</span>`;
}

const initials = (name) =>
  String(name || '?')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => [...w][0].toUpperCase())
    .join('') || '?';

// --- styles --------------------------------------------------------------------------------

export function pageCss(state) {
  const t = resolveTheme(state);
  const font = (FONTS[state.font] || FONTS.sans).css;
  const r = RADIUS[state.shape] || RADIUS.rounded;
  const vars = { bg: t.bg, text: t.text, muted: t.muted, btn: t.button, 'btn-text': t.buttonText, border: t.border, shadow: t.shadow || 'none', r, font };
  // Everything here is a preset or a validated hex colour, but strip anything that could end the rule anyway.
  const v = Object.entries(vars)
    .map(([k, val]) => `--kb-${k}:${String(val).replace(/[;{}<>\\]/g, '')}`)
    .join(';');
  return `.kb{${v};box-sizing:border-box;min-height:100%;margin:0;padding:48px 20px 32px;background:var(--kb-bg);color:var(--kb-text);font-family:var(--kb-font);line-height:1.45;-webkit-font-smoothing:antialiased;display:flex;flex-direction:column;align-items:center}
.kb *{box-sizing:border-box;margin:0;padding:0}
.kb-wrap{width:100%;max-width:520px;display:flex;flex-direction:column;align-items:center;text-align:center;flex:1}
.kb-avatar{width:96px;height:96px;border-radius:50%;object-fit:cover;display:block;box-shadow:0 0 0 4px color-mix(in srgb,var(--kb-text) 10%,transparent),0 10px 30px -12px rgba(0,0,0,.35)}
.kb-initials{display:grid;place-items:center;font-size:34px;font-weight:700;letter-spacing:-.02em;background:var(--kb-btn);color:var(--kb-btn-text)}
.kb-name{margin-top:16px;font-size:22px;font-weight:700;letter-spacing:-.01em;overflow-wrap:anywhere}
.kb-bio{margin-top:8px;max-width:400px;font-size:15px;color:var(--kb-muted);white-space:pre-line;overflow-wrap:anywhere}
.kb-links{list-style:none;width:100%;margin-top:28px;display:flex;flex-direction:column;gap:12px}
.kb-link{position:relative;display:flex;align-items:center;justify-content:center;min-height:56px;padding:10px 52px;border-radius:var(--kb-r);background:var(--kb-btn);color:var(--kb-btn-text);border:1.5px solid var(--kb-border);box-shadow:var(--kb-shadow);text-decoration:none;font-size:15.5px;font-weight:600;overflow-wrap:anywhere;transition:transform .15s ease,box-shadow .15s ease;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.kb-link:hover{transform:translateY(-2px)}
.kb-link:focus-visible{outline:3px solid var(--kb-text);outline-offset:3px}
.kb-link.kb-off{opacity:.45;border-style:dashed}
.kb-ico{position:absolute;left:9px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:calc(var(--kb-r) * .7);display:grid;place-items:center;overflow:hidden}
.kb-ico b{font-size:17px;line-height:1}
.kb-ico svg{display:block}
.kb-ico-plain{background:transparent}
.kb-foot{margin-top:40px;font-size:12px;color:var(--kb-muted)}
.kb-foot a{color:inherit;text-decoration:none;opacity:.85}
.kb-foot a:hover{text-decoration:underline}
@media (prefers-reduced-motion:reduce){.kb-link{transition:none}.kb-link:hover{transform:none}}`;
}

// --- markup ---------------------------------------------------------------------------------

/**
 * The page body (inside <main class="kb">).
 * @param {object} state
 * @param {{ preview?: boolean, creditUrl?: string }} [opts] preview keeps links that don't work yet, dimmed
 */
export function pageBody(state, { preview = false, creditUrl = '' } = {}) {
  const t = resolveTheme(state);
  const avatar = safeImage(state.avatar);
  const links = (state.links || [])
    .map((l) => ({ l, url: linkUrl(l) }))
    .filter(({ url }) => url || preview)
    .map(({ l, url }) => {
      const icon = state.icons === 'none' ? '' : linkIcon(l, state.icons === 'mono' ? 'mono' : 'brand', t.buttonText.startsWith('#') ? t.buttonText : 'currentColor');
      const pad = icon ? '' : ' style="padding:10px 20px"';
      return url
        ? `<li><a class="kb-link" href="${esc(url)}" target="_blank" rel="noopener"${pad}>${icon}<span>${esc(linkTitle(l))}</span></a></li>`
        : `<li><span class="kb-link kb-off" title="Add a link so this button goes somewhere"${pad}>${icon}<span>${esc(linkTitle(l))}</span></span></li>`;
    })
    .join('');
  const credit = state.credit !== false && safeUrl(creditUrl) !== '#' ? `<p class="kb-foot"><a href="${esc(safeUrl(creditUrl))}" target="_blank" rel="noopener">Made with Klickode Tools</a></p>` : '';
  return `<div class="kb-wrap">
${avatar ? `<img class="kb-avatar" src="${esc(avatar)}" alt="${esc(state.name || '')}" width="96" height="96">` : `<div class="kb-avatar kb-initials" aria-hidden="true">${esc(initials(state.name))}</div>`}
<h1 class="kb-name">${esc(state.name || 'Your name')}</h1>
${state.bio ? `<p class="kb-bio">${esc(state.bio)}</p>` : ''}
${links ? `<ul class="kb-links">${links}</ul>` : ''}
${credit}
</div>`;
}

/** The complete, self-contained page to download. */
export function renderPage(state, { creditUrl = '' } = {}) {
  const meta = state.meta || {};
  const title = String(meta.title || state.name || 'My links').trim();
  const description = String(meta.description || state.bio || '').trim().replace(/\s+/g, ' ').slice(0, 300);
  const ogImage = safeUrl(meta.image);
  const pageUrl = safeUrl(meta.url);
  const avatar = safeImage(state.avatar);
  const thai = /[฀-๿]/.test(`${state.name} ${state.bio}`);
  const t = resolveTheme(state);
  // A solid colour for the browser's address bar, taken from the theme.
  const themeColor = isHex(t.bg) ? t.bg : (/#[0-9a-f]{6}/i.exec(t.bg) || ['#ffffff'])[0];
  const tags = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${esc(title)}</title>`,
    description && `<meta name="description" content="${esc(description)}">`,
    `<meta name="theme-color" content="${themeColor}">`,
    '<meta property="og:type" content="profile">',
    `<meta property="og:title" content="${esc(title)}">`,
    description && `<meta property="og:description" content="${esc(description)}">`,
    ogImage !== '#' && /^https?:/.test(ogImage) && `<meta property="og:image" content="${esc(ogImage)}">`,
    pageUrl !== '#' && /^https?:/.test(pageUrl) && `<meta property="og:url" content="${esc(pageUrl)}">`,
    pageUrl !== '#' && /^https?:/.test(pageUrl) && `<link rel="canonical" href="${esc(pageUrl)}">`,
    `<meta name="twitter:card" content="${ogImage !== '#' && /^https?:/.test(ogImage) ? 'summary_large_image' : 'summary'}">`,
    avatar.startsWith('data:') && `<link rel="icon" href="${esc(avatar)}">`,
  ].filter(Boolean);
  return `<!doctype html>
<html lang="${thai ? 'th' : 'en'}">
<head>
${tags.join('\n')}
<style>html,body{margin:0;height:100%}body{background:${themeColor}}
${pageCss(state)}</style>
</head>
<body>
<main class="kb">
${pageBody(state, { creditUrl })}
</main>
</body>
</html>
`;
}
