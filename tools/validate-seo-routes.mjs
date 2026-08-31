import fs from 'node:fs';
import path from 'node:path';
import { indexableUrls, isIndexablePage } from '../src/templates/indexing.mjs';

const root = process.cwd();
const manifestPath = path.join(root, 'src', 'data', 'seo-routes.json');
const EXPECTED_PAGES = 59;
const EXPECTED_PRODUCTS = 37;
const EXPECTED_PRIORITY = { P0: 8, P1: 26, P2: 25 };
const EXPECTED_GATES = { DATA_REQUIRED: 37, CONTENT_REQUIRED: 22 };
const ALLOWED_PRIORITIES = new Set(['P0', 'P1', 'P2']);
const ALLOWED_GATES = new Set(['DATA_REQUIRED', 'CONTENT_REQUIRED']);
const ALLOWED_PAGE_INTENTS = new Set([
  'commercial',
  'category',
  'commercial_support',
  'trust',
  'navigation',
  'informational'
]);
const FICTIVE_PARENT_IDS = new Set(['Kazakhstan', 'kazakhstan', 'ROOT', 'root', 'market']);
const CRM_ID_RE = /^\d+(?:;\d+)*$/;
const REQUIRED_FIELDS = [
  'page_id', 'parent_id', 'page_name', 'url', 'page_type', 'template_type',
  'title', 'h1', 'priority', 'launch_wave', 'crm_product_id', 'page_intent',
  'target_indexability', 'indexability', 'canonical', 'target_sitemap',
  'sitemap', 'ready_to_index', 'indexing_gate'
];
const FORBIDDEN_URLS = [
  '/optovye-postavki/',
  '/price/',
  '/konsultatsiya-agronoma/',
  '/podbor-semyan/',
  '/contacts/',
  '/requisites/',
  '/catalog/po-naznacheniyu/'
];
const FORBIDDEN_FACELIA_URLS = [
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

if (!fs.existsSync(manifestPath)) {
  console.error('ERROR src/data/seo-routes.json не найден');
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch {
  console.error('ERROR src/data/seo-routes.json: некорректный JSON');
  process.exit(1);
}

if (!manifest.source?.name || !manifest.source?.version) {
  fail('в source должны быть имя и версия исходной SEO-карты');
}
if (manifest.source?.detected_page_rows !== EXPECTED_PAGES) {
  fail(`source.detected_page_rows должен быть ${EXPECTED_PAGES}`);
}
if (manifest.source?.detected_columns !== 78) {
  fail('source.detected_columns должен быть 78');
}
if (manifest.source?.excel_table?.used_for_import !== false) {
  fail('объект Excel SEOMapV3 не должен ограничивать импорт');
}

const pages = Array.isArray(manifest.pages) ? manifest.pages : [];
if (pages.length !== EXPECTED_PAGES) {
  fail(`ожидалось ${EXPECTED_PAGES} production URL, сейчас ${pages.length}`);
}

const products = pages.filter((page) => page.page_type === 'product');
if (products.length !== EXPECTED_PRODUCTS) {
  fail(`ожидалось ${EXPECTED_PRODUCTS} product pages, сейчас ${products.length}`);
}

const pageIds = new Set();
const urls = new Set();
const byUrl = new Map();
const priorityCounts = { P0: 0, P1: 0, P2: 0 };
const gateCounts = { DATA_REQUIRED: 0, CONTENT_REQUIRED: 0 };
let readyCount = 0;

for (const [index, page] of pages.entries()) {
  const label = page.page_id || page.url || `#${index + 1}`;
  for (const field of REQUIRED_FIELDS) {
    if (!Object.hasOwn(page, field)) fail(`${label}: нет поля ${field}`);
  }

  if (!page.page_id) fail(`${label}: пустой page_id`);
  else if (pageIds.has(page.page_id)) fail(`дублируется page_id: ${page.page_id}`);
  else pageIds.add(page.page_id);

  if (!page.url) fail(`${label}: пустой URL`);
  else if (urls.has(page.url)) fail(`дублируется URL: ${page.url}`);
  else {
    urls.add(page.url);
    byUrl.set(page.url, page);
  }

  if (!page.title) fail(`${label}: пустой title`);
  if (!page.h1) fail(`${label}: пустой H1`);
  if (!page.canonical) fail(`${label}: пустой canonical`);

  if (!ALLOWED_PRIORITIES.has(page.priority)) {
    fail(`${label}: пустой или неизвестный priority (${page.priority})`);
  } else {
    priorityCounts[page.priority] += 1;
  }

  if (!ALLOWED_GATES.has(page.indexing_gate)) {
    fail(`${label}: пустой или снятый indexing_gate (${page.indexing_gate})`);
  } else {
    gateCounts[page.indexing_gate] += 1;
  }

  if (page.page_type === 'product' && page.indexing_gate !== 'DATA_REQUIRED') {
    fail(`${label}: товарная страница должна иметь indexing_gate=DATA_REQUIRED`);
  }
  if (page.page_type !== 'product' && page.indexing_gate !== 'CONTENT_REQUIRED') {
    fail(`${label}: нетоварная страница должна иметь indexing_gate=CONTENT_REQUIRED`);
  }

  if (page.ready_to_index === true) readyCount += 1;
  if (page.ready_to_index !== true && page.ready_to_index !== false) {
    fail(`${label}: ready_to_index должен быть boolean`);
  }
  if (isIndexablePage(page)) {
    if (page.ready_to_index !== true) {
      fail(`${label}: готовая к индексации страница должна иметь ready_to_index=true`);
    }
    if (page.indexability !== 'index') {
      fail(`${label}: готовая к индексации страница должна иметь indexability=index`);
    }
    if (page.sitemap !== true) {
      fail(`${label}: готовая к индексации страница должна иметь sitemap=true`);
    }
  } else if (page.ready_to_index === true) {
    fail(`${label}: ready_to_index=true разрешён только точечно открытым страницам`);
  }
  if (page.ready_to_index !== true) {
    if (page.indexability === 'index') {
      fail(`${label}: indexability=index запрещён, пока ready_to_index=false`);
    }
    if (page.sitemap === true || page.sitemap === 'yes') {
      fail(`${label}: sitemap=true запрещён, пока ready_to_index=false`);
    }
    if (!ALLOWED_GATES.has(page.indexing_gate)) {
      fail(`${label}: снятие gate без подтверждённой готовности`);
    }
  }
  if (page.sitemap !== false && page.ready_to_index !== true) {
    fail(`${label}: текущий sitemap должен быть false`);
  }

  if (page.page_type === 'product') {
    if (page.page_intent !== null) fail(`${label}: у товара page_intent должен быть null`);
    if (typeof page.crm_product_id !== 'string' || !CRM_ID_RE.test(page.crm_product_id)) {
      fail(`${label}: crm_product_id должен быть строкой числовых ID`);
    }
  } else {
    if (page.crm_product_id !== null) {
      fail(`${label}: у нетоварной страницы crm_product_id должен быть null`);
    }
    if (!ALLOWED_PAGE_INTENTS.has(page.page_intent)) {
      fail(`${label}: недопустимый page_intent (${page.page_intent})`);
    }
  }

  if (page.url) {
    if (!page.url.startsWith('/') || !page.url.endsWith('/')) {
      fail(`${label}: URL должен начинаться с / и заканчиваться trailing slash (${page.url})`);
    }
    if (page.url.includes('?') || /[?&](filter|sort|q|search)=/i.test(page.url)) {
      fail(`${label}: запрещён индексируемый filter/sort/search URL (${page.url})`);
    }
    const segments = page.url.split('/').filter(Boolean);
    const geo = segments.find((segment) => FORBIDDEN_GEO_SEGMENTS.includes(segment));
    if (geo) fail(`${label}: запрещён городской/областной SEO URL (${page.url})`);
  }
}

const expectedReady = indexableUrls().length;
if (readyCount !== expectedReady) {
  fail(`READY_TO_INDEX должен быть ${expectedReady}, сейчас ready_to_index=true у ${readyCount} страниц`);
}

for (const [priority, expected] of Object.entries(EXPECTED_PRIORITY)) {
  if (priorityCounts[priority] !== expected) {
    fail(`ожидалось ${expected} страниц ${priority}, сейчас ${priorityCounts[priority]}`);
  }
}
for (const [gate, expected] of Object.entries(EXPECTED_GATES)) {
  if (gateCounts[gate] !== expected) {
    fail(`ожидалось ${expected} страниц ${gate}, сейчас ${gateCounts[gate]}`);
  }
}

const homePages = pages.filter((page) => page.page_type === 'homepage' || page.url === '/');
if (homePages.length !== 1) fail(`должна быть ровно одна главная, сейчас ${homePages.length}`);
const home = homePages[0];
if (home) {
  if (home.parent_id !== null) fail(`${home.page_id}: у главной parent_id должен быть null`);
  if (home.market !== 'Kazakhstan') fail(`${home.page_id}: у главной market должен быть Kazakhstan`);
}

for (const page of pages) {
  if (page === home) continue;
  if (page.parent_id === null || page.parent_id === undefined || page.parent_id === '') {
    fail(`${page.page_id}: parent_id=null разрешён только главной`);
    continue;
  }
  if (FICTIVE_PARENT_IDS.has(page.parent_id)) {
    fail(`${page.page_id}: запрещён фиктивный parent_id ${page.parent_id}`);
  }
  if (!pageIds.has(page.parent_id)) {
    fail(`${page.page_id}: parent_id ${page.parent_id} не существует`);
  }
}

for (const url of [...FORBIDDEN_URLS, ...FORBIDDEN_FACELIA_URLS]) {
  if (urls.has(url)) fail(`запрещённый URL из PROJECT_PROFILE.md: ${url}`);
}

const solutionUrls = pages.filter((page) => page.page_type === 'solution').map((page) => page.url);
for (const page of pages) {
  const nestedInSolution = solutionUrls.find((solutionUrl) => (
    page.url !== solutionUrl && page.url.startsWith(solutionUrl)
  ));
  if (nestedInSolution) {
    fail(`${page.page_id}: товарный дубль внутри solution page ${nestedInSolution}`);
  }
}

const crmIds = (page) => String(page?.crm_product_id || '')
  .split(';')
  .map((id) => id.trim())
  .filter(Boolean);

const requireProduct = (url, expectedIds) => {
  const page = byUrl.get(url);
  if (!page) {
    fail(`нет обязательной product page: ${url}`);
    return null;
  }
  if (page.page_type !== 'product') fail(`${url}: ожидался page_type=product`);
  if (expectedIds) {
    const ids = crmIds(page);
    for (const id of expectedIds) {
      if (!ids.includes(id)) fail(`${url}: нет CRM ID ${id}`);
    }
  }
  return page;
};

requireProduct('/catalog/mnogoletnie-kormovye-travy/myatlik-lugovoy/', ['1178']);
if (pages.some((page) => crmIds(page).includes('838'))) {
  fail('CRM ID 838 нельзя использовать с сайта; для мятлика лугового нужен 1178');
}

requireProduct('/catalog/travosmesi/kormovaya/', ['1118', '646']);
requireProduct('/catalog/mnogoletnie-kormovye-travy/kostrets/', ['118', '156']);

const sheepFescue = requireProduct('/catalog/mnogoletnie-kormovye-travy/ovsyannitsa-ovechya/', ['1190']);
const bentgrass = requireProduct('/catalog/mnogoletnie-kormovye-travy/polevitsa/pobegonosnaya/', ['1190']);
if (sheepFescue && bentgrass && sheepFescue.page_id === bentgrass.page_id) {
  fail('овсянница овечья и полевица побегоносная должны оставаться разными page_id при общем CRM 1190');
}

const sudankaHub = byUrl.get('/catalog/odnoletnie-kormovye-travy/sudanka/');
const sudanka1 = requireProduct('/catalog/odnoletnie-kormovye-travy/sudanka/1rs/');
const sudanka2 = requireProduct('/catalog/odnoletnie-kormovye-travy/sudanka/2rs/');
const sorghumSudan = requireProduct('/catalog/sorgo/sudankovoe/');
if (!sudankaHub || sudankaHub.page_type !== 'culture_hub') {
  fail('суданка должна иметь отдельный culture hub /catalog/odnoletnie-kormovye-travy/sudanka/');
}
if (sudanka1 && sudanka2 && sudanka1.page_id === sudanka2.page_id) {
  fail('суданка 1РС и 2РС должны быть разными product pages');
}
if (sorghumSudan && sudankaHub && sorghumSudan.url === sudankaHub.url) {
  fail('сорго суданковое нельзя объединять с хабом суданки');
}

requireProduct('/catalog/odnoletnie-kormovye-travy/vika-yarovaya/');
requireProduct('/catalog/odnoletnie-kormovye-travy/vika-yarovaya-elita/');
requireProduct('/catalog/odnoletnie-kormovye-travy/vika-ozimaya/');
requireProduct('/catalog/odnoletnie-kormovye-travy/fatseliya/');
requireProduct('/catalog/travosmesi/rozh-vika-65-35/');
requireProduct('/catalog/odnoletnie-kormovye-travy/lyupin-belyy-odnoletniy/');

if (errors.length) {
  errors.forEach((message) => console.error(`ERROR ${message}`));
  console.log(`Проверка SEO routes: ошибок ${errors.length}`);
  process.exit(1);
}

console.log(`Проверка SEO routes: ${pages.length} URL, ${products.length} product pages, P0=${priorityCounts.P0} P1=${priorityCounts.P1} P2=${priorityCounts.P2}; ошибок: 0`);
