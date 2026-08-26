import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'site');
const oldLogo = '/assets/img/bas-agros-logo.png';
const newLogo = '/assets/img/bas-agros-logo.svg';

const audienceIcons = [
  ['Животноводческие хозяйства', '/assets/img/audience-cow.png'],
  ['Фермерские и сельхозпредприятия', '/assets/img/audience-tractor.png'],
  ['Пасечные хозяйства', '/assets/img/audience-bee.png'],
  ['Оптовые покупатели', '/assets/img/audience-box.png']
];

function replaceAudienceIcon(html, title, src) {
  const marker = `<strong>${title}</strong>`;
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) return html;

  const svgStart = html.lastIndexOf('<svg class="home-icon"', markerIndex);
  const svgEnd = svgStart === -1 ? -1 : html.indexOf('</svg>', svgStart);
  if (svgStart === -1 || svgEnd === -1 || svgEnd > markerIndex) return html;

  const image = `<img class="home-icon home-audience-icon" src="${src}" width="48" height="48" alt="" aria-hidden="true" decoding="async">`;
  return html.slice(0, svgStart) + image + html.slice(svgEnd + 6);
}

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
    for (const [title, src] of audienceIcons) {
      next = replaceAudienceIcon(next, title, src);
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

const audienceIconRule = `
/* Exact audience icons supplied by the client. */
.home-audience-icon {
  display: block;
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  flex: 0 0 3rem;
}
`;
if (!css.includes('Exact audience icons supplied by the client.')) {
  css += audienceIconRule;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Brand overrides applied: transparent logo, aligned header, inline hero labels, and exact supplied audience icons.');
