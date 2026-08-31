import { escapeHtml, pageByUrl } from './html.mjs';

const LUCERNE_URL = '/catalog/mnogoletnie-kormovye-travy/lyutserna/';
const LUCERNE_IMAGE = 'https://basagros.kz/assets/img/social/lucerne-seeds-1200x630.jpg';

const PARTY_LABELS = {
  variety: 'Сорт',
  reproduction: 'Репродукция',
  origin: 'Производитель / происхождение',
  harvestYear: 'Год урожая',
  lotNumber: 'Номер партии',
  purity: 'Чистота',
  germination: 'Всхожесть',
  hardSeeds: 'Твёрдые семена',
  impurities: 'Примеси',
  packagingNetWeight: 'Вес упаковки',
  availableVolume: 'Доступный объём',
  documents: 'Документы'
};

const PARTY_DATA = {
  variety: null,
  reproduction: null,
  origin: null,
  harvestYear: null,
  lotNumber: null,
  purity: null,
  germination: null,
  hardSeeds: null,
  impurities: null,
  packagingNetWeight: null,
  availableVolume: null,
  documents: null
};

function requirePage(pages, url) {
  const page = pageByUrl(pages, url);
  if (!page) throw new Error(`Товарная страница ссылается на URL вне manifest: ${url}`);
  return page;
}

function link(pages, url, label, className = '') {
  requirePage(pages, url);
  return `<a href="${escapeHtml(url)}"${className ? ` class="${className}"` : ''}>${escapeHtml(label)}</a>`;
}

function icon(name) {
  const icons = {
    price: '<path d="M5 12 12 5h6l1 1v6l-7 7-7-7Z"/><circle cx="15.5" cy="8.5" r="1"/>',
    stock: '<path d="M4 8.5 12 4l8 4.5V18l-8 4-8-4V8.5Z"/><path d="m4 8.5 8 4 8-4M12 12.5V22"/>',
    delivery: '<path d="M3 7h11v9H3zM14 10h4l3 4v2h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    doc: '<path d="M6 3h8l4 4v14H6zM14 3v5h5M9 12h6m-6 4h6"/>',
    spec: '<path d="M7 3h8l4 4v14H7zM15 3v5h5"/><path d="m9.2 12.1 1.3 1.3 3.2-3.3M9.2 17.1 10.5 18.4 13.7 15.1"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.check}</g></svg>`;
}

export function isEtalonProduct(page) {
  return page?.url === LUCERNE_URL;
}

export function productTitle(page) {
  if (!isEtalonProduct(page)) return page?.title || '';
  return 'Семена люцерны купить в Казахстане — цена | BAS Agros';
}

export function productH1(page) {
  if (!isEtalonProduct(page)) return page?.h1 || '';
  return 'Семена люцерны';
}

export function productDescription(page) {
  if (!isEtalonProduct(page)) return '';
  return 'Семена люцерны для фермерских хозяйств. Цена от 2 580 000 ₸ за тонну. Поставка по Казахстану и СНГ. Уточните наличие и условия заказа в BAS Agros.';
}

export function productRobots(page) {
  return isEtalonProduct(page) ? 'index, follow' : 'noindex, nofollow';
}

export function productFaq() {
  return [
    ['Сколько стоят семена люцерны?', 'Базовая цена — от 2 580 000 ₸ за тонну. Итоговая стоимость зависит от выбранной позиции, характеристик партии, объёма заказа и пункта доставки. Для точного расчёта укажите необходимый объём или площадь посева и населённый пункт.'],
    ['Есть ли семена люцерны в наличии?', 'Наличие подтверждается по конкретной заявке и партии. Укажите необходимый объём — менеджер проверит доступную продукцию и сообщит актуальные условия поставки.'],
    ['Куда возможна доставка?', 'Поставка возможна по Казахстану и в страны СНГ. Параметры отгрузки согласовываются по конкретному заказу.'],
    ['Какая упаковка доступна?', 'Доступны БИГ-БЭГ / МКР и полипропиленовый мешок. Размер тары не означает фиксированный вес семян. Вес нетто упаковки и количество мест подтверждаются перед поставкой.'],
    ['Какие характеристики партии можно получить?', 'По запросу менеджер сообщает доступные сведения конкретной партии: сорт, репродукцию, год урожая, показатели чистоты и всхожести и другие подтверждённые данные, если они есть у предлагаемой продукции.'],
    ['Какие документы можно запросить?', 'Сведения по сопровождающим документам зависят от конкретной партии и подтверждаются перед поставкой.'],
    ['Какая норма высева люцерны?', 'Справочный ориентир — 13,5–16,8 кг/га. Рабочая норма зависит от способа и цели посева, характеристик семян, типа почвы и условий увлажнения, поэтому её корректируют под конкретную технологию и участок.']
  ];
}

function confirmedPartyRows(data = PARTY_DATA) {
  return Object.entries(PARTY_LABELS)
    .filter(([key]) => data[key] != null && String(data[key]).trim() !== '')
    .map(([key, label]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(String(data[key]))}</dd></div>`);
}

export function productStructuredData(page) {
  if (!isEtalonProduct(page)) return [];
  const faq = productFaq();
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productH1(page),
      url: page.canonical,
      description: productDescription(page),
      image: LUCERNE_IMAGE,
      category: 'Многолетние кормовые травы',
      seller: {
        '@type': 'Organization',
        name: 'BAS Agros',
        url: 'https://basagros.kz/'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://basagros.kz/' },
        { '@type': 'ListItem', position: 2, name: 'Каталог семян', item: 'https://basagros.kz/catalog/' },
        { '@type': 'ListItem', position: 3, name: 'Многолетние кормовые травы', item: 'https://basagros.kz/catalog/mnogoletnie-kormovye-travy/' },
        { '@type': 'ListItem', position: 4, name: productH1(page), item: page.canonical }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer }
      }))
    }
  ];
}

function breadcrumbs(pages) {
  const items = [
    ['/', 'Главная'],
    ['/catalog/', 'Каталог семян'],
    ['/catalog/mnogoletnie-kormovye-travy/', 'Многолетние кормовые травы']
  ];
  for (const [url] of items) requirePage(pages, url);
  return `<nav class="product-breadcrumbs" aria-label="Навигация по разделу"><ol class="breadcrumbs">${items.map(([url, label]) => `<li><a href="${url}">${label}</a></li>`).join('')}<li aria-current="page"><span>Семена люцерны</span></li></ol></nav>`;
}

function ctaPair(primaryIntent, secondaryIntent) {
  return `<div class="product-actions"><a class="home-btn home-btn-primary" href="#request" data-product-modal-intent="${primaryIntent}">Получить коммерческое предложение</a><a class="home-btn home-btn-outline" href="#request" data-product-modal-intent="${secondaryIntent}">Запросить характеристики партии</a></div>`;
}

function hero(pages) {
  return `<section class="product-hero" aria-labelledby="product-h1">
    <div class="home-wrap">
      ${breadcrumbs(pages)}
      <div class="product-hero-grid">
        <div class="product-gallery" aria-label="Иллюстрации товара">
          <div class="product-gallery-main"><img src="/assets/img/products/lucerne-field-hero.webp" width="640" height="427" alt="Поле цветущей люцерны" fetchpriority="high" decoding="async"></div>
          <div class="product-gallery-detail"><img src="/assets/img/home/about-seeds-640.webp" width="640" height="640" alt="Семена крупным планом" loading="lazy" decoding="async"></div>
        </div>
        <div class="product-hero-copy">
          <p class="product-kicker">Многолетние кормовые травы</p>
          <h1 id="product-h1">Семена люцерны</h1>
          <p class="product-lead">Семена люцерны для фермерских хозяйств и агропромышленных компаний с поставкой по Казахстану и странам СНГ.<span class="product-lead-price">Базовая цена — от 2 580 000 ₸ за тонну; актуальное наличие и итоговые условия уточняются по заявке.</span></p>
          <dl class="product-facts" aria-label="Основные условия">
            <div>${icon('price')}<dt>Цена</dt><dd>от 2 580 000 ₸/т</dd></div>
            <div>${icon('delivery')}<dt>Доставка</dt><dd>Казахстан и СНГ</dd></div>
          </dl>
          ${ctaPair('commercial_offer', 'party_characteristics')}
          <p class="product-helper">Укажите необходимый объём — характеристики партии и условия поставки подтвердит менеджер.</p>
        </div>
      </div>
    </div>
  </section>`;
}

function commercial(pages) {
  return `<section class="product-section product-commercial" data-lucerne-commercial-flow aria-labelledby="product-commercial-title"><div class="home-wrap"><div class="product-commercial-card"><div><p class="product-eyebrow">Коммерческие условия</p><h2 id="product-commercial-title">Цена, поставка и наличие</h2><dl class="product-facts" aria-label="Подтверждённые коммерческие условия"><div>${icon('price')}<dt>Цена</dt><dd>от 2 580 000 ₸/т</dd></div><div>${icon('delivery')}<dt>Поставка</dt><dd>Казахстан и СНГ</dd></div><div>${icon('stock')}<dt>Наличие</dt><dd>по заявке / партии</dd></div><div>${icon('doc')}<dt>Фасовка</dt><dd>БИГ-БЭГ / МКР и ПП-мешок</dd></div></dl><p>Вес нетто упаковки, доступный объём и параметры конкретной партии подтверждаются перед поставкой.</p>${ctaPair('commercial_offer', 'party_characteristics')}</div><div class="product-commercial-links"><div>${icon('delivery')}<h3>Поставка по Казахстану и СНГ</h3><p>Поставка возможна по Казахстану и в страны СНГ. Направление, объём и стоимость доставки согласовываются по конкретному заказу.</p>${link(pages, '/dostavka-i-oplata/', 'Доставка и оплата →')}</div><div>${icon('doc')}<h3>Информация и документы</h3><p>Доступные сведения по продукции и документы уточняются по конкретной поставке.</p>${link(pages, '/kachestvo-i-sertifikaty/', 'Качество и сертификаты →')}</div></div></div></div></section>`;
}

function partySpecs() {
  const rows = confirmedPartyRows(PARTY_DATA);
  const requestItems = ['Сорт', 'Репродукция', 'Год урожая', 'Чистота и всхожесть', 'Фасовка', 'Документы'];
  const cardBody = rows.length
    ? `<dl class="product-spec-list product-spec-list-compact">${rows.join('')}</dl>`
    : `<ul class="product-party-list">${requestItems.map((item) => `<li>${icon('check')}<span>${item}</span></li>`).join('')}</ul>`;
  return `<section class="product-section product-party" data-lucerne-party-card aria-labelledby="product-party-title"><div class="home-wrap product-party-grid"><div class="product-party-copy"><p class="product-eyebrow">Партия</p><span class="product-party-icon">${icon('spec')}</span><h2 id="product-party-title">Характеристики конкретной партии</h2><p>При закупке семян важны подтверждённые параметры конкретной партии: сорт, репродукция, год урожая, показатели качества и фасовка.</p></div><div class="product-party-card"><p class="product-party-card-label">Что можно получить</p><p>BAS Agros подбирает доступную партию под необходимый объём и передаёт её подтверждённые характеристики.</p>${cardBody}<a class="home-btn home-btn-outline" href="#request" data-product-modal-intent="party_characteristics">Запросить характеристики партии</a></div></div></section>`;
}

function useCases(pages) {
  const cards = [
    ['/catalog/dlya-senokosa/', 'ref-hay', 'Поле с заготовленным сеном', 'Для сенокоса', 'Люцерна входит в подборку культур для сенокосного направления.'],
    ['/catalog/pastbishchnye-travy/', 'ref-pasture', 'Коровы на зелёном пастбище', 'Для пастбищ', 'Культура представлена в подборке для пастбищного и сенокосно-пастбищного направления.'],
    ['/catalog/medonosy/', 'ref-phacelia', 'Цветущее поле фацелии', 'Медоносное направление', 'Люцерна включена в подборку культур для медоносного направления.']
  ];
  const html = cards.map(([url, imageName, alt, title, text]) => {
    requirePage(pages, url);
    return `<article class="product-use-card"><a class="product-use-link" href="${url}"><span class="product-use-media"><picture><source type="image/avif" srcset="/assets/img/home/${imageName}-480.avif 480w, /assets/img/home/${imageName}-640.avif 640w" sizes="(min-width: 48rem) 32vw, calc(100vw - 2rem)"><source type="image/webp" srcset="/assets/img/home/${imageName}-480.webp 480w, /assets/img/home/${imageName}-640.webp 640w" sizes="(min-width: 48rem) 32vw, calc(100vw - 2rem)"><img src="/assets/img/home/${imageName}-640.webp" width="640" height="520" alt="${alt}" loading="lazy" decoding="async"></picture></span><span class="product-use-caption"><strong>${title}</strong><b aria-hidden="true">→</b></span><span class="visually-hidden">${text}</span></a></article>`;
  }).join('');
  return `<section class="product-section product-use" aria-labelledby="product-use-title"><div class="home-wrap"><div class="product-section-head"><div><p class="product-eyebrow">Применение</p><h2 id="product-use-title">Для каких задач подходит люцерна</h2></div><p>Назначение культуры помогает сузить выбор. Конкретную продукцию и параметры заказа лучше уточнять под задачу хозяйства.</p></div><div class="product-use-grid">${html}</div></div></section>`;
}

function packaging() {
  return `<section class="product-section product-articles" aria-labelledby="product-packaging-title"><div class="home-wrap"><div class="product-section-head"><div><p class="product-eyebrow">Фасовка</p><h2 id="product-packaging-title">Варианты упаковки семян люцерны</h2></div><p>Формат тары можно выбрать или уточнить при оформлении заявки. Фактический вес нетто одной упаковки зависит от партии и согласуется отдельно.</p></div><div class="product-article-grid"><article><h3>БИГ-БЭГ / МКР</h3><p>МКР Л4 Н-140, 95×95 — мягкий контейнер разового использования. Подходит как вариант тары для крупной отгрузки семян.</p></article><article><h3>Полипропиленовый мешок</h3><p>Полипропиленовый мешок 56×110 — альтернативный вариант фасовки для формирования заказа. Количество упаковок рассчитывается по необходимому объёму.</p></article></div><p class="product-helper">Размер тары не означает фиксированный вес семян. Вес нетто и количество мест указываются в параметрах конкретной поставки.</p></div></section>`;
}

function selectionGuide() {
  const items = [
    ['Назначение посева', 'Сенокос, пастбищное направление или другая задача хозяйства.'],
    ['Площадь посева', 'Помогает уточнить параметры заявки и необходимый объём.'],
    ['Необходимый объём', 'Если объём уже рассчитан, его можно сразу указать в заявке.'],
    ['Место доставки', 'Укажите регион или населённый пункт для согласования поставки.']
  ];
  return `<section class="product-section product-guide" aria-labelledby="product-guide-title"><div class="home-wrap product-guide-grid"><div><p class="product-eyebrow">Подбор</p><h2 id="product-guide-title">Что указать при выборе семян люцерны</h2><p>Эти данные помогают быстрее перейти от общего запроса к конкретным условиям поставки.</p><a class="home-btn home-btn-primary" href="#request" data-product-modal-intent="commercial_offer">Получить коммерческое предложение</a></div><ol>${items.map(([title, text]) => `<li><span><strong>${title}</strong><small>${text}</small></span></li>`).join('')}</ol></div></section>`;
}

function procurement() {
  const items = [
    ['Заявка', 'Покупатель указывает необходимый объём и населённый пункт.'],
    ['Подтверждение партии', 'Менеджер уточняет доступную продукцию и характеристики.'],
    ['Коммерческое предложение', 'Согласуются цена, фасовка и условия поставки.'],
    ['Поставка', 'Параметры отгрузки согласовываются по конкретному заказу.']
  ];
  return `<section class="product-section product-specs" aria-labelledby="product-flow-title"><div class="home-wrap product-two-col"><div><p class="product-eyebrow">Закупка</p><h2 id="product-flow-title">Как проходит закупка и поставка</h2><p>Сроки подготовки, оплата и самовывоз не публикуются без подтверждённых условий конкретной поставки.</p></div><ol class="product-flow-list">${items.map(([title, text]) => `<li><strong>${title}</strong><span>${text}</span></li>`).join('')}</ol></div></section>`;
}

function quality(pages) {
  return `<section class="product-section product-commercial" aria-labelledby="product-quality-title"><div class="home-wrap"><div class="product-commercial-card"><div><p class="product-eyebrow">Качество</p><h2 id="product-quality-title">Качество и документы</h2><p>Сведения по сопровождающим документам зависят от конкретной партии и подтверждаются перед поставкой.</p><a class="home-btn home-btn-outline" href="#request" data-product-modal-intent="party_characteristics">Запросить характеристики партии</a></div><div class="product-commercial-links"><div>${icon('doc')}<h3>Документы поставки</h3><p>Доступный комплект документов уточняется по предлагаемой партии.</p>${link(pages, '/kachestvo-i-sertifikaty/', 'Качество и сертификаты →')}</div><div>${icon('delivery')}<h3>Условия поставки</h3><p>Направление, объём и параметры отгрузки согласовываются по заказу.</p>${link(pages, '/dostavka-i-oplata/', 'Доставка и оплата →')}</div></div></div></div></section>`;
}

function agronomy() {
  return `<section class="product-section product-intro" aria-labelledby="product-agronomy-title"><div class="home-wrap"><div class="product-section-head"><div><p class="product-eyebrow">Ориентиры</p><h2 id="product-agronomy-title">Краткие агрономические ориентиры</h2></div><p>Эти сведения описывают культуру в целом. Они не заменяют характеристики конкретной продаваемой партии.</p></div><div class="product-intro-grid"><figure class="product-intro-media"><img src="/assets/img/products/lucerne-seeds-section-640.webp" srcset="/assets/img/products/lucerne-seeds-section-640.webp 640w, /assets/img/products/lucerne-seeds-section-960.webp 960w" sizes="(min-width: 48rem) 46vw, 100vw" width="960" height="720" alt="Цветущая люцерна и семена крупным планом" loading="lazy" decoding="async"></figure><div class="product-intro-copy"><p>Семена люцерны используют для закладки многолетних кормовых посевов, получения сена, сенажа и зелёной массы. Люцерна относится к бобовым культурам и ценится в животноводстве за питательность и содержание растительного белка.</p><p>Сорт, норму высева и технологию выращивания подбирают с учётом региона, почвы и назначения посевов.</p></div></div><dl class="product-spec-list product-spec-list-compact" aria-label="Справочные агрономические ориентиры">
      <div><dt>Культура</dt><dd>Люцерна посевная</dd></div>
      <div><dt>Научное название</dt><dd>Medicago sativa L.</dd></div>
      <div><dt>Тип</dt><dd>Многолетняя бобовая кормовая</dd></div>
      <div><dt>Назначение</dt><dd>Сено, сенаж, кормовые и пастбищные посевы</dd></div>
      <div><dt>Масса 1000 семян</dt><dd>Ориентировочно 1,6–2,2 г</dd></div>
      <div><dt>Норма высева</dt><dd>Ориентир 13,5–16,8 кг/га</dd></div>
      <div><dt>pH почвы</dt><dd>Ориентир 6,3–7,0</dd></div>
      <div><dt>Глубина посева</dt><dd>Ориентир 0,6–1,3 см</dd></div>
    </dl></div></section>`;
}

function articles(pages) {
  const cards = [
    ['/agroblog/posev-lyutserny/', 'Посев люцерны: сроки и норма высева', 'Когда сеять люцерну, как подготовить почву, выбрать глубину заделки и рассчитать норму высева.'],
    ['/agroblog/urozhaynost-lyutserny/', 'От чего зависит урожайность люцерны', 'Как на урожайность влияют сорт, почва, влага, уход за посевами и сроки проведения укосов.']
  ];
  return `<section class="product-section product-articles" aria-labelledby="product-articles-title"><div class="home-wrap"><div class="product-section-head"><div><p class="product-eyebrow">Полезно знать</p><h2 id="product-articles-title">Посев и урожайность люцерны</h2></div><p>В этих материалах собраны практические рекомендации по посеву люцерны и объяснение факторов, от которых зависит урожайность культуры.</p></div><div class="product-article-grid">${cards.map(([url, title, text]) => `<article><h3>${title}</h3><p>${text}</p>${link(pages, url, 'Читать статью →')}</article>`).join('')}</div></div></section>`;
}

function faq() {
  const items = productFaq();
  const renderItems = (group, offset) => group.map(([question, answer], index) => `<details name="lucerne-faq"${offset + index === 0 ? ' open' : ''}><summary>${question}</summary><p>${answer}</p></details>`).join('');
  return `<section class="product-section product-faq" aria-labelledby="product-faq-title"><div class="home-wrap"><p class="product-eyebrow">FAQ</p><h2 id="product-faq-title">Частые вопросы о семенах люцерны</h2><div class="product-faq-list"><div class="product-faq-column">${renderItems(items.slice(0, 4), 0)}</div><div class="product-faq-column">${renderItems(items.slice(4), 4)}</div></div></div></section>`;
}

function requestForm() {
  return `<section class="product-request" id="request" aria-labelledby="product-request-title"><div class="home-wrap product-request-grid"><div><p class="product-eyebrow">Заявка</p><h2 id="product-request-title">Получить коммерческое предложение</h2><p>Укажите контактные данные и параметры заявки. Можно сообщить площадь посева или необходимый объём продукции.</p><ul><li>${icon('check')}<span>Товар: семена люцерны</span></li><li>${icon('check')}<span>Базовая цена — от 2 580 000 ₸/т</span></li><li>${icon('check')}<span>Поставка по Казахстану и СНГ</span></li></ul></div><form class="home-form product-form" data-lead-form data-form-name="Товар — Люцерна — коммерческое предложение"><label for="lucerne-name">Имя<input id="lucerne-name" name="name" type="text" autocomplete="name"></label><label for="lucerne-phone">Телефон<input id="lucerne-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX"></label><label for="lucerne-area">Площадь посева<input id="lucerne-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га"></label><label for="lucerne-message">Объём / место доставки<textarea id="lucerne-message" name="message" rows="4" placeholder="Например, нужный объём или населённый пункт"></textarea></label><input type="hidden" name="category" value="Семена люцерны"><input type="hidden" name="intent" value="commercial_offer"><input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="product-form-note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p><button class="home-btn home-btn-primary" type="submit">Получить коммерческое предложение</button><div class="home-form-status" data-form-status aria-live="polite" aria-atomic="true"></div></form></div></section>`;
}

function requestModal() {
  return `<dialog class="product-modal" data-product-modal aria-labelledby="product-modal-title" aria-describedby="product-modal-description">
    <div class="product-modal-panel">
      <button class="product-modal-close" type="button" data-product-modal-close aria-label="Закрыть форму">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
      <p class="product-eyebrow">Заявка</p>
      <h2 id="product-modal-title" data-product-modal-title>Получить коммерческое предложение</h2>
      <p id="product-modal-description" class="product-modal-description" data-product-modal-description>Укажите контактные данные, необходимый объём и место доставки. Менеджер уточнит актуальное наличие, стоимость партии, фасовку и условия поставки.</p>
      <form class="home-form product-modal-form" data-lead-form data-form-name="Товар — Люцерна — модальное окно — коммерческое предложение">
        <label for="lucerne-modal-name">Имя<input id="lucerne-modal-name" name="name" type="text" autocomplete="name"></label>
        <label for="lucerne-modal-phone">Телефон<input id="lucerne-modal-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX"></label>
        <label for="lucerne-modal-message" class="product-modal-message"><span data-product-modal-field-label>Объём / место доставки</span><textarea id="lucerne-modal-message" name="message" rows="3" data-product-modal-message placeholder="Например, необходимый объём или населённый пункт"></textarea></label>
        <input type="hidden" name="category" value="Семена люцерны">
        <input type="hidden" name="intent" value="commercial_offer" data-product-modal-intent-field>
        <input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p class="product-form-note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
        <button class="home-btn home-btn-primary" type="submit" data-product-modal-submit>Получить коммерческое предложение</button>
        <div class="home-form-status" data-form-status aria-live="polite" aria-atomic="true"></div>
      </form>
    </div>
  </dialog>`;
}

export function renderProduct(page, pages) {
  if (!isEtalonProduct(page)) return '';
  return [hero(pages), commercial(pages), partySpecs(), useCases(pages), packaging(), selectionGuide(), procurement(), quality(pages), agronomy(), faq(), articles(pages), requestForm(), requestModal()].join('\n');
}
