import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'site');
const oldLogo = '/assets/img/bas-agros-logo.png';
const newLogo = '/assets/img/bas-agros-logo.svg';

const audienceIconReplacements = new Map([
  [
    '<path d="M8 17h25v14H12l-4-6Z"/><path d="M13 31v7m14-7v7M33 20l5-5m-5 9 6 2M12 17 8 12"/><circle cx="17" cy="22" r="2"/>',
    '<path d="M14 16 9 12l1 8 4 2m20-6 5-4-1 8-4 2"/><path d="M15 18c0-5 4-9 9-9s9 4 9 9v13c0 5-4 9-9 9s-9-4-9-9Z"/><path d="m18 10-3-5m15 5 3-5"/><circle cx="19" cy="22" r="1"/><circle cx="29" cy="22" r="1"/><path d="M18 30c4-2 8-2 12 0v5c-4 2-8 2-12 0Z"/><path d="M21 33h.01M27 33h.01"/>'
  ],
  [
    '<circle cx="12" cy="31" r="7"/><circle cx="33" cy="31" r="7"/><path d="M12 31h12l5-17H17l-5 17Zm7-17V8h9l5 6"/>',
    '<circle cx="13" cy="34" r="7"/><circle cx="35" cy="35" r="5"/><path d="M7 30h14l4-12h11l4 12h2v5h-2"/><path d="M26 18V9h9l4 9M20 30h7M30 18h9M13 27v-8h8l-3 11M34 9V5"/>'
  ],
  [
    '<ellipse cx="24" cy="24" rx="7" ry="12"/><path d="m19 16-7-6c-5 7-1 13 7 12m10-6 7-6c5 7 1 13-7 12M18 24h12m-11 6h10M24 12V7"/>',
    '<ellipse cx="24" cy="25" rx="6" ry="11"/><path d="M18 20c-7-1-10-5-9-10 6 0 10 3 11 8m10 2c7-1 10-5 9-10-6 0-10 3-11 8M18 24h12m-11 6h10M24 14V9m-3 1-3-4m9 4 3-4"/>'
  ],
  [
    '<path d="m8 15 16-8 16 8-16 9-16-9Zm0 0v18l16 9 16-9V15M24 24v18"/>',
    '<path d="m10 15 14-8 14 8-14 8-14-8Zm0 0v18l14 8 14-8V15M24 23v18M17 11l14 8"/>'
  ]
]);

function patchHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'assets') patchHtml(abs);
      continue;
    }
    if (!entry.isFile() || entry.name.toLowerCase() !== 'index.html') continue;
    const html = fs.readFileSync(abs, 'utf8');
    let next = html.replaceAll(oldLogo, newLogo);
    for (const [oldIcon, newIcon] of audienceIconReplacements) {
      next = next.replaceAll(oldIcon, newIcon);
    }
    if (next !== html) fs.writeFileSync(abs, next, 'utf8');
  }
}

patchHtml(siteRoot);

const cssPath = path.join(siteRoot, 'assets', 'css', 'home.css');
let css = fs.readFileSync(cssPath, 'utf8');
const wideHeader = 'width: min(calc(100% - 1.5rem), 86rem);';
const pageWidth = 'width: min(calc(100% - 2rem), var(--home-max));';
if (css.includes(wideHeader)) {
  css = css.replace(wideHeader, pageWidth);
} else if (!css.includes(pageWidth)) {
  throw new Error('Header width override was not found in home.css');
}

const heroCategoryInlineRule = `
/* Keep first-screen category labels and arrows on one line. */
@media (min-width: 48rem) {
  .home-hero-categories a {
    white-space: nowrap;
  }
}
`;
if (!css.includes('Keep first-screen category labels and arrows on one line.')) {
  css += heroCategoryInlineRule;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Brand overrides applied: transparent logo, aligned header, inline hero labels, and reference-style audience icons.');
