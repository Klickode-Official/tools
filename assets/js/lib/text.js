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
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  return {
    characters: [...text].length,
    charactersNoSpaces: [...text.replace(/\s/g, '')].length,
    words: wordCount,
    lines: text ? text.split('\n').length : 0,
    sentences: trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed]).length : 0,
    readingMinutes: Math.max(wordCount ? 1 : 0, Math.round(wordCount / 230)),
  };
}
