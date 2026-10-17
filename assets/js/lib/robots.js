// robots.txt parsing and matching per RFC 9309 (as implemented by Google).

export function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  const warnings = [];
  let current = null;
  let lastWasAgent = false;

  text.split(/\r\n|\r|\n/).forEach((raw, idx) => {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) return;
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!m) {
      warnings.push({ line: idx + 1, message: `Unrecognised line: "${raw.trim()}"` });
      return;
    }
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === 'user-agent') {
      if (!lastWasAgent || !current) {
        current = { agents: [], rules: [], line: idx + 1 };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      return;
    }
    lastWasAgent = false;
    if (key === 'sitemap') {
      sitemaps.push(value);
    } else if (key === 'allow' || key === 'disallow') {
      if (!current) warnings.push({ line: idx + 1, message: `${m[1]} before any User-agent line is ignored` });
      else current.rules.push({ type: key, path: value, line: idx + 1 });
    } else if (key === 'crawl-delay') {
      if (current) current.crawlDelay = value;
    } else {
      warnings.push({ line: idx + 1, message: `Unknown directive "${m[1]}"` });
    }
  });
  return { groups, sitemaps, warnings };
}

// Convert a robots path pattern (* wildcard, $ end anchor) to a RegExp.
function patternToRegExp(path) {
  const anchored = path.endsWith('$');
  const body = (anchored ? path.slice(0, -1) : path)
    .split('*')
    .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${body}${anchored ? '$' : ''}`);
}

// Percent-encode characters the way crawlers normalise URLs before matching.
function normalise(path) {
  return path.replace(/%[0-9a-f]{2}/gi, (s) => s.toUpperCase()).replace(/[^\x21-\x7e]/g, (c) => encodeURIComponent(c));
}

export function selectGroups(parsed, userAgent) {
  const ua = userAgent.toLowerCase().split('/')[0].trim();
  const specific = parsed.groups.filter((g) => g.agents.some((a) => a !== '*' && ua.startsWith(a)));
  if (specific.length) {
    // Most specific (longest) matching agent name wins; equal names merge.
    const best = Math.max(...specific.flatMap((g) => g.agents.filter((a) => ua.startsWith(a)).map((a) => a.length)));
    return specific.filter((g) => g.agents.some((a) => ua.startsWith(a) && a.length === best));
  }
  return parsed.groups.filter((g) => g.agents.includes('*'));
}

export function isAllowed(parsed, userAgent, urlOrPath) {
  let path = urlOrPath;
  try {
    const u = new URL(urlOrPath);
    path = u.pathname + u.search;
  } catch {
    if (!path.startsWith('/')) path = `/${path}`;
  }
  path = normalise(path);
  if (path === '/robots.txt') return { allowed: true, rule: null, reason: '/robots.txt is always allowed' };

  const groups = selectGroups(parsed, userAgent);
  let best = null;
  for (const g of groups) {
    for (const r of g.rules) {
      if (r.type === 'disallow' && r.path === '') continue; // empty Disallow allows everything
      if (!patternToRegExp(normalise(r.path)).test(path)) continue;
      const len = r.path.length;
      if (!best || len > best.path.length || (len === best.path.length && r.type === 'allow')) best = r;
    }
  }
  if (!groups.length) return { allowed: true, rule: null, reason: 'No group applies to this user agent' };
  if (!best) return { allowed: true, rule: null, reason: 'No rule matches this path' };
  return { allowed: best.type === 'allow', rule: best, reason: `Matched ${best.type === 'allow' ? 'Allow' : 'Disallow'}: ${best.path} (line ${best.line})` };
}
