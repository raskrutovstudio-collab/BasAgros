---
name: build-static-seo-page
description: Создавать, переносить, масштабировать и оптимизировать страницы чистого HTML/CSS/JS с SEO/AEO, mobile performance, forms, analytics и QA.
---
# Создание статической SEO-страницы

1. Прочитать PROJECT_PROFILE.md, AGENTS.md и применимые .cursor/rules.
2. Проверить git status, структуру, components и эталон page type.
3. Зафиксировать intent, URL, H1, CTA, materials, schema, internal links.
4. Неизвестное отметить `ТРЕБУЕТ ПОДТВЕРЖДЕНИЯ`; не выдумывать.
5. Реализовать mobile-first на текущем стеке.
6. First screen/H1 не должны зависеть от JS.
7. Определить LCP и оптимизировать до завершения layout.
8. Сохранить header/footer/analytics/global form-handler.
9. Проверить title/description/canonical/headings/alt/breadcrumbs/JSON-LD.
10. npm run quality:all.
11. QA: 360/390/412/430/768/1280/1440.
12. Menu/CTA/forms/modal/FAQ/tabs/slider/Console/Network.
13. Lighthouse mobile x3.
14. Показать changed files, checks, risks, git diff.
15. No commit/push/production deploy без отдельной команды.
