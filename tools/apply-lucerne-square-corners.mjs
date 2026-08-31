import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'site', 'catalog', 'mnogoletnie-kormovye-travy', 'lyutserna', 'index.html');
const cssPath = path.join(root, 'site', 'assets', 'css', 'product.css');

if (!fs.existsSync(pagePath)) throw new Error('Не найдена собранная страница люцерны');
if (!fs.existsSync(cssPath)) throw new Error('Не найден product.css');

let html = fs.readFileSync(pagePath, 'utf8');

if (!html.includes('page-lucerne-square')) {
  const bodyPattern = /<body class="([^"]*\bpage-product\b[^"]*)">/;
  if (!bodyPattern.test(html)) throw new Error('Не найден body страницы товара');
  html = html.replace(bodyPattern, (_match, classes) => `<body class="${classes} page-lucerne-square">`);
}

html = html.replace(/\/assets\/css\/product\.css\?v=[^"']+/g, '/assets/css/product.css?v=20260831-7');
fs.writeFileSync(pagePath, html, 'utf8');

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* Lucerne page: square corners everywhere. */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.page-lucerne-square,\n.page-lucerne-square *,\n.page-lucerne-square *::before,\n.page-lucerne-square *::after {\n  border-radius: 0 !important;\n}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
}

console.log('Lucerne page forced to zero border-radius on all elements and pseudo-elements.');
