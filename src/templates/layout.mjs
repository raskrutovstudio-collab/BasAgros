import { GENERATED_MARKER, HEADER_NAV_URLS, FOOTER_NAV_URLS } from './constants.mjs';
import { breadcrumbsOf, escapeHtml, joinSections, pageByUrl } from './html.mjs';
import { homepageDescription, renderHomeFooter, renderHomeHeader } from './homepage.mjs';
import { isEtalonProduct, productDescription, productStructuredData } from './product.mjs';

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
  const structuredData = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BAS Agros',
      url: page.canonical,
      description: homepageDescription()
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BAS Agros',
      url: page.canonical,
      inLanguage: 'ru'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      url: page.canonical,
      description: homepageDescription(),
      inLanguage: 'ru'
    }
  ]).replace(/</g, '\\u003c');
  return `<!doctype html>
${GENERATED_MARKER}
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(homepageDescription())}">
  <link rel="canonical" href="${escapeHtml(page.canonical)}">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#F7F8F3">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(homepageDescription())}">
  <meta property="og:url" content="${escapeHtml(page.canonical)}">
  <meta property="og:site_name" content="BAS Agros">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><rect width=%2232%22 height=%2232%22 rx=%224%22 fill=%22%23173F2C%22/><path d=%22M7 24C8 12 15 7 25 7c0 11-6 17-18 17Z%22 fill=%22%23E5EEE6%22/></svg>">
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/home.css?v=20260825-3">
  <script type="application/ld+json">${structuredData}</script>
</head>
<body class="page-home">
  <a class="skip-link" href="#main">Перейти к содержанию</a>
${renderHomeHeader(page, pages)}
  <main id="main">
${main}
  </main>
${renderHomeFooter(pages)}
  <script src="/assets/js/site-config.js" defer></script>
  <script src="/assets/js/home.js" defer></script>
  <script src="/assets/js/lead-form.js" defer></script>
</body>
</html>
`;
}

function renderProductDocument({ page, pages, main }) {
  const description = productDescription(page);
  const structuredData = JSON.stringify(productStructuredData(page)).replace(/</g, '\\u003c');
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
  <meta name="theme-color" content="#F7F8F3">
  <meta property="og:type" content="product">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(page.canonical)}">
  <meta property="og:site_name" content="BAS Agros">
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/home.css?v=20260825-3">
  <link rel="stylesheet" href="/assets/css/product.css?v=20260827-1">
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
  <script src="/assets/js/home.js" defer></script>
  <script src="/assets/js/lead-form.js" defer></script>
</body>
</html>
`;
}

export function renderDocument({ page, pages, byId, main }) {
  if (page.template_type === 'homepage') {
    return renderHomeDocument({ page, pages, main });
  }
  if (isEtalonProduct(page)) {
    return renderProductDocument({ page, pages, main });
  }
  return renderShellDocument({ page, pages, byId, main });
}
