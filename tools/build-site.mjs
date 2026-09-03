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

validateRoutes();

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

console.log(`Сборка сайта: ${pages.length} HTML-страниц из seo-routes.json; sitemap: ${sitemapUrls.length} URL`);
