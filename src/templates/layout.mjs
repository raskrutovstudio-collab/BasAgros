import { GENERATED_MARKER, HEADER_NAV_URLS, FOOTER_NAV_URLS } from './constants.mjs';
import { breadcrumbsOf, escapeHtml, joinSections, pageByUrl } from './html.mjs';
import { homepageDescription, homepageFaq, renderHomeFooter, renderHomeHeader } from './homepage.mjs';
import { pageRobots } from './indexing.mjs';
import { isEtalonProduct, productDescription, productRobots, productStructuredData, productTitle } from './product.mjs';
import { isTravosmesiHub, travosmesiDescription, travosmesiStructuredData } from './travosmesi.mjs';

function navItems(urls, pages, currentUrl) {
  return urls.map((url) => {
    const page = pageByUrl(pages, url);
    if (!page) {
      throw new Error(`Навигация ссылается на URL вне manifest: ${url}`);
    }
    const current = url === currentUrl;
    const currentAttr = current ? ' aria-current="page"' : '';
    return `        <li><a href="${escapeHtml(page.url)}"${currentAttr}>${escapeHtml(page.page_name)}</a></li>`;
  }).join('\n');
}

function breadcrumbs(page, byId) {
  if (page.url === '/') return '';
  const items = breadcrumbsOf(page, byId).map((crumb, index, list) => {
    const last = index === list.length - 1;
    if (last) {
      return `          <li aria-current="page"><span>${escapeHtml(crumb.page_name)}</span></li>`;
    }
    return `          <li><a href="${escapeHtml(crumb.url)}">${escapeHtml(crumb.page_name)}</a></li>`;
  }).join('\n');
  return `      <nav aria-label="Навигация по разделу">
        <ol class="breadcrumbs">
${items}
        </ol>
      </nav>`;
}

function renderShellDocument({ page, pages, byId, main }) {
  const description = `Технический каркас страницы «${page.page_name}». Индексация отключена до прохождения indexing gate.`;
  const mainHtml = joinSections([breadcrumbs(page, byId), main]);
  return `<!doctype html>
${GENERATED_MARKER}
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(page.canonical)}">
  <meta name="robots" content="noindex, nofollow">
  <link rel="stylesheet" href="/assets/css/site.css">
</head>
<body>
  <a class="skip-link" href="#main">Перейти к содержанию</a>
  <header>
    <p class="brand"><a href="/">BAS Agros</a></p>
    <nav aria-label="Основная навигация">
      <ul>
${navItems(HEADER_NAV_URLS, pages, page.url)}
      </ul>
    </nav>
  </header>
  <main id="main">
${mainHtml}
  </main>
  <footer>
    <nav aria-label="Дополнительные разделы">
      <ul>
${navItems(FOOTER_NAV_URLS, pages, page.url)}
      </ul>
    </nav>
  </footer>
</body>
</html>
`;
}

function renderHomeDocument({ page, pages, main }) {
  const description = homepageDescription();
  const faq = homepageFaq();
  const structuredData = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BAS Agros',
      url: 'https://basagros.kz/',
      logo: 'https://basagros.kz/assets/img/favicon-bull.png',
      telephone: '+77059608987',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+77059608987',
        contactType: 'sales',
        areaServed: 'KZ',
        availableLanguage: 'Russian'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BAS Agros',
      url: 'https://basagros.kz/',
      inLanguage: 'ru'
    },
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
      '@type': 'FAQPage',
      mainEntity: faq.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer
        }
      }))
    }
  ]).replace(/</g, '\\u003c');
  return `<!doctype html>
${GENERATED_MARKER}
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(page.canonical)}">
  <meta name="robots" content="${escapeHtml(pageRobots(page))}">
  <meta name="theme-color" content="#F7F8F3">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(page.canonical)}">
  <meta property="og:site_name" content="BAS Agros">
  <meta property="og:image" content="https://basagros.kz/assets/img/social/home-fields-1200x630.jpg">
  <meta property="og:image:secure_url" content="https://basagros.kz/assets/img/social/home-fields-1200x630.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Сельскохозяйственные поля BAS Agros">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="https://basagros.kz/assets/img/social/home-fields-1200x630.jpg">
  <meta name="twitter:image:alt" content="Сельскохозяйственные поля BAS Agros">
  <link rel="icon" type="image/png" sizes="512x512" href="/assets/img/favicon-bull.png?v=20260828-1">
  <link rel="apple-touch-icon" href="/assets/img/favicon-bull.png?v=20260828-1">
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/home.css?v=20260831-9">
  <link rel="stylesheet" href="/assets/css/home-square.css?v=20260831-1">
  <script type="application/ld+json">${structuredData}</script>
</head>
<body class="page-home page-home-main">
  <a class="skip-link" href="#main">Перейти к содержанию</a>
${renderHomeHeader(page, pages)}
  <main id="main">
${main}
  </main>
${renderHomeFooter(pages)}
  <script src="/assets/js/site-config.js" defer></script>
  <script src="/assets/js/home.js?v=20260831-7" defer></script>
  <script src="/assets/js/lead-form.js" defer></script>
</body>
</html>
`;
}

function renderTravosmesiDocument({ page, pages, main }) {
  const description = travosmesiDescription();
  const structuredData = JSON.stringify(travosmesiStructuredData(page, pages)).replace(/</g, '\\u003c');
  const header = renderHomeHeader(page, pages)
    .replace('href="#request"', 'href="#mix-request"')
    .replace(' data-home-modal-intent="commercial_offer"', '');
  const footer = renderHomeFooter(pages)
    .replaceAll('href="#request"', 'href="#mix-request"')
    .replaceAll(' data-home-modal-intent="commercial_offer"', '');
  return `<!doctype html>
${GENERATED_MARKER}
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(page.canonical)}">
  <meta name="robots" content="${escapeHtml(pageRobots(page))}">
  <meta name="theme-color" content="#F7F8F3">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(page.canonical)}">
  <meta property="og:site_name" content="BAS Agros">
  <meta property="og:image" content="https://basagros.kz/assets/img/social/home-fields-1200x630.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="https://basagros.kz/assets/img/social/home-fields-1200x630.jpg">
  <link rel="icon" type="image/png" sizes="512x512" href="/assets/img/favicon-bull.png?v=20260828-1">
  <link rel="apple-touch-icon" href="/assets/img/favicon-bull.png?v=20260828-1">
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/home.css?v=20260831-9">
  <link rel="stylesheet" href="/assets/css/travosmesi.css?v=20260901-6">
  <link rel="stylesheet" href="/assets/css/travosmesi-polish.css?v=20260901-5">
  <link rel="stylesheet" href="/assets/css/travosmesi-refine.css?v=20260901-2">
  <link rel="stylesheet" href="/assets/css/travosmesi-viewport.css?v=20260901-2">
  <script type="application/ld+json">${structuredData}</script>
</head>
<body class="page-home page-category page-travosmesi">
  <a class="skip-link" href="#main">Перейти к содержанию</a>
${header}
  <main id="main">
${main}
  </main>
${footer}
  <script src="/assets/js/site-config.js" defer></script>
  <script src="/assets/js/home.js?v=20260831-7" defer></script>
  <script src="/assets/js/lead-form.js" defer></script>
</body>
</html>
`;
}

function renderProductDocument({ page, pages, main }) {
  const title = productTitle(page);
  const description = productDescription(page);
  const structuredData = JSON.stringify(productStructuredData(page)).replace(/</g, '\\u003c');
  return `<!doctype html>
${GENERATED_MARKER}
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(page.canonical)}">
  <meta name="robots" content="${escapeHtml(productRobots(page))}">
  <meta name="theme-color" content="#F7F8F3">
  <meta property="og:type" content="product">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(page.canonical)}">
  <meta property="og:site_name" content="BAS Agros">
  <meta property="og:image" content="https://basagros.kz/assets/img/social/lucerne-seeds-1200x630.jpg">
  <meta property="og:image:secure_url" content="https://basagros.kz/assets/img/social/lucerne-seeds-1200x630.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Цветущая люцерна и семена люцерны">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="https://basagros.kz/assets/img/social/lucerne-seeds-1200x630.jpg">
  <meta name="twitter:image:alt" content="Цветущая люцерна и семена люцерны">
  <link rel="icon" type="image/png" sizes="512x512" href="/assets/img/favicon-bull.png?v=20260828-1">
  <link rel="apple-touch-icon" href="/assets/img/favicon-bull.png?v=20260828-1">
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/home.css?v=20260828-1">
  <link rel="stylesheet" href="/assets/css/product.css?v=20260831-6">
  <script type="application/ld+json">${structuredData}</script>
</head>
<body class="page-home page-product">
  <a class="skip-link" href="#main">Перейти к содержанию</a>
${renderHomeHeader(page, pages)}
  <main id="main">
${main}
  </main>
${renderHomeFooter(pages)}
  <script src="/assets/js/site-config.js" defer></script>
  <script src="/assets/js/home.js?v=20260828-2" defer></script>
  <script src="/assets/js/product.js?v=20260828-2" defer></script>
  <script src="/assets/js/lead-form.js" defer></script>
</body>
</html>
`;
}

export function renderDocument({ page, pages, byId, main }) {
  if (page.template_type === 'homepage') {
    return renderHomeDocument({ page, pages, main });
  }
  if (isTravosmesiHub(page)) {
    return renderTravosmesiDocument({ page, pages, main });
  }
  if (isEtalonProduct(page)) {
    return renderProductDocument({ page, pages, main });
  }
  return renderShellDocument({ page, pages, byId, main });
}
