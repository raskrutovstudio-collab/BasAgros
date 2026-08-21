# Обязательные правила проекта

Перед изменениями:
1. Прочитать `PROJECT_PROFILE.md`.
2. Прочитать применимые `.cursor/rules/*.mdc`.
3. Для страниц применить `.cursor/skills/build-static-seo-page/SKILL.md`.
4. Для специализированной задачи — соответствующий `.agents/skills/*/SKILL.md`.
5. Выполнить `git status`.
6. Сохранить пользовательские/несвязанные изменения.

## Архитектура
- Чистый semantic HTML, CSS, vanilla JS.
- Не добавлять framework/jQuery/UI-kit без необходимости.
- Переиспользовать components/CSS variables/header/footer/forms.
- Не дублировать полную desktop/mobile-разметку.
- Не менять другие страницы без необходимости.

## Performance
- H1/offering/CTA/first screen доступны без JS.
- Нет стартовых opacity:0/visibility:hidden для critical content.
- LCP определить заранее.
- Только один вероятный/реальный LCP может иметь fetchpriority=high.
- First-screen image не lazy.
- Below-fold images lazy.
- Dimensions/aspect-ratio обязательны.
- Responsive images: srcset/sizes.
- WOFF2, font-display:swap, только нужные weights.
- Некритический JS — defer/module.

## SEO / Schema
- Один H1.
- Unique Title/Description.
- Absolute self-canonical.
- Correct lang.
- Crawlable links.
- JSON-LD только по visible verified content.
- Не выдумывать price/rating/review/offer/address/certificate.
- URL/indexability — только по отдельному решению.

## Accessibility
- Native button/a/label/landmarks.
- Visible focus.
- Keyboard.
- Modal: Escape/focus trap/return focus.
- Content img: meaningful alt; decorative: alt="".
- Placeholder не заменяет label.

## Forms
- Сначала найти существующий handler.
- Не создавать второй submit/fetch.
- label/name/type/autocomplete/required.
- Real success/error.
- Conversion only after success.
- Secrets never in frontend.
- Production test lead — только с разрешения.

## Content
- Уверенно, конкретно, естественно.
- Без «не X, а Y», «не просто X», «это больше, чем X».
- Без вымышленных фактов/цен/свойств/обещаний.

## QA
После изменений:
```powershell
npm run quality:all
```
Проверить 360/390/412/430/768/1280/1440, menu, CTA, forms, modal, FAQ/tabs/slider,
phone/WhatsApp/email, Console, Network, 404, horizontal scroll, keyboard.

Lighthouse:
```powershell
npm run lighthouse:mobile -- <URL>
```
Медиана 3 запусков.

## Git / release
- `git diff --check`.
- Показать `git diff`.
- Commit/push/production deploy только по отдельной команде.
