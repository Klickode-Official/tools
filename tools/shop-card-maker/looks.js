// Style templates ("looks") and seasonal themes for the Shop Card Maker.
// A look is a one-click starting point: it sets a few editable settings (corner radius,
// heading font, shadows) and adds a class with its own type and border treatment.
// A season swaps the colours and adds decorations drawn in inline SVG, so they work in the
// copy-paste code and the PNG export alike. Platform logos and buttons keep their brand colours.

export const LOOKS = {
  classic: { name: 'Classic', settings: { radius: 20, headingFont: 'sans', shadow: true } },
  minimal: { name: 'Minimal', settings: { radius: 12, headingFont: 'sans', shadow: false } },
  bold: { name: 'Bold', settings: { radius: 18, headingFont: 'sans', shadow: true } },
  luxury: { name: 'Luxury', settings: { radius: 6, headingFont: 'serif', shadow: true } },
  festival: { name: 'Festival', settings: { radius: 26, headingFont: 'rounded', shadow: true } },
};
export const LOOK_ORDER = ['classic', 'minimal', 'bold', 'luxury', 'festival'];

// --- decorations ---------------------------------------------------------------------------

const drop = (x, y, s, fill, op) =>
  `<path d="M${x} ${y}c${4 * s} ${6 * s} ${7 * s} ${10 * s} ${7 * s} ${13.5 * s}a${7 * s} ${7 * s} 0 0 1-${14 * s} 0c0-${3.5 * s} ${3 * s}-${7.5 * s} ${7 * s}-${13.5 * s}z" fill="${fill}" opacity="${op}"/>`;

const flake = (x, y, r, op) => {
  const arms = [0, 60, 120]
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      const dx = (Math.cos(rad) * r).toFixed(1);
      const dy = (Math.sin(rad) * r).toFixed(1);
      return `M${(x - dx).toFixed(1)} ${(y - dy).toFixed(1)}L${(x + +dx).toFixed(1)} ${(y + +dy).toFixed(1)}`;
    })
    .join('');
  return `<path d="${arms}" stroke="#ffffff" stroke-width="${(r / 5).toFixed(1)}" stroke-linecap="round" opacity="${op}"/>`;
};

const confetti = (pieces) =>
  pieces.map(([x, y, w, h, rot, c, op = 0.9]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) / 2}" fill="${c}" opacity="${op}" transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"/>`).join('');

const lantern = (x, y, s, uid, i) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="8" r="26" fill="url(#${uid}-glow)" opacity=".7"/><path d="M-9 -6h18l5 22h-28z" fill="#FFB547"/><path d="M-9 -6h18l1.2 5h-20.4z" fill="#FFD98A"/><path d="M-14 16h28" stroke="#E07A1F" stroke-width="2"/><circle cx="0" cy="12" r="3" fill="#FFF3C4" opacity=".9"/>${i % 2 ? '' : '<path d="M0 16v4" stroke="#FFB547" stroke-width="1.2"/>'}</g>`;

const cnyLantern = (x, len, s) =>
  `<g transform="translate(${x} 0) scale(${s})"><path d="M0 0v${len}" stroke="#FFD27A" stroke-width="1.5"/><g transform="translate(0 ${len})"><rect x="-9" y="0" width="18" height="6" rx="2" fill="#FFD27A"/><ellipse cx="0" cy="26" rx="24" ry="21" fill="#E3242B"/><path d="M-12 7c-9 10-9 28 0 38M12 7c9 10 9 28 0 38M0 5v42" stroke="#B3121F" stroke-width="1.6" fill="none"/><rect x="-9" y="45" width="18" height="6" rx="2" fill="#FFD27A"/><path d="M-3 51v16M0 51v19M3 51v16" stroke="#FFD27A" stroke-width="1.6" stroke-linecap="round"/></g></g>`;

const cloud = (x, y, s, op) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 20a10 10 0 0 1 10-10a14 14 0 0 1 26-2a10 10 0 0 1 16 8a8 8 0 0 1 0 16h-44a8 8 0 0 1-8-12zM20 22a5 5 0 1 1 8 0" fill="none" stroke="#FFD27A" stroke-width="2.4" stroke-linecap="round" opacity="${op}"/>`;

const blossom = (x, y, r, op) =>
  `<g transform="translate(${x} ${y})" opacity="${op}">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(Math.cos((a * Math.PI) / 180) * r).toFixed(1)}" cy="${(Math.sin((a * Math.PI) / 180) * r).toFixed(1)}" r="${r}" fill="#FFB3C1"/>`).join('')}<circle r="${r * 0.6}" fill="#FFD27A"/></g>`;

// Each season returns SVG pieces for named corners: tr, br, bl, tl.
const DECOS = {
  songkran: () => ({
    b: `<svg viewBox="0 0 800 70" preserveAspectRatio="none"><path d="M0 40c90-26 170 18 260-6s180-30 270-4 170 16 270-6v46H0z" fill="#38BDF8" opacity=".2"/><path d="M0 54c110-22 200 14 300-6s200-22 300-2 130 10 200-4v28H0z" fill="#0EA5E9" opacity=".24"/><path d="M0 64c120-12 240 6 380-4s260-8 420 0v10H0z" fill="#0284C7" opacity=".22"/></svg>`,
    br: `<svg viewBox="0 0 420 200" preserveAspectRatio="xMaxYMax meet">${drop(352, 54, 2.2, '#38BDF8', 0.55)}${drop(392, 100, 1.4, '#0EA5E9', 0.45)}${drop(300, 96, 1.1, '#7DD3FC', 0.6)}<circle cx="330" cy="128" r="4" fill="#7DD3FC" opacity=".7"/><circle cx="268" cy="138" r="2.6" fill="#38BDF8" opacity=".6"/><circle cx="378" cy="146" r="3" fill="#0EA5E9" opacity=".5"/></svg>`,
    tl: `<svg viewBox="0 0 200 140" preserveAspectRatio="xMinYMin meet">${drop(30, 12, 1.3, '#38BDF8', 0.4)}${drop(70, 40, 0.9, '#0EA5E9', 0.35)}<circle cx="18" cy="70" r="3" fill="#7DD3FC" opacity=".6"/><circle cx="104" cy="22" r="2.4" fill="#38BDF8" opacity=".5"/><path d="M8 110c22-12 40 8 62-4" stroke="#38BDF8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".35"/></svg>`,
  }),
  loykrathong: (uid) => ({
    tr: `<svg viewBox="0 0 360 220" preserveAspectRatio="xMaxYMin meet"><defs><radialGradient id="${uid}-moon"><stop offset="0" stop-color="#FFF3C4" stop-opacity=".55"/><stop offset="1" stop-color="#FFF3C4" stop-opacity="0"/></radialGradient><radialGradient id="${uid}-glow"><stop offset="0" stop-color="#FFB547" stop-opacity=".8"/><stop offset="1" stop-color="#FFB547" stop-opacity="0"/></radialGradient></defs><circle cx="290" cy="70" r="80" fill="url(#${uid}-moon)"/><circle cx="290" cy="70" r="34" fill="#FCE7A8"/><circle cx="280" cy="62" r="6" fill="#F0D48A" opacity=".6"/><circle cx="300" cy="82" r="4" fill="#F0D48A" opacity=".5"/>${lantern(206, 58, 0.8, uid, 0)}${lantern(262, 150, 0.6, uid, 1)}${lantern(160, 132, 0.5, uid, 2)}${lantern(336, 178, 0.42, uid, 3)}<circle cx="40" cy="40" r="1.5" fill="#fff" opacity=".7"/><circle cx="170" cy="20" r="1.2" fill="#fff" opacity=".6"/><circle cx="340" cy="170" r="1.4" fill="#fff" opacity=".6"/><circle cx="90" cy="100" r="1" fill="#fff" opacity=".5"/></svg>`,
    br: `<svg viewBox="0 0 420 150" preserveAspectRatio="xMaxYMax meet"><path d="M40 128h380M120 140h300M220 116h200" stroke="#F5C451" stroke-width="1.4" stroke-linecap="round" opacity=".28"/><g transform="translate(330 104)"><ellipse cx="0" cy="14" rx="44" ry="8" fill="#F5C451" opacity=".18"/><path d="M-34 6h68l-8 10h-52z" fill="#2F7D4F"/><path d="M-26 6c4-14 12-20 14-24 2 8 0 18-2 24zM26 6c-4-14-12-20-14-24-2 8 0 18 2 24zM-12 6c2-16 8-24 12-30 4 6 10 14 12 30z" fill="#F7D774"/><path d="M-6 6c2-10 4-14 6-18 2 4 4 8 6 18z" fill="#FFB3C1"/><path d="M0 -24v-10" stroke="#FFF3C4" stroke-width="2"/><path d="M0 -44c3 4 3 7 0 10-3-3-3-6 0-10z" fill="#FFB547"/><circle cx="0" cy="-38" r="12" fill="url(#${uid}-glow)"/></g></svg>`,
  }),
  '1111': () => ({
    tr: `<svg viewBox="0 0 380 200" preserveAspectRatio="xMaxYMin meet"><text x="372" y="150" text-anchor="end" font-family="Inter, system-ui, sans-serif" font-weight="900" font-size="150" letter-spacing="-8" fill="none" stroke="#FF3D2E" stroke-width="2.5" opacity=".2">11.11</text>${confetti([[40, 30, 18, 7, 25, '#FF3D2E'], [96, 70, 9, 9, 0, '#FFB800'], [150, 22, 20, 6, -30, '#FF7AB6'], [210, 60, 7, 16, 15, '#2EC4B6'], [330, 24, 16, 6, 40, '#FFB800'], [270, 168, 14, 6, -20, '#FF3D2E'], [60, 150, 8, 8, 0, '#2EC4B6', 0.7]])}</svg>`,
    bl: `<svg viewBox="0 0 240 120" preserveAspectRatio="xMinYMax meet">${confetti([[20, 70, 16, 6, -25, '#FFB800'], [70, 96, 8, 8, 0, '#FF3D2E'], [120, 80, 18, 6, 30, '#2EC4B6', 0.7], [40, 30, 6, 14, 10, '#FF7AB6', 0.7]])}</svg>`,
  }),
  blackfriday: (uid) => ({
    tr: `<svg viewBox="0 0 300 200" preserveAspectRatio="xMaxYMin meet"><defs><pattern id="${uid}-hz" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="22" fill="#111"/><rect width="11" height="22" fill="#FFD400"/></pattern></defs><path d="M150 0h150v150z" fill="url(#${uid}-hz)" opacity=".9"/><path d="M150 0h18l132 132v18z" fill="#0A0A0A"/><text x="40" y="180" font-family="Inter, system-ui, sans-serif" font-weight="900" font-size="150" fill="#FFD400" opacity=".07">%</text></svg>`,
    bl: `<svg viewBox="0 0 200 120" preserveAspectRatio="xMinYMax meet"><path d="M0 60l60 60H30L0 90z" fill="#FFD400" opacity=".85"/><path d="M0 20l100 100H82L0 38z" fill="#FFD400" opacity=".18"/></svg>`,
  }),
  cny: () => ({
    tr: `<svg viewBox="0 0 300 220" preserveAspectRatio="xMaxYMin meet">${cnyLantern(250, 30, 1.1)}${cnyLantern(180, 70, 0.8)}${cnyLantern(120, 18, 0.6)}${blossom(60, 40, 6, 0.8)}${blossom(84, 60, 4, 0.7)}<path d="M20 20c20 10 40 14 70 40" stroke="#5A2A1A" stroke-width="2" fill="none" opacity=".6"/></svg>`,
    bl: `<svg viewBox="0 0 280 130" preserveAspectRatio="xMinYMax meet">${cloud(10, 70, 1.6, 0.35)}${cloud(130, 96, 1, 0.25)}</svg>`,
  }),
  christmas: () => ({
    tr: `<svg viewBox="0 0 300 200" preserveAspectRatio="xMaxYMin meet"><path d="M300 0c-60 10-110 30-160 70" stroke="#3B2A1A" stroke-width="5" fill="none" stroke-linecap="round"/>${[[280, 4], [255, 12], [230, 22], [205, 34], [182, 46], [160, 60]].map(([x, y], i) => `<path d="M${x} ${y}l-14 ${i % 2 ? 22 : -20}M${x} ${y}l10 ${i % 2 ? 24 : -18}M${x} ${y}l-24 ${i % 2 ? 6 : -4}" stroke="#2F8A57" stroke-width="5" stroke-linecap="round"/>`).join('')}<path d="M262 18v34M196 44v42" stroke="#F2C14E" stroke-width="1.5"/><circle cx="262" cy="60" r="10" fill="#E2483D"/><circle cx="259" cy="57" r="3" fill="#fff" opacity=".5"/><circle cx="196" cy="94" r="8" fill="#F2C14E"/><circle cx="194" cy="92" r="2.4" fill="#fff" opacity=".6"/>${flake(110, 40, 9, 0.6)}${flake(60, 110, 6, 0.45)}${flake(250, 140, 7, 0.5)}${flake(150, 160, 5, 0.4)}</svg>`,
    bl: `<svg viewBox="0 0 320 110" preserveAspectRatio="xMinYMax meet">${flake(40, 30, 7, 0.45)}${flake(130, 50, 5, 0.35)}${flake(220, 26, 6, 0.4)}</svg>`,
    b: `<svg viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M0 26C60 12 120 10 190 22s130 14 210-2v20H0z" fill="#ffffff" opacity=".09"/></svg>`,
  }),
};

// theme: colours for the card (CSS values). tag: the little sticker with the season text.
export const SEASONS = {
  none: { name: 'None' },
  songkran: {
    name: 'Songkran',
    badge: 'Songkran deals',
    theme: { bg: 'linear-gradient(135deg, #EAF8FF 0%, #DBF1FE 55%, #D5F5F1 100%)', surface: '#ffffff', text: '#0B2A3F', muted: '#3F5B6E', border: '#C3E6F7', accent: '#0284C7', dark: false },
    tag: { bg: '#0EA5E9', color: '#ffffff' },
  },
  loykrathong: {
    name: 'Loy Krathong',
    badge: 'Loy Krathong night',
    theme: { bg: 'radial-gradient(120% 120% at 85% 0%, #24306A 0%, #0E1440 50%, #080B24 100%)', surface: '#121838', text: '#FBF6E9', muted: '#BDBAD0', border: '#2B3366', accent: '#F5C451', cardButton: '#F5C451', cardButtonText: '#141A3D', dark: true },
    tag: { bg: '#F5C451', color: '#141A3D' },
  },
  1111: {
    name: '11.11',
    badge: '11.11 SALE',
    theme: { bg: 'linear-gradient(135deg, #FFF6F0 0%, #FFEDE6 60%, #FFE7EF 100%)', surface: '#ffffff', text: '#1F1A1A', muted: '#5E5454', border: '#FBD5CC', accent: '#E8331F', dark: false },
    tag: { bg: '#FF3D2E', color: '#ffffff' },
  },
  blackfriday: {
    name: 'Black Friday',
    badge: 'BLACK FRIDAY',
    theme: { bg: 'linear-gradient(160deg, #161616 0%, #0A0A0A 100%)', surface: '#151515', text: '#FFFFFF', muted: '#A3A3A3', border: '#2B2B2B', accent: '#FFD400', cardButton: '#FFD400', cardButtonText: '#0A0A0A', dark: true },
    tag: { bg: '#FFD400', color: '#0A0A0A' },
  },
  cny: {
    name: 'Lunar New Year',
    badge: 'Lunar New Year deals',
    theme: { bg: 'radial-gradient(120% 130% at 80% 0%, #C4161C 0%, #9A0E16 55%, #6E0910 100%)', surface: '#82101A', text: '#FFF6E5', muted: '#F2C9B8', border: '#A8323A', accent: '#FFD27A', cardButton: '#FFD27A', cardButtonText: '#6E0910', dark: true },
    tag: { bg: '#FFD27A', color: '#7A0A12' },
  },
  christmas: {
    name: 'Christmas',
    badge: 'Christmas gifts',
    theme: { bg: 'radial-gradient(120% 130% at 80% 0%, #1A5A40 0%, #0F3D2C 55%, #0A2A1F 100%)', surface: '#11392A', text: '#FBFAF4', muted: '#BFD3C6', border: '#25543F', accent: '#F2C14E', cardButton: '#F2C14E', cardButtonText: '#0F3D2C', dark: true },
    tag: { bg: '#E2483D', color: '#ffffff' },
  },
};
export const SEASON_ORDER = ['none', 'songkran', 'loykrathong', '1111', 'blackfriday', 'cny', 'christmas'];

let decoCounter = 0;
/** Decoration markup for a season, or '' for none. */
export function seasonDeco(season) {
  const make = DECOS[season];
  if (!make) return '';
  const parts = make(`ksc-s${++decoCounter}`);
  return `<span class="ksc-deco" aria-hidden="true">${Object.entries(parts)
    .map(([corner, svg]) => svg.replace('<svg ', `<svg class="ksc-deco-${corner}" focusable="false" `))
    .join('')}</span>`;
}

// --- styles ---------------------------------------------------------------------------------
// Appended to the card's base CSS. Same rules as there: every selector starts with .ksc.

export const LOOK_CSS = {
  minimal: `.ksc.ksc-k-minimal .ksc-title{font-weight:500;letter-spacing:-0.035em}
.ksc.ksc-k-minimal .ksc-badge{border:0;background:none;padding:0;font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ksc-muted);font-weight:600}
.ksc.ksc-k-minimal .ksc-btn{box-shadow:none;border-radius:calc(var(--ksc-r) * 0.4)}
.ksc.ksc-k-minimal .ksc-card{box-shadow:none}
.ksc.ksc-k-minimal .ksc-list li{font-size:14.5px;color:var(--ksc-muted)}
.ksc.ksc-k-minimal .ksc-card-head{border-bottom-style:dashed}
.ksc.ksc-k-minimal .ksc-card-btn{background:none;color:var(--ksc-text);border:1px solid var(--ksc-text);border-radius:calc(var(--ksc-r) * 0.4)}
.ksc.ksc-k-minimal.ksc-l-banner{gap:56px}`,
  bold: `.ksc.ksc-k-bold .ksc-title{font-weight:800;letter-spacing:-0.045em;font-size:clamp(32px,5vw,58px);line-height:1}
.ksc.ksc-k-bold .ksc-badge{border:2px solid var(--ksc-text);font-weight:700}
.ksc.ksc-k-bold .ksc-btn{padding:17px 28px;font-size:16.5px;font-weight:700;border:2px solid var(--ksc-text);box-shadow:4px 4px 0 var(--ksc-text)}
.ksc.ksc-k-bold.ksc-l-button{border:2px solid #111111;box-shadow:4px 4px 0 #111111;font-weight:700;padding:16px 26px}
.ksc.ksc-k-bold .ksc-card{border:2px solid var(--ksc-text);box-shadow:8px 8px 0 var(--ksc-text)}
.ksc.ksc-k-bold.ksc-l-banner{border:2px solid var(--ksc-text)}
.ksc.ksc-k-bold .ksc-card-head{border-bottom:2px solid var(--ksc-text)}
.ksc.ksc-k-bold .ksc-card-btn{font-weight:700;border-radius:calc(var(--ksc-r) * 0.5)}
.ksc.ksc-k-bold .ksc-shop{font-weight:800}
.ksc.ksc-k-bold.ksc-flat .ksc-card,.ksc.ksc-k-bold.ksc-flat .ksc-btn,.ksc.ksc-k-bold.ksc-flat.ksc-l-button{box-shadow:none}`,
  luxury: `.ksc.ksc-k-luxury .ksc-title{font-weight:500;letter-spacing:-0.01em;font-size:clamp(32px,4.6vw,54px);line-height:1.04}
.ksc.ksc-k-luxury .ksc-hl{font-style:italic}
.ksc.ksc-k-luxury .ksc-badge{border:0;border-radius:0;background:none;padding:0 0 10px;border-bottom:1px solid var(--ksc-accent);font-size:11px;letter-spacing:.26em;text-transform:uppercase;font-weight:600;color:var(--ksc-text)}
.ksc.ksc-k-luxury .ksc-btn,.ksc.ksc-k-luxury.ksc-l-button{text-transform:uppercase;letter-spacing:.18em;font-size:12.5px;padding:17px 30px;box-shadow:none}
.ksc.ksc-k-luxury.ksc-l-banner{outline:1px solid color-mix(in srgb,var(--ksc-accent) 40%,transparent);outline-offset:-12px}
.ksc.ksc-k-luxury .ksc-card{outline:1px solid var(--ksc-border);outline-offset:-8px;padding:28px}
.ksc.ksc-k-luxury .ksc-shop{font-family:var(--ksc-head-font);font-weight:600;font-size:22px}
.ksc.ksc-k-luxury .ksc-label{letter-spacing:.26em}
.ksc.ksc-k-luxury .ksc-card-btn{text-transform:uppercase;letter-spacing:.18em;font-size:12.5px;border-radius:calc(var(--ksc-r) * 0.5)}
.ksc.ksc-k-luxury .ksc-list li{font-size:14.5px;letter-spacing:.01em}`,
  festival: `.ksc.ksc-k-festival .ksc-title{font-weight:800;letter-spacing:-0.025em}
.ksc.ksc-k-festival .ksc-hl{background:linear-gradient(transparent 60%,color-mix(in srgb,var(--ksc-accent) 30%,transparent) 60%);padding:0 .06em;border-radius:.12em}
.ksc.ksc-k-festival .ksc-badge{border:1.5px dashed color-mix(in srgb,var(--ksc-accent) 65%,var(--ksc-border));transform:rotate(-2deg)}
.ksc.ksc-k-festival .ksc-btn,.ksc.ksc-k-festival.ksc-l-button{border-radius:999px;padding:15px 26px;font-weight:700}
.ksc.ksc-k-festival .ksc-side{transform:rotate(1.5deg)}
.ksc.ksc-k-festival .ksc-card-btn{font-weight:700}
.ksc.ksc-k-festival .ksc-products img:nth-child(odd),.ksc.ksc-k-festival .ksc-products .ksc-ph:nth-child(odd){transform:rotate(-2deg)}
.ksc.ksc-k-festival .ksc-products img:nth-child(even),.ksc.ksc-k-festival .ksc-products .ksc-ph:nth-child(even){transform:rotate(2deg)}
.ksc.ksc-k-festival.ksc-l-banner:not(.ksc-seasonal){background:radial-gradient(circle at 7% 14%,color-mix(in srgb,var(--ksc-accent) 40%,transparent) 0 5px,transparent 6px),radial-gradient(circle at 46% 92%,color-mix(in srgb,var(--ksc-accent) 30%,transparent) 0 4px,transparent 5px),radial-gradient(circle at 54% 8%,rgba(255,184,0,.55) 0 3px,transparent 4px),radial-gradient(circle at 3% 80%,color-mix(in srgb,var(--ksc-accent) 25%,transparent) 0 7px,transparent 8px),var(--ksc-bg)}`,
};

export const SEASON_CSS = `.ksc.ksc-seasonal{position:relative;overflow:hidden;isolation:isolate}
.ksc .ksc-card.ksc-seasonal{position:relative;overflow:hidden;isolation:isolate}
.ksc .ksc-deco{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;display:block}
.ksc .ksc-deco svg{position:absolute;display:block;height:auto;max-width:none;fill:none;border:0;background:none;box-shadow:none}
.ksc .ksc-deco .ksc-deco-tr{top:0;right:0;width:min(36%,340px)}
.ksc.ksc-stack .ksc-deco .ksc-deco-tr{width:30%}
.ksc .ksc-card .ksc-deco .ksc-deco-tr{width:min(34%,160px);top:-12px}
.ksc .ksc-deco .ksc-deco-b{bottom:0;left:0;width:100%;height:40px}
.ksc .ksc-deco .ksc-deco-br{bottom:0;right:0;width:min(62%,460px)}
.ksc .ksc-deco .ksc-deco-bl{bottom:0;left:0;width:min(38%,280px)}
.ksc .ksc-deco .ksc-deco-tl{top:0;left:0;width:min(30%,200px)}
.ksc.ksc-seasonal>:not(.ksc-deco),.ksc .ksc-card.ksc-seasonal>:not(.ksc-deco){position:relative;z-index:1}
.ksc .ksc-badges{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:18px}
.ksc .ksc-badges .ksc-badge{margin-bottom:0}
.ksc .ksc-tag{display:inline-block;padding:6px 12px;border-radius:8px;background:var(--ksc-tag-bg);color:var(--ksc-tag-text);font-size:12.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;line-height:1.2;transform:rotate(-2deg);box-shadow:0 6px 14px -8px rgba(0,0,0,.5)}
.ksc .ksc-card-head .ksc-tag{font-size:11px;padding:5px 10px}`;

export const QR_CSS = `.ksc .ksc-cta{display:flex;flex-wrap:wrap;align-items:center;gap:18px}
.ksc .ksc-qr{display:inline-flex;align-items:center;gap:12px;margin:0;color:var(--ksc-muted);font-size:13px;line-height:1.3}
.ksc .ksc-qr svg{display:block;width:96px;height:96px;max-width:none;flex:none;background:#ffffff;border-radius:10px;border:1px solid rgba(0,0,0,.08);box-shadow:none}
.ksc .ksc-qr b{display:block;color:var(--ksc-text);font-weight:700;font-size:14px}
.ksc .ksc-card-foot{display:flex;align-items:center;gap:14px}
.ksc .ksc-card-foot .ksc-card-btn{flex:1;width:auto}
.ksc .ksc-card-foot .ksc-qr svg{width:76px;height:76px;border-radius:8px}`;
