// Home page: instant tool search.
import { $ } from './ui.js';

const input = $('#tool-search');
const empty = $('#no-results');

input?.addEventListener('input', () => {
  const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
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
