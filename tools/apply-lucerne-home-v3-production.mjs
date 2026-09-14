import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('site/catalog/mnogoletnie-kormovye-travy/lyutserna/index.html');
if (!fs.existsSync(file)) process.exit(0);

let html = fs.readFileSync(file, 'utf8');
const assetVersion = '20260914-9';

html = html.replace(/<meta name="theme-color" content="[^"]+">/, '<meta name="theme-color" content="#060706">');
html = html.replace(/<link rel="stylesheet" href="\/assets\/css\/home\.css\?v=[^"]+">/, `<link rel="stylesheet" href="/assets/css/home.css?v=${assetVersion}">`);

html = html
  .replace(/\s*<link rel="stylesheet" href="\/assets\/css\/product\.css(?:\?v=[^"]+)?">/g, '')
  .replace(/\s*<link rel="stylesheet" href="\/assets\/css\/product-lucerne-v3\.css(?:\?v=[^"]+)?">/g, '')
  .replace(/\s*<link rel="stylesheet" href="\/assets\/css\/product-lucerne-cleanup\.css(?:\?v=[^"]+)?">/g, '')
  .replace(/\s*<link rel="stylesheet" href="\/assets\/css\/product-lucerne-commercial-balance\.css(?:\?v=[^"]+)?">/g, '')
  .replace(/\s*<link rel="stylesheet" href="\/assets\/css\/product-lucerne-party-balance\.css(?:\?v=[^"]+)?">/g, '')
  .replace(/\s*<link rel="stylesheet" href="\/assets\/css\/product-lucerne-use-icons\.css(?:\?v=[^"]+)?">/g, '')
  .replace(/\s*<link rel="stylesheet" href="\/assets\/css\/product-lucerne-packaging-v2\.css(?:\?v=[^"]+)?">/g, '');

const productStyles = [
  `<link rel="stylesheet" href="/assets/css/product.css?v=${assetVersion}">`,
  `<link rel="stylesheet" href="/assets/css/product-lucerne-v3.css?v=${assetVersion}">`,
  `<link rel="stylesheet" href="/assets/css/product-lucerne-cleanup.css?v=${assetVersion}">`,
  `<link rel="stylesheet" href="/assets/css/product-lucerne-commercial-balance.css?v=${assetVersion}">`,
  `<link rel="stylesheet" href="/assets/css/product-lucerne-party-balance.css?v=${assetVersion}">`,
  `<link rel="stylesheet" href="/assets/css/product-lucerne-use-icons.css?v=${assetVersion}">`,
  `<link rel="stylesheet" href="/assets/css/product-lucerne-packaging-v2.css?v=${assetVersion}">`
].join('\n  ');

const homeStyleMatcher = /<link rel="stylesheet" href="\/assets\/css\/home\.css\?v=[^"]+">/;
if (homeStyleMatcher.test(html)) {
  html = html.replace(homeStyleMatcher, (match) => `${match}\n  ${productStyles}`);
} else {
  html = html.replace('</head>', `  ${productStyles}\n</head>`);
}

html = html.replace(/<body class="([^"]*)">/, (_match, classes) => {
  const set = new Set(classes.split(/\s+/).filter(Boolean));
  ['page-home', 'page-home-main', 'page-product', 'page-lucerne-v3', 'page-lucerne-square'].forEach((name) => set.add(name));
  return `<body class="${[...set].join(' ')}">`;
});

const packagingSection = `<section class="product-section product-packaging-v2" aria-labelledby="product-packaging-title"><div class="home-wrap"><div class="packaging-v2-head"><div><p class="product-eyebrow">Фасовка</p><h2 id="product-packaging-title">Варианты упаковки семян люцерны</h2></div><div class="packaging-v2-summary"><strong>2 формата поставки</strong><p>Формат тары подбирается под объём заказа и схему отгрузки: крупная партия в МКР или более гибкая комплектация в полипропиленовых мешках.</p></div></div><div class="packaging-v2-compare"><article class="packaging-v2-card"><div class="packaging-v2-top"><span class="packaging-v2-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 9h11v10h-11z"/><path d="M8 9 9.3 5.8h5.4L16 9"/><path d="M9.4 5.8c0-1 .5-1.8 1.2-1.8s1.2.8 1.2 1.8M13.2 5.8c0-1 .5-1.8 1.2-1.8s1.2.8 1.2 1.8"/><path d="M9.5 13h5v3.2h-5z"/></svg></span><span class="packaging-v2-badge">Крупнотоннажная поставка</span></div><h3>БИГ-БЭГ / МКР</h3><p class="packaging-v2-lead">Основной формат для крупного объёма отгрузки семян.</p><dl class="packaging-v2-specs"><div><dt>Формат</dt><dd>МКР Л4 Н-140, 95×95</dd></div><div><dt>Лучше для</dt><dd>крупных партий</dd></div><div><dt>Плюс</dt><dd>проще логистика большого объёма</dd></div></dl></article><article class="packaging-v2-card"><div class="packaging-v2-top"><span class="packaging-v2-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.4 10.4 7.5 20h9l-.9-9.6"/><path d="M8.4 10.4c0-1.2 1.6-2.2 3.6-2.2s3.6 1 3.6 2.2"/><path d="M9.8 8.2 10.4 5h3.2l.6 3.2"/><path d="M9.8 8.2h4.4"/></svg></span><span class="packaging-v2-badge">Гибкая комплектация</span></div><h3>Полипропиленовый мешок</h3><p class="packaging-v2-lead">Формат для более дробного комплектования конкретного заказа.</p><dl class="packaging-v2-specs"><div><dt>Формат</dt><dd>ПП-мешок 56×110</dd></div><div><dt>Лучше для</dt><dd>разбитой поставки</dd></div><div><dt>Плюс</dt><dd>гибкая комплектация по потребности</dd></div></dl></article></div><div class="packaging-v2-choice">формат фиксируется при расчёте заказа</div><div class="packaging-v2-facts"><div class="packaging-v2-fact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h10l2 4v10H5V9l2-4Z"/><path d="M8 9h8"/></svg><div><strong>Вес нетто</strong><span>одной упаковки</span></div></div><div class="packaging-v2-fact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5 12 4l8 4.5V18l-8 4-8-4V8.5Z"/><path d="m4 8.5 8 4 8-4M12 12.5V22"/></svg><div><strong>Количество мест</strong><span>по конкретному заказу</span></div></div><div class="packaging-v2-fact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h16M6 15l4-4 3 2 5-6"/><path d="M18 7v4h-4"/></svg><div><strong>Общий объём</strong><span>фиксируется в предложении</span></div></div></div></div></section>`;

html = html.replace(/<section class="product-section product-articles product-packaging"[\s\S]*?<\/section>/, packagingSection);

const productScriptMatcher = /<script src="\/assets\/js\/product\.js(?:\?v=[^"]+)?" defer><\/script>/;
if (productScriptMatcher.test(html)) {
  html = html.replace(productScriptMatcher, `<script src="/assets/js/product.js?v=${assetVersion}" defer></script>`);
} else {
  const leadScriptMatcher = /<script src="\/assets\/js\/lead-form\.js(?:\?v=[^"]+)?" defer><\/script>/;
  if (leadScriptMatcher.test(html)) {
    html = html.replace(leadScriptMatcher, (match) => `${match}\n  <script src="/assets/js/product.js?v=${assetVersion}" defer></script>`);
  } else {
    html = html.replace('</body>', `  <script src="/assets/js/product.js?v=${assetVersion}" defer></script>\n</body>`);
  }
}

html = html.replace(/\s*<script src="\/assets\/js\/product-lucerne-use-icons\.js(?:\?v=[^"]+)?" defer><\/script>/g, '');
html = html.replace('</body>', `  <script src="/assets/js/product-lucerne-use-icons.js?v=${assetVersion}" defer></script>\n</body>`);

const navMarker = '<nav class="home-nav" id="home-navigation" aria-label="Основная навигация" data-mobile-nav><ul>';
if (html.includes(navMarker) && !html.includes(`${navMarker}<li><a href="/">Главная</a></li>`)) {
  html = html.replace(navMarker, `${navMarker}<li><a href="/">Главная</a></li>`);
}
html = html.replace('<li><a href="#solutions">Решения</a></li>', '<li><a href="/#solutions">Направления</a></li>');

const navActionsMarker = '</ul><div class="home-nav-actions">';
const headerStart = html.indexOf('<header class="home-header">');
const headerEnd = html.indexOf('</header>', headerStart);
if (headerStart !== -1 && headerEnd !== -1) {
  const header = html.slice(headerStart, headerEnd);
  if (!header.includes('href="#contacts"')) {
    const patched = header.replace(navActionsMarker, '<li><a href="#contacts">Контакты</a></li></ul><div class="home-nav-actions">');
    html = html.slice(0, headerStart) + patched + html.slice(headerEnd);
  }
}

fs.writeFileSync(file, html);
console.log('Applied lucerne Home V3 production patch');
