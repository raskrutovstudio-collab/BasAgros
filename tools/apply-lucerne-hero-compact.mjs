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

const factsPattern = /<dl class="product-facts" aria-label="Основные условия">[\s\S]*?<\/dl>/;
const compactFacts = `<dl class="product-facts" aria-label="Основные условия">
            <div><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12 12 5h6l1 1v6l-7 7-7-7Z"/><circle cx="15.5" cy="8.5" r="1"/></g></svg><dt>Цена</dt><dd>от 2 580 000 ₸/т</dd></div>
            <div><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 4v2h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></g></svg><dt>Доставка</dt><dd>Казахстан и СНГ</dd></div>
          </dl>`;

if (!factsPattern.test(html)) {
  throw new Error('Не найден блок основных условий на странице люцерны');
}
html = html.replace(factsPattern, compactFacts);

fs.writeFileSync(pagePath, html, 'utf8');

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* Lucerne hero: two facts, media follows content height. */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.page-product .product-facts {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n@media (min-width: 48rem) {\n  .page-product .product-hero-grid {\n    min-height: 0;\n    align-items: stretch;\n  }\n  .page-product .product-gallery {\n    min-height: 0;\n    height: auto;\n    align-self: stretch;\n  }\n  .page-product .product-gallery-main {\n    position: absolute;\n    inset: 0;\n    min-height: 0;\n    height: auto;\n  }\n  .page-product .product-gallery-main img {\n    position: absolute;\n    inset: 0;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n  }\n  .page-product .product-hero-copy {\n    align-self: start;\n  }\n}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
}

console.log('Lucerne hero compacted: price and delivery facts restored; media follows content height.');
