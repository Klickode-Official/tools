// Approximate Google SERP text widths with canvas text metrics (Arial is what Google renders with).
const ctx = document.createElement('canvas').getContext('2d');
const FONTS = { title: '20px arial, sans-serif', desc: '14px arial, sans-serif' };

export function measure(text, kind = 'title') {
  ctx.font = FONTS[kind] || FONTS.title;
  return ctx.measureText(text).width;
}
