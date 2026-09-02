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
const description = 'О компании BAS Agros: поставка семян кормовых трав, травосмесей и сельскохозяйственных культур по Казахстану. Работа с хозяйствами, подбор, документы и логистика.';
const phone = '+7 705 960 89 87';
const phoneHref = 'tel:+77059608987';
const whatsappHref = 'https://wa.me/77059608987';
const email = 'basagros@mail.ru';
const thematicPeoplePhoto = 'https://images.unsplash.com/photo-1649726955230-6a2b7b4add6e?auto=format&fit=crop&fm=jpg&q=82&w=1600';

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
  quality: icon('M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3Zm-3 8 2 2 4-4'),
  handshake: icon('M4 12 8 8l4 2 4-2 4 4-5 5-3-2-3 2-5-5Zm4-4L6 6 3 9l3 3m10-4 2-2 3 3-3 3'),
  document: icon('M6 3h9l3 3v15H6V3Zm9 0v4h4M9 11h6m-6 4h6')
};

function localImage(src, alt, width = 960, height = 640, loading = 'lazy') {
  return `<img src="${src}" width="${width}" height="${height}" alt="${alt}" loading="${loading}" decoding="async">`;
}

const header = renderHomeHeader(page, pages);
const footer = renderHomeFooter(pages);

const structuredData = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: page.title,
    url: page.canonical,
    description,
    inLanguage: 'ru',
    about: {
      '@type': 'Organization',
      name: 'BAS Agros',
      url: 'https://basagros.kz/',
      telephone: '+77059608987',
      email,
      areaServed: 'KZ',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Петропавловск',
        addressRegion: 'Северо-Казахстанская область',
        addressCountry: 'KZ'
      }
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://basagros.kz/' },
      { '@type': 'ListItem', position: 2, name: 'О компании', item: page.canonical }
    ]
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
  <meta name="robots" content="noindex, nofollow">
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
  <link rel="stylesheet" href="/assets/css/about-classic.css?v=20260902-1">
  <script type="application/ld+json">${structuredData}</script>
</head>
<body class="page-home page-about">
  <a class="skip-link" href="#main">Перейти к содержанию</a>
${header}
  <main id="main" class="about-classic">
    <section class="about-classic-hero" aria-labelledby="about-h1">
      <div class="home-wrap">
        <nav class="about-breadcrumbs" aria-label="Навигация по разделу"><ol class="breadcrumbs"><li><a href="/">Главная</a></li><li aria-current="page"><span>О компании</span></li></ol></nav>
        <div class="about-classic-hero__grid">
          <div class="about-classic-hero__copy">
            <p class="about-classic-kicker">BAS Agros · Петропавловск</p>
            <h1 id="about-h1">${page.h1}</h1>
            <p class="about-classic-hero__lead">BAS Agros — казахстанская компания, специализирующаяся на поставке семян кормовых трав, травосмесей и зернобобовых культур. Работаем с фермерскими хозяйствами, сельхозпредприятиями и профессиональными закупщиками, которым важны понятные условия, подходящий ассортимент и организованная доставка.</p>
            <div class="about-classic-hero__actions"><a class="home-btn home-btn-primary" href="/catalog/">Перейти в каталог</a><a class="home-btn home-btn-outline" href="#request">Связаться с компанией</a></div>
          </div>
          <div class="about-classic-hero__media">${localImage('/assets/img/home/about-field-640.webp', 'Поле сельскохозяйственных культур', 640, 520, 'eager')}<div class="about-classic-hero__caption">Семена для кормовой базы, сенокосов, пастбищ и других задач хозяйства</div></div>
        </div>
      </div>
    </section>

    <section class="about-classic-summary" aria-label="BAS Agros в кратких фактах"><div class="home-wrap"><div class="about-classic-summary__grid"><div class="about-classic-summary__item"><strong>С 2019 года</strong><span>команда развивает направление поставок семян для сельского хозяйства</span></div><div class="about-classic-summary__item"><strong>Петропавловск, СКО</strong><span>здесь сосредоточена операционная работа компании и складская логистика</span></div><div class="about-classic-summary__item"><strong>Основной профиль</strong><span>кормовые травы, травосмеси и зернобобовые культуры</span></div><div class="about-classic-summary__item"><strong>Поставка по Казахстану</strong><span>условия и логистика рассчитываются под конкретный регион и объём</span></div></div></div></section>

    <section class="about-classic-section about-classic-story" aria-labelledby="about-story-title"><div class="home-wrap about-classic-story__grid"><div class="about-classic-story__intro"><p class="about-classic-kicker">История и специализация</p><h2 id="about-story-title">Компания, выросшая из практической задачи агробизнеса</h2><div class="about-classic-photo">${localImage('/assets/img/home/about-seeds-640.webp', 'Семена сельскохозяйственных культур крупным планом', 640, 480)}</div></div><div class="about-classic-story__copy"><p>BAS Agros развивает направление поставок семян для сельского хозяйства с 2019 года. Юридическое лицо ТОО «БАС АГРОС» зарегистрировано в Казахстане в 2021 году. Компания базируется в Петропавловске — одном из ключевых аграрных центров Северного Казахстана.</p><p>Изначально специализация строилась вокруг кормовых трав: люцерны, эспарцета, костреца, донника, житняка, суданской травы и других культур, востребованных для кормовой базы. Со временем ассортимент расширился зернобобовыми, отдельными сельскохозяйственными культурами и готовыми травосмесями под разные сценарии использования.</p><p class="about-classic-pullquote">Наша задача — не просто передать клиенту прайс, а помочь быстро перейти от потребности хозяйства к понятному варианту закупки.</p><p>В работе с заявкой учитываются назначение посева, площадь, предполагаемый объём, культура или состав смеси, регион доставки и требования к документам. Такой подход особенно важен в B2B-закупках, где цена без контекста партии и логистики редко даёт полную картину.</p><p>Компания работает и с теми, кто уже знает конкретную культуру или сорт, и с хозяйствами, которым сначала нужно определить подходящее направление: кормовая база, сенокос, пастбище, сидерация, медоносный посев, озеленение или восстановление территории.</p></div></div></section>

    <section class="about-classic-section about-classic-team" aria-labelledby="about-team-title"><div class="home-wrap about-classic-team__grid"><div class="about-classic-team__media"><img src="${thematicPeoplePhoto}" width="1600" height="1067" alt="Специалисты сельского хозяйства в поле — тематическое фото" loading="lazy" decoding="async"></div><div class="about-classic-team__copy"><p class="about-classic-kicker">Люди и работа с клиентом</p><h2 id="about-team-title">За каждой заявкой стоит конкретная задача хозяйства</h2><p>В BAS Agros коммуникация строится напрямую: менеджер уточняет параметры закупки, помогает сориентироваться в ассортименте и собирает исходные данные для коммерческого предложения. Для клиента это означает меньше лишних переходов между отделами и более понятный путь от запроса до поставки.</p><p>Мы сознательно не заменяем консультацию автоматическим «калькулятором цены», потому что в семенах многое зависит от культуры, партии, объёма и направления доставки. Финальные условия подтверждаются менеджером по актуальным данным.</p><div class="about-classic-team__facts"><div><strong>Контакт с менеджером</strong><span>телефон, WhatsApp или форма на сайте</span></div><div><strong>Коммерческий расчёт</strong><span>под объём, культуру и регион доставки</span></div><div><strong>Сопровождение заказа</strong><span>от уточнения потребности до согласования поставки</span></div></div></div></div></section>

    <section class="about-classic-section about-classic-principles" aria-labelledby="about-principles-title"><div class="home-wrap"><div class="about-classic-principles__head"><div><p class="about-classic-kicker">Подход BAS Agros</p><h2 id="about-principles-title">На чём строим работу</h2></div><p>Для сельхозпредприятия важна не громкая презентация поставщика, а предсказуемость сделки: что именно предлагается, какие документы доступны, как формируется цена и куда будет доставлена партия.</p></div><div class="about-classic-principles__list"><article class="about-classic-principle">${icons.seed}<div><h3>Профильный ассортимент</h3><p>Основной акцент — травы и травосмеси, дополненные другими востребованными сельскохозяйственными культурами.</p></div></article><article class="about-classic-principle">${icons.task}<div><h3>Подбор под задачу</h3><p>Начинаем не только с названия товара, но и с назначения посева, площади и условий конкретного хозяйства.</p></div></article><article class="about-classic-principle">${icons.quality}<div><h3>Документы и качество</h3><p>Характеристики и документы по конкретной партии уточняются до заключения сделки.</p></div></article><article class="about-classic-principle">${icons.truck}<div><h3>Логистика по Казахстану</h3><p>Организуем доставку в регионы; стоимость и формат перевозки зависят от объёма и пункта назначения.</p></div></article></div></div></section>

    <section class="about-classic-section about-classic-work" aria-labelledby="about-work-title"><div class="home-wrap"><p class="about-classic-kicker">Как мы работаем</p><h2 id="about-work-title">Понятный процесс от запроса до поставки</h2><div class="about-classic-work__grid"><article class="about-classic-work__item"><h3>1. Уточняем потребность</h3><p>Культура или задача, площадь, объём, регион и желаемые сроки.</p></article><article class="about-classic-work__item"><h3>2. Формируем предложение</h3><p>Подбираем подходящие позиции и актуальные условия конкретной закупки.</p></article><article class="about-classic-work__item"><h3>3. Согласовываем поставку</h3><p>Подтверждаем документы, логистику и остальные коммерческие условия.</p></article></div><div class="about-classic-gallery"><figure>${localImage('/assets/img/home/about-machinery-640.webp', 'Сельскохозяйственная техника в поле', 640, 480)}<figcaption>Работаем в контексте реальных задач сельского хозяйства</figcaption></figure><figure>${localImage('/assets/img/home/article-lyutserna-720.webp', 'Поле люцерны', 720, 405)}<figcaption>Кормовые культуры — одно из ключевых направлений</figcaption></figure><figure>${localImage('/assets/img/home/about-seeds-640.webp', 'Семенной материал', 640, 480)}<figcaption>Параметры конкретной партии уточняются перед сделкой</figcaption></figure></div></div></section>

    <section class="about-classic-section about-classic-geo" aria-labelledby="about-geo-title"><div class="home-wrap about-classic-geo__grid"><div><p class="about-classic-kicker">География</p><h2 id="about-geo-title">Из Северного Казахстана — хозяйствам по стране</h2><p>Операционная база BAS Agros находится в Петропавловске, Северо-Казахстанская область. Компания организует отправку семян в другие регионы Казахстана. Для поставок за пределы страны условия рассчитываются отдельно.</p><div class="about-classic-geo__facts"><div><strong>Петропавловск</strong><span>базовый город компании</span></div><div><strong>Казахстан</strong><span>основная география поставок</span></div></div></div><div class="about-classic-geo__media">${localImage('/assets/img/home/hero-field-920.webp', 'Сельскохозяйственные поля Казахстана', 920, 720)}</div></div></section>

    <section class="about-classic-section about-classic-requisites" aria-labelledby="about-requisites-title"><div class="home-wrap about-classic-requisites__grid"><div><p class="about-classic-kicker">Компания</p><h2 id="about-requisites-title">BAS Agros в деловом формате</h2><p>ТОО «БАС АГРОС» работает в сфере оптовой торговли зерном, семенами и кормами для животных. На сайте оставляем только сведения, которые можно подтвердить по текущим данным компании.</p></div><dl class="about-classic-requisites__rows"><div class="about-classic-requisites__row"><dt>Наименование</dt><dd>ТОО «БАС АГРОС»</dd></div><div class="about-classic-requisites__row"><dt>Город</dt><dd>Петропавловск, Северо-Казахстанская область</dd></div><div class="about-classic-requisites__row"><dt>Основное направление</dt><dd>Семена кормовых трав, травосмеси и сельскохозяйственные культуры</dd></div><div class="about-classic-requisites__row"><dt>Телефон</dt><dd>${phone}</dd></div><div class="about-classic-requisites__row"><dt>E-mail</dt><dd>${email}</dd></div></dl></div></section>

    <section class="about-classic-section about-classic-contact" id="request" aria-labelledby="about-contact-title"><div class="home-wrap about-classic-contact__grid"><div><p class="about-classic-kicker">Связаться с BAS Agros</p><h2 id="about-contact-title">Обсудим вашу задачу</h2><p>Напишите, какая культура или смесь нужна, укажите примерный объём и регион доставки. Если точной позиции пока нет, опишите задачу хозяйства — менеджер поможет сориентироваться.</p><div class="about-classic-contact__links"><a href="${phoneHref}">${icons.phone}<span>${phone}</span></a><a href="${whatsappHref}" target="_blank" rel="noopener noreferrer">${icons.handshake}<span>WhatsApp: ${phone}</span></a><a href="mailto:${email}">${icons.mail}<span>${email}</span></a></div></div><form class="about-classic-form" data-lead-form data-form-name="О компании — заявка"><input type="hidden" name="page_url" value="/o-kompanii/"><input type="hidden" name="form_intent" value="company_contact"><label>Имя<input type="text" name="name" autocomplete="name" placeholder="Как к вам обращаться" required></label><label>Телефон<input type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="+7 *** *** ** **" required></label><label class="about-classic-form__wide">Что требуется<textarea name="message" placeholder="Культура, объём, регион доставки или задача хозяйства"></textarea></label><button class="home-btn home-btn-primary" type="submit">Отправить заявку</button><p class="home-form-status" data-form-status aria-live="polite"></p><p class="about-classic-form__note">Отправляя форму, вы соглашаетесь на обработку данных для ответа на обращение.</p></form></div></section>
  </main>
${footer}
  <script src="/assets/js/site-config.js" defer></script>
  <script src="/assets/js/home.js?v=20260831-7" defer></script>
  <script src="/assets/js/lead-form.js" defer></script>
</body>
</html>`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, 'utf8');
console.log('Classic corporate about page built: /o-kompanii/');
