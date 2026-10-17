// Regex testing helpers built on the browser's own RegExp engine.

export function compile(pattern, flags) {
  try {
    return { re: new RegExp(pattern, flags) };
  } catch (e) {
    return { error: e.message };
  }
}

export function findMatches(re, text, limit = 1000) {
  const matches = [];
  const global = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  if (!re.flags.includes('g')) {
    const m = new RegExp(re.source, re.flags).exec(text);
    return m ? [toMatch(m)] : [];
  }
  let m;
  while ((m = global.exec(text)) !== null) {
    matches.push(toMatch(m));
    if (m[0] === '') global.lastIndex += re.unicode || re.unicodeSets ? codePointWidth(text, global.lastIndex) : 1;
    if (matches.length >= limit) break;
  }
  return matches;
}

function codePointWidth(text, i) {
  const c = text.codePointAt(i);
  return c !== undefined && c > 0xffff ? 2 : 1;
}

function toMatch(m) {
  return {
    index: m.index,
    end: m.index + m[0].length,
    text: m[0],
    groups: m.slice(1),
    named: m.groups ? { ...m.groups } : null,
  };
}

export function replaceAll(re, text, replacement) {
  return text.replace(re, replacement);
}
