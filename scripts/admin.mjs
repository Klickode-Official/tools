// The tool switchboard at /admin/: every tool with an on/off switch. It isn't linked from the
// site and is kept out of search. Saving writes tools.config.json to GitHub with the owner's
// own token (see assets/js/admin.js), and the host rebuilds the site from that commit.
import { esc } from './layout.mjs';

export const ADMIN_REPO = 'klickode-studio/tools';
export const ADMIN_BRANCH = 'main';

export function adminBody({ allTools, off, categories }) {
  const data = { tools: allTools.map((t) => ({ slug: t.slug, name: t.name })), disabled: [...off].sort(), repo: ADMIN_REPO, branch: ADMIN_BRANCH };
  const groups = categories
    .map((c) => [c, allTools.filter((t) => t.category === c.id)])
    .filter(([, list]) => list.length)
    .map(
      ([c, list]) => `<h2>${esc(c.name)}</h2>
<ul class="admin-list">${list
        .map(
          (t) => `<li><label class="admin-row" data-row="${t.slug}"><input type="checkbox" role="switch" data-slug="${t.slug}"${off.has(t.slug) ? '' : ' checked'} disabled><span class="admin-name">${esc(t.name)}${t.variantOf ? ' <small>landing page</small>' : ''}</span><a href="/tools/${t.slug}/" target="_blank" rel="noopener">View</a></label></li>`,
        )
        .join('')}</ul>`,
    )
    .join('\n');
  return `<header class="page-head"><h1>Tool switchboard</h1><p class="lede">Turn any tool on or off. Saving updates <code>tools.config.json</code> on GitHub, and the site rebuilds by itself in a minute or two. A tool that’s off disappears from menus, search and the sitemap, and its address shows a friendly “taking a break” page.</p></header>
<section class="tool admin" aria-label="Tool switchboard">
  <div class="tool-body">
    <details class="admin-setup" id="setup">
      <summary>GitHub connection</summary>
      <div class="admin-fields">
        <label>Access token <input type="password" id="token" autocomplete="off" spellcheck="false" placeholder="github_pat_…"></label>
        <label>Repository <input type="text" id="repo" spellcheck="false"></label>
        <label>Branch <input type="text" id="branch" spellcheck="false"></label>
      </div>
      <label class="admin-remember"><input type="checkbox" id="remember"> Remember on this device</label>
      <p class="admin-help">Create a <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">fine-grained token</a> for this repository only, with <strong>Contents: Read and write</strong>. It goes straight from this page to GitHub and is never sent anywhere else. Leave “Remember” off on shared computers.</p>
      <button class="btn primary" id="connect" type="button">Connect</button>
    </details>
    <div class="status" id="status" aria-live="polite"></div>
    <div class="toolbar admin-actions"><button class="btn primary" id="save" type="button" disabled>Save changes</button><button class="btn" id="undo" type="button" disabled>Undo</button><span class="admin-summary" id="summary"></span></div>
${groups}
  </div>
</section>
<script type="application/json" id="admin-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}
