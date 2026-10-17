// Scaffold a new tool folder:  npm run new-tool -- <slug> <category>
// Categories: see scripts/categories.mjs (images, json, seo, text, encoding).
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categoryById } from './categories.mjs';

const [slug, category = 'text'] = process.argv.slice(2);
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run new-tool -- <slug> <category>\n  slug: lowercase-with-hyphens, used in the URL /tools/<slug>/');
  process.exit(1);
}
if (!categoryById[category]) {
  console.error(`Unknown category "${category}". Use one of: ${Object.keys(categoryById).join(', ')}`);
  process.exit(1);
}
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'tools', slug);
if (await stat(dir).then(() => true, () => false)) {
  console.error(`tools/${slug} already exists`);
  process.exit(1);
}
const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
await mkdir(dir, { recursive: true });
await writeFile(
  join(dir, 'tool.mjs'),
  `// ${name}: page copy and SEO details. What the page does lives in ./script.js.
export default {
  slug: '${slug}',
  category: '${category}',
  name: '${name}',
  // <title> and meta description: what shows in Google. Keep title ≲ 60 chars, description ≲ 160.
  title: '${name}: TODO main keyword phrase',
  description: 'TODO: one or two sentences with the phrase people search for. Mention that it is free and runs in the browser.',
  // One line for tool cards on the home and category pages.
  short: 'TODO: what it does in under 60 characters.',
  body: \`<div class="panel"><div class="panel-head"><label for="input">Input</label><button class="btn small" id="clear">Clear</button></div>
<textarea id="input" spellcheck="false"></textarea></div>
<div class="status" id="status" aria-live="polite"></div>
<pre class="output" id="output" tabindex="0"></pre>\`,
  content: \`<h2>How to use the ${name}</h2>
<p>TODO: a short how-to. This text is what search engines index, so write it for people.</p>\`,
  faq: [
    {
      q: 'Is my data uploaded?',
      a: 'No. Everything runs in your browser.',
    },
  ],
};
`,
);
await writeFile(
  join(dir, 'script.js'),
  `import { $, persist, setStatus } from '/assets/js/ui.js';

const input = $('#input');
const output = $('#output');
const status = $('#status');
persist(input);

function run() {
  output.textContent = input.value; // TODO
  setStatus(status, input.value ? 'Done' : '', true);
}

input.addEventListener('input', run);
$('#clear').addEventListener('click', () => {
  input.value = '';
  run();
});
run();
`,
);
console.log(`Created tools/${slug}/tool.mjs and tools/${slug}/script.js. Run npm run build to see it at /tools/${slug}/.`);
