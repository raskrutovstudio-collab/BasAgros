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
const heroImagePayloadPath = path.join(root, 'site', 'assets', 'img', 'products', 'lucerne-field-hero.webp.base64.txt');
const heroImagePath = path.join(root, 'site', 'assets', 'img', 'products', 'lucerne-field-hero.webp');

if (!fs.existsSync(pagePath)) throw new Error('Не найдена собранная страница люцерны');
if (!fs.existsSync(cssPath)) throw new Error('Не найден product.css');
if (!fs.existsSync(heroImagePayloadPath)) throw new Error('Не найден исходник изображения поля люцерны');

const heroImagePayload = fs.readFileSync(heroImagePayloadPath, 'utf8').trim();
const heroImageBuffer = Buffer.from(heroImagePayload, 'base64');
if (heroImageBuffer.length < 50000 || heroImageBuffer.subarray(0, 4).toString('ascii') !== 'RIFF' || heroImageBuffer.subarray(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('Некорректный WebP-файл поля люцерны');
}
fs.mkdirSync(path.dirname(heroImagePath), { recursive: true });
fs.writeFileSync(heroImagePath, heroImageBuffer);

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

const oldHeroImage = '<img src="/assets/img/home/about-field-640.webp" width="640" height="720" alt="Сельскохозяйственное поле" fetchpriority="high" decoding="async">';
const lucerneHeroImage = '<img src="/assets/img/products/lucerne-field-hero.webp" width="800" height="533" alt="Поле цветущей люцерны" fetchpriority="high" decoding="async">';
if (!html.includes(oldHeroImage)) {
  throw new Error('Не найдено исходное главное изображение на странице люцерны');
}
html = html.replace(oldHeroImage, lucerneHeroImage);

fs.writeFileSync(pagePath, html, 'utf8');

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* Lucerne hero: two facts, viewport-fitted media. */';
if (!css.includes(marker)) {
  css += `\n${marker}\n.page-product .product-facts {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n@media (min-width: 48rem) {\n  .page-product .product-hero-grid {\n    min-height: 0;\n    align-items: stretch;\n  }\n  .page-product .product-gallery {\n    min-height: 0;\n    height: auto;\n    align-self: stretch;\n  }\n  .page-product .product-gallery-main {\n    position: absolute;\n    inset: 0;\n    min-height: 0;\n    height: auto;\n  }\n  .page-product .product-gallery-main img {\n    position: absolute;\n    inset: 0;\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n    object-position: center center;\n  }\n}\n@media (min-width: 64rem) {\n  .page-product .product-hero {\n    min-height: calc(100vh - 4.25rem);\n    min-height: calc(100svh - 4.25rem);\n  }\n  .page-product .product-hero > .home-wrap {\n    display: grid;\n    grid-template-rows: auto minmax(0, 1fr);\n    min-height: calc(100vh - 4.25rem);\n    min-height: calc(100svh - 4.25rem);\n  }\n  .page-product .product-hero-grid {\n    height: auto;\n    min-height: 0;\n    padding-top: 1.25rem;\n    padding-bottom: 1.6rem;\n    align-items: stretch;\n  }\n  .page-product .product-gallery {\n    height: auto;\n    min-height: 0;\n  }\n  .page-product .product-hero-copy {\n    align-self: center;\n  }\n}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
}

console.log(`Lucerne hero image rebuilt (${heroImageBuffer.length} bytes) and applied.`);
