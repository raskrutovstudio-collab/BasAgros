import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'site');
const oldLogo = '/assets/img/bas-agros-logo.png';
const newLogo = '/assets/img/bas-agros-logo.svg';

function patchHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'assets') patchHtml(abs);
      continue;
    }
    if (!entry.isFile() || entry.name.toLowerCase() !== 'index.html') continue;
    const html = fs.readFileSync(abs, 'utf8');
    const next = html.replaceAll(oldLogo, newLogo);
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
  fs.writeFileSync(cssPath, css, 'utf8');
} else if (!css.includes(pageWidth)) {
  throw new Error('Header width override was not found in home.css');
}

console.log('Brand overrides applied: transparent logo and page-aligned header width.');
