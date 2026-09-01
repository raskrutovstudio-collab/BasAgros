import { childrenOf, escapeHtml, joinSections } from './html.mjs';
import { renderHomepage } from './homepage.mjs';
import { isEtalonProduct, renderProduct } from './product.mjs';
import { isTravosmesiHub, renderTravosmesi } from './travosmesi.mjs';

function pageList(title, items) {
  if (!items.length) return '';
  const links = items.map((item) => (
    `          <li><a href="${escapeHtml(item.url)}">${escapeHtml(item.page_name)}</a></li>`
  )).join('\n');
  return `      <section>
        <h2>${escapeHtml(title)}</h2>
        <ul>
${links}
        </ul>
      </section>`;
}

function routeMeta(page) {
  const rows = [
    ['page_id', page.page_id],
    ['page_type', page.page_type],
    ['template_type', page.template_type],
    ['priority', page.priority],
    ['launch_wave', page.launch_wave],
    ['indexing_gate', page.indexing_gate],
    ['indexability', page.indexability]
  ];
  if (page.page_intent) rows.push(['page_intent', page.page_intent]);
  const items = rows.map(([name, value]) => (
    `          <div><dt>${escapeHtml(name)}</dt><dd>${escapeHtml(value)}</dd></div>`
  )).join('\n');
  return `      <section>
        <h2>Технический статус маршрута</h2>
        <p>Индексация отключена до прохождения indexing gate.</p>
        <dl>
${items}
        </dl>
      </section>`;
}

function heading(page) {
  return `      <h1>${escapeHtml(page.h1)}</h1>`;
}

function renderCatalogHub(page, pages) {
  const children = childrenOf(page.page_id, pages);
  return joinSections([
    heading(page),
    routeMeta(page),
    pageList('Категории', children.filter((item) => item.page_type === 'category')),
    pageList('Страницы по назначению', children.filter((item) => item.page_type === 'solution'))
  ]);
}

function renderCategory(page, pages) {
  if (isTravosmesiHub(page)) return renderTravosmesi(page, pages);
  return joinSections([
    heading(page),
    routeMeta(page),
    pageList('Страницы категории', childrenOf(page.page_id, pages))
  ]);
}

function renderCulture(page, pages) {
  return joinSections([
    heading(page),
    routeMeta(page),
    pageList('Страницы культуры', childrenOf(page.page_id, pages))
  ]);
}

function renderShell(page) {
  return joinSections([heading(page), routeMeta(page)]);
}

function renderProductPage(page, pages) {
  if (isEtalonProduct(page)) return renderProduct(page, pages);
  return renderShell(page);
}

function renderArticleHub(page, pages) {
  return joinSections([
    heading(page),
    routeMeta(page),
    pageList('Статьи', childrenOf(page.page_id, pages))
  ]);
}

const RENDERERS = {
  homepage: renderHomepage,
  catalog_hub: renderCatalogHub,
  category: renderCategory,
  culture: renderCulture,
  product: renderProductPage,
  solution: renderShell,
  commercial_service: renderShell,
  corporate: renderShell,
  faq_hub: renderShell,
  article_hub: renderArticleHub,
  article: renderShell
};

export function renderMain(page, pages) {
  const render = RENDERERS[page.template_type];
  if (!render) {
    throw new Error(`Неизвестный template_type: ${page.template_type} (${page.page_id} ${page.url})`);
  }
  return render(page, pages);
}
