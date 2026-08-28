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
    hay: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M5 9H3m2 6H3m16-6h2m-2 6h2"/>',
    pasture: '<path d="M3 18c4-4 9-5 18-5M5 20v-8m14 8V10M5 16h14M5 19h14"/>',
    flower: '<circle cx="12" cy="10" r="2"/><circle cx="12" cy="5.5" r="2.5"/><circle cx="16.3" cy="8.5" r="2.5"/><circle cx="14.7" cy="13" r="2.5"/><circle cx="9.3" cy="13" r="2.5"/><circle cx="7.7" cy="8.5" r="2.5"/><path d="M12 15v6m0-2c-2-2.5-4-2.5-5.5-2.5 0 2 1.7 3.5 5.5 3.5m0-1c2-2.5 4-2.5 5.5-2.5 0 2-1.7 3.5-5.5 3.5"/>',
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

export function productDescription(page) {
  if (!isEtalonProduct(page)) return '';
  return 'Семена люцерны для фермерских хозяйств. Цена от 2 580 000 ₸ за тонну. Поставка по Казахстану и СНГ. Уточните наличие и условия заказа в BAS Agros.';
}

export function productFaq() {
  return [
    ['Сколько стоят семена люцерны?', 'Базовая цена — от 2 580 000 ₸ за тонну. Итоговая стоимость зависит от выбранной позиции, характеристик партии, объёма заказа и пункта доставки. Для точного расчёта укажите необходимый объём или площадь посева и населённый пункт.'],
    ['Есть ли семена люцерны в наличии?', 'Наличие меняется по мере формирования и отгрузки партий, поэтому подтверждается на дату заявки. Укажите необходимый объём и желаемый срок получения — менеджер проверит доступную продукцию и сообщит актуальные условия поставки.'],
    ['Куда можно заказать доставку?', 'Поставка возможна по Казахстану и в страны СНГ. Срок и стоимость доставки рассчитываются отдельно с учётом объёма заказа, выбранной упаковки и пункта назначения.'],
    ['Какая упаковка доступна?', 'Можно уточнить поставку в БИГ-БЭГ / МКР или полипропиленовом мешке. Фактический вес нетто одной упаковки и количество мест зависят от партии и согласованного объёма заказа.'],
    ['Подходит ли люцерна для сенокоса?', 'Люцерну используют для многолетних кормовых посевов и заготовки сена. Конкретную позицию и технологию посева подбирают с учётом почвы, климата, обеспеченности влагой и планируемого режима укосов.'],
    ['Используют ли люцерну для пастбищ?', 'Люцерну применяют в пастбищных и сенокосно-пастбищных посевах. Состав травостоя и режим его использования следует подбирать под условия хозяйства, регион и планируемую нагрузку на пастбище.'],
    ['Какие данные о семенах можно уточнить?', 'Перед заказом можно запросить доступные характеристики продукции и сведения по конкретной партии. Набор показателей зависит от предлагаемой позиции, поэтому менеджер подтверждает их до согласования поставки.'],
    ['Какая норма высева люцерны?', 'Справочный ориентир — 13,5–16,8 кг/га. Рабочая норма зависит от способа и цели посева, характеристик семян, типа почвы и условий увлажнения, поэтому её корректируют под конкретную технологию и участок.']
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
            <a class="home-btn home-btn-primary" href="#request" data-product-modal-intent="price">Запросить цену</a>
            <a class="home-btn home-btn-outline" href="#request" data-product-modal-intent="availability">Уточнить наличие</a>
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
    ['/catalog/dlya-senokosa/', 'ref-hay', 'Поле с заготовленным сеном', 'Для сенокоса', 'Люцерна входит в подборку культур для сенокосного направления.'],
    ['/catalog/pastbishchnye-travy/', 'ref-pasture', 'Коровы на зелёном пастбище', 'Для пастбищ', 'Культура представлена в подборке для пастбищного и сенокосно-пастбищного направления.'],
    ['/catalog/medonosy/', 'ref-phacelia', 'Цветущее поле фацелии', 'Медоносное направление', 'Люцерна включена в подборку культур для медоносного направления.']
  ];
  const html = cards.map(([url, imageName, alt, title, text]) => {
    requirePage(pages, url);
    return `<article class="product-use-card"><a class="product-use-link" href="${url}"><span class="product-use-media"><picture><source type="image/avif" srcset="/assets/img/home/${imageName}-480.avif 480w, /assets/img/home/${imageName}-640.avif 640w" sizes="(min-width: 48rem) 32vw, calc(100vw - 2rem)"><source type="image/webp" srcset="/assets/img/home/${imageName}-480.webp 480w, /assets/img/home/${imageName}-640.webp 640w" sizes="(min-width: 48rem) 32vw, calc(100vw - 2rem)"><img src="/assets/img/home/${imageName}-640.webp" width="640" height="520" alt="${alt}" loading="lazy" decoding="async"></picture></span><span class="product-use-caption"><strong>${title}</strong><b aria-hidden="true">→</b></span><span class="visually-hidden">${text}</span></a></article>`;
  }).join('');
  return `<section class="product-section product-use" aria-labelledby="product-use-title"><div class="home-wrap"><div class="product-section-head"><div><p class="product-eyebrow">Применение</p><h2 id="product-use-title">Для каких задач используют люцерну</h2></div><p>Назначение культуры помогает сузить выбор. Конкретную продукцию и параметры заказа лучше уточнять под задачу хозяйства.</p></div><div class="product-use-grid">${html}</div></div></section>`;
}

function characteristics() {
  return `<section class="product-section product-specs product-specs-compact" aria-labelledby="product-specs-title"><div class="home-wrap product-two-col">
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
  return `<section class="product-section product-guide" aria-labelledby="product-guide-title"><div class="home-wrap product-guide-grid"><div><p class="product-eyebrow">Подбор</p><h2 id="product-guide-title">Что указать при выборе семян люцерны</h2><p>Эти данные помогают быстрее перейти от общего запроса к конкретным условиям поставки.</p><a class="home-btn home-btn-primary" href="#request" data-product-modal-intent="selection">Уточнить подходящий вариант</a></div><ol>${items.map(([title, text]) => `<li><span><strong>${title}</strong><small>${text}</small></span></li>`).join('')}</ol></div></section>`;
}

function commercial(pages) {
  return `<section class="product-section product-commercial" aria-labelledby="product-commercial-title"><div class="home-wrap"><div class="product-commercial-card"><div><p class="product-eyebrow">Условия заказа</p><h2 id="product-commercial-title">Цена и наличие семян люцерны</h2><p>Фиксированная стоимость на странице не публикуется. Цена и актуальное наличие уточняются для конкретной заявки.</p><div class="product-actions"><a class="home-btn home-btn-primary" href="#request" data-product-modal-intent="price">Запросить цену</a><a class="home-btn home-btn-outline" href="#request" data-product-modal-intent="availability">Уточнить наличие</a></div></div><div class="product-commercial-links"><div>${icon('delivery')}<h3>Поставка по Казахстану</h3><p>Условия и стоимость доставки согласовываются по заказу.</p>${link(pages, '/dostavka-i-oplata/', 'Доставка и оплата →')}</div><div>${icon('doc')}<h3>Информация и документы</h3><p>Доступные сведения по продукции и документы уточняются по конкретной поставке.</p>${link(pages, '/kachestvo-i-sertifikaty/', 'Качество и сертификаты →')}</div></div></div></div></section>`;
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
  return `<section class="product-request" id="request" aria-labelledby="product-request-title"><div class="home-wrap product-request-grid"><div><p class="product-eyebrow">Заявка</p><h2 id="product-request-title">Запросить цену на семена люцерны</h2><p>Укажите контактные данные и параметры заявки. Можно сообщить площадь посева или необходимый объём продукции.</p><ul><li>${icon('check')}<span>Товар: Люцерна</span></li><li>${icon('check')}<span>Цена — по запросу</span></li><li>${icon('check')}<span>Поставка по Казахстану</span></li></ul></div><form class="home-form product-form" data-lead-form data-form-name="Товар — Люцерна — запрос цены"><label for="lucerne-name">Имя<input id="lucerne-name" name="name" type="text" autocomplete="name"></label><label for="lucerne-phone">Телефон<input id="lucerne-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX"></label><label for="lucerne-area">Площадь посева<input id="lucerne-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га"></label><label for="lucerne-message">Объём или комментарий<textarea id="lucerne-message" name="message" rows="4" placeholder="Например, нужный объём или место доставки"></textarea></label><input type="hidden" name="category" value="Люцерна"><input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="product-form-note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p><button class="home-btn home-btn-primary" type="submit">Запросить цену</button><div class="home-form-status" data-form-status aria-live="polite" aria-atomic="true"></div></form></div></section>`;
}

function requestModal() {
  return `<dialog class="product-modal" data-product-modal aria-labelledby="product-modal-title" aria-describedby="product-modal-description">
    <div class="product-modal-panel">
      <button class="product-modal-close" type="button" data-product-modal-close aria-label="Закрыть форму">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
      <p class="product-eyebrow">Заявка</p>
      <h2 id="product-modal-title" data-product-modal-title>Оставить заявку на семена люцерны</h2>
      <p id="product-modal-description" class="product-modal-description" data-product-modal-description>Оставьте контактные данные и кратко опишите задачу. Менеджер свяжется с вами для уточнения деталей.</p>
      <form class="home-form product-modal-form" data-lead-form data-form-name="Товар — Люцерна — модальное окно — общая заявка">
        <label for="lucerne-modal-name">Имя<input id="lucerne-modal-name" name="name" type="text" autocomplete="name"></label>
        <label for="lucerne-modal-phone">Телефон<input id="lucerne-modal-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX"></label>
        <label for="lucerne-modal-message" class="product-modal-message"><span data-product-modal-field-label>Что вас интересует</span><textarea id="lucerne-modal-message" name="message" rows="3" data-product-modal-message placeholder="Например, необходимый объём или место доставки"></textarea></label>
        <input type="hidden" name="category" value="Люцерна">
        <input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p class="product-form-note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
        <button class="home-btn home-btn-primary" type="submit" data-product-modal-submit>Отправить заявку</button>
        <div class="home-form-status" data-form-status aria-live="polite" aria-atomic="true"></div>
      </form>
    </div>
  </dialog>`;
}

export function renderProduct(page, pages) {
  if (!isEtalonProduct(page)) return '';
  return [hero(pages), intro(), useCases(pages), characteristics(), selectionGuide(), commercial(pages), articles(pages), faq(), requestForm(), requestModal()].join('\n');
}
