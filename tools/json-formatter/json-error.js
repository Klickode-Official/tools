// Shows messages from the shared libraries in the page's language. The libraries stay in English
// (they're tested that way); these helpers map their fixed sentences to t() templates.
// Used by the JSON, CSV and SEO tools.
import { t } from '/assets/js/ui.js';

/**
 * Translate a sentence that follows one of a known set of shapes.
 * @param {string} text the English message
 * @param {Array<[RegExp, string, string[]?]>} patterns regex, English template, names for the groups
 */
export function localise(text, patterns) {
  for (const [re, template, names = []] of patterns) {
    const m = re.exec(text);
    if (m) return t(template, Object.fromEntries(names.map((n, i) => [n, m[i + 1]])));
  }
  return t(text);
}

// "end of input" is words; anything else is a quoted character and stays as it is.
const what = (s) => (s === 'end of input' ? t('end of input') : s);

/** A JSON syntax error (or any other error) as text for the status line. */
export function jsonErrorText(e) {
  const at = / at line (\d+), column (\d+)$/.exec(e.message);
  const base = at ? e.message.slice(0, at.index) : e.message;
  let m;
  let msg;
  if ((m = /^Unexpected (.+?), expected (.+)$/.exec(base))) msg = t('Unexpected {what}, expected {expected}', { what: what(m[1]), expected: t(m[2]) });
  else if ((m = /^Unexpected (.+) after the end of the JSON value$/.exec(base))) msg = t('Unexpected {what} after the end of the JSON value', { what: what(m[1]) });
  else if ((m = /^Invalid escape sequence (.+)$/.exec(base))) msg = t('Invalid escape sequence {seq}', { seq: m[1] });
  else msg = t(base);
  return at ? t('{message} at line {line}, column {column}', { message: msg, line: at[1], column: at[2] }) : msg;
}
