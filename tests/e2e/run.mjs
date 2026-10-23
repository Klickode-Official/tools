// Builds the site into a temp folder, serves it with the same Content-Security-Policy as
// production (from netlify.toml) and runs the browser checks in site.e2e.cjs.
//   npm i -D playwright && npx playwright install chromium   (once)
//   npm run test:e2e
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const out = mkdtempSync(join(tmpdir(), 'klickode-e2e-'));
const port = process.env.PORT || '4173';
const csp = /Content-Security-Policy = "([^"]+)"/.exec(readFileSync(join(root, 'netlify.toml'), 'utf8'))[1];

const build = spawnSync(process.execPath, [join(root, 'scripts/build.mjs')], { env: { ...process.env, SITE_URL: 'https://example.com', OUT_DIR: out, SHOW_ALL_TOOLS: '1' }, stdio: 'inherit' });
if (build.status) process.exit(build.status);

const server = spawn(process.execPath, [join(here, 'serve.mjs'), out], { env: { ...process.env, CSP: csp, PORT: port }, stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((resolve) => server.stdout.once('data', resolve));

const run = spawnSync(process.execPath, [join(here, 'site.e2e.cjs')], { env: { ...process.env, BASE_URL: `http://localhost:${port}` }, stdio: 'inherit' });
server.kill();
rmSync(out, { recursive: true, force: true });
process.exit(run.status ?? 1);
