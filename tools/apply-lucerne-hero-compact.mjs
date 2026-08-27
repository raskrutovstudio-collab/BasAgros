import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(
  root,
  'site',
  'catalog',
  'mnogoletnie-kormovye-travy',
  'lyutserna',
  'index.html'
);
const cssPath = path.join(root, 'site', 'assets', 'css', 'product.css');

if (!fs.existsSync(pagePath)) throw new Error('Не найдена собранная страница люцерны');
if (!fs.existsSync(cssPath)) throw new Error('Не найден product.css');

let html = fs.readFileSync(pagePath, 'utf8');

html = html.replace(/\s*<div><svg[^>]*>[\s\S]*?<\/svg><dt>Наличие<\/dt><dd>[^<]*<\/dd><\/div>/, '');
html = html.replace(/\s*<div><svg[^>]*>[\s\S]*?<\/svg><dt>Документы<\/dt><dd>[^<]*<\/dd><\/div>/, '');

fs.writeFileSync(pagePath, html, 'utf8');

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* Lucerne hero: two facts, media follows content height. */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.page-product .product-facts {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n@media (min-width: 48rem) {\n  .page-product .product-hero-grid {\n    min-height: 0;\n    align-items: stretch;\n  }\n  .page-product .product-gallery {\n    min-height: 0;\n    height: auto;\n    align-self: stretch;\n  }\n  .page-product .product-gallery-main {\n    position: absolute;\n    inset: 0;\n    min-height: 0;\n    height: auto;\n  }\n  .page-product .product-gallery-main img {\n    position: absolute;\n    inset: 0;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n  }\n  .page-product .product-hero-copy {\n    align-self: start;\n  }\n}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
}

console.log('Lucerne hero compacted: availability/docs facts removed; image follows content height.');
