import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'src', 'data', 'seo-routes.json');
const EXPECTED_PAGES = 59;
const EXPECTED_PRODUCTS = 37;
const ROOT_PARENT_IDS = new Set(['Kazakhstan']);
const REQUIRED_FIELDS = [
  'page_id', 'parent_id', 'page_name', 'url', 'page_type', 'template_type',
  'title', 'h1', 'priority', 'launch_wave', 'crm_product_id',
  'indexability', 'canonical', 'sitemap', 'indexing_gate'
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

  if (page.url) {
    if (!page.url.startsWith('/') || !page.url.endsWith('/')) {
      fail(`${label}: URL должен начинаться и заканчиваться trailing slash (${page.url})`);
    }
    if (page.url.includes('?') || /[?&](filter|sort|q|search)=/i.test(page.url)) {
      fail(`${label}: запрещён индексируемый filter/sort/search URL (${page.url})`);
    }
    const segments = page.url.split('/').filter(Boolean);
    const geo = segments.find((segment) => FORBIDDEN_GEO_SEGMENTS.includes(segment));
    if (geo) fail(`${label}: запрещён городской/областной SEO URL (${page.url})`);
  }
}

for (const page of pages) {
  if (!page.parent_id) {
    fail(`${page.page_id}: пустой parent_id`);
    continue;
  }
  if (!pageIds.has(page.parent_id) && !ROOT_PARENT_IDS.has(page.parent_id)) {
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

console.log(`Проверка SEO routes: ${pages.length} URL, ${products.length} product pages; ошибок: 0`);
