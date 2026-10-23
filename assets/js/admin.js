// Tool switchboard (/admin/). Reads and writes tools.config.json in the GitHub repo with the
// owner's token, then watches /admin/status.json until the rebuilt site reflects the change.
import { $, storage } from './ui.js';

const data = JSON.parse($('#admin-data').textContent);
const switches = [...document.querySelectorAll('[data-slug]')];
const statusEl = $('#status');
const save = $('#save');
const undo = $('#undo');
const summary = $('#summary');
const fields = { token: $('#token'), repo: $('#repo'), branch: $('#branch'), remember: $('#remember') };
const nameOf = Object.fromEntries(data.tools.map((t) => [t.slug, t.name]));
const KEY = 'kt-admin';

let remote = null; // { sha, config } as it is on GitHub now
let watching = 0;

function say(message, kind = '') {
  statusEl.className = `status ${kind}`;
  statusEl.textContent = message;
}

// --- connection settings ---------------------------------------------------------------------
const saved = (() => {
  try {
    return JSON.parse(storage.get(KEY) || '{}');
  } catch {
    return {};
  }
})();
fields.repo.value = saved.repo || data.repo;
fields.branch.value = saved.branch || data.branch;
fields.token.value = saved.token || '';
fields.remember.checked = Boolean(saved.token);
$('#setup').open = !saved.token;

function remember() {
  const keep = { repo: fields.repo.value.trim(), branch: fields.branch.value.trim() };
  if (fields.remember.checked) keep.token = fields.token.value.trim();
  storage.set(KEY, JSON.stringify(keep));
}

// --- GitHub ----------------------------------------------------------------------------------
const api = (path, init = {}) =>
  fetch(`https://api.github.com/repos/${fields.repo.value.trim()}/contents/tools.config.json${path}`, {
    ...init,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${fields.token.value.trim()}`, 'X-GitHub-Api-Version': '2022-11-28', ...init.headers },
  });

const problem = (res) =>
  res.status === 401
    ? 'GitHub didn’t accept that token. Check it hasn’t expired.'
    : res.status === 403
      ? 'That token can’t change this repository. Give it Contents: Read and write.'
      : res.status === 404
        ? 'Repository or branch not found, or the token can’t see it.'
        : `GitHub said ${res.status}. Try again in a moment.`;

async function connect() {
  if (!fields.token.value.trim()) return say('Paste your GitHub token first.', 'err');
  say('Connecting…');
  let res;
  try {
    res = await api(`?ref=${encodeURIComponent(fields.branch.value.trim())}`, { cache: 'no-store' });
  } catch {
    return say('Couldn’t reach GitHub. Check your connection.', 'err');
  }
  if (res.status === 404 && (await isRepoReachable())) {
    remote = { sha: null, config: {} }; // no config file yet: everything is on
  } else if (!res.ok) {
    return say(problem(res), 'err');
  } else {
    const file = await res.json();
    try {
      remote = { sha: file.sha, config: JSON.parse(atob(file.content.replace(/\s/g, ''))) };
    } catch {
      return say('tools.config.json on GitHub isn’t valid JSON. Fix it there first.', 'err');
    }
  }
  remember();
  $('#setup').open = false;
  show(new Set(remote.config.disabled || []));
  for (const s of switches) s.disabled = false;
  say(`Connected to ${fields.repo.value.trim()} (${fields.branch.value.trim()}).`, 'ok');
}

async function isRepoReachable() {
  const res = await fetch(`https://api.github.com/repos/${fields.repo.value.trim()}`, { headers: { Authorization: `Bearer ${fields.token.value.trim()}` } }).catch(() => null);
  return Boolean(res?.ok);
}

// --- switches --------------------------------------------------------------------------------
const chosenOff = () => switches.filter((s) => !s.checked).map((s) => s.dataset.slug).sort();

function show(off) {
  for (const s of switches) s.checked = !off.has(s.dataset.slug);
  refresh();
}

function refresh() {
  const before = new Set(remote?.config.disabled || data.disabled);
  const now = new Set(chosenOff());
  const turnOff = [...now].filter((s) => !before.has(s));
  const turnOn = [...before].filter((s) => !now.has(s) && nameOf[s]);
  for (const s of switches) s.closest('.admin-row').classList.toggle('changed', turnOff.includes(s.dataset.slug) || turnOn.includes(s.dataset.slug));
  const changes = turnOff.length + turnOn.length;
  summary.textContent = changes ? [turnOff.length && `${turnOff.length} to switch off`, turnOn.length && `${turnOn.length} to switch on`].filter(Boolean).join(' · ') : `${switches.length - now.size} of ${switches.length} on`;
  save.disabled = !remote || !changes;
  undo.disabled = !changes;
  return { turnOff, turnOn };
}

for (const s of switches) s.addEventListener('change', refresh);
undo.addEventListener('click', () => show(new Set(remote?.config.disabled || data.disabled)));
$('#connect').addEventListener('click', connect);

save.addEventListener('click', async () => {
  const { turnOff, turnOn } = refresh();
  const off = chosenOff();
  if (off.length === switches.length) return say('At least one tool has to stay on.', 'err');
  const label = (list) => list.map((s) => nameOf[s]).join(', ');
  const message = [turnOff.length && `Switch off ${label(turnOff)}`, turnOn.length && `Switch on ${label(turnOn)}`].filter(Boolean).join('; ');
  const config = { ...remote.config, disabled: off };
  save.disabled = true;
  say('Saving…');
  let res;
  try {
    res = await api('', {
      method: 'PUT',
      body: JSON.stringify({ message: `${message} (from /admin/)`, content: btoa(`${JSON.stringify(config, null, 2)}\n`), branch: fields.branch.value.trim(), ...(remote.sha && { sha: remote.sha }) }),
    });
  } catch {
    save.disabled = false;
    return say('Couldn’t reach GitHub. Nothing was changed.', 'err');
  }
  if (res.status === 409 || res.status === 422) {
    await connect();
    return say('Someone changed the switches since you connected. They’re reloaded; make your change again.', 'err');
  }
  if (!res.ok) {
    save.disabled = false;
    return say(problem(res), 'err');
  }
  remote = { sha: (await res.json()).content.sha, config };
  refresh();
  watch(off);
});

// After a save, check the live site every 10 seconds until it has been rebuilt with the new list.
function watch(off) {
  const run = ++watching;
  const want = off.join(',');
  const started = Date.now();
  say('Saved. The site is rebuilding, which usually takes a minute or two…', 'ok');
  const tick = async () => {
    if (run !== watching) return;
    const live = await fetch(`/admin/status.json?${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .catch(() => null);
    if (live && live.disabled.join(',') === want) return say('Live now. Visitors see the new set of tools.', 'ok');
    if (Date.now() - started > 8 * 60_000) return say('Saved on GitHub, but the site hasn’t updated yet. Check the deploy on Vercel.', 'err');
    setTimeout(tick, 10_000);
  };
  setTimeout(tick, 10_000);
}

if (fields.token.value) connect();
else refresh();
