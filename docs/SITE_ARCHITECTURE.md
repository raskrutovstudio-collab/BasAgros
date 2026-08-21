# Архитектура сайта BAS Agros

Технический каркас 59 production-маршрутов. Финальный дизайн, бизнес-контент, формы и Schema на этом этапе не входят в сборку.

## Источник маршрутов

Порядок источников:

1. `PROJECT_PROFILE.md`
2. `src/data/seo-routes.json`
3. `docs/seo/SEO_ROUTE_NORMALIZATION.md`
4. замороженная Excel SEO-карта — только как исходный документ

Манифест содержит 59 URL. Генератор и валидаторы читают его, а не пересчитывают семантику. Excel-файл и `PROJECT_PROFILE.md` не изменяются при сборке.

## Генератор и шаблоны

`tools/build-site.mjs`:

1. запускает `validate-seo-routes`;
2. читает `src/data/seo-routes.json`;
3. создаёт `index.html` для каждого URL внутри `site/`;
4. обновляет только HTML с маркером `<!-- generated-by: build-site.mjs -->`;
5. удаляет помеченные `index.html`, которых больше нет в манифесте;
6. записывает `site/.generated-pages.json`.

Шаблоны:

- `src/templates/constants.mjs` — marker и служебная навигация;
- `src/templates/types.mjs` — допустимые `page_type` → `template_type`;
- `src/templates/html.mjs` — экранирование, дети, крошки;
- `src/templates/layout.mjs` — общий HTML-каркас;
- `src/templates/render-body.mjs` — тело страницы по шаблону.

Неизвестный `page_type` или `template_type` останавливает сборку. Дата и случайные значения в HTML не используются.

## Generated-файлы

| URL | Файл |
|---|---|
| `/` | `site/index.html` |
| `/catalog/` | `site/catalog/index.html` |
| `/catalog/travosmesi/` | `site/catalog/travosmesi/index.html` |

Вложенные маршруты повторяют сегменты URL.

Инвентарь `site/.generated-pages.json` фиксирует версию формата, источник, marker, 59 URL и 59 HTML-файлов. Вручную править generated HTML нельзя: изменения перезапишет следующая сборка. Файлы без маркера генератор не трогает.

`site/robots.txt` разрешает обход. `sitemap.xml` не создаётся, пока `READY_TO_INDEX = 0`.

Технический CSS: `site/assets/css/site.css`. Все 59 страниц подключают его. Это адаптивный каркас с skip-link, видимым focus и `prefers-reduced-motion`, без бренд-палитры и анимаций.

## Типы страниц и шаблонов

| page_type | template_type | Число |
|---|---|---:|
| homepage | homepage | 1 |
| catalog_hub | catalog_hub | 1 |
| category | category | 4 |
| culture_hub | culture | 2 |
| product | product | 37 |
| service | commercial_service | 1 |
| trust | commercial_service | 1 |
| corporate | corporate | 1 |
| faq_hub | faq_hub | 1 |
| content_hub | article_hub | 1 |
| article | article | 5 |
| solution | solution | 4 |

Title, H1 и canonical берутся из манифеста. CRM Product ID остаются в JSON и не выводятся в HTML.

## Перелинковка

Ссылки строятся только по существующим URL манифеста:

- header и footer — служебные маршруты из манифеста;
- дочерние списки — страницы с данным `parent_id`;
- хлебные крошки — цепочка `parent_id` до главной.

Запрещены `href="#"`, пустые ссылки, городские URL, `/catalog/po-naznacheniyu/` и другие запрещённые пути из `PROJECT_PROFILE.md`. Все 59 страниц должны быть достижимы от `/`.

## Режим noindex

Пока `ready_to_index` ложно:

- `indexability` в манифесте: `noindex`;
- HTML: `noindex, nofollow`;
- sitemap отсутствует;
- canonical остаётся целевым self-canonical URL.

## Снятие indexing gate

Для конкретной страницы после критериев из `PROJECT_PROFILE.md`:

- контент соответствует SEO-карте;
- заполнены обязательные блоки;
- только подтверждённые данные;
- формы дают реальный success/error;
- метаданные и canonical корректны;
- Schema соответствует видимому контенту;
- пройдены responsive QA и Lighthouse mobile.

Тогда допустимы `ready_to_index: true`, `indexability: index` и включение в sitemap. До этого `index` и sitemap запрещены.

## Дальше: контент и дизайн

Контент и визуальная система добавляются поверх этого каркаса после отдельных решений. Нельзя выдумывать цены, наличие, сроки, урожайность, нормы высева, сорта, документы и преимущества. Формы, CRM и Schema подключаются отдельным заданием.

## Команды

```powershell
npm run validate:seo-routes
npm run build:site
npm run audit:pages
npm run validate:built-site
npm run check:secrets
npm run quality:all
```

`quality:all` выполняет эти пять шагов в указанном порядке.
