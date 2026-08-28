import fs from 'node:fs';
import path from 'node:path';
import { GENERATED_MARKER } from '../src/templates/constants.mjs';
import { breadcrumbsOf } from '../src/templates/html.mjs';
import { productTitle } from '../src/templates/product.mjs';

const root = process.cwd();
const siteRoot = path.join(root, 'site');
const manifestPath = path.join(root, 'src', 'data', 'seo-routes.json');
const inventoryPath = path.join(siteRoot, '.generated-pages.json');
const cssPath = path.join(siteRoot, 'assets', 'css', 'site.css');
const EXPECTED_PAGES = 59;
const FORBIDDEN_URLS = [
  '/optovye-postavki/',
  '/price/',
  '/konsultatsiya-agronoma/',
  '/podbor-semyan/',
  '/contacts/',
  '/requisites/',
  '/catalog/po-naznacheniyu/',
  '/catalog/odnoletnie-kormovye-travy/fatseliya-kak-siderat/',
  '/catalog/odnoletnie-kormovye-travy/fatseliya-kak-medonos/',
  '/catalog/sideraty/fatseliya/',
  '/catalog/medonosy/fatseliya/'
];
const FORBIDDEN_GEO_SEGMENTS = [
  'almaty', 'astana', 'nur-sultan', 'shymkent', 'karaganda', 'aktobe', 'taraz',
  'pavlodar', 'ust-kamenogorsk', 'semey', 'kostanay', 'kyzylorda', 'atyrau',
  'aktau', 'petropavl', 'kokshetau', 'turkestan'
];

const errors = [];
const fail = (message) => errors.push(message);
let indexingErrors = 0;
let brokenLinks = 0;
let sitemapUrls = 0;

function unescapeHtml(value) {
  return String(value)
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

function routeToFile(url) {
  if (url === '/') return path.join(siteRoot, 'index.html');
  return path.join(siteRoot, ...url.split('/').filter(Boolean), 'index.html');
}

function routeToPosixFile(url) {
  if (url === '/') return 'site/index.html';
  return `site${url}index.html`;
}

function toPosix(rel) {
  return rel.split(path.sep).join('/');
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

function extractAttr(tag, name) {
  const match = new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i').exec(tag);
  return match ? match[1] : '';
}

function extractLinks(html) {
  return (html.match(/<a\b[^>]*>/gi) || []).map((tag) => extractAttr(tag, 'href'));
}

function normalizeInternalUrl(href, fromUrl) {
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
  if (/^https?:\/\//i.test(href)) {
    try {
      const parsed = new URL(href);
      if (parsed.hostname !== 'basagros.kz') return null;
      href = parsed.pathname;
    } catch {
      return href;
    }
  }
  if (href.startsWith('#')) return href;
  if (!href.startsWith('/')) {
    const base = fromUrl === '/' ? '/' : fromUrl;
    href = path.posix.normalize(`${base}${href}`);
    if (!href.startsWith('/')) href = `/${href}`;
  }
  if (href !== '/' && !path.posix.extname(href) && !href.endsWith('/')) href += '/';
  return href;
}

function breadcrumbsFromHtml(html) {
  const block = html.match(/<ol class="breadcrumbs">([\s\S]*?)<\/ol>/i);
  if (!block) return [];
  const items = [];
  const liRe = /<li\b([^>]*)>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = liRe.exec(block[1]))) {
    const attrs = match[1];
    const inner = match[2];
    const link = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i.exec(inner);
    const text = unescapeHtml((link ? link[2] : inner.replace(/<[^>]+>/g, '')).trim());
    items.push({
      href: link ? link[1] : null,
      text,
      current: /aria-current\s*=\s*["']page["']/i.test(attrs)
    });
  }
  return items;
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const pages = Array.isArray(manifest.pages) ? manifest.pages : [];
const byId = new Map(pages.map((page) => [page.page_id, page]));
const byUrl = new Map(pages.map((page) => [page.url, page]));
const crmIds = pages
  .flatMap((page) => String(page.crm_product_id || '').split(';'))
  .map((id) => id.trim())
  .filter(Boolean);

if (pages.length !== EXPECTED_PAGES) {
  fail(`manifest routes: ожидалось ${EXPECTED_PAGES}, сейчас ${pages.length}`);
}

if (fs.existsSync(path.join(siteRoot, 'sitemap.xml'))) {
  sitemapUrls += 1;
  fail('найден site/sitemap.xml');
}

const generatedFiles = collectMarkedHtml(siteRoot).map((abs) => path.resolve(abs));
if (generatedFiles.length !== EXPECTED_PAGES) {
  fail(`generated HTML: ожидалось ${EXPECTED_PAGES}, сейчас ${generatedFiles.length}`);
}

const expectedFiles = new Set(pages.map((page) => path.resolve(routeToFile(page.url))));
for (const page of pages) {
  const filePath = routeToFile(page.url);
  if (!fs.existsSync(filePath)) {
    fail(`${page.url}: нет HTML-файла ${toPosix(path.relative(root, filePath))}`);
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const label = page.url;

  if (!html.includes(GENERATED_MARKER)) fail(`${label}: нет маркера ${GENERATED_MARKER}`);
  if (!/<html\b[^>]*\blang=["']ru["']/i.test(html)) fail(`${label}: нет lang="ru"`);

  const title = unescapeHtml((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '').trim();
  if (title !== productTitle(page)) fail(`${label}: Title не совпадает с ожидаемым значением`);

  const h1Matches = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) || [];
  if (h1Matches.length !== 1) fail(`${label}: должен быть ровно один H1 (сейчас ${h1Matches.length})`);
  const h1 = unescapeHtml((h1Matches[0] || '').replace(/<[^>]+>/g, '')).trim();
  if (h1 !== page.h1) fail(`${label}: H1 не совпадает с манифестом`);

  const canonical =
    html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i) ||
    html.match(/<link\b[^>]*href=["'][^"']+["'][^>]*rel=["']canonical["'][^>]*>/i);
  const canonicalHref = canonical ? extractAttr(canonical[0], 'href') : '';
  if (canonicalHref !== page.canonical) fail(`${label}: canonical не совпадает с манифестом`);

  const robots = /<meta\b[^>]*name=["']robots["'][^>]*>/i.exec(html);
  const robotsContent = robots ? extractAttr(robots[0], 'content').replace(/\s+/g, '').toLowerCase() : '';
  if (robotsContent !== 'noindex,nofollow') {
    indexingErrors += 1;
    fail(`${label}: ожидался robots noindex, nofollow`);
  }

  if (!html.includes('href="/assets/css/site.css"')) {
    fail(`${label}: страница должна подключать /assets/css/site.css`);
  }
  if (/href=["'][^"']*base\.css/i.test(html)) {
    fail(`${label}: найден base.css`);
  }

  if (/crm_product_id/i.test(html)) fail(`${label}: в HTML есть crm_product_id`);
  for (const id of crmIds) {
    const re = new RegExp(`(^|[^0-9])${id}([^0-9]|$)`);
    if (re.test(html)) fail(`${label}: в HTML есть CRM Product ID ${id}`);
  }

  if (/(^|[^0-9])(?:0|1)\s*₸/.test(html)) fail(`${label}: найдены технические цены 0 ₸ или 1 ₸`);
  if (/^(<<<<<<<|>>>>>>>)/m.test(html) || /^=======$/m.test(html)) {
    fail(`${label}: найден конфликтный маркер Git`);
  }

  const crumbs = breadcrumbsFromHtml(html);
  const expectedCrumbs = breadcrumbsOf(page, byId);
  if (page.url === '/') {
    if (crumbs.length) fail(`${label}: у главной не должно быть хлебных крошек`);
  } else if (crumbs.length !== expectedCrumbs.length) {
    fail(`${label}: хлебные крошки не совпадают с parent_id`);
  } else {
    expectedCrumbs.forEach((crumb, index) => {
      const item = crumbs[index];
      const last = index === expectedCrumbs.length - 1;
      if (item.text !== crumb.page_name) fail(`${label}: крошка «${item.text}» не равна ${crumb.page_name}`);
      if (last) {
        if (item.href) fail(`${label}: текущая крошка не должна быть ссылкой`);
        if (!item.current) fail(`${label}: текущая крошка без aria-current`);
      } else if (item.href !== crumb.url) {
        fail(`${label}: крошка ${crumb.url} не совпадает с parent_id`);
      }
    });
  }
}

for (const filePath of generatedFiles) {
  if (!expectedFiles.has(filePath)) {
    fail(`лишний generated HTML: ${toPosix(path.relative(root, filePath))}`);
  }
}

const hrefsByPage = new Map();
for (const page of pages) {
  const filePath = routeToFile(page.url);
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf8');
  const resolved = [];
  for (const raw of extractLinks(html)) {
    if (raw === '' || raw === '#') {
      brokenLinks += 1;
      fail(`${page.url}: пустая ссылка или href="#"`);
      continue;
    }
    const href = normalizeInternalUrl(raw, page.url);
    if (href === null || href.startsWith('#')) continue;
    if (FORBIDDEN_URLS.includes(href)) fail(`${page.url}: запрещённый URL ${href}`);
    const geo = href.split('/').filter(Boolean).find((segment) => FORBIDDEN_GEO_SEGMENTS.includes(segment));
    if (geo) fail(`${page.url}: региональная ссылка ${href}`);
    if (/sitemap\.xml$/i.test(href)) {
      sitemapUrls += 1;
      fail(`${page.url}: ссылка на sitemap ${href}`);
    }
    if (byUrl.has(href)) {
      resolved.push(href);
      continue;
    }
    const assetPath = path.join(siteRoot, href.replace(/^\//, ''));
    if (!fs.existsSync(assetPath)) {
      brokenLinks += 1;
      fail(`${page.url}: битая внутренняя ссылка ${href}`);
    }
  }
  hrefsByPage.set(page.url, resolved);
}

for (const page of pages) {
  const geo = page.url.split('/').filter(Boolean).find((segment) => FORBIDDEN_GEO_SEGMENTS.includes(segment));
  if (geo) fail(`${page.url}: региональная страница`);
  if (FORBIDDEN_URLS.includes(page.url)) fail(`${page.url}: запрещённый production URL`);
}

const reachable = new Set();
const queue = ['/'];
while (queue.length) {
  const url = queue.shift();
  if (reachable.has(url) || !byUrl.has(url)) continue;
  reachable.add(url);
  for (const href of hrefsByPage.get(url) || []) {
    if (!reachable.has(href)) queue.push(href);
  }
}
if (reachable.size !== EXPECTED_PAGES) {
  fail(`reachable from /: ожидалось ${EXPECTED_PAGES}, сейчас ${reachable.size}`);
  for (const page of pages) {
    if (!reachable.has(page.url)) fail(`недостижимо от /: ${page.url}`);
  }
}

if (!fs.existsSync(cssPath)) {
  fail('нет site/assets/css/site.css');
} else {
  const css = fs.readFileSync(cssPath, 'utf8');
  if (!/\.skip-link/.test(css)) fail('CSS: нет skip-link');
  if (!/:focus-visible/.test(css)) fail('CSS: нет видимого focus');
  if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css)) fail('CSS: нет reduced-motion');
  if (!/@media\s*\(max-width:/.test(css)) fail('CSS: нет адаптивного media query');
  if (/@keyframes|animation\s*:|transition\s*:/.test(css)) fail('CSS: найдены анимация или transition');
  if (/fonts\.google|@font-face/.test(css)) fail('CSS: найдено подключение шрифта бренд-системы');
}

const siteConfigPath = path.join(siteRoot, 'assets', 'js', 'site-config.js');
if (fs.existsSync(siteConfigPath)) {
  const siteConfig = fs.readFileSync(siteConfigPath, 'utf8');
  const enabled = /enabled\s*:\s*true/.test(siteConfig);
  const endpointMatch = /leadEndpoint\s*:\s*['"]([^'"]*)['"]/.exec(siteConfig);
  const endpoint = endpointMatch ? endpointMatch[1].trim() : '';
  if (enabled && !endpoint) {
    fail('форма не может быть активна при пустом endpoint');
  }
  const homeHtml = fs.existsSync(routeToFile('/')) ? fs.readFileSync(routeToFile('/'), 'utf8') : '';
  if (homeHtml.includes('data-lead-form') && (!enabled || !endpoint)) {
    const submitDisabled =
      /<button\b[^>]*\btype=["']submit["'][^>]*\bdisabled\b/i.test(homeHtml) ||
      /<button\b[^>]*\bdisabled\b[^>]*\btype=["']submit["']/i.test(homeHtml);
    if (!submitDisabled) {
      fail('/: submit формы должен быть disabled, пока endpoint пустой');
    }
    if (!homeHtml.includes('Отправка будет доступна после подключения формы.')) {
      fail('/: нет текста об отключённой форме');
    }
    if (/name=["']consent["']/.test(homeHtml)) {
      fail('/: согласие с политикой нельзя показывать без маршрута /privacy/');
    }
  }
}

if (!fs.existsSync(inventoryPath)) {
  fail('нет site/.generated-pages.json');
} else {
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  if (inventory.format_version !== '1.0.0') fail('.generated-pages.json: неверная format_version');
  if (inventory.source !== 'src/data/seo-routes.json') fail('.generated-pages.json: неверный source');
  if (inventory.marker !== GENERATED_MARKER) fail('.generated-pages.json: неверный marker');
  if (inventory.page_count !== EXPECTED_PAGES) fail('.generated-pages.json: page_count должен быть 59');
  if (inventory.generated_at || inventory.timestamp || inventory.date) {
    fail('.generated-pages.json: нельзя хранить дату');
  }
  const ordered = pages.slice().sort((a, b) => a.page_id.localeCompare(b.page_id));
  const expectedUrls = ordered.map((page) => page.url);
  const expectedInventoryFiles = ordered.map((page) => routeToPosixFile(page.url));
  if (JSON.stringify(inventory.urls) !== JSON.stringify(expectedUrls)) {
    fail('.generated-pages.json: список URL не совпадает с манифестом');
  }
  if (JSON.stringify(inventory.files) !== JSON.stringify(expectedInventoryFiles)) {
    fail('.generated-pages.json: список HTML-файлов не совпадает с манифестом');
  }
}

const summary = {
  'manifest routes': pages.length,
  'generated HTML': generatedFiles.length,
  'reachable from /': reachable.size,
  'broken internal links': brokenLinks,
  'indexing errors': indexingErrors,
  'sitemap URL': sitemapUrls
};

if (errors.length) {
  errors.forEach((message) => console.error(`ERROR ${message}`));
  console.log(Object.entries(summary).map(([key, value]) => `${key}: ${value}`).join('\n'));
  console.log(`Проверка собранного сайта: ошибок ${errors.length}`);
  process.exit(1);
}

Object.entries(summary).forEach(([key, value]) => console.log(`${key}: ${value}`));
console.log('Проверка собранного сайта: ошибок 0');
