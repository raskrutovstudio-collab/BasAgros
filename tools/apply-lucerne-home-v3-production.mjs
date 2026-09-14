import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('site/catalog/mnogoletnie-kormovye-travy/lyutserna/index.html');
if (!fs.existsSync(file)) process.exit(0);

let html = fs.readFileSync(file, 'utf8');

html = html.replace('<meta name="theme-color" content="#F7F8F3">', '<meta name="theme-color" content="#060706">');
html = html.replace(/<link rel="stylesheet" href="\/assets\/css\/home\.css\?v=[^"]+">/, '<link rel="stylesheet" href="/assets/css/home.css?v=20260914-1">');
html = html.replace(/<link rel="stylesheet" href="\/assets\/css\/product\.css\?v=[^"]+">/, '<link rel="stylesheet" href="/assets/css/product.css?v=20260914-1">');

if (!html.includes('/assets/css/product-lucerne-v3.css')) {
  html = html.replace(
    '<link rel="stylesheet" href="/assets/css/product.css?v=20260914-1">',
    '<link rel="stylesheet" href="/assets/css/product.css?v=20260914-1">\n  <link rel="stylesheet" href="/assets/css/product-lucerne-v3.css?v=20260914-3">'
  );
} else {
  html = html.replace(/product-lucerne-v3\.css\?v=[^"]+/, 'product-lucerne-v3.css?v=20260914-3');
}

html = html.replace(/<body class="([^"]*)">/, (_match, classes) => {
  const set = new Set(classes.split(/\s+/).filter(Boolean));
  ['page-home', 'page-home-main', 'page-product', 'page-lucerne-v3', 'page-lucerne-square'].forEach((name) => set.add(name));
  return `<body class="${[...set].join(' ')}">`;
});

html = html.replace(/<script src="\/assets\/js\/product\.js(?:\?v=[^"]+)?" defer><\/script>/, '<script src="/assets/js/product.js?v=20260914-3" defer></script>');

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
