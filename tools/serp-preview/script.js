import { $, persist, escapeHtml, t } from '/assets/js/ui.js';
import { truncateToWidth, LIMITS } from '/assets/js/lib/seo.js';
import { measure } from '/assets/js/shared/serp-measure.js';

const title = $('#title');
const desc = $('#desc');
const url = $('#url');
const device = $('#device');
const preview = $('#preview');
const titleMeter = $('#title-meter');
const descMeter = $('#desc-meter');
persist(title, desc, url, device);

function meter(el, px, max, chars, truncated) {
  const pct = Math.min(100, (100 * px) / max);
  el.className = `meter${px > max ? ' over' : ''}`;
  el.innerHTML = `<i style="width:${pct}%"></i>`;
  el.nextElementSibling.textContent = t('{chars} characters · {px} / {max}px', { chars, px: Math.round(px), max: Math.round(max) }) + (px > max ? truncated : '');
}

function breadcrumb(raw) {
  try {
    const u = new URL(/^https?:\/\//.test(raw) ? raw : `https://${raw}`);
    const parts = u.pathname.split('/').filter(Boolean).map(decodeURIComponent);
    return { host: u.hostname.replace(/^www\./, ''), origin: u.origin, path: parts.length ? ` › ${parts.join(' › ')}` : '' };
  } catch {
    return { host: raw || 'example.com', origin: raw, path: '' };
  }
}

function run() {
  const mobile = device.value === 'mobile';
  // Mobile results wrap the title onto two lines, so the budget is wider.
  const titleMax = mobile ? LIMITS.titlePx * 1.55 : LIMITS.titlePx;
  const descMax = mobile ? LIMITS.descPx * 0.75 : LIMITS.descPx;
  const ti = title.value || t('Your page title');
  const d = desc.value || t('Your meta description. If it is missing, Google picks a snippet from the page content instead.');
  const tPx = measure(ti, 'title');
  const dPx = measure(d, 'desc');
  meter(titleMeter, tPx, titleMax, [...title.value].length, t(' · title will be truncated'));
  meter(descMeter, dPx, descMax, [...desc.value].length, t(' · description will be truncated'));
  const tt = truncateToWidth(ti, titleMax, (s) => measure(s, 'title'));
  const dd = truncateToWidth(d, descMax, (s) => measure(s, 'desc'));
  const b = breadcrumb(url.value);
  preview.className = `serp${mobile ? ' mobile' : ''}`;
  preview.innerHTML = `<div class="serp-site"><span class="fav" aria-hidden="true">${escapeHtml(b.host[0]?.toUpperCase() || '•')}</span><div><div>${escapeHtml(b.host)}</div><div class="serp-url">${escapeHtml(b.origin + b.path)}</div></div></div>
    <div class="serp-title">${escapeHtml(tt.text)}</div><div class="serp-desc">${escapeHtml(dd.text)}</div>`;
}

for (const el of [title, desc, url, device]) el.addEventListener('input', run);
run();
