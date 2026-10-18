// Home page: instant tool search and the tools you used last.
import { $, recentTools, escapeHtml, t } from './ui.js';

const input = $('#tool-search');
const empty = $('#no-results');

// Recently used: built from the cards already on the page, so it needs no extra data.
const recent = recentTools()
  .map((slug) => document.querySelector(`#all-tools .tool-card[data-slug="${slug}"]`))
  .filter(Boolean)
  .slice(0, 6);
let recentSection;
if (recent.length) {
  recentSection = document.createElement('section');
  recentSection.className = 'cat-section recent';
  recentSection.innerHTML = `<div class="cat-head"><h2>${t('Pick up where you left off')}</h2></div><div class="recent-list">${recent
    .map((card) => `<a href="${card.getAttribute('href')}">${card.querySelector('.tool-icon')?.outerHTML ?? ''}${escapeHtml(card.querySelector('strong').textContent)}</a>`)
    .join('')}</div>`;
  $('#all-tools').before(recentSection);
}

input?.addEventListener('input', () => {
  const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
  if (recentSection) recentSection.hidden = words.length > 0;
  let shown = 0;
  for (const section of document.querySelectorAll('[data-cat]')) {
    let inSection = 0;
    for (const card of section.querySelectorAll('.tool-card')) {
      const match = words.every((w) => card.dataset.search.includes(w));
      card.hidden = !match;
      inSection += match;
    }
    section.hidden = !inSection;
    shown += inSection;
  }
  empty.hidden = shown > 0;
});

// Enter in the search box opens the first match.
input?.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const first = document.querySelector('#all-tools .tool-card:not([hidden])');
  if (first && input.value.trim()) first.click();
});
