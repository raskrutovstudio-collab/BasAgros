import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('site/catalog/mnogoletnie-kormovye-travy/lyutserna/index.html');
if (!fs.existsSync(file)) process.exit(0);

let html = fs.readFileSync(file, 'utf8');
const assetVersion = '20260914-4';

html = html.replace(/<meta name="theme-color" content="[^"]+">/, '<meta name="theme-color" content="#060706">');
html = html.replace(/<link rel="stylesheet" href="\/assets\/css\/home\.css\?v=[^"]+">/, `<link rel="stylesheet" href="/assets/css/home.css?v=${assetVersion}">`);

function ensureStyle(href, matcher) {
  if (matcher.test(html)) {
    html = html.replace(matcher, `<link rel="stylesheet" href="${href}">`);
    return;
  }

  const homeStyle = new RegExp('<link rel="stylesheet" href="/assets/css/home\\.css\\?v=[^"]+">');
  if (homeStyle.test(html)) {
    html = html.replace(homeStyle, (match) => `${match}\n  <link rel="stylesheet" href="${href}">`);
  } else {
    html = html.replace('</head>', `  <link rel="stylesheet" href="${href}">\n</head>`);
  }
}

ensureStyle(`/assets/css/product.css?v=${assetVersion}`, /<link rel="stylesheet" href="\/assets\/css\/product\.css(?:\?v=[^"]+)?">/);
ensureStyle(`/assets/css/product-lucerne-v3.css?v=${assetVersion}`, /<link rel="stylesheet" href="\/assets\/css\/product-lucerne-v3\.css(?:\?v=[^"]+)?">/);

html = html.replace(/<body class="([^"]*)">/, (_match, classes) => {
  const set = new Set(classes.split(/\s+/).filter(Boolean));
  ['page-home', 'page-home-main', 'page-product', 'page-lucerne-v3', 'page-lucerne-square'].forEach((name) => set.add(name));
  return `<body class="${[...set].join(' ')}">`;
});

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
