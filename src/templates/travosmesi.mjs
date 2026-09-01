import { HOME_IMAGES } from '../data/home-images.mjs';
import { escapeHtml, pageByUrl } from './html.mjs';

export const TRAVOSMESI_URL = '/catalog/travosmesi/';

const CONSENT_TEXT = 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных.';

const PRODUCTS = [
  {
    url: '/catalog/travosmesi/kormovaya/',
    slot: 'travosmes-kormovaya',
    title: 'Травосмесь «Кормовая»',
    text: 'Кормовое направление для хозяйств. Состав и параметры конкретного варианта уточняются перед поставкой.'
  },
  {
    url: '/catalog/travosmesi/universalnaya/',
    slot: 'travosmes-universalnaya',
    title: 'Травосмесь «Универсальная»',
    text: 'Универсальная смесь в ассортименте BAS Agros. Подбор варианта выполняется под задачу и объём заказа.'
  },
  {
    url: '/catalog/travosmesi/rekultivatsionnaya/',
    slot: 'warehouse',
    title: 'Травосмесь «Рекультивационная»',
    text: 'Отдельная смесь для задач восстановления растительного покрова. Характеристики подтверждаются по предлагаемой позиции.'
  },
  {
    url: '/catalog/travosmesi/gazonnaya/',
    slot: 'hero',
    title: 'Травосмесь «Газонная»',
    text: 'Газонное и озеленительное направление. Конкретный состав и условия поставки согласовываются по заявке.'
  },
  {
    url: '/catalog/travosmesi/rozh-vika-65-35/',
    slot: 'article-3',
    title: 'Озимая кормовая травосмесь «Рожь + Вика» 65/35',
    text: 'Озимая кормовая смесь с указанным соотношением ржи и вики 65/35.'
  }
];

export function isTravosmesiHub(page) {
  return page?.url === TRAVOSMESI_URL;
}

export function travosmesiDescription() {
  return 'Травосмеси BAS Agros в Казахстане: кормовая, универсальная, рекультивационная, газонная и озимая смесь Рожь + Вика 65/35. Подбор под задачу и объём поставки.';
}

function requirePage(pages, url) {
  const page = pageByUrl(pages, url);
  if (!page) throw new Error(`Хаб травосмесей ссылается на URL вне manifest: ${url}`);
  return page;
}

function link(url, label, className = '', attributes = '') {
  return `<a href="${escapeHtml(url)}"${className ? ` class="${className}"` : ''}${attributes ? ` ${attributes}` : ''}>${escapeHtml(label)}</a>`;
}

const HERO_IMAGE = {
  width: 1600,
  height: 642,
  fallback: '/assets/img/catalog/travosmesi-hero-1280.webp',
  alt: 'Зелёное поле кормовых трав',
  sizes: '(min-width: 64rem) min(52vw, 820px), (min-width: 48rem) min(46vw, 560px), calc(100vw - 2rem)',
  avif: [
    { src: '/assets/img/catalog/travosmesi-hero-720.avif', w: 720 },
    { src: '/assets/img/catalog/travosmesi-hero-960.avif', w: 960 },
    { src: '/assets/img/catalog/travosmesi-hero-1280.avif', w: 1280 },
    { src: '/assets/img/catalog/travosmesi-hero-1600.avif', w: 1600 }
  ],
  webp: [
    { src: '/assets/img/catalog/travosmesi-hero-720.webp', w: 720 },
    { src: '/assets/img/catalog/travosmesi-hero-960.webp', w: 960 },
    { src: '/assets/img/catalog/travosmesi-hero-1280.webp', w: 1280 },
    { src: '/assets/img/catalog/travosmesi-hero-1600.webp', w: 1600 }
  ]
};

function pictureSources(asset) {
  const avif = asset.avif.map((item) => `${item.src} ${item.w}w`).join(', ');
  const webp = asset.webp.map((item) => `${item.src} ${item.w}w`).join(', ');
  return `<source type="image/avif" srcset="${avif}" sizes="${escapeHtml(asset.sizes)}"><source type="image/webp" srcset="${webp}" sizes="${escapeHtml(asset.sizes)}">`;
}

function media(slot, className = '') {
  const asset = HOME_IMAGES[slot];
  if (!asset) throw new Error(`Не найден image slot для травосмесей: ${slot}`);
  return `<div class="mix-media ${className}" data-asset-slot="${escapeHtml(slot)}"><picture>${pictureSources(asset)}<img src="${escapeHtml(asset.fallback)}" width="${asset.width}" height="${asset.height}" alt="${escapeHtml(asset.alt)}" loading="lazy" decoding="async"></picture></div>`;
}

function heroMedia() {
  return `<div class="mix-media mix-hero-image" data-asset-slot="travosmesi-hero"><picture>${pictureSources(HERO_IMAGE)}<img src="${escapeHtml(HERO_IMAGE.fallback)}" width="${HERO_IMAGE.width}" height="${HERO_IMAGE.height}" alt="${escapeHtml(HERO_IMAGE.alt)}" fetchpriority="high" decoding="async"></picture></div>`;
}

function breadcrumbs(pages) {
  requirePage(pages, '/');
  requirePage(pages, '/catalog/');
  return `<nav class="mix-breadcrumbs" aria-label="Навигация по разделу"><ol class="breadcrumbs"><li><a href="/">Главная</a></li><li><a href="/catalog/">Каталог семян</a></li><li aria-current="page"><span>Травосмеси</span></li></ol></nav>`;
}

function factIcon(name) {
  const shapes = {
    catalog: '<rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/>',
    filter: '<path d="M4 6h16M4 12h16M4 18h16"/><rect x="8" y="4" width="4" height="4"/><rect x="13" y="10" width="4" height="4"/><rect x="6" y="16" width="4" height="4"/>',
    calculator: '<rect x="4" y="2" width="16" height="20"/><path d="M7 6h10M8 11h2m3 0h2m3 0h2M8 15h2m3 0h2m3 0h2M8 19h2m3 0h2m3 0h2"/>',
    truck: '<path d="M3 8h13v10H3z"/><path d="M16 12h4l3 4v2h-7z"/><rect x="6" y="18" width="4" height="4"/><rect x="17" y="18" width="4" height="4"/><path d="M6 11h7"/>'
  };
  return `<svg class="mix-hero-fact-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">${shapes[name]}</g></svg>`;
}

function hero(pages) {
  const facts = [
    ['catalog', '5 товарных направлений'],
    ['filter', 'Подбор под задачу и площадь'],
    ['calculator', 'Расчёт под необходимый объём'],
    ['truck', 'Поставка по Казахстану']
  ].map(([icon, text]) => `<li>${factIcon(icon)}<span>${text}</span></li>`).join('');
  return `<section class="mix-hero" aria-labelledby="mix-h1"><div class="home-wrap">${breadcrumbs(pages)}<div class="mix-hero-grid"><div class="mix-hero-copy"><p class="home-eyebrow">Каталог BAS Agros</p><h1 id="mix-h1">Травосмеси</h1><p class="mix-lead">Семена травосмесей для сельскохозяйственных, кормовых, рекультивационных и озеленительных задач. BAS Agros помогает выбрать подходящую позицию из каталога и рассчитать поставку по Казахстану.</p><div class="home-actions">${link('#mix-products', 'Выбрать травосмесь', 'home-btn home-btn-primary')}${link('#mix-request', 'Получить коммерческое предложение', 'home-btn home-btn-outline')}</div><ul class="mix-hero-facts">${facts}</ul></div><div class="mix-hero-media">${heroMedia()}</div></div></div></section>`;
}

function products(pages) {
  const cards = PRODUCTS.map((item) => {
    requirePage(pages, item.url);
    return `<article class="mix-card"><a class="mix-card-link" href="${escapeHtml(item.url)}">${media(item.slot, 'mix-card-media')}<span class="mix-card-body"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.text)}</span><b>Подробнее →</b></span></a></article>`;
  }).join('');
  return `<section class="mix-section mix-products" id="mix-products" aria-labelledby="mix-products-title"><div class="home-wrap"><div class="mix-section-head"><div><p class="home-eyebrow">Ассортимент</p><h2 id="mix-products-title">Травосмеси в каталоге</h2></div><p>Каждая смесь вынесена на отдельную товарную страницу. На хабе показаны только ассортимент и назначение — конкретный состав, партия и коммерческие условия подтверждаются на этапе заявки.</p></div><div class="mix-product-grid">${cards}</div></div></section>`;
}

function criteria() {
  const items = [
    ['Назначение', 'Сенокос, пастбищное направление, восстановление территории, газон или другая задача.'],
    ['Площадь', 'Площадь помогает определить ориентировочную потребность в семенах.'],
    ['Объём', 'Если необходимое количество уже рассчитано, его можно сразу указать в заявке.'],
    ['Доставка', 'Населённый пункт нужен для расчёта логистики и коммерческого предложения.']
  ];
  return `<section class="mix-section mix-criteria" aria-labelledby="mix-criteria-title"><div class="home-wrap mix-two-col"><div><p class="home-eyebrow">Выбор</p><h2 id="mix-criteria-title">Как выбрать травосмесь под задачу</h2><p>Хаб помогает сузить выбор до подходящей товарной страницы. Для точного предложения достаточно описать задачу хозяйства и основные параметры заказа.</p></div><ol class="mix-criteria-list">${items.map(([title, text]) => `<li><strong>${title}</strong><span>${text}</span></li>`).join('')}</ol></div></section>`;
}

function compare() {
  const rows = [
    ['Кормовая', 'Кормовое направление хозяйства', '/catalog/travosmesi/kormovaya/'],
    ['Универсальная', 'Универсальная позиция из ассортимента', '/catalog/travosmesi/universalnaya/'],
    ['Рекультивационная', 'Восстановление растительного покрова', '/catalog/travosmesi/rekultivatsionnaya/'],
    ['Газонная', 'Газон и озеленение', '/catalog/travosmesi/gazonnaya/'],
    ['Рожь + Вика 65/35', 'Озимая кормовая смесь', '/catalog/travosmesi/rozh-vika-65-35/']
  ];
  return `<section class="mix-section mix-compare" aria-labelledby="mix-compare-title"><div class="home-wrap"><div class="mix-section-head"><div><p class="home-eyebrow">Сравнение</p><h2 id="mix-compare-title">Как различаются позиции в каталоге</h2></div><p>Сравнение построено только по подтверждённому назначению и названию позиции. Неподтверждённые характеристики и составы не добавляются.</p></div><div class="mix-compare-table" role="table" aria-label="Сравнение травосмесей"><div class="mix-compare-row mix-compare-header" role="row"><span role="columnheader">Травосмесь</span><span role="columnheader">Основной ориентир</span><span role="columnheader">Страница</span></div>${rows.map(([name, purpose, url]) => `<div class="mix-compare-row" role="row"><strong role="cell">${name}</strong><span role="cell">${purpose}</span><a role="cell" href="${url}">Подробнее →</a></div>`).join('')}</div></div></section>`;
}

function commercial(pages) {
  requirePage(pages, '/dostavka-i-oplata/');
  requirePage(pages, '/kachestvo-i-sertifikaty/');
  return `<section class="mix-section mix-commercial" aria-labelledby="mix-commercial-title"><div class="home-wrap"><div class="mix-commercial-card"><div><p class="home-eyebrow">Поставка</p><h2 id="mix-commercial-title">От выбора смеси до коммерческого предложения</h2><p>Укажите нужную травосмесь или задачу, площадь, объём и населённый пункт. Менеджер уточнит доступную позицию и подготовит условия поставки.</p>${link('#mix-request', 'Получить коммерческое предложение', 'home-btn home-btn-primary')}</div><div class="mix-commercial-links"><a href="/dostavka-i-oplata/"><strong>Доставка и оплата</strong><span>Как согласовываются параметры поставки →</span></a><a href="/kachestvo-i-sertifikaty/"><strong>Качество и документы</strong><span>Какие сведения можно получить по продукции →</span></a></div></div></div></section>`;
}

function requestForm() {
  return `<section class="mix-section mix-request" id="mix-request" aria-labelledby="mix-request-title"><div class="home-wrap mix-request-grid"><div><p class="home-eyebrow">Заявка</p><h2 id="mix-request-title">Подобрать травосмесь и рассчитать поставку</h2><p>Укажите назначение, площадь, необходимый объём и место доставки. Если конкретная смесь уже выбрана — укажите её в поле комментария.</p></div><form class="home-form mix-form" data-lead-form data-form-name="Травосмеси — подбор и коммерческое предложение"><label for="mix-task">Назначение<select id="mix-task" name="task"><option value="">Выберите задачу</option><option value="Кормовое направление">Кормовое направление</option><option value="Сенокос">Сенокос</option><option value="Пастбище">Пастбище</option><option value="Рекультивация">Рекультивация</option><option value="Газон и озеленение">Газон и озеленение</option><option value="Другое">Другое</option></select></label><label for="mix-area">Площадь посева<input id="mix-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га"></label><label for="mix-volume">Необходимый объём<input id="mix-volume" name="desired_volume" type="text" placeholder="Например, 2 тонны"></label><label for="mix-delivery">Место доставки<input id="mix-delivery" name="delivery_locality" type="text" autocomplete="address-level2" placeholder="Населённый пункт"></label><label for="mix-phone">Телефон<input id="mix-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX"></label><label class="mix-field-wide" for="mix-message">Травосмесь или комментарий<textarea id="mix-message" name="message" rows="3" placeholder="Например, кормовая травосмесь"></textarea></label><input type="hidden" name="intent" value="travosmesi_quote"><input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="mix-consent mix-field-wide">${escapeHtml(CONSENT_TEXT)}</p><button class="home-btn home-btn-primary" type="submit">Получить коммерческое предложение</button><div class="home-form-status mix-field-wide" data-form-status aria-live="polite" aria-atomic="true"></div></form></div></section>`;
}

export function travosmesiStructuredData(page, pages) {
  const itemList = PRODUCTS.map((item, index) => {
    const productPage = requirePage(pages, item.url);
    return {
      '@type': 'ListItem',
      position: index + 1,
      name: productPage.page_name,
      url: productPage.canonical
    };
  });
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Травосмеси BAS Agros',
      url: page.canonical,
      numberOfItems: itemList.length,
      itemListElement: itemList
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://basagros.kz/' },
        { '@type': 'ListItem', position: 2, name: 'Каталог семян', item: 'https://basagros.kz/catalog/' },
        { '@type': 'ListItem', position: 3, name: 'Травосмеси', item: page.canonical }
      ]
    }
  ];
}

export function renderTravosmesi(page, pages) {
  if (!isTravosmesiHub(page)) throw new Error('renderTravosmesi вызван не для /catalog/travosmesi/');
  return [hero(pages), products(pages), criteria(), compare(), commercial(pages), requestForm()].join('\n');
}
