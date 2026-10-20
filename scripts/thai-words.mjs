// Thai is written without spaces, so browsers pick line breaks from a word dictionary. Loanwords
// it doesn't know get split mid-word on narrow screens ("โซเชีย/ล", "ไอ/ดี"). The build wraps
// these in a no-wrap span inside headings and short labels, so they always stay on one line.
// Add a word here when you see it break; check with Intl.Segmenter('th', { granularity: 'word' }).
const KEEP = ['โซเชียลมีเดีย', 'โซเชียล', 'ไอดี', 'พร้อมเพย์', 'มิลลิวินาที', 'อินสตาแกรม', 'เฟซบุ๊ก', 'เมตาแท็ก', 'คอนเวอร์เตอร์', 'พ.ศ.'];

const WORD = new RegExp(KEEP.sort((a, b) => b.length - a.length).map((w) => w.replace(/\./g, '\\.')).join('|'), 'g');

// Only text between tags changes; attributes and nested tags are left alone.
const wrapText = (html) => html.replace(/(^|>)([^<]+)/g, (_, gt, text) => gt + text.replace(WORD, '<span class="nobr">$&</span>'));

// Headings, FAQ questions, card names and descriptions, and ledes. Not <title>, <option> or
// anything inside scripts, where a span would show up as text or be dropped.
const TARGETS = /(<(h[1-3]|summary|strong)\b[^>]*>)([\s\S]*?)(<\/\2>)|(<(span|p) class="(?:desc|lede)">)([^<]*)(<\/\6>)/g;

export const keepThaiWords = (html) =>
  html.replace(TARGETS, (m, open, tag, inner, close, open2, tag2, inner2, close2) => (open ? open + wrapText(inner) + close : open2 + wrapText(inner2) + close2));
