import fs from 'node:fs';
import path from 'node:path';
import { HOME_IMAGES } from '../data/home-images.mjs';
import { HEADER_NAV_URLS } from './constants.mjs';
import { escapeHtml, pageByUrl } from './html.mjs';

const homepage = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/homepage.json'), 'utf8'));
const HEADER = [
  ['/catalog/', 'Каталог'], ['#solutions', 'Решения'], ['/o-kompanii/', 'О компании'],
  ['/dostavka-i-oplata/', 'Доставка'], ['/kachestvo-i-sertifikaty/', 'Качество'],
  ['/agroblog/', 'Агроблог'], ['/faq/', 'FAQ']
];
const FOOTER = {
  'Каталог': ['/catalog/', '/catalog/travosmesi/', '/catalog/mnogoletnie-kormovye-travy/', '/catalog/odnoletnie-kormovye-travy/', '/catalog/sorgo/'],
  'Решения': ['/catalog/dlya-senokosa/', '/catalog/pastbishchnye-travy/', '/catalog/medonosy/', '/catalog/sideraty/'],
  'Компания': ['/o-kompanii/', '/dostavka-i-oplata/', '/kachestvo-i-sertifikaty/', '/faq/'],
  'Агроблог': ['/agroblog/', '/agroblog/urozhaynost-lyutserny/', '/agroblog/posev-lyutserny/', '/agroblog/viko-ovsyanaya-smes-posev/']
};
const PHONE_HREF = 'tel:+77059608987';
const PHONE_LABEL = '+7 705 960 89 87';
const CONSENT_TEXT = 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных.';

function block(id) {
  const value = homepage.blocks.find((item) => item.id === id);
  if (!value || value.status !== 'confirmed') throw new Error(`homepage.json: неподтверждённый блок ${id}`);
  return value;
}
function requirePage(pages, url) {
  const value = pageByUrl(pages, url);
  if (!value) throw new Error(`homepage ссылается на URL вне manifest: ${url}`);
  return value;
}
function link(url, label, className = '', attributes = '') {
  return `<a href="${escapeHtml(url)}"${className ? ` class="${className}"` : ''}${attributes ? ` ${attributes}` : ''}>${escapeHtml(label)}</a>`;
}
function paragraphs(text) {
  return String(text || '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `<p>${escapeHtml(item)}</p>`)
    .join('');
}
function logo() {
  return `<img class="home-logo-image" src="/assets/img/bas-agros-logo.png" width="1342" height="1172" alt="BAS Agros" decoding="async">`;
}
function phoneIcon() {
  return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M7.3 3.5 9.6 8l-1.8 1.6c1 2.3 2.7 4 5 5l1.7-1.8 4.4 2.3c.5.3.8.8.7 1.4-.3 2.1-1.8 3.5-3.9 3.5C9.2 20 4 14.8 4 8.3c0-2 1.4-3.6 3.5-3.9.6-.1 1.2.2 1.5.7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function phoneLink(className) {
  return `<a href="${PHONE_HREF}" class="${className}" aria-label="Позвонить по номеру ${PHONE_LABEL}">${phoneIcon()}<span>${PHONE_LABEL}</span></a>`;
}
function icon(name) {
  const shapes = {
    livestock: '<path d="M8 17h25v14H12l-4-6Z"/><path d="M13 31v7m14-7v7M33 20l5-5m-5 9 6 2M12 17 8 12"/><circle cx="17" cy="22" r="2"/>',
    farm: '<circle cx="12" cy="31" r="7"/><circle cx="33" cy="31" r="7"/><path d="M12 31h12l5-17H17l-5 17Zm7-17V8h9l5 6"/>',
    bee: '<ellipse cx="24" cy="24" rx="7" ry="12"/><path d="m19 16-7-6c-5 7-1 13 7 12m10-6 7-6c5 7 1 13-7 12M18 24h12m-11 6h10M24 12V7"/>',
    box: '<path d="m8 15 16-8 16 8-16 9-16-9Zm0 0v18l16 9 16-9V15M24 24v18"/>',
    leaf: '<path d="M9 38C9 20 19 9 38 8c1 19-10 30-29 30Zm2-2c8-11 15-17 25-24"/>',
    document: '<path d="M11 5h19l8 8v30H11zM30 5v8h8M17 22h15m-15 7h15m-15 7h10"/>',
    quality: '<circle cx="24" cy="18" r="8"/><path d="M21 18l2 2 4-4"/><path d="M18 25v12l6-4 6 4V25"/>',
    categories: '<rect x="8" y="10" width="12" height="10" rx="2"/><rect x="28" y="10" width="12" height="10" rx="2"/><rect x="18" y="28" width="12" height="10" rx="2"/><path d="M14 20v4h16v4"/><path d="M34 20v4"/>',
    compass: '<circle cx="24" cy="24" r="14"/><path d="m29 19-8 3-3 8 8-3 3-8Z"/><circle cx="24" cy="24" r="1.2"/>',
    delivery: '<path d="M6 16h23v13H6z"/><path d="M29 20h6l5 6v3H29z"/><circle cx="16" cy="34" r="4"/><circle cx="34" cy="34" r="4"/><path d="M12 21h10"/>'
  };
  return `<svg class="home-icon" viewBox="0 0 48 48" width="48" height="48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${shapes[name] || shapes.leaf}</g></svg>`;
}
function trustIcon(title) {
  switch (title) {
    case 'Качество семян': return icon('quality');
    case 'Категории под задачи': return icon('categories');
    case 'Поддержка выбора': return icon('compass');
    case 'Доставка по Казахстану': return icon('delivery');
    default: return icon('leaf');
  }
}
function imageFilesExist(asset) {
  return [asset.fallback, ...asset.avif.map((x) => x.src), ...asset.webp.map((x) => x.src)]
    .every((href) => fs.existsSync(path.join(process.cwd(), 'site', href.replace(/^\//, ''))));
}
function mediaSlot(slot, className = '') {
  const asset = HOME_IMAGES[slot];
  if (!asset || !imageFilesExist(asset)) return `<div class="home-media home-media-placeholder ${className}" data-asset-slot="${escapeHtml(slot)}" role="img" aria-label="Изображение ожидает утверждённый исходник">${icon('leaf')}<span>Фото будет добавлено после утверждения</span></div>`;
  const avif = asset.avif.map((x) => `${x.src} ${x.w}w`).join(', ');
  const webp = asset.webp.map((x) => `${x.src} ${x.w}w`).join(', ');
  return `<div class="home-media ${className}" data-asset-slot="${escapeHtml(slot)}"><picture><source type="image/avif" srcset="${avif}" sizes="${escapeHtml(asset.sizes)}"><source type="image/webp" srcset="${webp}" sizes="${escapeHtml(asset.sizes)}"><img src="${escapeHtml(asset.fallback)}" width="${asset.width}" height="${asset.height}" alt="${escapeHtml(asset.alt)}"${asset.priority ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture></div>`;
}
function navList(items, pages) {
  return items.map(([url, label]) => {
    if (url.startsWith('/#')) requirePage(pages, '/');
    else if (!url.startsWith('#')) requirePage(pages, url);
    return `<li>${link(url, label)}</li>`;
  }).join('');
}
function sectionHead(data, id, aside = '', kicker = '') {
  return `<header class="home-section-head" data-lux-reveal><div>${kicker ? `<p class="home-kicker">${escapeHtml(kicker)}</p>` : ''}<h2 id="${id}">${escapeHtml(data.heading)}</h2>${data.text ? `<p>${escapeHtml(data.text)}</p>` : ''}</div>${aside}</header>`;
}

export function homepageDescription() { return homepage.description.text; }
export function homepageFaq() {
  return block('faq').items.map((item) => [item.title, item.text]);
}
export function renderHomeHeader(page, pages) {
  const headerItems = HEADER.map(([url, label]) => [url === '#solutions' && page.url !== '/' ? '/#solutions' : url, label]);
  return `<header class="home-header"><div class="home-wrap home-header-inner"><a class="home-brand" href="/" aria-label="BAS Agros — главная">${logo()}</a><button class="home-menu-toggle" type="button" aria-expanded="false" aria-controls="home-navigation" data-menu-toggle><span class="visually-hidden">Открыть меню</span><span aria-hidden="true"></span></button><nav class="home-nav" id="home-navigation" aria-label="Основная навигация" data-mobile-nav><ul>${navList(headerItems, pages)}</ul><div class="home-nav-actions">${phoneLink('home-btn home-btn-outline')}${link('#request', 'Получить предложение', 'home-btn home-btn-primary', 'data-home-modal-intent="commercial_offer"')}</div></nav></div></header>`;
}
export function renderHomeFooter(pages) {
  const cols = Object.entries(FOOTER).map(([heading, urls]) => `<nav aria-label="${heading}"><h2>${heading}</h2><ul>${urls.map((url) => { const p = requirePage(pages, url); return `<li>${link(p.url, p.page_name)}</li>`; }).join('')}</ul></nav>`).join('');
  return `<footer class="home-footer"><div class="home-wrap home-footer-grid"><div class="home-footer-brand"><a class="home-brand" href="/">${logo()}</a><p>Семена трав, травосмеси и сельскохозяйственные культуры с доставкой по Казахстану.</p></div>${cols}<div id="contacts"><h2>Контакты</h2><p>${phoneLink('home-footer-phone')}</p><p>Поставка семян по Казахстану.</p>${link('#request', 'Получить коммерческое предложение →', 'home-footer-cta', 'data-home-modal-intent="commercial_offer"')}</div></div><div class="home-wrap home-footer-bottom"><p>© BAS Agros</p></div></footer>`;
}

function renderHero(page, pages) {
  const data = block('hero');
  if (page.h1 !== data.heading) throw new Error('homepage hero.heading должен совпадать с h1 маршрута');
  const categoryLinks = data.items.map((item) => { requirePage(pages, item.url); return `<li>${link(item.url, item.title)}<span aria-hidden="true">↗</span></li>`; }).join('');
  const facts = (data.facts || []).map((item) => `<li><span aria-hidden="true"></span>${escapeHtml(item)}</li>`).join('');
  return `<section class="home-hero" aria-labelledby="home-h1" data-lux-hero>
    <div class="home-hero-stage">
      ${mediaSlot('hero', 'home-hero-main')}
      <div class="home-hero-shade" aria-hidden="true"></div>
      <div class="home-wrap home-hero-content">
        <div class="home-hero-copy">
          <p class="home-eyebrow">BAS Agros · Казахстан</p>
          <h1 id="home-h1">${escapeHtml(data.heading)}</h1>
          <p class="home-lead">${escapeHtml(data.text)}</p>
          <div class="home-actions">${link(data.links[0].url, data.links[0].label, 'home-btn home-btn-primary', 'data-home-modal-intent="commercial_offer"')}${link(data.links[1].url, data.links[1].label, 'home-btn home-btn-ghost')}</div>
        </div>
        <aside class="home-hero-rail" aria-label="Ключевые возможности BAS Agros">
          <p class="home-hero-rail-label">Поставка для агробизнеса</p>
          <ul>${facts}</ul>
          ${mediaSlot('seeds', 'home-hero-specimen')}
        </aside>
      </div>
      <div class="home-wrap home-hero-index"><p>Основные направления</p><ul>${categoryLinks}</ul></div>
    </div>
  </section>`;
}

function renderSolutions(pages) {
  const data = block('solutions');
  const purposeIcons = ['leaf', 'farm', 'bee', 'compass'];
  const tabs = data.items.map((item, index) => {
    requirePage(pages, item.url);
    return `<button class="home-purpose-tab${index === 0 ? ' is-active' : ''}" type="button" role="tab" id="purpose-tab-${index}" aria-controls="purpose-panel-${index}" aria-selected="${index === 0 ? 'true' : 'false'}" tabindex="${index === 0 ? '0' : '-1'}" data-purpose-tab="${index}">${icon(purposeIcons[index])}<span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.text)}</small></span><b aria-hidden="true">→</b></button>`;
  }).join('');
  const benefits = [
    ['leaf', 'Категории под задачу'],
    ['compass', 'Помощь с выбором'],
    ['quality', 'Параметры партии'],
    ['delivery', 'Поставка по Казахстану']
  ];
  const panels = data.items.map((item, index) => `<article class="home-purpose-panel${index === 0 ? ' is-active' : ''}" role="tabpanel" id="purpose-panel-${index}" aria-labelledby="purpose-tab-${index}"${index === 0 ? '' : ' hidden'} data-purpose-panel="${index}">
    ${mediaSlot(item.slot, 'home-purpose-media')}
    <div class="home-purpose-shade" aria-hidden="true"></div>
    <div class="home-purpose-copy"><p class="home-kicker">Решение BAS Agros</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p>${link(item.url, 'Смотреть направление →', 'home-btn home-btn-outline')}</div>
    <ul class="home-purpose-benefits">${benefits.map(([name, label]) => `<li>${icon(name)}<span>${escapeHtml(label)}</span></li>`).join('')}</ul>
  </article>`).join('');
  return `<section class="home-section home-solutions" id="solutions" aria-labelledby="solutions-title">
    <div class="home-wrap">${sectionHead(data, 'solutions-title', '', 'Подбор по назначению')}
      <div class="home-purpose-selector" data-purpose-selector data-lux-reveal>
        <aside class="home-purpose-nav"><p>Подберём под вашу задачу</p><div class="home-purpose-tabs" role="tablist" aria-orientation="vertical">${tabs}</div></aside>
        <div class="home-purpose-panels">${panels}</div>
      </div>
    </div>
  </section>`;
}

function renderAudience(pages) {
  const data = block('audience');
  const scenes = [
    {
      image: 'audience-livestock',
      heading: 'Сенокос, пастбища и кормовая база',
      lead: 'Подбор семян под назначение посева, площадь, регион и планируемый объём поставки.',
      features: [
        ['Назначение посева', 'Сенокос, пастбище или кормовая база'],
        ['Подходящая категория', 'Травосмеси и кормовые травы'],
        ['Параметры поставки', 'Площадь, объём и регион']
      ]
    },
    {
      image: 'audience-farming',
      heading: 'Культуры под производственную задачу',
      lead: 'Переход к подходящей категории начинается с задачи хозяйства и параметров планируемой поставки.',
      features: [
        ['Задача хозяйства', 'Посевы, севооборот или сидерация'],
        ['Направление каталога', 'Культуры и категории под задачу'],
        ['Параметры заявки', 'Культура, объём и регион']
      ]
    },
    {
      image: 'audience-apiary',
      heading: 'Культуры для медоносных посевов',
      lead: 'Подбор направления для пасечного хозяйства с учётом площади посева и параметров поставки.',
      features: [
        ['Назначение', 'Медоносный посев'],
        ['Подтверждённые культуры', 'Фацелия и связанные позиции каталога'],
        ['Параметры поставки', 'Площадь, объём и регион']
      ]
    },
    {
      image: 'audience-wholesale',
      heading: 'Категории и объём для расчёта',
      lead: 'Для оптовой закупки укажите нужные категории, планируемый объём и направление поставки.',
      features: [
        ['Категории', 'Нужные группы и культуры'],
        ['Планируемый объём', 'Параметры закупки для расчёта'],
        ['Регион поставки', 'Направление для организации логистики']
      ]
    }
  ];
  const featureIcons = ['compass', 'categories', 'delivery'];
  const rows = data.items.map((item, index) => {
    requirePage(pages, item.url);
    const scene = scenes[index];
    return `<li class="audience-scene audience-scene-${index + 1}" data-audience-scene>
      <picture class="audience-scene-media" aria-hidden="true">
        <source srcset="/assets/img/home/${scene.image}-800.webp 800w, /assets/img/home/${scene.image}-1440.webp 1440w" sizes="(min-width: 64rem) 80vw, 100vw" type="image/webp">
        <img src="/assets/img/home/${scene.image}-800.webp" width="800" height="533" loading="lazy" decoding="async" alt="">
      </picture>
      <span class="audience-scene-shade" aria-hidden="true"></span>
      <button class="audience-scene-trigger" id="audience-trigger-${index}" type="button" aria-expanded="false" aria-controls="audience-detail-${index}" data-audience-trigger>
        <span class="audience-scene-icon">${icon(item.icon)}</span>
        <span class="audience-scene-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.text)}</small></span>
        <span class="audience-scene-arrow" aria-hidden="true">→</span>
      </button>
      <div class="audience-scene-teaser">
        <div><span>Задача</span><p>${escapeHtml(item.text)}</p></div>
        <div><span>Решение</span><p>${escapeHtml(item.result)}</p></div>
        ${link(item.url, 'Перейти к подбору →', 'audience-scene-teaser-link')}
      </div>
      ${link(item.url, '→', 'audience-scene-fallback', `aria-label="${escapeHtml(item.result)}"`)}
      <div class="audience-scene-detail" id="audience-detail-${index}" role="region" aria-labelledby="audience-trigger-${index}" data-audience-detail hidden>
        <div class="audience-scene-detail-inner">
          <p class="audience-scene-eyebrow">${icon(item.icon)}<span>${escapeHtml(item.title)}</span></p>
          <h3>${escapeHtml(scene.heading)}</h3>
          <p class="audience-scene-lead">${escapeHtml(scene.lead)}</p>
          <ul class="audience-scene-features">
            ${scene.features.map((feature, featureIndex) => `<li>${icon(featureIcons[featureIndex])}<div><strong>${escapeHtml(feature[0])}</strong><span>${escapeHtml(feature[1])}</span></div></li>`).join('')}
          </ul>
          <div class="audience-scene-actions">
            ${link(item.url, 'Смотреть решения →', 'audience-scene-primary')}
            <a class="audience-scene-secondary" href="#request" data-home-modal-intent="selection">Подобрать культуры →</a>
          </div>
        </div>
      </div>
    </li>`;
  }).join('');
  return `<section class="home-section home-audience" id="audience" aria-labelledby="audience-title">
    <div class="home-wrap">
      <div class="audience-stage-head" data-lux-reveal>
        <p class="home-kicker">B2B-сценарии</p>
        <h2 id="audience-title">${escapeHtml(data.heading)}</h2>
        <p>${escapeHtml(data.text)}</p>
      </div>
      <div class="audience-stage" data-audience-stage>
        <ul class="audience-stage-list" data-audience-list>${rows}</ul>
        <svg class="audience-stage-wave" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs><filter id="audience-wave-glow" x="-20%" y="-80%" width="140%" height="250%"><feGaussianBlur stdDeviation="4" result="blur"></feGaussianBlur><feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs>
          <path d="M0 91 C148 91 205 54 332 61 C475 69 520 111 650 94 C782 76 830 56 963 69 C1095 82 1168 59 1440 70" pathLength="1"></path>
          <circle cx="88" cy="83" r="5"></circle><circle cx="727" cy="91" r="5"></circle><circle cx="1012" cy="70" r="5"></circle><circle cx="1297" cy="66" r="5"></circle>
        </svg>
      </div>
    </div>
  </section>`;
}

function renderCatalog(pages) {
  const data = block('catalog');
  const cards = data.items.map((item, index) => {
    requirePage(pages, item.url);
    return `<article class="home-category${item.featured ? ' home-category-featured' : ''} home-category-${index + 1}" data-lux-reveal>
      <a href="${escapeHtml(item.url)}" class="home-category-media">${mediaSlot(item.slot)}<span class="home-category-arrow" aria-hidden="true">↗</span></a>
      <div class="home-category-body"><p class="home-kicker">${item.featured ? 'Главное направление' : 'Категория'}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p>${link(item.url, 'Открыть направление →', 'home-category-link')}</div>
    </article>`;
  }).join('');
  return `<section class="home-section home-catalog" aria-labelledby="catalog-title">
    <div class="home-wrap">${sectionHead(data, 'catalog-title', link('/catalog/', 'Весь каталог →', 'home-text-link'), 'Каталог')}<div class="home-category-grid">${cards}</div></div>
  </section>`;
}

function cropSlot(title) {
  const slots = {
    'Люцерна': 'lyutserna',
    'Эспарцет': 'espartset',
    'Суданская трава': 'article-1',
    'Кострец': 'travosmes-universalnaya',
    'Фацелия': 'fatseliya',
    'Кормовая травосмесь': 'travosmes-kormovaya'
  };
  return slots[title] || 'representative';
}
function renderCrops(pages) {
  const data = block('crops');
  const items = data.items.map((item) => {
    requirePage(pages, item.url);
    return `<li><a href="${escapeHtml(item.url)}">${mediaSlot(cropSlot(item.title))}<span>${escapeHtml(item.title)}</span><b aria-hidden="true">↗</b></a></li>`;
  }).join('');
  return `<section class="home-section home-crops" aria-labelledby="crops-title">
    <div class="home-wrap home-crops-shell" data-lux-reveal>
      <div class="home-crops-side"><p class="home-kicker">Подобранные культуры</p><h2 id="crops-title">${escapeHtml(data.heading)}</h2><p>${escapeHtml(data.text)}</p><div class="home-crops-controls"><button type="button" data-crop-prev aria-label="Предыдущие культуры">←</button><button type="button" data-crop-next aria-label="Следующие культуры">→</button></div></div>
      <div class="home-crops-rail-wrap">
        <ul class="home-crops-list" data-crop-rail>${items}</ul>
        ${link('/catalog/', 'Смотреть полный каталог →', 'home-crops-catalog')}
      </div>
    </div>
  </section>`;
}

function renderGuide() {
  const data = block('guide');
  return `<section class="home-section home-guide" aria-labelledby="guide-title">
    <div class="home-wrap home-guide-grid">
      <div class="home-guide-intro" data-lux-reveal>
        <p class="home-kicker">Персональный подбор</p>
        <h2 id="guide-title">${escapeHtml(data.heading)}</h2>
        <p>${escapeHtml(data.text)}</p>
        <ul class="home-guide-markers">${data.items.map((item) => `<li><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.text)}</span></li>`).join('')}</ul>
      </div>
      <div class="home-guide-form-shell" data-lux-reveal>
        <p class="home-guide-form-label">Расскажите о задаче</p>
        <form class="home-form home-form-compact" data-lead-form data-form-name="Главная — подбор семян под задачу">
          <label for="guide-task">Задача хозяйства<select id="guide-task" name="task"><option value="">Выберите задачу</option><option value="Сенокос">Сенокос</option><option value="Пастбище">Пастбище</option><option value="Медоносный посев">Медоносный посев</option><option value="Сидерация">Сидерация</option></select></label>
          <label for="guide-category">Категория<select id="guide-category" name="category"><option value="">Выберите категорию</option><option value="Травосмеси">Травосмеси</option><option value="Многолетние травы">Многолетние травы</option><option value="Однолетние травы">Однолетние травы</option><option value="Сорго">Сорго</option></select></label>
          <label for="guide-sowing-area">Площадь посева<input id="guide-sowing-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га"></label>
          <label for="guide-desired-volume">Планируемый объём<input id="guide-desired-volume" name="desired_volume" type="text" placeholder="Например, 2 тонны"></label>
          <label for="guide-delivery-locality">Регион / место доставки<input id="guide-delivery-locality" name="delivery_locality" type="text" autocomplete="address-level2" placeholder="Населённый пункт"></label>
          <label for="guide-phone">Телефон<input id="guide-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX"></label>
          <input type="hidden" name="intent" value="seed_selection"><input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="home-btn home-btn-primary home-field-wide" type="submit">Получить персональный подбор</button>
          <p class="home-guide-consent home-field-wide">${escapeHtml(CONSENT_TEXT)}</p><div class="home-form-status home-field-wide" data-form-status aria-live="polite" aria-atomic="true"></div>
        </form>
      </div>
    </div>
  </section>`;
}

function renderAbout(pages) {
  const data = block('about');
  data.links.forEach((x) => requirePage(pages, x.url));
  return `<section class="home-section home-about" aria-labelledby="about-title">
    <div class="home-wrap">
      <div class="home-strength" data-strength-banner data-lux-reveal>
        <div class="home-strength-copy"><p class="home-kicker">Травы и травосмеси</p><h2 id="about-title">Семена для задач сельского хозяйства</h2><ul>${data.items.map((item) => `<li><span aria-hidden="true">✓</span>${escapeHtml(item.title)}</li>`).join('')}</ul>${link(data.links[1].url, 'Перейти в каталог трав →', 'home-btn home-btn-outline')}</div>
        ${mediaSlot('article-2', 'home-strength-media')}
      </div>
    </div>
  </section>`;
}

function renderDeliveryQuality(pages) {
  const delivery = block('delivery');
  const quality = block('quality');
  requirePage(pages, delivery.links[0].url);
  requirePage(pages, quality.links[0].url);
  return `<section class="home-section home-service" aria-label="Доставка и качество">
    <div class="home-wrap home-service-stage">
      <article class="home-delivery-panel" aria-labelledby="delivery-title" data-lux-reveal>
        <p class="home-kicker">От заявки до поставки</p><h2 id="delivery-title">${escapeHtml(delivery.heading)}</h2><p>${escapeHtml(delivery.text)}</p>
        <ol class="home-delivery-steps">${delivery.items.map((item) => `<li><span aria-hidden="true"></span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div></li>`).join('')}</ol>
        ${link(delivery.links[0].url, `${delivery.links[0].label} →`, 'home-text-link')}
      </article>
      <article class="home-quality" aria-labelledby="quality-title" data-lux-reveal>
        ${mediaSlot('quality', 'home-quality-media')}
        <div class="home-quality-shade" aria-hidden="true"></div>
        <div class="home-quality-copy">${icon('document')}<p class="home-kicker">Контроль партии</p><h2 id="quality-title">${escapeHtml(quality.heading)}</h2><p>${escapeHtml(quality.text)}</p>${link(quality.links[0].url, `${quality.links[0].label} →`, 'home-text-link')}</div>
      </article>
    </div>
  </section>`;
}

function renderArticles(pages) {
  const data = block('articles');
  const cards = data.items.map((item) => {
    requirePage(pages, item.url);
    return `<article class="home-article" data-lux-reveal><a href="${escapeHtml(item.url)}" class="home-article-media">${mediaSlot(item.slot)}<span aria-hidden="true">↗</span></a><div><h3>${link(item.url, item.title)}</h3><p>${escapeHtml(item.text)}</p></div></article>`;
  }).join('');
  return `<section class="home-section home-articles" aria-labelledby="articles-title"><div class="home-wrap">${sectionHead(data, 'articles-title', link(data.links[0].url, `${data.links[0].label} →`, 'home-text-link'), 'Экспертиза')}<div class="home-article-grid">${cards}</div></div></section>`;
}

function renderFaq(pages) {
  const data = block('faq');
  requirePage(pages, data.links[0].url);
  return `<section class="home-section home-faq" aria-labelledby="faq-title"><div class="home-wrap home-faq-grid"><div data-lux-reveal><p class="home-kicker">FAQ</p><h2 id="faq-title">${escapeHtml(data.heading)}</h2><p>${escapeHtml(data.text)}</p>${link(data.links[0].url, `${data.links[0].label} →`, 'home-text-link')}</div><div data-lux-reveal>${data.items.map((item, i) => `<details${i === 0 ? ' open' : ''}><summary>${escapeHtml(item.title)}<span aria-hidden="true"></span></summary><p>${escapeHtml(item.text)}</p></details>`).join('')}</div></div></section>`;
}

function renderRequest() {
  const data = block('request');
  return `<section class="home-section home-request" id="request" aria-labelledby="request-title">
    <div class="home-request-aura" aria-hidden="true"></div>
    <div class="home-wrap home-request-grid">
      <div class="home-request-copy" data-lux-reveal><p class="home-eyebrow">Коммерческое предложение</p><h2 id="request-title">${escapeHtml(data.heading)}</h2><p>${escapeHtml(data.text)}</p><p class="home-request-note">Культура · объём · площадь · регион поставки</p></div>
      <form class="home-form" data-lead-form data-form-name="Главная — коммерческое предложение" data-lux-reveal>
        <label for="request-name">Имя<input id="request-name" name="name" type="text" autocomplete="name"></label>
        <label for="request-phone">Телефон<input id="request-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX"></label>
        <label for="request-category">Категория или культура<input id="request-category" name="category" type="text" placeholder="Например, люцерна"></label>
        <label for="request-sowing-area">Площадь посева<input id="request-sowing-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га"></label>
        <label for="request-desired-volume">Планируемый объём<input id="request-desired-volume" name="desired_volume" type="text" placeholder="Например, 2 тонны"></label>
        <label for="request-delivery-locality">Населённый пункт доставки<input id="request-delivery-locality" name="delivery_locality" type="text" autocomplete="address-level2" placeholder="Населённый пункт"></label>
        <label class="home-field-wide" for="request-message">Комментарий<textarea id="request-message" name="message" rows="4" placeholder="Дополнительные параметры заказа"></textarea></label>
        <input type="hidden" name="intent" value="commercial_offer"><input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="home-btn home-btn-primary home-field-wide" type="submit">Получить коммерческое предложение</button>
        <p class="home-guide-consent home-field-wide">${escapeHtml(CONSENT_TEXT)}</p><div class="home-form-status home-field-wide" data-form-status aria-live="polite" aria-atomic="true"></div>
      </form>
    </div>
  </section>`;
}

function renderHomeModal() {
  return `<dialog class="home-modal" data-home-modal aria-labelledby="home-modal-title" aria-describedby="home-modal-description">
    <div class="home-modal-panel">
      <button class="home-modal-close" type="button" data-home-modal-close aria-label="Закрыть форму"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
      <p class="home-eyebrow">Заявка</p>
      <h2 id="home-modal-title" data-home-modal-title>Получить коммерческое предложение</h2>
      <p id="home-modal-description" class="home-modal-description" data-home-modal-description>Укажите культуру, объём и населённый пункт доставки. Менеджер подготовит коммерческий расчёт под параметры заказа.</p>
      <form class="home-form home-modal-form" data-lead-form data-form-name="Главная — модальное окно — коммерческое предложение">
        <label for="home-modal-name">Имя<input id="home-modal-name" name="name" type="text" autocomplete="name"></label>
        <label for="home-modal-phone">Телефон<input id="home-modal-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX"></label>
        <label for="home-modal-category"><span data-home-modal-category-label>Категория или культура</span><input id="home-modal-category" name="category" type="text" data-home-modal-category placeholder="Например, люцерна или травосмесь"></label>
        <label for="home-modal-area">Площадь посева<input id="home-modal-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га"></label>
        <label class="home-modal-message" for="home-modal-message"><span data-home-modal-message-label>Объём и место доставки</span><textarea id="home-modal-message" name="message" rows="3" data-home-modal-message placeholder="Например, 2 тонны, Акмолинская область"></textarea></label>
        <input type="hidden" name="intent" value="commercial_offer" data-home-modal-intent-field><input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p class="home-modal-note">${escapeHtml(CONSENT_TEXT)}</p><button class="home-btn home-btn-primary" type="submit" data-home-modal-submit>Получить коммерческое предложение</button><div class="home-form-status" data-form-status aria-live="polite" aria-atomic="true"></div>
      </form>
    </div>
  </dialog>`;
}

export function renderHomepage(page, pages) {
  HEADER_NAV_URLS.forEach((url) => requirePage(pages, url));
  return [
    renderHero(page, pages),
    renderSolutions(pages),
    renderAudience(pages),
    renderCatalog(pages),
    renderCrops(pages),
    renderGuide(),
    renderAbout(pages),
    renderDeliveryQuality(pages),
    renderArticles(pages),
    renderFaq(pages),
    renderRequest(),
    renderHomeModal()
  ].join('\n');
}
