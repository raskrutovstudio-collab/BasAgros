# Универсальный workflow разработки нового сайта

## Этап 1. Архитектура до вёрстки

Перед созданием десятков страниц:
1. собрать семантику;
2. кластеризовать запросы;
3. создать SEO-карту;
4. определить page types;
5. определить URL;
6. построить hierarchy и internal linking;
7. при существующем сайте — карту redirects.

Применимые skills:
- `site-architecture`
- `seo`
- `seo-audit`
- `programmatic-seo` при масштабировании.

## Этап 2. Design system

Зафиксировать:
- container widths;
- spacing scale;
- colors;
- typography;
- buttons;
- cards;
- forms;
- header/footer;
- breadcrumbs;
- section patterns;
- breakpoints;
- hover/focus/error/success states.

Не проектировать каждую страницу как независимый сайт.

## Этап 3. Эталонные страницы

До массового выпуска создать и утвердить минимум по одному эталону каждого ключевого типа:
- homepage;
- hub/category;
- product/service;
- information page.

Эталон проходит полный performance/accessibility/SEO gate.

## Этап 4. Создание страницы

Использовать `.cursor/skills/build-static-seo-page/SKILL.md`.

Порядок:
1. intent/URL/H1/CTA/data;
2. semantic HTML;
3. mobile-first CSS;
4. responsive media;
5. minimal JS;
6. forms;
7. SEO/schema;
8. accessibility;
9. functional QA;
10. performance QA.

## Этап 5. Масштабирование

Только после утверждения эталона.

Для массовых страниц:
- pilot 3–5 страниц;
- проверка реальной уникальной ценности;
- отсутствие пустых variables;
- контроль фактов;
- unique Title/Description/H1;
- internal linking;
- no cannibalization;
- полный quality gate перед следующей пачкой.

## Этап 6. Release

Перед production:
1. `npm run quality:all`;
2. `git diff --check`;
3. visual QA;
4. Console/Network;
5. functional QA;
6. Lighthouse mobile x3;
7. SEO/schema QA;
8. form/analytics QA;
9. только затем commit/push/deploy по отдельной команде.
