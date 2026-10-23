import { $, toast, download, debounce, escapeHtml, t, lang } from '/assets/js/ui.js';
import { PLATFORMS, PLATFORM_ORDER, THEMES, THEME_ORDER, pageCss, pageBody, renderPage, linkUrl, linkTitle, linkIcon } from './page.js';
import { parseTarget } from '/assets/js/lib/promptpay.js';

const STORE_KEY = 'kt:link-in-bio';
const creditUrl = `${location.origin}/tools/link-in-bio/`;

let nextId = 1;
const newId = () => `l${Date.now().toString(36)}${nextId++}`;

function freshState() {
  return {
    name: lang === 'th' ? 'มะลิ แฮนด์เมด' : 'Mali’s Handmade',
    bio: lang === 'th' ? 'เครื่องเงินทำมือจากเชียงใหม่ ส่งทั่วไทยและต่างประเทศ' : 'Silver jewellery made by hand in Chiang Mai. Ships worldwide.',
    avatar: '',
    links: [
      { id: newId(), type: 'platform', platform: 'instagram', handle: '@malishandmade', title: '' },
      { id: newId(), type: 'platform', platform: 'shopee', handle: '', title: t('Shop on Shopee') },
      { id: newId(), type: 'platform', platform: 'whatsapp', handle: '', title: t('Order on WhatsApp') },
      { id: newId(), type: 'custom', title: t('Care guide for silver'), url: '' },
    ],
    theme: 'light',
    colors: {},
    shape: 'rounded',
    font: 'sans',
    icons: 'brand',
    credit: true,
    meta: {},
    pay: {},
  };
}

let state = freshState();
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
  if (saved && Array.isArray(saved.links)) state = { ...state, ...saved, colors: { ...saved.colors }, meta: { ...saved.meta }, pay: { ...saved.pay } };
} catch {
  // Nothing saved, or storage is blocked: start with the example.
}

const save = debounce(() => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Over the storage quota (a big photo); the page still works, it just won't be remembered.
  }
}, 400);

// --- preview -------------------------------------------------------------------------------

// A shadow root keeps this site's styles out of the preview, so it looks exactly like the download.
const shadow = $('#preview').attachShadow({ mode: 'open' });
const htmlOut = $('#html-out');

function render() {
  // Drawn at real phone width (about 390px) and zoomed down to fit the frame.
  shadow.innerHTML = `<style>:host{display:block;height:100%}${pageCss(state)}.kb{min-height:100%;width:var(--lib-w,390px);zoom:var(--lib-zoom,.72);min-height:calc(100% / var(--lib-zoom,.72))}</style><div class="kb">${pageBody({ ...state, lang }, { preview: true, creditUrl })}</div>`;
  // The preview is only a picture; following links from it would leave the editor.
  for (const a of shadow.querySelectorAll('a')) a.addEventListener('click', (e) => e.preventDefault());
  htmlOut.value = renderPage({ ...state, lang }, { creditUrl });
  const kb = new Blob([htmlOut.value]).size / 1024;
  const missing = state.links.filter((l) => !linkUrl(l)).length;
  const size = kb < 10 ? kb.toFixed(1) : Math.round(kb);
  $('#size-note').textContent = [
    t('The page is {kb} KB.', { kb: size }),
    missing === 1 ? t('1 link has no address yet and won’t be included.') : missing ? t('{n} links have no address yet and won’t be included.', { n: missing }) : '',
  ].filter(Boolean).join(' ');
  save();
}

// --- profile -------------------------------------------------------------------------------

for (const el of document.querySelectorAll('[data-k]')) {
  el.value = state[el.dataset.k] ?? '';
  el.addEventListener('input', () => {
    state[el.dataset.k] = el.value;
    render();
  });
}
for (const el of document.querySelectorAll('[data-meta]')) {
  el.value = state.meta[el.dataset.meta] ?? '';
  el.addEventListener('input', () => {
    state.meta = { ...state.meta, [el.dataset.meta]: el.value.trim() };
    render();
  });
}

const payNote = $('#pay-note');
const payHint = payNote?.textContent;
for (const el of document.querySelectorAll('[data-pay]')) {
  el.value = state.pay[el.dataset.pay] ?? '';
  el.addEventListener('input', () => {
    state.pay = { ...state.pay, [el.dataset.pay]: el.value.trim() };
    const bad = state.pay.id && !parseTarget(state.pay.id);
    payNote.textContent = bad ? t('That isn’t a Thai mobile number, 13-digit ID or 15-digit e-wallet ID yet.') : payHint;
    payNote.classList.toggle('err-text', Boolean(bad));
    render();
  });
}

const avatarSlot = $('#avatar-slot');
const avatarInput = $('#avatar-input');
function showAvatar() {
  avatarSlot.style.backgroundImage = state.avatar ? `url("${state.avatar}")` : '';
  avatarSlot.classList.toggle('filled', !!state.avatar);
  $('#avatar-remove').hidden = !state.avatar;
}

// Shrink to a small square so the page stays light: cropped from the centre, 240×240.
async function shrinkSquare(file, size = 240) {
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  const c = document.createElement('canvas');
  c.width = c.height = Math.min(size, side);
  const ctx = c.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, c.width, c.height);
  bmp.close();
  const webp = c.toDataURL('image/webp', 0.84);
  return webp.startsWith('data:image/webp') ? webp : c.toDataURL('image/jpeg', 0.86);
}

for (const el of [avatarSlot, $('#avatar-pick')]) el.addEventListener('click', () => avatarInput.click());
avatarSlot.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), avatarInput.click()));
avatarInput.addEventListener('change', async () => {
  const file = avatarInput.files[0];
  avatarInput.value = '';
  if (!file) return;
  try {
    state.avatar = await shrinkSquare(file);
    showAvatar();
    render();
  } catch {
    toast(t('That file couldn’t be opened as an image'));
  }
});
$('#avatar-remove').addEventListener('click', () => {
  state.avatar = '';
  showAvatar();
  render();
});

// --- links -----------------------------------------------------------------------------------

const list = $('#links');
const ICON_BTN = {
  up: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="m6 15 6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  down: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  remove: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  grip: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><g fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></g></svg>',
};

function statusFor(link) {
  const url = linkUrl(link);
  if (url) return `${escapeHtml(t('Goes to'))} <a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(url.replace(/^https?:\/\//, '').slice(0, 70))}</a>`;
  if (link.type === 'platform') return escapeHtml(t('Add your {what} to make this work.', { what: t(PLATFORMS[link.platform].handle.label) }));
  return escapeHtml(link.url ? t('That doesn’t look like a web address. Try something like https://yourshop.com') : t('Add a web address to make this work.'));
}

function rowHtml(link, i, n) {
  const p = link.type === 'platform' ? PLATFORMS[link.platform] : null;
  const fields = p
    ? `<label class="lib-fld"><span>${escapeHtml(t(p.handle.label))}</span><input type="text" data-f="handle" value="${escapeHtml(link.handle || '')}" placeholder="${escapeHtml(p.handle.placeholder)}" spellcheck="false" maxlength="300"></label>
       <label class="lib-fld"><span>${escapeHtml(t('Button text'))}</span><input type="text" data-f="title" value="${escapeHtml(link.title || '')}" placeholder="${escapeHtml(linkTitle({ ...link, title: '' }, lang))}" maxlength="80"></label>`
    : `<label class="lib-fld"><span>${escapeHtml(t('Button text'))}</span><input type="text" data-f="title" value="${escapeHtml(link.title || '')}" placeholder="${escapeHtml(t('My website'))}" maxlength="80"></label>
       <label class="lib-fld"><span>${escapeHtml(t('Web address'))}</span><input type="text" data-f="url" value="${escapeHtml(link.url || '')}" placeholder="https://" spellcheck="false" maxlength="500"></label>`;
  return `<li class="lib-link" data-id="${link.id}">
  <div class="lib-link-top">
    <span class="lib-grip" title="${escapeHtml(t('Drag to move'))}" aria-hidden="true">${ICON_BTN.grip}</span>
    <span class="lib-link-ico">${linkIcon(link, 'brand')}</span>
    <strong>${escapeHtml(p ? p.name : t('Website or other link'))}</strong>
    <span class="lib-link-actions">
      <button type="button" class="lib-icon-btn" data-act="up" aria-label="${escapeHtml(t('Move up'))}"${i === 0 ? ' disabled' : ''}>${ICON_BTN.up}</button>
      <button type="button" class="lib-icon-btn" data-act="down" aria-label="${escapeHtml(t('Move down'))}"${i === n - 1 ? ' disabled' : ''}>${ICON_BTN.down}</button>
      <button type="button" class="lib-icon-btn" data-act="remove" aria-label="${escapeHtml(t('Remove link'))}">${ICON_BTN.remove}</button>
    </span>
  </div>
  <div class="lib-link-fields">${fields}</div>
  <p class="lib-link-status">${statusFor(link)}</p>
</li>`;
}

function renderLinks() {
  list.innerHTML = state.links.length ? state.links.map((l, i) => rowHtml(l, i, state.links.length)).join('') : `<li class="lib-empty">${escapeHtml(t('No links yet. Add your first one below.'))}</li>`;
}

const findLink = (el) => {
  const li = el.closest('[data-id]');
  return li ? [li, state.links.findIndex((l) => l.id === li.dataset.id)] : [null, -1];
};

list.addEventListener('input', (e) => {
  const f = e.target.dataset.f;
  const [li, i] = findLink(e.target);
  if (!f || i < 0) return;
  state.links[i] = { ...state.links[i], [f]: e.target.value };
  li.querySelector('.lib-link-status').innerHTML = statusFor(state.links[i]);
  render();
});

function move(from, to) {
  if (to < 0 || to >= state.links.length || from === to) return;
  const links = [...state.links];
  const [item] = links.splice(from, 1);
  links.splice(to, 0, item);
  state.links = links;
  renderLinks();
  render();
}

list.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const [, i] = findLink(btn);
  const act = btn.dataset.act;
  if (act === 'remove') {
    state.links = state.links.filter((_, j) => j !== i);
    renderLinks();
    render();
  } else {
    const to = act === 'up' ? i - 1 : i + 1;
    move(i, to);
    list.querySelector(`[data-id="${state.links[to].id}"] [data-act="${act}"]:not([disabled])`)?.focus();
  }
});

// Drag to reorder, started from the grip so text in the fields can still be selected.
let dragId = null;
list.addEventListener('pointerdown', (e) => {
  const li = e.target.closest('.lib-grip') && e.target.closest('[data-id]');
  if (li) li.draggable = true;
});
list.addEventListener('dragstart', (e) => {
  const li = e.target.closest('[data-id]');
  if (!li) return;
  dragId = li.dataset.id;
  li.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragId);
});
list.addEventListener('dragover', (e) => {
  if (!dragId) return;
  e.preventDefault();
  const over = e.target.closest('[data-id]');
  const dragging = list.querySelector('.dragging');
  if (!over || over === dragging) return;
  const rect = over.getBoundingClientRect();
  over[e.clientY > rect.top + rect.height / 2 ? 'after' : 'before'](dragging);
});
list.addEventListener('dragend', () => {
  const order = [...list.querySelectorAll('[data-id]')].map((li) => li.dataset.id);
  for (const li of list.querySelectorAll('[data-id]')) li.draggable = false;
  dragId = null;
  state.links = order.map((id) => state.links.find((l) => l.id === id)).filter(Boolean);
  renderLinks();
  render();
});

const addSelect = $('#add-platform');
addSelect.innerHTML = `<optgroup label="${escapeHtml(t('Platforms'))}">${PLATFORM_ORDER.map((id) => `<option value="${id}">${escapeHtml(PLATFORMS[id].name)}</option>`).join('')}</optgroup><optgroup label="${escapeHtml(t('Other'))}"><option value="custom">${escapeHtml(t('Website or any other link'))}</option></optgroup>`;
$('#add-link').addEventListener('click', () => {
  const v = addSelect.value;
  const link = v === 'custom' ? { id: newId(), type: 'custom', title: '', url: '' } : { id: newId(), type: 'platform', platform: v, handle: '', title: '' };
  state.links = [...state.links, link];
  renderLinks();
  render();
  list.querySelector(`[data-id="${link.id}"] input`)?.focus();
});

// --- style ------------------------------------------------------------------------------------

$('#themes').innerHTML = THEME_ORDER.map((id) => {
  const th = THEMES[id];
  return `<button type="button" role="radio" data-theme-id="${id}" aria-checked="false"><span class="lib-swatch" style="background:${th.bg}"><i style="background:${th.button};border-color:${th.border}"></i><i style="background:${th.button};border-color:${th.border}"></i></span><span>${escapeHtml(t(th.name))}</span></button>`;
}).join('');

function setSeg(id, value) {
  for (const b of document.querySelectorAll(`#${id} [data-v]`)) b.setAttribute('aria-pressed', String(b.dataset.v === value));
}

function fillStyle() {
  for (const b of document.querySelectorAll('[data-theme-id]')) b.setAttribute('aria-checked', String(b.dataset.themeId === state.theme));
  for (const id of ['shape', 'font', 'icons']) setSeg(id, state[id]);
  const look = THEMES[state.theme] || THEMES.light;
  // Colour pickers need #rrggbb; show the look's colour when it has a plain one.
  const solid = (v, fallback) => (/^#[0-9a-f]{6}$/i.test(v || '') ? v : fallback);
  for (const el of document.querySelectorAll('[data-color]')) {
    const k = el.dataset.color;
    el.value = solid(state.colors[k], solid(look[k], k === 'bg' || k === 'button' ? '#ffffff' : '#111111'));
    el.closest('label').classList.toggle('set', !!state.colors[k]);
  }
  $('#credit').checked = state.credit !== false;
}

$('#themes').addEventListener('click', (e) => {
  const b = e.target.closest('[data-theme-id]');
  if (!b) return;
  state.theme = b.dataset.themeId;
  state.colors = {};
  fillStyle();
  render();
});
for (const id of ['shape', 'font', 'icons']) {
  $(`#${id}`).addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    state[id] = b.dataset.v;
    setSeg(id, b.dataset.v);
    if (id === 'icons') renderLinks();
    render();
  });
}
for (const el of document.querySelectorAll('[data-color]')) {
  el.addEventListener('input', () => {
    state.colors = { ...state.colors, [el.dataset.color]: el.value };
    el.closest('label').classList.add('set');
    render();
  });
}
$('#colors-reset').addEventListener('click', () => {
  state.colors = {};
  fillStyle();
  render();
});
$('#credit').addEventListener('change', (e) => {
  state.credit = e.target.checked;
  render();
});

// --- tabs and download ---------------------------------------------------------------------------

const tabs = [...document.querySelectorAll('[data-tab]')];
for (const tab of tabs) {
  tab.addEventListener('click', () => {
    for (const other of tabs) other.setAttribute('aria-selected', String(other === tab));
    for (const panel of document.querySelectorAll('[data-panel]')) panel.hidden = panel.dataset.panel !== tab.dataset.tab;
  });
}

$('#download').addEventListener('click', () => {
  // Plain ASCII file names download reliably everywhere.
  const slug =
    String(state.name || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'my';
  download(`${slug}-links.html`, renderPage({ ...state, lang }, { creditUrl }), 'text/html');
  toast(t('Page downloaded'));
});

showAvatar();
renderLinks();
fillStyle();
render();
