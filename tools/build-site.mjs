import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { GENERATED_MARKER } from '../src/templates/constants.mjs';
import { isIndexablePage } from '../src/templates/indexing.mjs';
import { renderPageDocument } from '../src/templates/layout.mjs';
import { renderMain } from '../src/templates/render-body.mjs';
import { assertKnownTypes } from '../src/templates/types.mjs';

const root = process.cwd();
const siteRoot = path.join(root, 'site');
const manifestPath = path.join(root, 'src', 'data', 'seo-routes.json');
const validatorPath = path.join(root, 'tools', 'validate-seo-routes.mjs');

const HOME_CSS = [
  'site.css',
  'home.css',
  'home-square.css',
  'home-v3-qa.css',
  'home-v3-polish.css',
  'home-v3-feedback.css',
  'home-v3-audience.css',
  'home-v3-catalog-sculpted.css',
  'home-v3-catalog-terrain.css',
  'home-v3-crops-lux.css',
  'home-v3-crops-final.css',
  'home-v3-mobile.css',
  'home-v3-review-fixes.css',
  'home-v3-header-hotfix.css',
  'home-v3-purpose-icons.css',
  'home-v3-audience-icons.css',
  'home-v3-final-tuning.css',
  'home-v3-final-ui.css',
  'home-v3-mobile-pass2.css',
  'home-v3-mobile-pass3.css',
  'home-v3-mobile-pass4.css',
  'home-v3-performance.css'
];

const HOME_JS = [
  'site-config.js',
  'home.js',
  'home-v3-catalog-terrain.js',
  'home-v3-review-fixes.js',
  'lead-form.js',
  'home-v3-final-ui.js',
  'home-v3-mobile-pass3.js'
];

function validateRoutes() {
  const result = spawnSync(process.execPath, [validatorPath], {
    cwd: root,
    stdio: 'inherit'
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function routeToFile(url) {
  if (url === '/') return path.join(siteRoot, 'index.html');
  const segments = url.split('/').filter(Boolean);
  return path.join(siteRoot, ...segments, 'index.html');
}

function routeToPosixFile(url) {
  if (url === '/') return 'site/index.html';
  return `site${url}index.html`;
}

function collectMarkedHtml(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'assets') continue;
      collectMarkedHtml(abs, files);
    } else if (entry.isFile() && entry.name.toLowerCase() === 'index.html') {
      const html = fs.readFileSync(abs, 'utf8');
      if (html.includes(GENERATED_MARKER)) files.push(abs);
    }
  }
  return files;
}

function assertWritable(filePath) {
  if (!fs.existsSync(filePath)) return;
  const current = fs.readFileSync(filePath, 'utf8');
  if (!current.includes(GENERATED_MARKER)) {
    const rel = path.relative(root, filePath);
    throw new Error(`Файл существует и не сгенерирован build-site.mjs: ${rel}`);
  }
}

function writeUtf8(filePath, html) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, 'utf8');
}

function bundleFiles(directory, names, outputName, separator) {
  const chunks = names.map((name) => {
    const file = path.join(siteRoot, 'assets', directory, name);
    if (!fs.existsSync(file)) throw new Error(`Не найден ресурс для HOME bundle: ${file}`);
    return `/* ${name} */\n${fs.readFileSync(file, 'utf8').trim()}`;
  });
  const output = path.join(siteRoot, 'assets', directory, outputName);
  writeUtf8(output, `${chunks.join(separator)}\n`);
}

function optimizeHomeDocument() {
  const file = path.join(siteRoot, 'index.html');
  let html = fs.readFileSync(file, 'utf8');

  for (const name of HOME_CSS) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`\\s*<link[^>]+href=\"/assets/css/${escaped}[^\"]*\"[^>]*>`, 'g'), '');
  }
  for (const name of HOME_JS) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`\\s*<script[^>]+src=\"/assets/js/${escaped}[^\"]*\"[^>]*><\\/script>`, 'g'), '');
  }

  const preload = [
    '  <link rel="preload" as="image" type="image/avif" href="/assets/img/home/hero-v4-machinery-900.avif" media="(max-width: 63.99rem)" fetchpriority="high">',
    '  <link rel="preload" as="image" type="image/avif" href="/assets/img/home/hero-v4-machinery-1672.avif" media="(min-width: 64rem)" fetchpriority="high">',
    '  <link rel="stylesheet" href="/assets/css/home-v3.bundle.css?v=20260907-1" data-home-v3-catalog-sculpted data-home-v3-crops-lux>'
  ].join('\n');
  html = html.replace('</head>', `${preload}\n</head>`);
  html = html.replace('</body>', '  <script src="/assets/js/home-v3.bundle.js?v=20260907-1" defer></script>\n</body>');
  fs.writeFileSync(file, html, 'utf8');
}

validateRoutes();

/* Build one render-blocking CSS request and one deferred JS request for the V3
   homepage. The source files stay separate for maintainability; only generated
   output is bundled. */
bundleFiles('css', HOME_CSS, 'home-v3.bundle.css', '\n\n');
bundleFiles('js', HOME_JS, 'home-v3.bundle.js', '\n\n;\n\n');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const pages = Array.isArray(manifest.pages) ? manifest.pages : [];
const byId = new Map(pages.map((page) => [page.page_id, page]));
const expectedFiles = new Set();

for (const page of pages.slice().sort((a, b) => a.page_id.localeCompare(b.page_id))) {
  assertKnownTypes(page);
  const filePath = routeToFile(page.url);
  expectedFiles.add(path.resolve(filePath));
  assertWritable(filePath);
  const html = renderPageDocument({
    page,
    pages,
    byId,
    main: renderMain(page, pages)
  });
  writeUtf8(filePath, html);
}

optimizeHomeDocument();

for (const filePath of collectMarkedHtml(siteRoot)) {
  if (!expectedFiles.has(path.resolve(filePath))) {
    fs.unlinkSync(filePath);
  }
}

if (expectedFiles.size !== pages.length) {
  throw new Error(`Ожидалось ${pages.length} файлов, подготовлено ${expectedFiles.size}`);
}

for (const filePath of expectedFiles) {
  const html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes(GENERATED_MARKER)) {
    throw new Error(`Нет маркера генерации: ${path.relative(root, filePath)}`);
  }
}

const orderedPages = pages.slice().sort((a, b) => a.page_id.localeCompare(b.page_id));
const inventory = {
  format_version: '1.0.0',
  source: 'src/data/seo-routes.json',
  generator: 'build-site.mjs',
  marker: GENERATED_MARKER,
  page_count: orderedPages.length,
  urls: orderedPages.map((page) => page.url),
  files: orderedPages.map((page) => routeToPosixFile(page.url))
};
writeUtf8(
  path.join(siteRoot, '.generated-pages.json'),
  `${JSON.stringify(inventory, null, 2)}\n`
);

const sitemapUrls = pages.filter(isIndexablePage).map((page) => page.canonical);
const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapUrls.map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`),
  '</urlset>',
  ''
].join('\n');
fs.writeFileSync(path.join(siteRoot, 'sitemap.xml'), sitemapXml, 'utf8');
fs.writeFileSync(
  path.join(siteRoot, 'robots.txt'),
  'User-agent: *\nAllow: /\n\nSitemap: https://basagros.kz/sitemap.xml\n',
  'utf8'
);

console.log(`Сборка сайта: ${pages.length} HTML-страниц из seo-routes.json; sitemap: ${sitemapUrls.length} URL; HOME CSS/JS bundled`);
