import { HOME_IMAGES } from '../data/home-images.mjs';
import { escapeHtml, pageByUrl } from './html.mjs';

export const TRAVOSMESI_URL = '/catalog/travosmesi/';

const CONSENT_TEXT = 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных.';

const PRODUCTS = [
  {
    url: '/catalog/travosmesi/kormovaya/',
    slot: 'travosmes-kormovaya',
    title: 'Травосмесь «Кормовая»',
    titleLines: ['Травосмесь', '«Кормовая»'],
    text: 'Кормовая травосмесь для формирования кормовой базы хозяйства. Подбираем позицию под назначение посева и необходимый объём.'
  },
  {
    url: '/catalog/travosmesi/universalnaya/',
    slot: 'travosmes-universalnaya',
    title: 'Травосмесь «Универсальная»',
    titleLines: ['Травосмесь', '«Универсальная»'],
    text: 'Универсальная травосмесь из каталога BAS Agros. Подбираем позицию под задачу хозяйства и необходимый объём.'
  },
  {
    url: '/catalog/travosmesi/rekultivatsionnaya/',
    slot: 'travosmes-rekultivatsionnaya',
    title: 'Травосмесь «Рекультивационная»',
    titleLines: ['Травосмесь', '«Рекультивационная»'],
    text: 'Травосмесь для восстановления растительного покрова на рекультивируемых территориях. Подбираем позицию под площадь и объём посева.'
  },
  {
    url: '/catalog/travosmesi/gazonnaya/',
    slot: 'travosmes-gazonnaya',
    title: 'Травосмесь «Газонная»',
    titleLines: ['Травосмесь', '«Газонная»'],
    text: 'Травосмесь для газонного и озеленительного направления. Подбираем позицию под площадь и необходимый объём.'
  },
  {
    url: '/catalog/travosmesi/rozh-vika-65-35/',
    slot: 'travosmes-rozh-vika',
    title: 'Озимая кормовая травосмесь «Рожь + Вика» 65/35',
    titleLines: ['Озимая кормовая травосмесь', '«Рожь + Вика» 65/35'],
    text: 'Озимая кормовая смесь с соотношением ржи и вики 65/35 для кормового направления.'
  }
];

const FAQ = [
  ['Какие травосмеси представлены в каталоге?', 'В каталоге BAS Agros представлены кормовая, универсальная, рекультивационная, газонная травосмеси и озимая кормовая смесь «Рожь + Вика» 65/35.'],
  ['Как выбрать травосмесь под задачу хозяйства?', 'Для подбора укажите назначение посева, площадь, необходимый объём и место доставки. По этим параметрам BAS Agros подбирает подходящую позицию из каталога.'],
  ['Можно ли рассчитать необходимый объём травосмеси?', 'Да. Для расчёта укажите площадь посева и назначение. Если объём уже известен, его можно сразу указать в килограммах или тоннах.'],
  ['Поставляет ли BAS Agros травосмеси по Казахстану?', 'Да. BAS Agros рассчитывает поставку травосмесей по Казахстану. Для коммерческого предложения укажите населённый пункт доставки.'],
  ['Что указать для получения коммерческого предложения?', 'Укажите травосмесь или задачу, площадь, необходимый объём, место доставки и контактный телефон. Менеджер подготовит коммерческое предложение под параметры заказа.']
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

const CARD_SIZES = '(min-width: 64rem) min(28vw, 420px), (min-width: 48rem) 44vw, calc(100vw - 1.5rem)';

function catalogCard(id, alt) {
  return {
    width: 640,
    height: 520,
    fallback: `/assets/img/catalog/${id}-640.webp`,
    alt,
    sizes: CARD_SIZES,
    avif: [
      { src: `/assets/img/catalog/${id}-480.avif`, w: 480 },
      { src: `/assets/img/catalog/${id}-640.avif`, w: 640 },
      { src: `/assets/img/catalog/${id}-960.avif`, w: 960 }
    ],
    webp: [
      { src: `/assets/img/catalog/${id}-480.webp`, w: 480 },
      { src: `/assets/img/catalog/${id}-640.webp`, w: 640 },
      { src: `/assets/img/catalog/${id}-960.webp`, w: 960 }
    ]
  };
}

const CARD_IMAGES = {
  'travosmes-rekultivatsionnaya': catalogCard('mix-card-rekult', 'Разнотравный покров на природном участке'),
  'travosmes-gazonnaya': catalogCard('mix-card-lawn', 'Плотный зелёный газон'),
  'travosmes-rozh-vika': catalogCard('mix-card-rye', 'Поле злаковой культуры для озимой смеси')
};

function pictureSources(asset) {
  const avif = asset.avif.map((item) => `${item.src} ${item.w}w`).join(', ');
  const webp = asset.webp.map((item) => `${item.src} ${item.w}w`).join(', ');
  return `<source type="image/avif" srcset="${avif}" sizes="${escapeHtml(asset.sizes)}"><source type="image/webp" srcset="${webp}" sizes="${escapeHtml(asset.sizes)}">`;
}

function media(slot, className = '') {
  const asset = CARD_IMAGES[slot] || HOME_IMAGES[slot];
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

function mixIcon(name, className) {
  const shapes = {
    catalog: '<rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/>',
    filter: '<path d="M4 6h16M4 12h16M4 18h16"/><rect x="8" y="4" width="4" height="4"/><rect x="13" y="10" width="4" height="4"/><rect x="6" y="16" width="4" height="4"/>',
    calculator: '<rect x="4" y="2" width="16" height="20"/><path d="M7 6h10M8 11h2m3 0h2m3 0h2M8 15h2m3 0h2m3 0h2M8 19h2m3 0h2m3 0h2"/>',
    truck: '<path d="M3 8h13v10H3z"/><path d="M16 12h4l3 4v2h-7z"/><rect x="6" y="18" width="4" height="4"/><rect x="17" y="18" width="4" height="4"/><path d="M6 11h7"/>',
    checklist: '<path d="M9 6h11M9 12h11M9 18h8"/><path d="M4 6l1.6 1.6L8 5M4 12l1.6 1.6L8 11"/>',
    plot: '<rect x="3" y="3" width="18" height="18"/><path d="M3 11h18M11 3v18"/>'
  };
  return `<svg class="${className}" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">${shapes[name]}</g></svg>`;
}

function factIcon(name) {
  return mixIcon(name, 'mix-hero-fact-icon');
}

function hero(pages) {
  const facts = [
    ['catalog', '5 товарных направлений'],
    ['filter', 'Подбор под задачу и площадь'],
    ['calculator', 'Расчёт под необходимый объём'],
    ['truck', 'Поставка по Казахстану']
  ].map(([icon, text]) => `<li>${factIcon(icon)}<span>${text}</span></li>`).join('');
  return `<section class="mix-hero" aria-labelledby="mix-h1"><div class="home-wrap">${breadcrumbs(pages)}<div class="mix-hero-grid"><div class="mix-hero-copy"><p class="home-eyebrow">Каталог BAS Agros</p><h1 id="mix-h1">Травосмеси</h1><p class="mix-lead">Семена травосмесей для сельскохозяйственных, кормовых, рекультивационных и озеленительных задач. BAS Agros подбирает травосмесь под задачу хозяйства, площадь и необходимый объём и рассчитывает поставку по Казахстану.</p><div class="home-actions">${link('#mix-products', 'Выбрать травосмесь', 'home-btn home-btn-primary', 'data-mix-modal-intent="selection"')}${link('#mix-request', 'Получить коммерческое предложение', 'home-btn home-btn-outline', 'data-mix-modal-intent="quote"')}</div><ul class="mix-hero-facts">${facts}</ul></div><div class="mix-hero-media">${heroMedia()}</div></div></div></section>`;
}

function products(pages) {
  const cards = PRODUCTS.map((item) => {
    requirePage(pages, item.url);
    const titleHtml = item.titleLines.map((line) => escapeHtml(line)).join('<br>');
    return `<article class="mix-card"><a class="mix-card-link" href="${escapeHtml(item.url)}">${media(item.slot, 'mix-card-media')}<span class="mix-card-body"><strong>${titleHtml}</strong><span>${escapeHtml(item.text)}</span><b>Подробнее →</b></span></a></article>`;
  }).join('');
  return `<section class="mix-section mix-products" id="mix-products" aria-labelledby="mix-products-title"><div class="home-wrap"><div class="mix-section-head"><div><p class="home-eyebrow">Ассортимент</p><h2 id="mix-products-title">Травосмеси в каталоге</h2></div><p>В каталоге — пять направлений травосмесей для разных задач хозяйства. Выберите позицию по назначению, а мы рассчитаем необходимый объём и условия поставки.</p></div><div class="mix-product-grid">${cards}</div></div></section>`;
}

function criteria() {
  const items = [
    ['checklist', 'Назначение', 'Сенокос, пастбищное направление, восстановление территории, газон или другая задача.'],
    ['plot', 'Площадь', 'Площадь используется для расчёта потребности в семенах.'],
    ['calculator', 'Объём', 'Укажите необходимое количество в килограммах или тоннах.'],
    ['truck', 'Доставка', 'Населённый пункт используется для расчёта логистики и коммерческого предложения.']
  ];
  return `<section class="mix-section mix-criteria" aria-labelledby="mix-criteria-title"><div class="home-wrap mix-two-col"><div><p class="home-eyebrow">Выбор</p><h2 id="mix-criteria-title">Как выбрать травосмесь под задачу</h2><p>Выбор строится на четырёх параметрах: назначение, площадь, объём и место доставки. По ним подбираем позицию и рассчитываем поставку.</p></div><ol class="mix-criteria-list">${items.map(([icon, title, text]) => `<li>${mixIcon(icon, 'mix-criteria-icon')}<strong>${title}</strong><span>${text}</span></li>`).join('')}</ol></div></section>`;
}

function compare() {
  const rows = [
    ['Кормовая', 'Кормовое направление хозяйства', '/catalog/travosmesi/kormovaya/'],
    ['Универсальная', 'Универсальная позиция из ассортимента', '/catalog/travosmesi/universalnaya/'],
    ['Рекультивационная', 'Восстановление растительного покрова', '/catalog/travosmesi/rekultivatsionnaya/'],
    ['Газонная', 'Газон и озеленение', '/catalog/travosmesi/gazonnaya/'],
    ['Рожь + Вика 65/35', 'Озимая кормовая смесь', '/catalog/travosmesi/rozh-vika-65-35/']
  ];
  return `<section class="mix-section mix-compare" aria-labelledby="mix-compare-title"><div class="home-wrap"><div class="mix-section-head"><div><p class="home-eyebrow">Сравнение</p><h2 id="mix-compare-title">Как различаются позиции в каталоге</h2></div><p>Таблица показывает назначение каждой позиции и ведёт на соответствующую товарную страницу.</p></div><div class="mix-compare-table" role="table" aria-label="Сравнение травосмесей"><div class="mix-compare-row mix-compare-header" role="row"><span role="columnheader">Травосмесь</span><span role="columnheader">Основной ориентир</span><span role="columnheader">Страница</span></div>${rows.map(([name, purpose, url]) => `<div class="mix-compare-row" role="row"><strong role="cell">${name}</strong><span role="cell">${purpose}</span><a role="cell" href="${url}">Подробнее →</a></div>`).join('')}</div></div></section>`;
}

function commercial(pages) {
  requirePage(pages, '/dostavka-i-oplata/');
  requirePage(pages, '/kachestvo-i-sertifikaty/');
  return `<section class="mix-section mix-commercial" aria-labelledby="mix-commercial-title"><div class="home-wrap"><div class="mix-commercial-card"><div><p class="home-eyebrow">Поставка</p><h2 id="mix-commercial-title">От выбора смеси до коммерческого предложения</h2><p>Укажите травосмесь или задачу, площадь, объём и населённый пункт. Менеджер подбирает позицию и готовит коммерческое предложение с параметрами поставки.</p>${link('#mix-request', 'Получить коммерческое предложение', 'home-btn home-btn-primary', 'data-mix-modal-intent="quote"')}</div><div class="mix-commercial-links"><a href="/dostavka-i-oplata/"><strong>Доставка и оплата</strong><span>Параметры поставки и оплаты →</span></a><a href="/kachestvo-i-sertifikaty/"><strong>Качество и документы</strong><span>Характеристики и документы по продукции →</span></a></div></div></div></section>`;
}

function faq() {
  const items = FAQ.map(([question, answer], index) => `<details${index === 0 ? ' open' : ''}><summary>${escapeHtml(question)}<span aria-hidden="true"></span></summary><p>${escapeHtml(answer)}</p></details>`).join('');
  return `<section class="mix-section home-faq mix-faq" aria-labelledby="mix-faq-title"><div class="home-wrap home-faq-grid"><div><p class="home-eyebrow">FAQ</p><h2 id="mix-faq-title">Частые вопросы о травосмесях</h2><p>Короткие ответы по ассортименту, подбору, расчёту объёма и поставке травосмесей.</p></div><div>${items}</div></div></section>`;
}

function requestForm() {
  return `<section class="mix-section mix-request" id="mix-request" aria-labelledby="mix-request-title"><div class="home-wrap mix-request-grid"><div><p class="home-eyebrow">Заявка</p><h2 id="mix-request-title">Подобрать травосмесь и рассчитать поставку</h2><p>Укажите назначение, площадь, необходимый объём и место доставки — этих данных достаточно для подбора позиции и расчёта поставки. Название выбранной смеси добавьте в комментарии.</p></div><form class="home-form mix-form" data-lead-form data-form-name="Травосмеси — подбор и коммерческое предложение"><label for="mix-task">Назначение<select id="mix-task" name="task"><option value="">Выберите задачу</option><option value="Кормовое направление">Кормовое направление</option><option value="Сенокос">Сенокос</option><option value="Пастбище">Пастбище</option><option value="Рекультивация">Рекультивация</option><option value="Газон и озеленение">Газон и озеленение</option><option value="Другое">Другое</option></select></label><label for="mix-area">Площадь посева<input id="mix-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га"></label><label for="mix-volume">Необходимый объём<input id="mix-volume" name="desired_volume" type="text" placeholder="Например, 2 тонны"></label><label for="mix-delivery">Место доставки<input id="mix-delivery" name="delivery_locality" type="text" autocomplete="address-level2" placeholder="Населённый пункт"></label><label for="mix-phone">Телефон<input id="mix-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX"></label><label class="mix-field-wide" for="mix-message">Травосмесь или комментарий<textarea id="mix-message" name="message" rows="3" placeholder="Например, кормовая травосмесь"></textarea></label><input type="hidden" name="intent" value="travosmesi_quote"><input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="mix-consent mix-field-wide">${escapeHtml(CONSENT_TEXT)}</p><button class="home-btn home-btn-primary" type="submit">Получить коммерческое предложение</button><div class="home-form-status mix-field-wide" data-form-status aria-live="polite" aria-atomic="true"></div></form></div></section>`;
}

function requestModal() {
  return `<dialog class="home-modal" data-mix-modal aria-labelledby="mix-modal-title" aria-describedby="mix-modal-description"><div class="home-modal-panel"><button class="home-modal-close" type="button" data-mix-modal-close aria-label="Закрыть форму"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><p class="home-eyebrow">Заявка</p><h2 id="mix-modal-title" data-mix-modal-title>Подобрать травосмесь</h2><p id="mix-modal-description" class="home-modal-description" data-mix-modal-description>Укажите задачу, площадь, объём и место доставки.</p><form class="home-form home-modal-form" data-lead-form data-form-name="Травосмеси — модальное окно — подбор"><label for="mix-modal-name">Имя<input id="mix-modal-name" name="name" type="text" autocomplete="name"></label><label for="mix-modal-phone">Телефон<input id="mix-modal-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX"></label><label for="mix-modal-task"><span data-mix-modal-task-label>Назначение</span><input id="mix-modal-task" name="task" type="text" data-mix-modal-task placeholder="Например, сенокос"></label><label for="mix-modal-area">Площадь посева<input id="mix-modal-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га"></label><label for="mix-modal-volume">Необходимый объём<input id="mix-modal-volume" name="desired_volume" type="text" placeholder="Например, 2 тонны"></label><label for="mix-modal-delivery">Место доставки<input id="mix-modal-delivery" name="delivery_locality" type="text" autocomplete="address-level2" placeholder="Населённый пункт"></label><label class="home-modal-message" for="mix-modal-message">Комментарий<textarea id="mix-modal-message" name="message" rows="3" placeholder="Дополнительные параметры заказа"></textarea></label><input type="hidden" name="intent" value="travosmesi_selection" data-mix-modal-intent-field><input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="home-modal-note">${escapeHtml(CONSENT_TEXT)}</p><button class="home-btn home-btn-primary" type="submit" data-mix-modal-submit>Подобрать травосмесь</button><div class="home-form-status" data-form-status aria-live="polite" aria-atomic="true"></div></form></div></dialog><script src="/assets/js/travosmesi-modal.js?v=20260901-1" defer></script>`;
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
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer
        }
      }))
    }
  ];
}

export function renderTravosmesi(page, pages) {
  if (!isTravosmesiHub(page)) throw new Error('renderTravosmesi вызван не для /catalog/travosmesi/');
  return [hero(pages), products(pages), criteria(), compare(), commercial(pages), faq(), requestForm(), requestModal()].join('\n');
}
