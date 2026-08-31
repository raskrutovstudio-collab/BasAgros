import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'site', 'catalog', 'mnogoletnie-kormovye-travy', 'lyutserna', 'index.html');
const cssPath = path.join(root, 'site', 'assets', 'css', 'product.css');

if (!fs.existsSync(pagePath)) throw new Error('Не найдена собранная страница люцерны');
if (!fs.existsSync(cssPath)) throw new Error('Не найден product.css');

let html = fs.readFileSync(pagePath, 'utf8');
const qualitySection = '<section class="product-section product-commercial" aria-labelledby="product-quality-title">';
if (!html.includes(qualitySection)) {
  throw new Error('Не найдена секция «Качество и документы»');
}
html = html.replace(
  qualitySection,
  '<section class="product-section product-commercial product-quality" aria-labelledby="product-quality-title">'
);

const agronomyLead = 'Для уверенного старта люцерне нужны глубокая хорошо дренированная почва, плотное посевное ложе, точная глубина заделки и хороший контакт семян с почвой.';
const agronomyLeadParagraph = `<p>${agronomyLead}</p>`;
const agronomyCopyOpen = '<div class="product-intro-copy">';
if (!html.includes(agronomyLeadParagraph) || !html.includes(agronomyCopyOpen)) {
  throw new Error('Не найден текст или колонка агрономического блока');
}
html = html.replace(agronomyLeadParagraph, '');
html = html.replace(
  agronomyCopyOpen,
  `${agronomyCopyOpen}<p class="product-agronomy-lead">${agronomyLead}</p>`
);

html = html.replace(/\/assets\/css\/product\.css\?v=[^"']+/g, '/assets/css/product.css?v=20260831-6');
fs.writeFileSync(pagePath, html, 'utf8');

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* Lucerne quality: compact two-column section. */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.product-quality {\n  padding: clamp(1.35rem, 2.1vw, 1.9rem) 0;\n}\n\n.product-quality .product-commercial-card {\n  gap: 1.35rem 2rem;\n  padding: clamp(1.2rem, 2vw, 1.6rem);\n  align-items: start;\n}\n\n.product-quality h2 {\n  font-size: clamp(2rem, 3.2vw, 2.85rem);\n}\n\n.product-quality .product-commercial-card > div:first-child > p:not(.product-eyebrow) {\n  max-width: 38rem;\n  margin: .65rem 0 .95rem;\n  line-height: 1.5;\n}\n\n.product-quality .product-commercial-links {\n  gap: 0;\n}\n\n.product-quality .product-commercial-links > div {\n  padding: .72rem 0;\n}\n\n.product-quality .product-commercial-links > div:first-child {\n  padding-top: .55rem;\n}\n\n.product-quality .product-commercial-links > div:last-child {\n  padding-bottom: .2rem;\n}\n\n.product-quality .product-commercial-links svg {\n  width: 1.5rem;\n  height: 1.5rem;\n  margin-bottom: .4rem;\n}\n\n.product-quality .product-commercial-links p {\n  margin: .35rem 0 .55rem;\n  line-height: 1.45;\n}\n\n.product-quality + .product-intro {\n  padding-top: clamp(1.35rem, 2.1vw, 1.8rem);\n}\n\n.product-intro-copy .product-agronomy-lead {\n  margin: 0 0 .85rem;\n}\n\n@media (max-width: 47.99rem) {\n  .product-quality {\n    padding: 1.1rem 0;\n  }\n\n  .product-quality .product-commercial-card {\n    gap: 1rem;\n    padding: 1rem .9rem;\n  }\n\n  .product-quality h2 {\n    font-size: clamp(1.9rem, 8vw, 2.25rem);\n  }\n\n  .product-quality .product-commercial-links > div {\n    padding: .65rem 0;\n  }\n\n  .product-quality + .product-intro {\n    padding-top: 1.15rem;\n  }\n\n  .product-intro-copy .product-agronomy-lead {\n    margin-bottom: .7rem;\n  }\n}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
}

console.log('Lucerne quality section compacted and agronomy lead moved into the content column.');
