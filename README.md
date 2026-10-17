# Klickode Tools

Free, private developer tools that run entirely in the browser. No sign-up, no uploads, no trackers.

This is Phase 1 of the roadmap: the **JSON/Data Toolkit** and the **Regex & Text Suite**, the two
high-value, low-complexity opportunities. Both ship as a static site that costs nothing to host.

## Tools

| Category | Tool | Path |
| --- | --- | --- |
| JSON & Data | JSON Formatter & Validator (exact line/column errors, sort keys, minify) | `/tools/json-formatter/` |
| | JSON Diff (structural, reports JSONPath of each change) | `/tools/json-diff/` |
| | CSV → JSON (RFC 4180, type detection, safe for big integer IDs) | `/tools/csv-to-json/` |
| | JSON → CSV (flattens nested objects to dot-notation columns) | `/tools/json-to-csv/` |
| | JSON Schema Generator (draft 2020-12, merges array items, detects formats) | `/tools/json-schema-generator/` |
| Regex & Text | Regex Tester (live highlight, groups, replace, runaway-pattern timeout) | `/tools/regex-tester/` |
| | Text Diff (line-based LCS) | `/tools/text-diff/` |
| | Case Converter & Word Counter | `/tools/case-converter/` |
| Encoding & IDs | Base64 / Base64URL (UTF-8 safe) | `/tools/base64/` |
| | URL Encoder / Decoder (+ query-param table) | `/tools/url-encoder/` |
| | JWT Decoder (iat/nbf/exp, expiry status; input never persisted) | `/tools/jwt-decoder/` |
| | UUID Generator (v4, v7) & Validator | `/tools/uuid-generator/` |
| | Unix Timestamp Converter (s/ms/µs/ns auto-detect) | `/tools/timestamp-converter/` |

## Privacy by design

- All processing is client-side JavaScript. The pages make no network requests beyond their own static assets.
- The regex tester runs patterns in a Web Worker and kills it after 1.5s, so catastrophic backtracking can't freeze the tab.
- Share links put state in the URL **fragment** (`#s=…`), which browsers never send to the server.
- Inputs are remembered in `localStorage` for convenience, except in the JWT decoder, because tokens are credentials.
- `netlify.toml` / `vercel.json` set a strict Content-Security-Policy (`connect-src 'self'`) so even a compromised script can't send data anywhere else.

## Development

Requires Node 20+. There are no dependencies.

```sh
npm test                                   # unit tests for every lib module (node:test)
SITE_URL=https://your.domain npm run build # generate dist/
npx serve dist                             # preview locally
```

`SITE_URL` enables canonical links, `og:url` and `sitemap.xml`. Set it in your host's environment variables.

### Layout

```
assets/js/lib/     Pure, DOM-free logic (tested in Node): json, csv, diff, schema, regex, encode, jwt, uuid, time, text
assets/js/pages/   One module per tool page that wires the lib to the DOM
assets/js/ui.js    Shared helpers: theme, copy, download, persistence, share links
scripts/tools.mjs  Tool registry: markup, SEO title/description and FAQ copy for each page
scripts/build.mjs  Static site generator → dist/ (pages, home, privacy, terms, 404, sitemap, robots)
tests/             node:test suites
```

### Adding a tool

1. Put the logic in `assets/js/lib/<name>.js` and add tests in `tests/`.
2. Add an entry to `scripts/tools.mjs` (slug, category, name, title, description, short, body, content).
3. Create `assets/js/pages/<slug>.js` (or set `script` to share one, as CSV↔JSON does).
4. `npm test && npm run build`.

## Deploying (free tiers)

- **Netlify**: import the repo; `netlify.toml` already sets the build command, publish dir and security headers.
- **Vercel**: import the repo; `vercel.json` does the same.
- **Cloudflare Pages / GitHub Pages**: build command `npm run build`, output directory `dist`. Add the CSP from `netlify.toml` as a `_headers` file on Cloudflare.

## Roadmap

- [x] Phase 1: JSON/Data toolkit + Regex & Text suite (static, client-side)
- [ ] Privacy-respecting, cookieless analytics to see which tools to invest in
- [ ] SEO content: one how-to article per tool (e.g. "Debugging JWTs", "Regex for email validation")
- [ ] YAML ↔ JSON, XML formatter, SQL formatter, JSONPath query tester
- [ ] Mermaid diagram editor, GraphQL/API playground
- [ ] Code playground and AI code explainer (these need a backend, so they come later)

## License

MIT
