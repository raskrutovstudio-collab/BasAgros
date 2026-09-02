import fs from 'node:fs';
import path from 'node:path';
import { GENERATED_MARKER } from '../src/templates/constants.mjs';
import { renderHomeFooter, renderHomeHeader } from '../src/templates/homepage.mjs';

const root = process.cwd();
const siteRoot = path.join(root, 'site');
const routes = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'seo-routes.json'), 'utf8'));
const pages = routes.pages || [];
const page = pages.find((item) => item.url === '/o-kompanii/');
if (!page) throw new Error('Маршрут /o-kompanii/ не найден в SEO-карте');

const output = path.join(siteRoot, 'o-kompanii', 'index.html');
const description = 'BAS Agros поставляет семена кормовых трав, травосмеси и сельскохозяйственные культуры по Казахстану. Подбор под задачу хозяйства, коммерческий расчёт и сопровождение поставки.';
const phone = '+7 705 960 89 87';
const phoneHref = 'tel:+77059608987';
const whatsappHref = 'https://wa.me/77059608987';
const email = 'basagros@mail.ru';

function icon(pathData) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${pathData}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

const icons = {
  seed: icon('M12 21V9m0 0C9 5 5 4 3 5c.5 4 3 7 9 7m0-3c3-4 7-5 9-4-.5 4-3 7-9 7'),
  map: icon('M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6Zm5-2v14m6-12v14'),
  task: icon('M5 7h14M5 12h9M5 17h6'),
  truck: icon('M3 7h11v9H3V7Zm11 4h4l3 3v2h-7v-5ZM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'),
  phone: icon('M7.4 3.5 9.7 8 7.9 9.6c1 2.3 2.7 4 5 5l1.7-1.8 4.4 2.3c.5.3.8.8.7 1.4-.3 2.1-1.8 3.5-3.9 3.5C9.2 20 4 14.8 4 8.3c0-2 1.4-3.6 3.5-3.9.6-.1 1.2.2 1.5.7Z'),
  mail: icon('M3 6h18v12H3V6Zm0 1 9 7 9-7'),
  document: icon('M6 3h9l3 3v15H6V3Zm9 0v4h4M9 11h6m-6 4h6'),
  quality: icon('M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3Zm-3 8 2 2 4-4')
};

function img(base, alt, className = '') {
  return `<div class="about-picture ${className}"><picture><source type="image/avif" srcset="/assets/img/home/${base}-480.avif 480w, /assets/img/home/${base}-640.avif 640w"><source type="image/webp" srcset="/assets/img/home/${base}-480.webp 480w, /assets/img/home/${base}-640.webp 640w"><img src="/assets/img/home/${base}-640.webp" width="640" height="520" alt="${alt}" loading="lazy" decoding="async"></picture></div>`;
}

const header = renderHomeHeader(page, pages);
const footer = renderHomeFooter(pages);

const structuredData = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    url: page.canonical,
    description,
    inLanguage: 'ru'
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://basagros.kz/' },
      { '@type': 'ListItem', position: 2, name: 'О компании BAS Agros', item: page.canonical }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BAS Agros',
    url: 'https://basagros.kz/',
    telephone: '+77059608987',
    email,
    areaServed: 'KZ'
  }
]).replace(/</g, '\\u003c');

const html = `<!doctype html>
${GENERATED_MARKER}
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${page.canonical}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#F7F8F3">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${page.canonical}">
  <meta property="og:site_name" content="BAS Agros">
  <meta property="og:image" content="https://basagros.kz/assets/img/social/home-fields-1200x630.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="https://basagros.kz/assets/img/social/home-fields-1200x630.jpg">
  <link rel="icon" type="image/png" sizes="512x512" href="/assets/img/favicon-bull.png?v=20260828-1">
  <link rel="apple-touch-icon" href="/assets/img/favicon-bull.png?v=20260828-1">
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/home.css?v=20260902-1">
  <link rel="stylesheet" href="/assets/css/about.css?v=20260902-1">
  <script type="application/ld+json">${structuredData}</script>
</head>
<body class="page-home page-about">
  <a class="skip-link" href="#main">Перейти к содержанию</a>
${header}
  <main id="main">
    <section class="about-hero" aria-labelledby="about-h1">
      <div class="home-wrap">
        <nav class="about-breadcrumbs" aria-label="Навигация по разделу"><ol><li><a href="/">Главная</a></li><li aria-current="page"><span>О компании</span></li></ol></nav>
        <div class="about-hero-grid">
          <div class="about-hero-copy">
            <p class="about-eyebrow">BAS Agros</p>
            <h1 id="about-h1">${page.h1}</h1>
            <p class="about-hero-lead">Поставляем семена кормовых трав, травосмеси и сельскохозяйственные культуры для фермерских и агропромышленных предприятий Казахстана. Основное направление BAS Agros — травы и травосмеси.</p>
            <div class="home-actions"><a class="home-btn home-btn-primary" href="/catalog/">Перейти в каталог</a><a class="home-btn home-btn-outline" href="#request">Связаться с нами</a></div>
          </div>
          <div class="about-hero-media">${img('ref-hero-field', 'Поля кормовых культур BAS Agros')}</div>
        </div>
      </div>
    </section>

    <section class="about-section" aria-label="Ключевые факты о BAS Agros"><div class="home-wrap"><ul class="about-facts"><li>${icons.seed}<strong>Семена трав и травосмеси — основное направление</strong></li><li>${icons.map}<strong>Поставка по всему Казахстану</strong></li><li>${icons.task}<strong>Подбор под задачу хозяйства</strong></li><li>${icons.truck}<strong>Коммерческий расчёт под объём и направление поставки</strong></li></ul></div></section>

    <section class="about-section about-intro" aria-labelledby="about-company-title"><div class="home-wrap about-intro-grid"><div class="about-collage">${img('ref-forage', 'Густой посев кормовых культур')}${img('ref-seeds', 'Семена трав крупным планом')}${img('about-machinery', 'Сельскохозяйственная техника в поле')}</div><div class="about-intro-copy"><p class="about-eyebrow">О компании</p><h2 id="about-company-title">Поставщик семян для сельскохозяйственных задач</h2><p>BAS Agros работает с хозяйствами, которым нужны семена для формирования кормовой базы, сенокосов, пастбищ, медоносных посевов, сидерации и других производственных задач.</p><p>Каталог выстроен так, чтобы клиент мог начать как с конкретной культуры, так и с задачи хозяйства. По заявке менеджер уточняет назначение посева, площадь, необходимый объём и место доставки, после чего готовится коммерческое предложение.</p><p>Сайт не использует неподтверждённые заявления о собственном производстве, объёмах или сроках работы компании. В коммерческом предложении фиксируются только актуальные параметры конкретной поставки.</p></div></div></section>

    <section class="about-section about-audience" aria-labelledby="about-audience-title"><div class="home-wrap"><div class="about-audience-head"><div><p class="about-eyebrow">Клиенты</p><h2 id="about-audience-title">С кем работает BAS Agros</h2></div><p>Основная модель работы — B2B: подбор и поставка семян под параметры конкретного хозяйства или закупки.</p></div><div class="about-audience-grid"><article class="about-audience-card"><span>01</span><h3>Агрохолдинги и сельхозпредприятия</h3><p>Ассортимент семян, коммерческий расчёт, документы и условия поставки.</p></article><article class="about-audience-card"><span>02</span><h3>Крестьянские и фермерские хозяйства</h3><p>Подбор культуры или травосмеси под сенокос, пастбище и кормовую базу.</p></article><article class="about-audience-card"><span>03</span><h3>Профессиональные закупщики</h3><p>Сверка ассортимента, объёма, характеристик партии и логистики.</p></article><article class="about-audience-card"><span>04</span><h3>Озеленители и ландшафтные компании</h3><p>Травосмеси и отдельные виды трав для озеленительных задач.</p></article></div></div></section>

    <section class="about-section about-directions" aria-labelledby="about-directions-title"><div class="home-wrap"><div class="about-section-head"><div><p class="about-eyebrow">Ассортимент</p><h2 id="about-directions-title">Основные направления каталога</h2></div><p>Структура каталога соответствует утверждённой SEO-карте BAS Agros и разделяет товарные направления по типу культуры и назначению.</p></div><div class="about-direction-grid"><article class="about-direction-card"><a href="/catalog/travosmesi/">${img('ref-forage', 'Травостой кормовых культур')}<div class="about-direction-body"><h3>Травосмеси</h3><p>Кормовые, универсальные, рекультивационные, газонные и озимые смеси.</p><b>Перейти →</b></div></a></article><article class="about-direction-card"><a href="/catalog/mnogoletnie-kormovye-travy/">${img('article-lyutserna', 'Поле люцерны')}<div class="about-direction-body"><h3>Многолетние кормовые травы</h3><p>Люцерна, эспарцет, тимофеевка и другие культуры каталога.</p><b>Перейти →</b></div></a></article><article class="about-direction-card"><a href="/catalog/odnoletnie-kormovye-travy/">${img('ref-phacelia', 'Цветущее поле фацелии')}<div class="about-direction-body"><h3>Однолетние кормовые травы</h3><p>Суданская трава, фацелия, вика и другие однолетние культуры.</p><b>Перейти →</b></div></a></article><article class="about-direction-card"><a href="/catalog/sorgo/">${img('ref-sorghum', 'Поле сорго')}<div class="about-direction-body"><h3>Сорго</h3><p>Зерновое и суданковое сорго в отдельном направлении каталога.</p><b>Перейти →</b></div></a></article></div></div></section>

    <section class="about-section about-process" aria-labelledby="about-process-title"><div class="home-wrap about-process-grid"><div class="about-process-copy"><p class="about-eyebrow">Работа с заявкой</p><h2 id="about-process-title">Как формируется предложение</h2><p>Вместо универсального прайса BAS Agros уточняет параметры конкретной закупки. Это позволяет связать выбранную культуру, объём и направление поставки в одном обращении.</p></div><ol class="about-steps"><li><h3>Задача или культура</h3><p>Клиент указывает конкретный товар либо задачу: сенокос, пастбище, медоносный посев, сидерация или другое направление.</p></li><li><h3>Площадь и объём</h3><p>Учитываются площадь посева и требуемое количество семян. Фиксированный минимальный заказ не заявляется — объём согласуется индивидуально.</p></li><li><h3>Место доставки</h3><p>Населённый пункт используется для расчёта направления поставки и логистики.</p></li><li><h3>Коммерческое предложение</h3><p>После уточнения параметров менеджер формирует предложение по подходящей позиции и условиям поставки.</p></li></ol></div></section>

    <section class="about-section about-trust" aria-labelledby="about-trust-title"><div class="home-wrap"><div class="about-section-head"><div><p class="about-eyebrow">Поставка и документы</p><h2 id="about-trust-title">Что можно уточнить до заказа</h2></div><p>Для выбранной позиции и партии согласовываются актуальные параметры продукции, документы и условия поставки.</p></div><div class="about-trust-grid"><article class="about-trust-card"><div class="about-trust-copy">${icons.quality}<h3>Качество и документы</h3><p>Характеристики продукции и перечень сопровождающих документов уточняются по выбранной партии.</p><a class="home-text-link" href="/kachestvo-i-sertifikaty/">Качество и сертификаты →</a></div>${img('ref-lab', 'Работа с образцами семян и документами')}</article><article class="about-trust-card"><div class="about-trust-copy">${icons.truck}<h3>Доставка по Казахстану</h3><p>Для расчёта поставки учитываются культура, объём и населённый пункт доставки.</p><a class="home-text-link" href="/dostavka-i-oplata/">Доставка и оплата →</a></div>${img('about-machinery', 'Сельскохозяйственная техника в поле')}</article></div></div></section>

    <section class="about-section about-contacts" id="request" aria-labelledby="about-contacts-title"><div class="home-wrap about-contacts-grid"><div><p class="about-eyebrow">Контакты и реквизиты</p><h2 id="about-contacts-title">Связаться с BAS Agros</h2><div class="about-contact-list"><a class="about-contact-link" href="${phoneHref}">${icons.phone}<div><strong>${phone}</strong><span>Телефон для связи</span></div></a><a class="about-contact-link" href="${whatsappHref}" target="_blank" rel="noopener noreferrer">${icons.phone}<div><strong>${phone}</strong><span>WhatsApp</span></div></a><a class="about-contact-link" href="mailto:${email}">${icons.mail}<div><strong>${email}</strong><span>Электронная почта</span></div></a><div class="about-requisites">${icons.document}<div><strong>Реквизиты и карточка предприятия</strong><span>Актуальные реквизиты предоставляются по запросу менеджеру. Неподтверждённые юридические данные на сайте не публикуются.</span></div></div></div></div><form class="home-form about-form" data-lead-form data-form-name="О компании — связаться с BAS Agros"><label for="about-name">Имя<input id="about-name" name="name" type="text" autocomplete="name"></label><label for="about-phone">Телефон<input id="about-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 *** *** ** **"></label><label class="about-form-wide" for="about-topic">Что вас интересует<input id="about-topic" name="category" type="text" placeholder="Например, травосмеси или люцерна"></label><label class="about-form-wide" for="about-message">Комментарий<textarea id="about-message" name="message" rows="4" placeholder="Укажите культуру, объём и место доставки"></textarea></label><input type="hidden" name="intent" value="company_contact"><input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="about-form-note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p><button class="home-btn home-btn-primary" type="submit">Отправить заявку</button><div class="home-form-status" data-form-status aria-live="polite" aria-atomic="true"></div></form></div></section>
  </main>
${footer}
  <script src="/assets/js/site-config.js" defer></script>
  <script src="/assets/js/home.js?v=20260902-1" defer></script>
  <script src="/assets/js/lead-form.js" defer></script>
</body>
</html>`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, 'utf8');
console.log('About page built: /o-kompanii/');
