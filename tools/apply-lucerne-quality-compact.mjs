import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'site', 'catalog', 'mnogoletnie-kormovye-travy', 'lyutserna', 'index.html');
const cssPath = path.join(root, 'site', 'assets', 'css', 'product.css');

if (!fs.existsSync(pagePath)) throw new Error('Не найдена собранная страница люцерны');
if (!fs.existsSync(cssPath)) throw new Error('Не найден product.css');

let html = fs.readFileSync(pagePath, 'utf8');

const qualityCopy = 'По выбранной партии предоставляются характеристики семян и перечень сопровождающих документов для согласования поставки.';
const qualityCopyBroken = 'По выбранной партии предоставляются характеристики семян и<br>перечень сопровождающих документов для согласования поставки.';
if (html.includes(qualityCopy)) {
  html = html.replace(qualityCopy, qualityCopyBroken);
}

const agronomyLead = 'Для уверенного старта люцерне нужны глубокая хорошо дренированная почва, плотное посевное ложе, точная глубина заделки и хороший контакт семян с почвой.';
const agronomyLeadParagraph = `<p>${agronomyLead}</p>`;
const agronomyCopyOpen = '<div class="product-intro-copy">';
const agronomyMoved = `<p class="product-agronomy-lead">${agronomyLead}</p>`;

if (!html.includes(agronomyMoved)) {
  if (!html.includes(agronomyLeadParagraph) || !html.includes(agronomyCopyOpen)) {
    throw new Error('Не найден текст или колонка агрономического блока');
  }
  html = html.replace(agronomyLeadParagraph, '');
  html = html.replace(
    agronomyCopyOpen,
    `${agronomyCopyOpen}${agronomyMoved}`
  );
}

html = html.replace(/\/assets\/css\/product\.css\?v=[^"']+/g, '/assets/css/product.css?v=20260831-6');
fs.writeFileSync(pagePath, html, 'utf8');

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* Lucerne agronomy lead inside content column. */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.product-intro-copy .product-agronomy-lead {\n  margin: 0 0 .85rem;\n}\n\n@media (max-width: 47.99rem) {\n  .product-intro-copy .product-agronomy-lead {\n    margin-bottom: .7rem;\n  }\n}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
}

console.log('Lucerne quality copy line break and agronomy lead placement applied.');