// Shared page behaviour: theme toggle, copy/download helpers, persisted inputs, share links.
import { base64Encode, base64Decode, htmlEscape } from './lib/encode.js';

export const $ = (sel, root = document) => root.querySelector(sel);

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
  toast('Copied to clipboard');
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
    toast('Input is too large to share as a link');
    return;
  }
  history.replaceState(null, '', url);
  copyText(url).then(() => toast('Share link copied'));
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

initTheme();
initCopyButtons();
initScroller();
