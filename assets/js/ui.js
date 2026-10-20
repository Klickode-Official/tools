// Shared page behaviour: theme toggle, copy/download helpers, persisted inputs, share links.
import { base64Encode, base64Decode, htmlEscape } from './lib/encode.js';

export const $ = (sel, root = document) => root.querySelector(sel);

// --- language ---------------------------------------------------------------------------------
// Thai pages carry their translations in <script id="kt-strings">. t('Copied {n} rows', { n: 3 })
// returns the Thai text when there is one, otherwise the English it was given.
export const lang = document.documentElement.lang || 'en';
let strings = {};
try {
  strings = JSON.parse(document.getElementById('kt-strings')?.textContent || '{}');
} catch {
  strings = {};
}
export function t(text, vars) {
  const out = strings[text] ?? text;
  return vars ? out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : out;
}
// Where a tool lives in this page's language.
export const toolHref = (slug) => (lang === 'th' ? `/th/tools/${slug}/` : `/tools/${slug}/`);

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage can be unavailable (private mode, blocked site data); inputs just won't persist.
    }
  },
};

function initTheme() {
  const saved = storage.get('kt-theme');
  if (saved) document.documentElement.dataset.theme = saved;
  const btn = $('#theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    storage.set('kt-theme', next);
  });
}

let toastTimer;
export function toast(msg) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.append(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1600);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.append(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  toast(t('Copied to clipboard'));
}

export function download(filename, text, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function setStatus(el, message, ok) {
  el.textContent = message || '';
  el.className = `status ${ok ? 'ok' : 'err'}`;
}

// Wire up any [data-copy="#target"] buttons.
function initCopyButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const target = $(btn.dataset.copy);
    if (target) copyText('value' in target && target.tagName !== 'PRE' ? target.value : target.textContent);
  });
}

// Remember textarea/input contents per page so a refresh doesn't lose work.
export function persist(...elements) {
  const page = location.pathname;
  const keyOf = (el) => `kt:${page}:${el.id}`;
  const save = (el) => storage.set(keyOf(el), el.type === 'checkbox' ? (el.checked ? '1' : '0') : el.value);
  // Values set from code (Sample, Swap) fire no input event, so also save on the way out.
  addEventListener('pagehide', () => elements.forEach(save));
  for (const el of elements) {
    const key = keyOf(el);
    const saved = storage.get(key);
    // Only restore over untouched defaults, so a share link's values win.
    if (saved !== null) {
      if (el.type === 'checkbox') {
        if (el.checked === el.defaultChecked) el.checked = saved === '1';
      } else if (el.tagName === 'SELECT' || el.value === el.defaultValue) {
        el.value = saved;
      }
    }
    el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input', () => save(el));
  }
}

// Share links keep state in the URL fragment, which browsers never send to a server.
export function shareLink(state) {
  const url = `${location.origin}${location.pathname}#s=${base64Encode(JSON.stringify(state), { urlSafe: true })}`;
  if (url.length > 32000) {
    toast(t('Input is too large to share as a link'));
    return;
  }
  history.replaceState(null, '', url);
  copyText(url).then(() => toast(t('Share link copied')));
}

export function readShared() {
  const m = /#s=([\w-]+)/.exec(location.hash);
  if (!m) return null;
  try {
    return JSON.parse(base64Decode(m[1]));
  } catch {
    return null;
  }
}

export function debounce(fn, ms = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export const escapeHtml = htmlEscape;

// The page scrolls inside the framed panel, not the window. Focus that panel so arrow keys,
// Page Down and Space scroll it straight away.
function initScroller() {
  const scroller = document.getElementById('scroller');
  if (scroller && document.activeElement === document.body) scroller.focus({ preventScroll: true });
}

// A signature for anyone who opens the developer tools.
function signConsole() {
  console.info(
    '%cKLICKODE%c TOOLS\n%c© Klickode Studio Ltd. All rights reserved. Klickode™ is a trademark of Klickode Studio Ltd.\nCopying this site or its code needs written permission: https://www.klickode.com/contact',
    'font: 800 18px Inter, system-ui, sans-serif; color: #E03131; letter-spacing: -0.03em',
    'font: 600 11px monospace; color: #E03131; letter-spacing: 0.3em',
    'font: 12px system-ui, sans-serif; color: inherit',
  );
}

// --- tool index: names and categories of every tool, written by the build ---------------
let indexPromise;
export function toolIndex() {
  indexPromise ??= fetch(lang === 'th' ? '/assets/tools-index.th.json' : '/assets/tools-index.json')
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => []);
  return indexPromise;
}

const currentSlug = (/^(?:\/th)?\/tools\/([\w-]+)\//.exec(location.pathname) || [])[1];

// --- recently used tools (shown on the home page) ----------------------------------------
export function recentTools() {
  try {
    const list = JSON.parse(storage.get('kt-recent') || '[]');
    return Array.isArray(list) ? list.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}
function rememberTool() {
  if (!currentSlug) return;
  storage.set('kt-recent', JSON.stringify([currentSlug, ...recentTools().filter((s) => s !== currentSlug)].slice(0, 6)));
}

// --- command palette: Ctrl/Cmd+K from any page -------------------------------------------
let palette;
function openPalette() {
  if (!palette) {
    palette = document.createElement('dialog');
    palette.className = 'palette';
    palette.setAttribute('aria-label', 'Find a tool');
    palette.innerHTML = `<div class="palette-box">
  <div class="palette-search"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  <input type="text" placeholder="${t('Find a tool…')}" aria-label="${t('Find a tool')}" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="palette-list"><kbd>Esc</kbd></div>
  <ul class="palette-list" id="palette-list" role="listbox"></ul>
</div>`;
    document.body.append(palette);
    const input = palette.querySelector('input');
    const list = palette.querySelector('ul');
    let items = [];
    let active = 0;
    const paint = () => {
      list.querySelectorAll('li').forEach((li, i) => {
        li.setAttribute('aria-selected', String(i === active));
        if (i === active) li.scrollIntoView({ block: 'nearest' });
      });
      input.setAttribute('aria-activedescendant', items.length ? `pal-${active}` : '');
    };
    const render = async () => {
      const all = await toolIndex();
      const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      const recent = recentTools();
      items = all
        .filter((x) => words.every((w) => x.search.includes(w)))
        .sort((a, b) => (words.length ? 0 : (recent.indexOf(a.slug) + 1 || 99) - (recent.indexOf(b.slug) + 1 || 99)));
      active = 0;
      list.innerHTML = items.length
        ? items.map((x, i) => `<li id="pal-${i}" role="option"><a href="${x.href}" tabindex="-1"><strong>${htmlEscape(x.name)}</strong><span>${htmlEscape(x.short)}</span><em>${htmlEscape(x.cat)}</em></a></li>`).join('')
        : `<li class="palette-empty">${t('No tools match that.')}</li>`;
      paint();
    };
    input.addEventListener('input', render);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length) active = (active + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length;
        paint();
      } else if (e.key === 'Enter' && items[active]) {
        e.preventDefault();
        location.href = items[active].href;
      }
    });
    list.addEventListener('mousemove', (e) => {
      const li = e.target.closest('li[id]');
      if (li && list.children[active] !== li) {
        active = [...list.children].indexOf(li);
        paint();
      }
    });
    palette.addEventListener('click', (e) => e.target === palette && palette.close());
    palette.render = render;
  }
  if (palette.open) return;
  const input = palette.querySelector('input');
  input.value = '';
  palette.render();
  palette.showModal();
  input.focus();
}

// --- keyboard shortcuts --------------------------------------------------------------------
function initShortcuts() {
  const mac = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform ?? navigator.platform);
  for (const btn of document.querySelectorAll('[data-palette]')) {
    btn.addEventListener('click', openPalette);
    if (mac) btn.querySelector('kbd')?.replaceChildren('⌘K');
  }
  document.addEventListener('keydown', (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openPalette();
      return;
    }
    // Ctrl/Cmd+Enter runs the tool's main button (Format, Convert, Compare…).
    if (mod && e.key === 'Enter') {
      const primary = document.querySelector('.tool-body .btn.primary:not([disabled])');
      if (primary) {
        e.preventDefault();
        primary.click();
      }
      return;
    }
    // "/" jumps to the search box on the home page, like on most sites with search.
    const typing = e.target.closest?.('input, textarea, select, [contenteditable="true"]');
    if (e.key === '/' && !typing && !mod) {
      const search = document.getElementById('tool-search');
      e.preventDefault();
      if (search) search.focus();
      else openPalette();
    }
  });
}

// --- drop a text file onto any text box to load it ------------------------------------------
const TEXT_LIMIT = 20 * 1024 * 1024;
function initTextDrop() {
  const target = (e) => {
    const ta = e.target.closest?.('textarea');
    return ta && !ta.readOnly && !ta.disabled && e.dataTransfer?.types.includes('Files') ? ta : null;
  };
  document.addEventListener('dragover', (e) => {
    const ta = target(e);
    if (!ta) return;
    e.preventDefault();
    ta.classList.add('drop-over');
  });
  document.addEventListener('dragleave', (e) => target(e)?.classList.remove('drop-over'));
  document.addEventListener('drop', async (e) => {
    const ta = target(e);
    if (!ta) return;
    e.preventDefault();
    ta.classList.remove('drop-over');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.size > TEXT_LIMIT) return toast(t('That file is over 20 MB'));
    if (/^(image|video|audio)\//.test(file.type)) return toast(t('That box takes text files'));
    ta.value = await file.text();
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    toast(t('Loaded {name}', { name: file.name }));
  });
}

// --- "Send to…": hand one tool's result to another ------------------------------------------
// Mark an output with data-send-to="slug,slug". The text travels in sessionStorage, which stays
// in this tab and is never sent anywhere.
const HANDOFF = 'kt-handoff';
function initSendTo() {
  for (const out of document.querySelectorAll('[data-send-to]')) {
    const head = out.closest('.panel')?.querySelector('.panel-head');
    if (!head) continue;
    const wrap = document.createElement('div');
    wrap.className = 'send-to';
    wrap.innerHTML = `<button class="btn small" type="button" aria-haspopup="true" aria-expanded="false">${t('Send to')} <span aria-hidden="true">▾</span></button><div class="send-menu" role="menu" hidden></div>`;
    const btn = wrap.firstElementChild;
    const menu = wrap.lastElementChild;
    (head.querySelector('[data-copy]') ?? head.lastElementChild)?.before(wrap);
    const close = () => {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    };
    toolIndex().then((all) => {
      const slugs = out.dataset.sendTo.split(',').map((s) => s.trim());
      menu.innerHTML = slugs
        .map((s) => all.find((x) => x.slug === s))
        .filter(Boolean)
        .map((x) => `<button type="button" role="menuitem" data-slug="${x.slug}">${htmlEscape(x.name)}</button>`)
        .join('');
    });
    btn.addEventListener('click', () => {
      menu.hidden = !menu.hidden;
      btn.setAttribute('aria-expanded', String(!menu.hidden));
    });
    menu.addEventListener('click', (e) => {
      const slug = e.target.closest('[data-slug]')?.dataset.slug;
      if (!slug) return;
      const text = 'value' in out && out.tagName !== 'PRE' ? out.value : out.textContent;
      if (!text.trim()) {
        close();
        return toast(t('Nothing to send yet'));
      }
      try {
        sessionStorage.setItem(HANDOFF, JSON.stringify({ to: slug, text }));
      } catch {
        close();
        return toast(t('Too large to send. Copy it instead.'));
      }
      location.href = toolHref(slug);
    });
    document.addEventListener('click', (e) => !wrap.contains(e.target) && close());
    wrap.addEventListener('keydown', (e) => e.key === 'Escape' && (close(), btn.focus()));
  }
}

// Fill this tool's main input with text sent from another tool, then run it.
function receiveHandoff() {
  let data;
  try {
    data = JSON.parse(sessionStorage.getItem(HANDOFF) || 'null');
  } catch {
    return;
  }
  if (!data || data.to !== currentSlug) return;
  sessionStorage.removeItem(HANDOFF);
  const input = document.querySelector('.tool-body [data-receive]') ?? document.querySelector('.tool-body textarea:not([readonly])');
  if (!input) return;
  input.value = data.text;
  // The tool's own script runs after this module, so wait for it to attach its listeners.
  setTimeout(() => {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.tool-body .btn.primary')?.click();
    toast(t('Brought over from the last tool'));
  });
}

// --- offline support ------------------------------------------------------------------------
// A small note in the corner with one action and a close button.
function notice(text, action, href, onAction) {
  const el = document.createElement('div');
  el.className = 'notice';
  el.setAttribute('role', 'status');
  el.innerHTML = `<span>${htmlEscape(text)}</span><a class="btn small primary" href="${href}">${htmlEscape(action)}</a><button type="button" class="notice-x" aria-label="${htmlEscape(t('Dismiss'))}">×</button>`;
  if (onAction) el.querySelector('a').addEventListener('click', (e) => (e.preventDefault(), onAction()));
  el.querySelector('.notice-x').addEventListener('click', () => {
    el.remove();
    if (onAction === undefined) storage.set('kt-lang-hint', 'off');
  });
  document.body.append(el);
}

function initOffline() {
  if (!('serviceWorker' in navigator) || !isSecureContext) return;
  // A deploy installs a new service worker, which takes over straight away. Tell people already
  // on the page, so they can reload into the new version.
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController) notice(t('A new version of the site is ready.'), t('Refresh'), '#', () => location.reload());
  });
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

// Thai readers on an English page get a one-time pointer to the Thai version.
function suggestThai() {
  if (lang !== 'en' || storage.get('kt-lang-hint') === 'off') return;
  const th = document.querySelector('link[rel="alternate"][hreflang="th"]');
  if (!th || !(navigator.languages || [navigator.language]).some((l) => /^th\b/i.test(l))) return;
  notice('อ่านหน้านี้เป็นภาษาไทย', 'ภาษาไทย', new URL(th.href, location.href).pathname);
}

initTheme();
initCopyButtons();
initScroller();
initShortcuts();
initTextDrop();
initSendTo();
receiveHandoff();
rememberTool();
initOffline();
suggestThai();
signConsole();
