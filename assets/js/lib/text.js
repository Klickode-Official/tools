// Case conversion and text statistics.

export function words(text) {
  return text
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

export const cases = {
  camel: (t) => words(t).map((w, i) => (i ? cap(w) : w.toLowerCase())).join(''),
  pascal: (t) => words(t).map(cap).join(''),
  snake: (t) => words(t).map((w) => w.toLowerCase()).join('_'),
  constant: (t) => words(t).map((w) => w.toUpperCase()).join('_'),
  kebab: (t) => words(t).map((w) => w.toLowerCase()).join('-'),
  title: (t) => t.toLowerCase().replace(/(^|[\s\-_])(\p{L})/gu, (_, sep, c) => sep + c.toUpperCase()),
  sentence: (t) => t.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, sep, c) => sep + c.toUpperCase()),
  upper: (t) => t.toUpperCase(),
  lower: (t) => t.toLowerCase(),
};

export function stats(text) {
  const trimmed = text.trim();
  const wordCount = tokenize(text).length;
  return {
    characters: [...text].length,
    charactersNoSpaces: [...text.replace(/\s/g, '')].length,
    words: wordCount,
    lines: text ? text.split('\n').length : 0,
    sentences: trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed]).length : 0,
    readingMinutes: Math.max(wordCount ? 1 : 0, Math.round(wordCount / 230)),
  };
}

const STOPWORDS = new Set(
  'a about above after again against all am an and any are as at be because been before being below between both but by can did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with you your yours yourself yourselves'.split(' '),
);

// Thai (and Lao, Khmer, Chinese, Japanese) is written without spaces between words, so splitting on
// spaces counts a whole sentence as one word. Intl.Segmenter knows where the words break.
const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'word' }) : null;

export function tokenize(text) {
  if (segmenter) return [...segmenter.segment(text)].filter((s) => s.isWordLike).map((s) => s.segment);
  return text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || [];
}

const isThai = (w) => /\p{Script=Thai}/u.test(w);

const THAI_STOPWORDS = new Set(
  'ที่ และ ของ ใน เป็น มี ได้ ให้ กับ จะ ไม่ การ ความ ว่า นี้ ก็ แต่ หรือ จาก โดย ซึ่ง อยู่ ไป มา แล้ว คือ เพื่อ ทำ ด้วย ยัง อีก นั้น เมื่อ ถ้า กว่า ต้อง ไว้ ทุก แบบ ครับ ค่ะ คะ นะ จ้า'.split(' '),
);

// Top single words and phrases with their share of total words.
export function keywordDensity(text, { minLength = 3, ignoreStopwords = true, top = 20 } = {}) {
  const tokens = tokenize(text.toLowerCase());
  const total = tokens.length;
  // Thai words are often only two characters long, so the minimum length applies to other scripts only.
  const keep = (w) =>
    isThai(w) ? w.length >= 2 && !(ignoreStopwords && THAI_STOPWORDS.has(w)) : w.length >= minLength && !(ignoreStopwords && STOPWORDS.has(w)) && !/^\d+$/.test(w);
  // Thai phrases are written without spaces between the words.
  const joinWords = (gram) => gram.reduce((acc, w, i) => (i === 0 ? w : acc + (isThai(gram[i - 1]) && isThai(w) ? '' : ' ') + w), '');
  const count = (n) => {
    const m = new Map();
    for (let i = 0; i + n <= tokens.length; i++) {
      const gram = tokens.slice(i, i + n);
      // Phrases may contain stopwords in the middle ("return on investment") but not at the ends.
      if (!keep(gram[0]) || !keep(gram[n - 1])) continue;
      const k = joinWords(gram);
      m.set(k, (m.get(k) || 0) + 1);
    }
    return [...m]
      .filter(([, c]) => n === 1 || c > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, top)
      .map(([phrase, c]) => ({ phrase, count: c, density: total ? (100 * c * n) / total : 0 }));
  };
  return { total, single: count(1), double: count(2), triple: count(3) };
}
