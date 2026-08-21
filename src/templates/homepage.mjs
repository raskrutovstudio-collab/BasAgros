import fs from 'node:fs';
import path from 'node:path';
import { HEADER_NAV_URLS } from './constants.mjs';
import { escapeHtml, pageByUrl } from './html.mjs';

const homepagePath = path.join(process.cwd(), 'src', 'data', 'homepage.json');
const homepage = JSON.parse(fs.readFileSync(homepagePath, 'utf8'));

const HOME_HEADER_ITEMS = [
  { url: '/catalog/', label: 'Каталог' },
  { url: '/o-kompanii/', label: 'О компании' },
  { url: '/dostavka-i-oplata/', label: 'Доставка' },
  { url: '/kachestvo-i-sertifikaty/', label: 'Качество' },
  { url: '/agroblog/', label: 'Агроблог' },
  { url: '/faq/', label: 'FAQ' }
];

const HOME_FOOTER_NAV = ['/catalog/', '/o-kompanii/', '/faq/', '/agroblog/'];
const HOME_FOOTER_SERVICE = [
  '/dostavka-i-oplata/',
  '/kachestvo-i-sertifikaty/',
  '/o-kompanii/'
];
const HOME_FOOTER_CATALOG = [
  '/catalog/travosmesi/',
  '/catalog/sorgo/',
  '/catalog/odnoletnie-kormovye-travy/',
  '/catalog/mnogoletnie-kormovye-travy/'
];

const PRODUCT_SLOTS = {
  '/catalog/mnogoletnie-kormovye-travy/espartset/': 'espartset',
  '/catalog/mnogoletnie-kormovye-travy/lyutserna/': 'lyutserna',
  '/catalog/mnogoletnie-kormovye-travy/zhitnyak/': 'zhitnyak',
  '/catalog/travosmesi/kormovaya/': 'travosmes-kormovaya',
  '/catalog/travosmesi/universalnaya/': 'travosmes-universalnaya',
  '/catalog/odnoletnie-kormovye-travy/fatseliya/': 'fatseliya'
};

function block(id) {
  const found = homepage.blocks.find((item) => item.id === id);
  if (!found) {
    throw new Error(`homepage.json: блок «${id}» не найден`);
  }
  if (found.status !== 'confirmed') {
    throw new Error(`homepage.json: блок «${id}» не имеет status=confirmed`);
  }
  return found;
}

function requirePage(pages, url) {
  const page = pageByUrl(pages, url);
  if (!page) {
    throw new Error(`homepage ссылается на URL вне manifest: ${url}`);
  }
  return page;
}

function link(href, label, extraClass = '') {
  const className = extraClass ? ` class="${extraClass}"` : '';
  return `<a href="${escapeHtml(href)}"${className}>${escapeHtml(label)}</a>`;
}

function svgWrap(extraClass, paths, viewBox = '0 0 100 100') {
  return `<svg class="${extraClass}" viewBox="${viewBox}" width="100" height="100" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" stroke-width="1.6">${paths}</g>
  </svg>`;
}

function botanical(extraClass = '') {
  return svgWrap(
    `home-botanical${extraClass ? ` ${extraClass}` : ''}`,
    `<path d="M50 96 V12"/>
     <path d="M50 28 C32 18 24 8 28 4"/>
     <path d="M50 28 C68 18 76 8 72 4"/>
     <path d="M50 48 C28 38 18 26 22 16"/>
     <path d="M50 48 C72 38 82 26 78 16"/>
     <path d="M50 70 C26 60 14 48 18 36"/>
     <path d="M50 70 C74 60 86 48 82 36"/>`
  );
}

function iconMark(name) {
  const paths = {
    catalog: '<path d="M22 28h56v48H22z"/><path d="M42 28v48"/><path d="M22 52h56"/>',
    seed: '<path d="M50 14c18 20 18 48 0 72C32 62 32 34 50 14z"/>',
    price: '<path d="M28 50h44"/><path d="M50 28v44"/><path d="M34 36h32"/><path d="M34 64h32"/>',
    stock: '<path d="M24 72V38l26-14 26 14v34H24z"/>',
    truck: '<path d="M18 62h42l16-20h12v20h-8"/><path d="M32 76a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M68 76a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>',
    mix: '<path d="M28 78c14-26 28-26 44 0"/><path d="M36 32c8 10 20 10 28 0"/>',
    field: '<path d="M16 74c14-18 24-18 34 0 14-18 24-18 34 0"/><path d="M16 52c14-14 24-14 34 0 14-14 24-14 34 0"/>',
    volume: '<path d="M24 74h52V36H24z"/><path d="M34 36V24h32v12"/>'
  };
  return `<svg class="home-icon" viewBox="0 0 100 100" width="28" height="28" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" stroke-width="2.4">${paths[name] || paths.seed}</g>
  </svg>`;
}

function slotArt(slot) {
  const arts = {
    hero: `<path d="M8 88 C22 62 30 54 48 48 C64 42 72 28 78 12"/>
      <path d="M18 88 C28 70 40 62 58 58"/>
      <path d="M70 88 V22"/><path d="M82 88 V36"/>
      <circle cx="48" cy="48" r="18" opacity="0.35"/>`,
    espartset: `<path d="M50 92 V18"/>
      <path d="M50 34 C30 24 22 12 28 6"/><path d="M50 34 C70 24 78 12 72 6"/>
      <path d="M50 54 C26 44 16 30 22 20"/><path d="M50 54 C74 44 84 30 78 20"/>
      <path d="M42 18 h16"/>`,
    lyutserna: `<path d="M50 92 V30"/>
      <path d="M50 34 C36 16 24 20 30 36"/>
      <path d="M50 34 C64 16 76 20 70 36"/>
      <path d="M50 26 C44 8 56 8 50 26"/>`,
    zhitnyak: `<path d="M50 94 V10"/>
      <path d="M50 18 L38 8"/><path d="M50 18 L62 8"/>
      <path d="M50 30 L34 20"/><path d="M50 30 L66 20"/>
      <path d="M50 42 L32 34"/><path d="M50 42 L68 34"/>
      <path d="M50 54 L36 48"/><path d="M50 54 L64 48"/>`,
    'travosmes-kormovaya': `<path d="M28 90 V32"/><path d="M50 94 V18"/><path d="M72 90 V40"/>
      <path d="M28 40 C18 28 16 16 22 12"/><path d="M50 28 C40 16 38 8 44 6"/>
      <path d="M72 48 C82 36 84 24 78 18"/>`,
    'travosmes-universalnaya': `<path d="M22 88 V44"/><path d="M40 92 V24"/><path d="M58 90 V30"/><path d="M78 88 V48"/>
      <path d="M40 32 C28 20 26 10 32 8"/><path d="M58 38 C70 24 74 14 68 10"/>`,
    fatseliya: `<path d="M50 92 C50 70 74 64 74 46 C74 28 50 24 50 40 C50 54 28 52 28 36 C28 22 50 18 50 8"/>
      <path d="M50 92 V62"/>`,
    representative: `<circle cx="50" cy="28" r="12"/>
      <path d="M24 86 C28 58 40 50 50 50 C60 50 72 58 76 86"/>
      <path d="M38 62 h24 v16 H38z"/>`,
    warehouse: `<path d="M14 78 V40 L50 18 L86 40 V78z"/><path d="M50 18 V78"/><path d="M28 78 V52 h16 v26"/>`,
    seeds: `<path d="M36 28 C24 44 24 62 36 78 C48 62 48 44 36 28z"/>
      <path d="M64 22 C52 40 52 60 64 80 C76 60 76 40 64 22z"/>`,
    order: `<path d="M22 26 h56 v52 H22z"/><path d="M34 40 h32"/><path d="M34 52 h32"/><path d="M34 64 h20"/>`,
    shipping: `<path d="M16 64 h40 l14-18 h16 v18 h-8"/>
      <path d="M30 78 a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
      <path d="M68 78 a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>`,
    kazakhstan: `<path d="M8 42 L22 18 L48 12 L72 16 L92 28 L88 46 L70 58 L42 62 L18 54 Z"/>`,
    document: `<path d="M30 16 h28 l12 12 v56 H30z"/><path d="M58 16 v12 h12"/><path d="M38 44 h24"/><path d="M38 54 h24"/><path d="M38 64 h16"/>`,
    'document-1': `<path d="M30 16 h28 l12 12 v56 H30z"/><path d="M58 16 v12 h12"/><path d="M38 44 h24"/><path d="M38 54 h24"/><path d="M38 64 h16"/>`,
    'document-2': `<path d="M28 18 h32 l12 12 v52 H28z"/><path d="M60 18 v12 h12"/><path d="M36 48 h22"/>`,
    'document-3': `<path d="M32 14 h26 l14 14 v54 H32z"/><path d="M58 14 v14 h14"/><path d="M40 52 h20"/><path d="M40 62 h14"/>`,
    article: `<path d="M12 68 C28 48 40 42 52 40 C66 38 78 24 84 12"/>
      <path d="M18 80 C32 64 48 58 70 56"/>`,
    'article-1': `<path d="M12 68 C28 48 40 42 52 40 C66 38 78 24 84 12"/>
      <path d="M18 80 C32 64 48 58 70 56"/>`,
    'article-2': `<path d="M16 78 C30 58 46 48 62 44"/><path d="M24 88 C40 70 58 64 80 60"/>`,
    'article-3': `<path d="M20 84 V28"/><path d="M40 88 V22"/><path d="M62 86 V34"/><path d="M20 36 C12 24 14 14 22 12"/>`
  };
  return svgWrap('home-slot-art', arts[slot] || arts.hero);
}

function mediaSlot(slot, extraClass = '') {
  return `<div class="home-media-slot ${extraClass}" data-asset-slot="${escapeHtml(slot)}" aria-hidden="true">
    ${slotArt(slot)}
  </div>`;
}

function headerNav(pages, currentUrl) {
  return HOME_HEADER_ITEMS.map((item) => {
    requirePage(pages, item.url);
    const current = item.url === currentUrl ? ' aria-current="page"' : '';
    return `            <li><a href="${escapeHtml(item.url)}"${current}>${escapeHtml(item.label)}</a></li>`;
  }).join('\n');
}

function navLinks(urls, pages, currentUrl) {
  return urls.map((url) => {
    const page = requirePage(pages, url);
    const current = url === currentUrl ? ' aria-current="page"' : '';
    return `            <li><a href="${escapeHtml(page.url)}"${current}>${escapeHtml(page.page_name)}</a></li>`;
  }).join('\n');
}

export function homepageDescription() {
  return homepage.description.text;
}

export function renderHomeHeader(page, pages) {
  return `  <header class="home-header">
    <div class="home-wrap home-header-inner">
      <p class="home-brand"><a href="/">BAS Agros</a></p>
      <input class="home-nav-check" id="home-nav-toggle" type="checkbox">
      <label class="home-menu-toggle" for="home-nav-toggle">Меню</label>
      <nav class="home-nav" aria-label="Основная навигация">
        <ul>
${headerNav(pages, page.url)}
        </ul>
      </nav>
      <p class="home-header-cta">
        ${link('#request', 'Оставить заявку', 'home-btn home-btn-gold')}
      </p>
    </div>
  </header>`;
}

export function renderHomeFooter(pages) {
  return `  <footer class="home-footer">
    <div class="home-wrap home-footer-grid">
      <div>
        <p class="home-brand"><a href="/">BAS Agros</a></p>
        <p>Поставки семян по Казахстану.</p>
      </div>
      <nav aria-label="Разделы сайта">
        <h2>Разделы</h2>
        <ul>
${navLinks(HOME_FOOTER_NAV, pages, '/')}
        </ul>
      </nav>
      <nav aria-label="Каталог">
        <h2>Каталог</h2>
        <ul>
${navLinks(HOME_FOOTER_CATALOG, pages, '/')}
        </ul>
      </nav>
      <nav aria-label="Сервисные страницы">
        <h2>Сервис</h2>
        <ul>
${navLinks(HOME_FOOTER_SERVICE, pages, '/')}
        </ul>
      </nav>
    </div>
    <div class="home-wrap home-footer-bar">
      <p>BAS Agros</p>
    </div>
  </footer>`;
}

function renderHero(page) {
  const hero = block('hero');
  if (hero.heading !== page.h1) {
    throw new Error('homepage hero.heading должен совпадать с h1 маршрута');
  }
  const icons = ['mix', 'catalog', 'price', 'stock', 'truck'];
  const features = hero.items.map((item, index) => (
    `        <li class="home-feature">
          ${iconMark(icons[index])}
          <p>${escapeHtml(item.title)}</p>
        </li>`
  )).join('\n');
  return `    <section class="home-hero" aria-labelledby="home-h1">
      <div class="home-wrap home-hero-grid">
        <div class="home-hero-copy">
          <h1 id="home-h1">${escapeHtml(hero.heading)}</h1>
          <p class="home-lead">${escapeHtml(hero.text)}</p>
          <p class="home-hero-actions">
            ${link(hero.links[0].url, hero.links[0].label, 'home-btn home-btn-gold')}
            ${link(hero.links[1].url, hero.links[1].label, 'home-btn home-btn-ghost')}
          </p>
        </div>
        ${mediaSlot('hero', 'home-hero-media')}
        <ul class="home-feature-bar">
${features}
        </ul>
      </div>
    </section>`;
}

function renderDirections() {
  const data = block('directions');
  const icons = ['mix', 'field', 'seed', 'field', 'price', 'volume'];
  const cards = data.items.map((item, index) => (
    `        <li class="home-cut-card">
          ${iconMark(icons[index])}
          <h3>${escapeHtml(item.title)}</h3>
        </li>`
  )).join('\n');
  return `    <section class="home-section home-section-paper" aria-labelledby="home-directions">
      <div class="home-wrap home-directions">
        <header class="home-section-intro">
          <h2 id="home-directions">${escapeHtml(data.heading)}</h2>
          <p>${escapeHtml(data.text)}</p>
        </header>
        <ul class="home-directions-grid">
${cards}
        </ul>
      </div>
    </section>`;
}

function renderCatalog(pages) {
  const data = block('catalog');
  const filters = data.links.slice(0, 4).map((item) => {
    const page = requirePage(pages, item.url);
    return `        <li>${link(page.url, page.page_name, 'home-filter')}</li>`;
  }).join('\n');
  return `    <section class="home-section home-section-light home-catalog" aria-labelledby="home-catalog">
      <div class="home-wrap">
        <header class="home-catalog-head">
          <h2 id="home-catalog">${escapeHtml(data.heading)}</h2>
          ${link(data.links[4].url, data.links[4].label, 'home-text-link-ink')}
        </header>
        <ul class="home-filters">
${filters}
        </ul>
      </div>
    </section>`;
}

function renderProducts(pages) {
  const data = block('products');
  const cards = data.links.map((item) => {
    const page = requirePage(pages, item.url);
    const row = data.items.find((entry) => entry.title === item.label);
    const slot = PRODUCT_SLOTS[item.url];
    return `        <article class="home-product">
          ${mediaSlot(slot, 'home-product-media')}
          <div class="home-product-body">
            <h3>${escapeHtml(page.page_name)}</h3>
            <p>${escapeHtml(row?.text || 'Цена по запросу')}</p>
            <p class="home-product-actions">
              ${link(page.url, 'Подробнее', 'home-btn home-btn-line')}
              ${link('#request', 'Запросить цену', 'home-btn home-btn-gold')}
            </p>
          </div>
        </article>`;
  }).join('\n');
  return `    <section class="home-section home-section-paper" aria-labelledby="home-products">
      <div class="home-wrap">
        <header class="home-section-intro home-section-intro-wide">
          <h2 id="home-products">${escapeHtml(data.heading)}</h2>
          <p>${escapeHtml(data.text)}</p>
        </header>
        <div class="home-product-grid">
${cards}
        </div>
      </div>
    </section>`;
}

function renderPurpose() {
  const data = block('purpose');
  const fields = data.links.map((item) => (
    `        <li>${link(item.url, item.label, 'home-purpose-field')}</li>`
  )).join('\n');
  return `    <section class="home-section home-section-ink home-purpose-section" aria-labelledby="home-purpose">
      <div class="home-wrap home-purpose">
        <div class="home-purpose-copy">
          <h2 id="home-purpose">${escapeHtml(data.heading)}</h2>
          <p>${escapeHtml(data.text)}</p>
        </div>
        <div class="home-purpose-fields">
          <ol>
${fields}
          </ol>
          ${link('/catalog/', 'Открыть каталог', 'home-btn home-btn-gold home-btn-wide')}
        </div>
        ${mediaSlot('representative', 'home-purpose-media')}
      </div>
    </section>`;
}

function renderAbout() {
  const data = block('about');
  const slots = ['warehouse', 'seeds', 'order', 'shipping'];
  const collage = slots.map((slot) => mediaSlot(slot, 'home-about-frame')).join('\n          ');
  const strip = data.items.map((item) => (
    `        <li class="home-about-chip"><strong>${escapeHtml(item.title)}</strong></li>`
  )).join('\n');
  return `    <section class="home-section home-section-paper" aria-labelledby="home-about">
      <div class="home-wrap">
        <div class="home-about">
          <div class="home-about-visual">
          ${collage}
          </div>
          <div class="home-about-copy">
            <h2 id="home-about">${escapeHtml(data.heading)}</h2>
            <p>${escapeHtml(data.text)}</p>
            <p class="home-hero-actions">
              ${link(data.links[0].url, data.links[0].label, 'home-btn home-btn-gold')}
              ${link(data.links[1].url, data.links[1].label, 'home-btn home-btn-line')}
            </p>
          </div>
        </div>
        <ul class="home-about-strip">
${strip}
        </ul>
      </div>
    </section>`;
}

function renderDelivery() {
  const data = block('delivery');
  const steps = data.items.map((item) => (
    `        <li class="home-step">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </li>`
  )).join('\n');
  return `    <section class="home-section home-section-light" aria-labelledby="home-delivery">
      <div class="home-wrap home-delivery">
        <div class="home-delivery-copy">
          <h2 id="home-delivery">${escapeHtml(data.heading)}</h2>
          <p>${escapeHtml(data.text)}</p>
          ${link(data.links[0].url, data.links[0].label, 'home-btn home-btn-line')}
        </div>
        ${mediaSlot('kazakhstan', 'home-map-slot')}
        <ol class="home-steps">
${steps}
        </ol>
      </div>
    </section>`;
}

function renderQuality() {
  const data = block('quality');
  const docs = ['document-1', 'document-2', 'document-3']
    .map((slot) => mediaSlot(slot, 'home-doc-slot'))
    .join('\n          ');
  const list = data.items.map((item) => (
    `          <li>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
          </li>`
  )).join('\n');
  return `    <section class="home-section home-section-paper" aria-labelledby="home-quality">
      <div class="home-wrap home-quality">
        <div class="home-quality-copy">
          <h2 id="home-quality">${escapeHtml(data.heading)}</h2>
          <p>${escapeHtml(data.text)}</p>
          <p class="home-hero-actions">
            ${link(data.links[0].url, data.links[0].label, 'home-btn home-btn-gold')}
            ${link(data.links[1].url, data.links[1].label, 'home-btn home-btn-line')}
          </p>
        </div>
        <div class="home-quality-docs">
          ${docs}
        </div>
        <ul class="home-quality-list">
${list}
        </ul>
      </div>
    </section>`;
}

function renderArticles(pages) {
  const data = block('articles');
  const articleSlots = ['article-1', 'article-2', 'article-3'];
  const cards = data.links.slice(0, 3).map((item, index) => {
    const page = requirePage(pages, item.url);
    return `        <article class="home-article">
          ${mediaSlot(articleSlots[index], 'home-article-media')}
          <p class="home-article-tag">Агроблог</p>
          <h3>${link(page.url, page.page_name)}</h3>
          <p>${link(page.url, 'Читать')}</p>
        </article>`;
  }).join('\n');
  return `    <section class="home-section home-section-light" aria-labelledby="home-articles">
      <div class="home-wrap">
        <header class="home-catalog-head">
          <h2 id="home-articles">${escapeHtml(data.heading)}</h2>
          ${link(data.links[3].url, data.links[3].label, 'home-text-link-ink')}
        </header>
        <div class="home-article-grid">
${cards}
        </div>
      </div>
    </section>`;
}

function renderFaq() {
  const data = block('faq');
  const items = data.items.map((item) => (
    `        <details class="home-faq-item">
          <summary>${escapeHtml(item.title)}</summary>
          <p>${escapeHtml(item.text)}</p>
        </details>`
  )).join('\n');
  return `    <section class="home-section home-section-paper" aria-labelledby="home-faq">
      <div class="home-wrap home-faq">
        <header class="home-section-intro">
          <h2 id="home-faq">${escapeHtml(data.heading)}</h2>
          <p>${escapeHtml(data.text)}</p>
          ${link(data.links[0].url, data.links[0].label, 'home-text-link-ink')}
        </header>
        <div class="home-faq-list">
${items}
        </div>
      </div>
    </section>`;
}

function renderRequest() {
  const data = block('request');
  return `    <section class="home-section home-section-ink home-request" id="request" aria-labelledby="home-request">
      <div class="home-wrap home-request-grid">
        <div>
          <h2 id="home-request">${escapeHtml(data.heading)}</h2>
          <p>${escapeHtml(data.text)}</p>
          <p>${link(data.links[0].url, data.links[0].label, 'home-text-link')}</p>
        </div>
        <form class="home-form" data-lead-form data-form-name="Главная — заявка" novalidate>
          <input class="lead-form-honeypot" type="text" name="website" autocomplete="off" tabindex="-1" aria-hidden="true">
          <div class="home-field">
            <label for="home-lead-name">Имя</label>
            <input id="home-lead-name" name="name" type="text" autocomplete="name">
          </div>
          <div class="home-field">
            <label for="home-lead-phone">Телефон</label>
            <input id="home-lead-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="home-lead-phone-hint">
            <small id="home-lead-phone-hint">Укажите номер для связи.</small>
          </div>
          <div class="home-field">
            <label for="home-lead-volume">Желаемый объём</label>
            <input id="home-lead-volume" name="desired_volume" type="text" autocomplete="off">
          </div>
          <div class="home-field">
            <label for="home-lead-message">Комментарий</label>
            <textarea id="home-lead-message" name="message" rows="3"></textarea>
          </div>
          <button type="submit" class="home-btn home-btn-gold home-btn-wide" disabled aria-disabled="true">Оставить заявку</button>
          <div data-form-status aria-live="polite" aria-atomic="true">Отправка будет доступна после подключения формы.</div>
        </form>
      </div>
    </section>`;
}

export function renderHomepage(page, pages) {
  HEADER_NAV_URLS.forEach((url) => requirePage(pages, url));
  return [
    renderHero(page),
    renderDirections(),
    renderCatalog(pages),
    renderProducts(pages),
    renderPurpose(),
    renderAbout(),
    renderDelivery(),
    renderQuality(),
    renderArticles(pages),
    renderFaq(),
    renderRequest()
  ].join('\n');
}
