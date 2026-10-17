// On-page SEO checks. `extract` turns a parsed Document into plain data;
// `audit` is pure so it can be tested without a DOM.

export const LIMITS = { titleMin: 30, titleMax: 60, titlePx: 580, descMin: 70, descMax: 160, descPx: 920 };

export function extract(doc) {
  const meta = (sel) => doc.querySelector(sel)?.getAttribute('content')?.trim() ?? null;
  const ldJson = [...doc.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent);
  const anchors = [...doc.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  return {
    title: doc.querySelector('title')?.textContent.trim() ?? null,
    titleCount: doc.querySelectorAll('title').length,
    description: meta('meta[name="description" i]'),
    descriptionCount: doc.querySelectorAll('meta[name="description" i]').length,
    robots: meta('meta[name="robots" i]'),
    viewport: meta('meta[name="viewport" i]'),
    canonical: doc.querySelector('link[rel~="canonical" i]')?.getAttribute('href') ?? null,
    lang: doc.documentElement.getAttribute('lang'),
    charset: !!doc.querySelector('meta[charset], meta[http-equiv="content-type" i]'),
    headings: [...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({ level: Number(h.tagName[1]), text: h.textContent.trim().replace(/\s+/g, ' ') })),
    images: [...doc.querySelectorAll('img')].map((img) => ({ src: img.getAttribute('src') || '', alt: img.getAttribute('alt') })),
    og: Object.fromEntries([...doc.querySelectorAll('meta[property^="og:" i]')].map((m) => [m.getAttribute('property').toLowerCase(), m.getAttribute('content')])),
    twitter: Object.fromEntries([...doc.querySelectorAll('meta[name^="twitter:" i]')].map((m) => [m.getAttribute('name').toLowerCase(), m.getAttribute('content')])),
    hreflang: doc.querySelectorAll('link[rel="alternate" i][hreflang]').length,
    ldJson,
    links: { total: anchors.length, external: anchors.filter((h) => /^https?:\/\//i.test(h)).length, nofollow: doc.querySelectorAll('a[rel~="nofollow" i]').length },
    wordCount: (doc.body?.textContent || '').trim().split(/\s+/).filter(Boolean).length,
  };
}

// measure(text, kind) → pixel width; optional, used for SERP truncation.
export function audit(d, measure) {
  const checks = [];
  const add = (level, area, message) => checks.push({ level, area, message });

  if (!d.title) add('error', 'Title', 'Missing <title> tag.');
  else {
    const n = [...d.title].length;
    const px = measure?.(d.title, 'title');
    if (n < LIMITS.titleMin) add('warn', 'Title', `Title is short (${n} characters). Aim for ${LIMITS.titleMin}–${LIMITS.titleMax}.`);
    else if (n > LIMITS.titleMax || (px && px > LIMITS.titlePx)) add('warn', 'Title', `Title may be truncated in search results (${n} characters${px ? `, ~${Math.round(px)}px` : ''}).`);
    else add('ok', 'Title', `Title length is good (${n} characters).`);
  }
  if (d.titleCount > 1) add('error', 'Title', `${d.titleCount} <title> tags found; use exactly one.`);

  if (!d.description) add('error', 'Description', 'Missing meta description. Search engines will pick text from the page instead.');
  else {
    const n = [...d.description].length;
    if (n < LIMITS.descMin) add('warn', 'Description', `Meta description is short (${n} characters). Aim for ${LIMITS.descMin}–${LIMITS.descMax}.`);
    else if (n > LIMITS.descMax) add('warn', 'Description', `Meta description may be truncated (${n} characters).`);
    else add('ok', 'Description', `Meta description length is good (${n} characters).`);
  }
  if (d.descriptionCount > 1) add('warn', 'Description', `${d.descriptionCount} meta descriptions found; use exactly one.`);

  const h1s = d.headings.filter((h) => h.level === 1);
  if (!h1s.length) add('warn', 'Headings', 'No <h1> heading.');
  else if (h1s.length > 1) add('warn', 'Headings', `${h1s.length} <h1> headings. One clear <h1> per page is the convention.`);
  else add('ok', 'Headings', 'Exactly one <h1>.');
  for (let i = 1; i < d.headings.length; i++) {
    if (d.headings[i].level > d.headings[i - 1].level + 1) {
      add('warn', 'Headings', `Heading level skips from h${d.headings[i - 1].level} to h${d.headings[i].level} ("${d.headings[i].text.slice(0, 40)}").`);
      break;
    }
  }

  const noAlt = d.images.filter((i) => i.alt === null);
  if (noAlt.length) add('warn', 'Images', `${noAlt.length} of ${d.images.length} images have no alt attribute (use alt="" for decorative images).`);
  else if (d.images.length) add('ok', 'Images', `All ${d.images.length} images have alt attributes.`);

  if (!d.canonical) add('warn', 'Indexing', 'No canonical link. Add <link rel="canonical"> to avoid duplicate-content issues.');
  else if (!/^https?:\/\//i.test(d.canonical)) add('warn', 'Indexing', `Canonical URL should be absolute: "${d.canonical}".`);
  else add('ok', 'Indexing', `Canonical: ${d.canonical}`);
  if (d.robots && /noindex/i.test(d.robots)) add('error', 'Indexing', `meta robots is "${d.robots}": this page will not be indexed.`);

  if (!d.viewport) add('error', 'Mobile', 'No viewport meta tag; the page will not render well on phones.');
  else add('ok', 'Mobile', 'Viewport meta tag present.');
  if (!d.lang) add('warn', 'Accessibility', 'No lang attribute on <html>.');
  if (!d.charset) add('warn', 'Encoding', 'No charset declaration.');

  const ogMissing = ['og:title', 'og:description', 'og:image'].filter((k) => !d.og[k]);
  if (ogMissing.length) add('warn', 'Social', `Missing Open Graph tags: ${ogMissing.join(', ')}. Links shared on social media will look plain.`);
  else add('ok', 'Social', 'Open Graph title, description and image are set.');
  if (!d.twitter['twitter:card']) add('info', 'Social', 'No twitter:card tag (X/Twitter falls back to Open Graph).');

  d.ldJson.forEach((src, i) => {
    try {
      const v = JSON.parse(src);
      const types = [].concat(v).flatMap((x) => [].concat(x['@type'] || (x['@graph'] ? x['@graph'].map((g) => g['@type']) : []))).filter(Boolean);
      add('ok', 'Structured data', `JSON-LD block ${i + 1} is valid${types.length ? ` (${types.join(', ')})` : ''}.`);
    } catch (e) {
      add('error', 'Structured data', `JSON-LD block ${i + 1} is not valid JSON: ${e.message}`);
    }
  });
  if (!d.ldJson.length) add('info', 'Structured data', 'No JSON-LD structured data found.');

  if (d.wordCount < 300) add('info', 'Content', `Only ~${d.wordCount} words of visible text. Thin pages tend to rank poorly.`);

  const score = Math.round((100 * checks.filter((c) => c.level === 'ok').length) / Math.max(1, checks.filter((c) => c.level !== 'info').length));
  return { checks, score };
}

// Truncate text to fit a pixel budget the way Google's SERP does, adding an ellipsis.
export function truncateToWidth(text, maxPx, measure) {
  if (measure(text) <= maxPx) return { text, truncated: false };
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (measure(`${text.slice(0, mid)} ...`) <= maxPx) lo = mid;
    else hi = mid - 1;
  }
  const cut = text.slice(0, lo);
  const atWord = cut.lastIndexOf(' ') > lo * 0.6 ? cut.slice(0, cut.lastIndexOf(' ')) : cut;
  return { text: `${atWord.trimEnd()} ...`, truncated: true };
}
