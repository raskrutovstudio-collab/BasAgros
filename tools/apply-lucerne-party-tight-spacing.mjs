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

const qualitySection = '<section class="product-section product-commercial" aria-labelledby="product-quality-title">';
if (!html.includes(qualitySection)) {
  throw new Error('Не найдена секция «Качество и документы»');
}
html = html.replace(
  qualitySection,
  '<section class="product-section product-commercial product-quality" aria-labelledby="product-quality-title">'
);

html = html.replace(/\/assets\/css\/product\.css\?v=[^"']+/g, '/assets/css/product.css?v=20260831-5');
fs.writeFileSync(pagePath, html, 'utf8');

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* Lucerne party section: no icon, tighter spacing to adjacent sections. */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.product-commercial[data-lucerne-commercial-flow] {\n  padding-bottom: clamp(1.65rem, 2.4vw, 2.2rem);\n}\n\n.product-party {\n  padding: clamp(.75rem, 1.25vw, 1rem) 0;\n}\n\n.product-party-copy .product-eyebrow {\n  margin-bottom: .25rem;\n}\n\n.product-party-grid {\n  gap: .8rem 2rem;\n}\n\n.product-party + .product-use {\n  padding-top: clamp(1.65rem, 2.4vw, 2.2rem);\n}\n\n@media (max-width: 56.24rem) {\n  .product-commercial[data-lucerne-commercial-flow] {\n    padding-bottom: 1.5rem;\n  }\n\n  .product-party {\n    padding: .7rem 0 .85rem;\n  }\n\n  .product-party + .product-use {\n    padding-top: 1.5rem;\n  }\n}\n\n@media (max-width: 47.99rem) {\n  .product-party {\n    padding: .65rem 0 .8rem;\n  }\n}\n\n/* Lucerne use section: wider supporting copy, tighter heading gap. */\n@media (min-width: 64rem) {\n  .product-use .product-section-head {\n    grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);\n    column-gap: 1.25rem;\n  }\n\n  .product-use .product-section-head > p {\n    max-width: 42rem;\n  }\n}\n`;
}

const qualityMarker = '/* Lucerne quality: compact two-column section. */';
if (!css.includes(qualityMarker)) {
  css += `\n${qualityMarker}\n.product-flow + .product-quality {\n  padding-top: clamp(1.2rem, 1.8vw, 1.55rem);\n}\n\n.product-quality {\n  padding-bottom: clamp(1.25rem, 1.9vw, 1.65rem);\n}\n\n.product-quality .product-commercial-card {\n  gap: 1.25rem 1.8rem;\n  padding: clamp(1rem, 1.7vw, 1.35rem);\n  align-items: start;\n}\n\n.product-quality h2 {\n  font-size: clamp(2rem, 3vw, 2.7rem);\n}\n\n.product-quality .product-commercial-card > div:first-child > p:not(.product-eyebrow) {\n  max-width: 38rem;\n  margin: .55rem 0 .8rem;\n  line-height: 1.45;\n}\n\n.product-quality .product-commercial-links {\n  gap: 0;\n}\n\n.product-quality .product-commercial-links > div {\n  padding: .58rem 0;\n}\n\n.product-quality .product-commercial-links > div:first-child {\n  padding-top: .3rem;\n}\n\n.product-quality .product-commercial-links > div:last-child {\n  padding-bottom: 0;\n}\n\n.product-quality .product-commercial-links svg {\n  width: 1.45rem;\n  height: 1.45rem;\n  margin-bottom: .32rem;\n}\n\n.product-quality .product-commercial-links p {\n  margin: .28rem 0 .45rem;\n  line-height: 1.4;\n}\n\n.product-quality + .product-intro {\n  padding-top: clamp(1.2rem, 1.8vw, 1.55rem);\n}\n\n@media (max-width: 47.99rem) {\n  .product-flow + .product-quality {\n    padding-top: 1rem;\n  }\n\n  .product-quality {\n    padding-bottom: 1rem;\n  }\n\n  .product-quality .product-commercial-card {\n    gap: .85rem;\n    padding: .9rem .8rem;\n  }\n\n  .product-quality h2 {\n    font-size: clamp(1.9rem, 8vw, 2.2rem);\n  }\n\n  .product-quality .product-commercial-links > div {\n    padding: .52rem 0;\n  }\n\n  .product-quality + .product-intro {\n    padding-top: 1rem;\n  }\n}\n`;
}

fs.writeFileSync(cssPath, css, 'utf8');

console.log('Lucerne party/use spacing preserved; quality section compacted.');
