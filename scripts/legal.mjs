// Legal pages: terms, privacy, disclaimer, copyright. Rendered by build.mjs at /<slug>/.
// Written to match the privacy policy on klickode.com. Have a lawyer review before relying on them.
export const COMPANY = 'Klickode Studio Ltd.';
export const CONTACT_EMAIL = 'klickode@gmail.com';
export const CONTACT_URL = 'https://www.klickode.com/contact';
export const UPDATED = '17 October 2026';
export const STUDIO_SITE = 'https://www.klickode.com/';

// One line of brand identity, repeated where customers don't see it but anyone inspecting does:
// the HTML source, the top of every CSS/JS file, image metadata and the developer console.
export const BRAND_NOTICE = `© ${new Date().getFullYear()} ${'Klickode Studio Ltd.'} All rights reserved. Klickode™ and the Klickode logo are trademarks of Klickode Studio Ltd. Unauthorised copying is prohibited. ${'https://www.klickode.com/'}`;

const mail = `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`;

const toc = (items) =>
  `<nav class="legal-toc" aria-label="On this page"><span class="eyebrow dot">On this page</span><ol>${items.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('')}</ol></nav>`;

const page = ({ title, lede, sections }) => `<section class="content legal">
<header class="page-head"><span class="eyebrow dot">Legal</span><h1>${title}</h1><p class="lede">${lede}</p><p class="legal-meta">Last updated ${UPDATED}</p></header>
${toc(sections.map(([id, h]) => [id, h]))}
${sections.map(([id, h, body]) => `<h2 id="${id}">${h}</h2>\n${body}`).join('\n')}
<p class="legal-foot">Questions about this page? Write to ${mail} or use the <a href="${CONTACT_URL}">contact form on klickode.com</a>.</p>
</section>`;

export const legalPages = [
  {
    slug: 'terms',
    title: 'Terms of Use',
    description: 'The rules for using Klickode Tools, who owns what, and what needs our permission.',
    body: page({
      title: 'Terms of Use',
      lede: `These terms cover your use of Klickode Tools. By using the site you agree to them. If you don’t agree, please don’t use the site.`,
      sections: [
        ['who', 'Who we are', `<p>Klickode Tools is run by ${COMPANY} (“Klickode”, “we”), a website design and development studio in Bangkok, Thailand. You can reach us at ${mail}.</p>`],
        [
          'using',
          'Using the tools',
          `<p>The tools are free to use for any lawful purpose, personal or commercial. You don’t need an account.</p>
<p>You’re responsible for the files, text and data you put into the tools, and for making sure you have the right to use them. Don’t use the tools to process material you aren’t allowed to handle, or to break any law.</p>`,
        ],
        [
          'yours',
          'Your files and your results',
          `<p>The tools run in your browser, so your files stay on your device (see our <a href="/privacy/">Privacy Policy</a>). <strong>Anything you put in, and anything the tools produce from it, is yours.</strong> We claim no rights over it.</p>
<p>That includes the code and images made with the <a href="/tools/shop-card-maker/">Shop Card Maker</a>: you may use them on your own website, shop pages and social media. Platform names and logos that appear on those cards still belong to their owners, so use them only to point people to your own page on that platform.</p>`,
        ],
        [
          'ours',
          'Our content and what needs permission',
          `<p>Everything else on this site belongs to ${COMPANY} or the people who licensed it to us. That includes the text, page designs, layouts, illustrations, icons, graphics, social images, the Klickode name and logo, the source code, and the way the tools are selected and arranged. It is protected by the Copyright Act B.E. 2537 of Thailand and by international copyright treaties.</p>
<p><strong>You may not, without our written permission:</strong></p>
<ul>
<li>copy, reproduce, republish, sell or distribute any part of the site’s content, design or code;</li>
<li>build a copy or close imitation of the site or its tools, or reuse our code in another product;</li>
<li>frame or mirror the site, or present our tools as your own;</li>
<li>scrape, crawl or bulk-download the site with automated tools, other than normal search engine indexing;</li>
<li>use the site’s content, code or images to train or improve machine learning or AI systems;</li>
<li>use the Klickode name or logo, or suggest that we endorse you.</li>
</ul>
<p><strong>You don’t need to ask to:</strong> use the tools, share links to any page, or quote a sentence or two with a link back to the page it came from. The <a href="/copyright/">Copyright &amp; Permissions</a> page explains how to ask for anything else.</p>`,
        ],
        [
          'conduct',
          'Things you must not do',
          `<ul>
<li>Try to break, overload or get around the security of the site.</li>
<li>Reverse engineer the site to copy how the tools work, except where the law expressly allows it.</li>
<li>Use the site to distribute malware, spam or anything illegal.</li>
</ul>`,
        ],
        [
          'trademarks',
          'Trademarks',
          `<p>“Klickode” and the Klickode logo are trademarks of ${COMPANY}. Other names and logos on the site, such as Etsy, TikTok, WhatsApp, Instagram, Shopee and Google, are trademarks of their owners. We aren’t affiliated with or endorsed by any of them.</p>`,
        ],
        [
          'warranty',
          'No warranty and limits on liability',
          `<p>The tools are provided as they are, free of charge. Our <a href="/disclaimer/">Disclaimer</a> explains what we do and don’t promise. As far as the law allows, ${COMPANY} isn’t liable for any loss or damage that comes from using, or not being able to use, the site or its results.</p>`,
        ],
        [
          'changes',
          'Changes',
          `<p>We may change these terms, or change or remove tools, at any time. The date at the top shows when the terms last changed. If you keep using the site after a change, the new terms apply.</p>`,
        ],
        [
          'law',
          'Governing law',
          `<p>These terms are governed by the laws of Thailand. Any dispute will be handled by the courts of Thailand.</p>`,
        ],
      ],
    }),
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'What Klickode Tools collects (almost nothing), what stays in your browser, and your rights under Thailand’s PDPA.',
    body: page({
      title: 'Privacy Policy',
      lede: `The short version: the tools work inside your browser, so the files and text you use them on never reach us.`,
      sections: [
        [
          'who',
          'Who we are',
          `<p>Klickode Tools is run by ${COMPANY}, Bangkok, Thailand. For anything this policy covers, we are the data controller under Thailand’s Personal Data Protection Act B.E. 2562 (“PDPA”). Questions or requests about your data: ${mail}.</p>
<p>This policy covers this tools site only. The main Klickode website has its own <a href="https://www.klickode.com/privacy">privacy policy</a>.</p>`,
        ],
        [
          'tools',
          'The files and text you put into the tools',
          `<p>Images, documents, text, tokens and other data you put into a tool are processed by code running in your own browser. <strong>They are not uploaded to us or to anyone else</strong>, and we can’t see them.</p>`,
        ],
        [
          'browser',
          'What is stored in your own browser',
          `<p>To save you retyping, some tools remember your last input in your browser’s local storage. This stays on your device and is never sent to us. It includes:</p>
<ul>
<li>your light or dark theme choice;</li>
<li>the last text you typed into most text tools (the JWT decoder deliberately doesn’t save anything, because tokens work like passwords);</li>
<li>your Shop Card Maker settings, including any pictures you added to the card.</li>
</ul>
<p>The site also remembers which tools you used last (to list them on the home page), and when you use <strong>Send to</strong> to move a result into another tool, the text is held for a moment in this tab’s session storage, which is cleared when you close the tab.</p>
<p>So the tools keep working without a connection, your browser keeps a copy of the site’s own pages, scripts and fonts (a “service worker” cache). It holds only our files, never anything you put into a tool.</p>
<p>To open iPhone photos (HEIC) in browsers that can’t read them, the image tools download a decoder from this site the first time you add one. The photo is decoded in your browser and is not uploaded.</p>
<p>Images you convert, compress or resize are never stored. To clear what’s saved, use a tool’s Clear button or clear this site’s data in your browser settings.</p>`,
        ],
        [
          'share',
          'Share links',
          `<p>Some tools can make a share link. The content sits in the part of the link after the <code>#</code>, which browsers don’t send to web servers. Anyone you give the link to can read it, so share it the way you would share the content itself.</p>`,
        ],
        [
          'logs',
          'Hosting and server logs',
          `<p>Our hosting provider delivers the site’s pages and keeps standard server logs (internet address, browser type, the page requested and the time) for security and to keep the site running. These logs never contain what you put into the tools. They are kept by the provider for a limited time and used for no other purpose (our legitimate interest in running a secure website, PDPA section 24(5)).</p>`,
        ],
        [
          'cookies',
          'Cookies and analytics',
          `<p>This site sets no cookies and uses no analytics, advertising or tracking scripts. All fonts and files are served from this site, so no third party learns that you visited. If that ever changes, we’ll update this policy first and ask for your consent where the law requires it.</p>`,
        ],
        [
          'links',
          'Links to other sites',
          `<p>Some pages link to other websites, such as klickode.com or a platform like Etsy. Their own privacy policies apply once you leave this site.</p>`,
        ],
        [
          'rights',
          'Your rights',
          `<p>Under the PDPA you can ask to see, correct, delete, or get a copy of personal data we hold about you, object to or limit how we use it, and withdraw consent you gave. Because the tools don’t send us your data, in practice the only data we might hold is the server logs above and any email you send us. Write to ${mail} and we’ll reply within 30 days. You can also complain to Thailand’s Personal Data Protection Committee.</p>`,
        ],
        [
          'changes',
          'Changes to this policy',
          `<p>If we change this policy, we’ll update the date at the top of this page.</p>`,
        ],
      ],
    }),
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    description: 'Klickode Tools are free and provided as they are. Check results before relying on them.',
    body: page({
      title: 'Disclaimer',
      lede: `We build these tools carefully and test them, but they are free and provided as they are. Please check the results before you rely on them.`,
      sections: [
        [
          'as-is',
          'Provided as they are',
          `<p>The tools are provided “as is” and “as available”, without warranties of any kind, whether express or implied. That includes warranties that the tools will be accurate, complete, error-free, uninterrupted, or fit for a particular purpose. We may change, pause or remove any tool at any time.</p>`,
        ],
        [
          'check',
          'Check your results',
          `<p>Treat every result as a helpful starting point, and check it before it goes anywhere important. In particular:</p>
<ul>
<li>Converted or compressed images can lose quality. Keep your originals.</li>
<li>The regex tester uses your browser’s JavaScript engine, which can behave differently from other languages.</li>
<li>The JWT decoder only reads a token. It doesn’t check the signature, so it can’t tell you whether a token is genuine.</li>
<li>Generated JSON schemas, CSV conversions and timestamps should be checked against your real data.</li>
</ul>`,
        ],
        [
          'advice',
          'Not professional advice',
          `<p>Nothing on this site is legal, financial, security or professional advice. The SEO tools give general guidance only and can’t promise any search ranking.</p>`,
        ],
        [
          'shop-cards',
          'Shop cards and third-party brands',
          `<p>The <a href="/tools/shop-card-maker/">Shop Card Maker</a> shows only what you type: ratings, sales, reviews and follower counts aren’t checked by us, and you’re responsible for keeping them true. Platform names and logos belong to their owners. Klickode isn’t affiliated with or endorsed by Etsy, TikTok, Meta (Facebook, Instagram, WhatsApp), LINE, Shopee, Lazada, Amazon, eBay, Shopify, Google, YouTube or Telegram. Follow each platform’s brand rules when you use their name or logo.</p>`,
        ],
        [
          'links',
          'Links to other websites',
          `<p>Links to other sites are there for convenience. We don’t control those sites and aren’t responsible for their content or practices.</p>`,
        ],
        [
          'liability',
          'Limits on our liability',
          `<p>As far as the law allows, ${COMPANY} isn’t liable for any direct, indirect or consequential loss or damage arising from your use of the site, its tools or their results, including loss of data, profit or business. Nothing here limits liability that can’t be limited under Thai law.</p>`,
        ],
      ],
    }),
  },
  {
    slug: 'copyright',
    title: 'Copyright & Permissions',
    description: 'Who owns the content on Klickode Tools, what you can do without asking, and how to ask for permission.',
    body: page({
      title: 'Copyright & Permissions',
      lede: `© ${COMPANY} All rights reserved. Here’s what that means for you, and how to ask if you’d like to use something.`,
      sections: [
        [
          'owner',
          'Who owns what',
          `<p>The text, page and tool designs, illustrations, icons, social images, the Klickode name and logo, and the source code of this site are owned by ${COMPANY}, unless a credit below says otherwise. They are protected by the Copyright Act B.E. 2537 of Thailand and international copyright treaties.</p>
<p>What you make with the tools belongs to you. See <a href="/terms/#yours">Your files and your results</a>.</p>`,
        ],
        [
          'free',
          'What you can do without asking',
          `<ul>
<li>Use any tool, for personal or business work.</li>
<li>Link to any page on this site.</li>
<li>Quote a sentence or two, with a link back to the page.</li>
<li>Use the code and images you make with the Shop Card Maker on your own sites and social media.</li>
</ul>`,
        ],
        [
          'ask',
          'What needs our written permission',
          `<ul>
<li>Copying or republishing our articles, page text or FAQs, in whole or in large part.</li>
<li>Reusing our designs, illustrations, icons, screenshots or source code.</li>
<li>Embedding, framing or mirroring our tools on another site.</li>
<li>Scraping or bulk-downloading the site, or using it to train AI or machine learning models.</li>
<li>Using the Klickode name or logo.</li>
</ul>
<p>To ask, email ${mail} with what you’d like to use, where and how it will appear, and for how long. We’ll reply as soon as we can. Silence isn’t permission.</p>`,
        ],
        [
          'report',
          'Report copying or an infringement',
          `<p>If you’ve found our content used without permission, or you believe something on this site uses your work without permission, email ${mail} with:</p>
<ul>
<li>the work concerned and where the original is;</li>
<li>the address (URL) where the copy appears;</li>
<li>your name and contact details;</li>
<li>a statement that the information you’ve given is accurate and that you own the rights or act for the owner.</li>
</ul>
<p>We’ll look into every report and, where it’s justified, remove the material quickly.</p>`,
        ],
        [
          'ai',
          'Automated collection and AI training',
          `<p>Our <a href="/robots.txt">robots.txt</a> file asks AI training crawlers not to collect this site. Search engines can still index it so people can find the tools. Collecting the site for AI training is not permitted, whether or not a crawler follows robots.txt.</p>`,
        ],
        [
          'credits',
          'Third-party credits',
          `<ul>
<li><strong>Inter</strong> and <strong>JetBrains Mono</strong> fonts, used under the SIL Open Font License 1.1.</li>
<li>Platform logos in the Shop Card Maker come from <a href="https://simpleicons.org">Simple Icons</a> (CC0). The logos themselves remain trademarks of their owners.</li>
</ul>`,
        ],
      ],
    }),
  },
];
