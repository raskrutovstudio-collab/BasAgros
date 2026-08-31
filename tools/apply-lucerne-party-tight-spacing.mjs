import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'site', 'catalog', 'mnogoletnie-kormovye-travy', 'lyutserna', 'index.html');
const cssPath = path.join(root, 'site', 'assets', 'css', 'product.css');

if (!fs.existsSync(pagePath)) throw new Error('Не найдена собранная страница люцерны');
if (!fs.existsSync(cssPath)) throw new Error('Не найден product.css');

let html = fs.readFileSync(pagePath, 'utf8');
const iconPattern = /<span class="product-party-icon">[\s\S]*?<\/span>/;
if (!iconPattern.test(html)) {
  throw new Error('Не найдена иконка в секции характеристик партии');
}
html = html.replace(iconPattern, '');
html = html.replace('/assets/css/product.css?v=20260828-14', '/assets/css/product.css?v=20260831-2');
fs.writeFileSync(pagePath, html, 'utf8');

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* Lucerne party section: no icon, tighter spacing to adjacent sections. */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.product-commercial[data-lucerne-commercial-flow] {\n  padding-bottom: clamp(1.65rem, 2.4vw, 2.2rem);\n}\n\n.product-party {\n  padding: clamp(.75rem, 1.25vw, 1rem) 0;\n}\n\n.product-party-copy .product-eyebrow {\n  margin-bottom: .25rem;\n}\n\n.product-party-grid {\n  gap: .8rem 2rem;\n}\n\n.product-party + .product-use {\n  padding-top: clamp(1.65rem, 2.4vw, 2.2rem);\n}\n\n@media (max-width: 56.24rem) {\n  .product-commercial[data-lucerne-commercial-flow] {\n    padding-bottom: 1.5rem;\n  }\n\n  .product-party {\n    padding: .7rem 0 .85rem;\n  }\n\n  .product-party + .product-use {\n    padding-top: 1.5rem;\n  }\n}\n\n@media (max-width: 47.99rem) {\n  .product-party {\n    padding: .65rem 0 .8rem;\n  }\n}\n`;
}
fs.writeFileSync(cssPath, css, 'utf8');

console.log('Lucerne party icon removed and spacing tightened.');
