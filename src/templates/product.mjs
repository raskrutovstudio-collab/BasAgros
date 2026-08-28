import { escapeHtml, pageByUrl } from './html.mjs';

const LUCERNE_URL = '/catalog/mnogoletnie-kormovye-travy/lyutserna/';

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
    field: '<path d="M4 19c4-5 8-7 16-8M4 15c4-4 8-6 16-7M4 11c4-3 8-5 16-6"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.check}</g></svg>`;
}

export function isEtalonProduct(page) {
  return page?.url === LUCERNE_URL;
}

export function productDescription(page) {
  if (!isEtalonProduct(page)) return '';
  return 'Люцерна — семена для хозяйств Казахстана. Цена по запросу, наличие и условия доставки уточняются по заявке. Информация о продукции и документах — по запросу.';
}

export function productFaq() {
  return [
    ['Сколько стоят семена люцерны?', 'Цена предоставляется по запросу. Для расчёта укажите необходимый объём или площадь посева и параметры заказа.'],
    ['Есть ли люцерна в наличии?', 'Актуальное наличие уточняется при обработке заявки.'],
    ['Можно ли заказать семена люцерны с доставкой по Казахстану?', 'Да. BAS Agros принимает заявки на поставку по Казахстану. Условия и стоимость доставки согласовываются по конкретному заказу.'],
    ['Подходит ли люцерна для сенокоса?', 'Люцерна представлена в подборке культур для сенокосного направления. Подбор конкретной продукции зависит от задачи хозяйства.'],
    ['Используют ли люцерну для пастбищ?', 'Люцерна входит в подборку культур для пастбищного и сенокосно-пастбищного направления.'],
    ['Какие характеристики семян можно уточнить перед заказом?', 'Доступные характеристики конкретной продукции и сведения по партии предоставляются при обработке заявки.'],
    ['Какая норма высева люцерны?', 'Норма высева зависит от условий и технологии посева. Для этого вопроса на сайте предусмотрен отдельный материал о посеве люцерны.']
  ];
}

export function productStructuredData(page) {
  if (!isEtalonProduct(page)) return [];
  const faq = productFaq();
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Люцерна',
      url: page.canonical,
      description: productDescription(page),
      category: 'Многолетние кормовые травы',
      brand: {
        '@type': 'Brand',
        name: 'BAS Agros'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://basagros.kz/' },
        { '@type': 'ListItem', position: 2, name: 'Каталог семян', item: 'https://basagros.kz/catalog/' },
        { '@type': 'ListItem', position: 3, name: 'Многолетние кормовые травы', item: 'https://basagros.kz/catalog/mnogoletnie-kormovye-travy/' },
        { '@type': 'ListItem', position: 4, name: 'Люцерна', item: page.canonical }
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
  return `<nav class="product-breadcrumbs" aria-label="Навигация по разделу"><ol class="breadcrumbs">${items.map(([url, label]) => `<li><a href="${url}">${label}</a></li>`).join('')}<li aria-current="page"><span>Люцерна</span></li></ol></nav>`;
}

function hero(pages) {
  return `<section class="product-hero" aria-labelledby="product-h1">
    <div class="home-wrap">
      ${breadcrumbs(pages)}
      <div class="product-hero-grid">
        <div class="product-gallery" aria-label="Иллюстрации товара">
          <div class="product-gallery-main"><img src="/assets/img/home/about-field-640.webp" width="640" height="720" alt="Сельскохозяйственное поле" fetchpriority="high" decoding="async"></div>
          <div class="product-gallery-detail"><img src="/assets/img/home/about-seeds-640.webp" width="640" height="640" alt="Семена крупным планом" loading="lazy" decoding="async"></div>
        </div>
        <div class="product-hero-copy">
          <p class="product-kicker">Многолетние кормовые травы</p>
          <h1 id="product-h1">Люцерна</h1>
          <p class="product-lead">Семена люцерны для сельскохозяйственных хозяйств с поставкой по Казахстану. Цена и актуальное наличие уточняются по конкретной заявке.</p>
          <dl class="product-facts" aria-label="Основные условия">
            <div>${icon('price')}<dt>Цена</dt><dd>По запросу</dd></div>
            <div>${icon('stock')}<dt>Наличие</dt><dd>Уточнить</dd></div>
            <div>${icon('delivery')}<dt>Доставка</dt><dd>По Казахстану</dd></div>
            <div>${icon('doc')}<dt>Документы</dt><dd>По запросу</dd></div>
          </dl>
          <div class="product-actions">
            <a class="home-btn home-btn-primary" href="#request">Запросить цену</a>
            <a class="home-btn home-btn-outline" href="#request">Уточнить наличие</a>
          </div>
          <p class="product-helper">Укажите необходимый объём или площадь посева — условия согласовываются по конкретной заявке.</p>
        </div>
      </div>
    </div>
  </section>`;
}

function intro() {
  return `<section class="product-section product-intro" aria-labelledby="product-intro-title"><div class="home-wrap product-intro-grid">
    <figure class="product-intro-media"><img src="/assets/img/products/lucerne-seeds-section-640.webp" srcset="/assets/img/products/lucerne-seeds-section-640.webp 640w, /assets/img/products/lucerne-seeds-section-960.webp 960w" sizes="(min-width: 48rem) 46vw, 100vw" width="960" height="720" alt="Цветущая люцерна и семена крупным планом" loading="lazy" decoding="async"></figure>
    <div class="product-intro-copy"><p class="product-eyebrow">О товаре</p>
    <h2 id="product-intro-title">Семена люцерны</h2>
    <p>Семена люцерны используют для закладки многолетних кормовых посевов, получения сена, сенажа и зелёной массы. Люцерна относится к бобовым культурам и ценится в животноводстве за питательность и содержание растительного белка.</p>
    <p>Посевы люцерны помогают хозяйству формировать кормовую базу на несколько сезонов. Развитая корневая система позволяет культуре использовать влагу из глубоких слоёв почвы, а симбиоз с клубеньковыми бактериями способствует накоплению биологического азота. Сорт, норму высева и технологию выращивания подбирают с учётом региона, почвы и назначения посевов.</p></div>
  </div></section>`;
}

function useCases(pages) {
  const cards = [
    ['/catalog/dlya-senokosa/', 'Для сенокоса', 'Люцерна входит в подборку культур для сенокосного направления.'],
    ['/catalog/pastbishchnye-travy/', 'Для пастбищ', 'Культура представлена в подборке для пастбищного и сенокосно-пастбищного направления.'],
    ['/catalog/medonosy/', 'Медоносное направление', 'Люцерна включена в подборку культур для медоносного направления.']
  ];
  const html = cards.map(([url, title, text]) => `<article class="product-use-card">${icon('field')}<h3>${title}</h3><p>${text}</p>${link(pages, url, 'Подробнее →')}</article>`).join('');
  return `<section class="product-section product-use" aria-labelledby="product-use-title"><div class="home-wrap"><div class="product-section-head"><div><p class="product-eyebrow">Применение</p><h2 id="product-use-title">Для каких задач используют люцерну</h2></div><p>Назначение культуры помогает сузить выбор. Конкретную продукцию и параметры заказа лучше уточнять под задачу хозяйства.</p></div><div class="product-use-grid">${html}</div></div></section>`;
}

function characteristics() {
  return `<section class="product-section product-specs" aria-labelledby="product-specs-title"><div class="home-wrap product-two-col">
    <div><p class="product-eyebrow">Характеристики</p><h2 id="product-specs-title">Что можно уточнить по семенам люцерны</h2><p>Технические параметры должны относиться к конкретной предлагаемой продукции. Поэтому сорт, репродукция, происхождение, фасовка и показатели партии не подменяются универсальными значениями.</p></div>
    <dl class="product-spec-list">
      <div><dt>Наименование</dt><dd>Люцерна</dd></div>
      <div><dt>Категория</dt><dd>Многолетние кормовые травы</dd></div>
      <div><dt>Сорт / вариант</dt><dd>Уточняется по доступной продукции</dd></div>
      <div><dt>Репродукция</dt><dd>Уточняется по конкретной позиции</dd></div>
      <div><dt>Фасовка</dt><dd>Уточняется при обработке заявки</dd></div>
      <div><dt>Показатели партии</dt><dd>Доступные сведения — по запросу</dd></div>
    </dl>
  </div></section>`;
}

function selectionGuide() {
  const items = [
    ['Назначение посева', 'Сенокос, пастбищное направление или другая задача хозяйства.'],
    ['Площадь посева', 'Помогает уточнить параметры заявки и необходимый объём.'],
    ['Необходимый объём', 'Если объём уже рассчитан, его можно сразу указать в заявке.'],
    ['Место доставки', 'Укажите регион или населённый пункт для согласования поставки.']
  ];
  return `<section class="product-section product-guide" aria-labelledby="product-guide-title"><div class="home-wrap product-guide-grid"><div><p class="product-eyebrow">Подбор</p><h2 id="product-guide-title">Что указать при выборе семян люцерны</h2><p>Эти данные помогают быстрее перейти от общего запроса к конкретным условиям поставки.</p><a class="home-btn home-btn-primary" href="#request">Уточнить подходящий вариант</a></div><ol>${items.map(([title, text]) => `<li><span><strong>${title}</strong><small>${text}</small></span></li>`).join('')}</ol></div></section>`;
}

function commercial(pages) {
  return `<section class="product-section product-commercial" aria-labelledby="product-commercial-title"><div class="home-wrap"><div class="product-commercial-card"><div><p class="product-eyebrow">Условия заказа</p><h2 id="product-commercial-title">Цена и наличие семян люцерны</h2><p>Фиксированная стоимость на странице не публикуется. Цена и актуальное наличие уточняются для конкретной заявки.</p><div class="product-actions"><a class="home-btn home-btn-primary" href="#request">Запросить цену</a><a class="home-btn home-btn-outline" href="#request">Уточнить наличие</a></div></div><div class="product-commercial-links"><div>${icon('delivery')}<h3>Поставка по Казахстану</h3><p>Условия и стоимость доставки согласовываются по заказу.</p>${link(pages, '/dostavka-i-oplata/', 'Доставка и оплата →')}</div><div>${icon('doc')}<h3>Информация и документы</h3><p>Доступные сведения по продукции и документы уточняются по конкретной поставке.</p>${link(pages, '/kachestvo-i-sertifikaty/', 'Качество и сертификаты →')}</div></div></div></div></section>`;
}

function articles(pages) {
  const cards = [
    ['/agroblog/posev-lyutserny/', 'Посев люцерны и норма высева', 'Подробный материал о вопросах посева вынесен отдельно, чтобы товарная страница оставалась коммерческой.'],
    ['/agroblog/urozhaynost-lyutserny/', 'Урожайность люцерны', 'Отдельный материал для информационного интента об урожайности культуры.']
  ];
  return `<section class="product-section product-articles" aria-labelledby="product-articles-title"><div class="home-wrap"><div class="product-section-head"><div><p class="product-eyebrow">Агроблог</p><h2 id="product-articles-title">Посев и урожайность люцерны</h2></div><p>Агрономические вопросы вынесены в отдельные материалы. Здесь остаётся информация, необходимая для выбора и заказа товара.</p></div><div class="product-article-grid">${cards.map(([url, title, text]) => `<article><h3>${title}</h3><p>${text}</p>${link(pages, url, 'Читать материал →')}</article>`).join('')}</div></div></section>`;
}

function faq() {
  return `<section class="product-section product-faq" aria-labelledby="product-faq-title"><div class="home-wrap product-narrow"><p class="product-eyebrow">FAQ</p><h2 id="product-faq-title">Частые вопросы о семенах люцерны</h2><div class="product-faq-list">${productFaq().map(([question, answer], index) => `<details${index === 0 ? ' open' : ''}><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div></div></section>`;
}

function requestForm() {
  return `<section class="product-request" id="request" aria-labelledby="product-request-title"><div class="home-wrap product-request-grid"><div><p class="product-eyebrow">Заявка</p><h2 id="product-request-title">Запросить цену на семена люцерны</h2><p>Укажите контактные данные и параметры заявки. Можно сообщить площадь посева или необходимый объём продукции.</p><ul><li>${icon('check')}<span>Товар: Люцерна</span></li><li>${icon('check')}<span>Цена — по запросу</span></li><li>${icon('check')}<span>Поставка по Казахстану</span></li></ul></div><form class="home-form product-form" data-lead-form data-form-name="Товар — Люцерна — запрос цены"><label for="lucerne-name">Имя<input id="lucerne-name" name="name" type="text" autocomplete="name"></label><label for="lucerne-phone">Телефон<input id="lucerne-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX"></label><label for="lucerne-area">Площадь посева<input id="lucerne-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га"></label><label for="lucerne-message">Объём или комментарий<textarea id="lucerne-message" name="message" rows="4" placeholder="Например, нужный объём или место доставки"></textarea></label><input type="hidden" name="category" value="Люцерна"><input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="product-form-note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p><button class="home-btn home-btn-primary" type="submit">Запросить цену</button><div class="home-form-status" data-form-status aria-live="polite" aria-atomic="true"></div></form></div></section>`;
}

export function renderProduct(page, pages) {
  if (!isEtalonProduct(page)) return '';
  return [hero(pages), intro(), useCases(pages), characteristics(), selectionGuide(), commercial(pages), articles(pages), faq(), requestForm()].join('\n');
}
