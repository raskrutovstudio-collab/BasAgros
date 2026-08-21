# Universal Clean Site Starter v3

Универсальный стартовый пакет для новых сайтов на чистом HTML + CSS + vanilla JavaScript.
Он предназначен для повторного использования: в пакете нет привязки к конкретному бренду, нише или домену.

## Что входит

- `.cursor/rules/` — постоянные правила разработки, performance, SEO/AEO, accessibility, forms, content, release.
- `.cursor/skills/` — skill создания статической SEO-страницы.
- `.agents/skills/` — специализированные skills для SEO, архитектуры, schema, performance, forms, accessibility, тестирования и clean migration.
- `tools/` — аудит HTML, проверка секретов, Lighthouse mobile x3, локальный сервер, инициализация проекта.
- `templates/` — безопасные шаблоны страницы, формы и performance `.htaccess`.
- `docs/` — workflow, настройка нового ПК, интеграция форм, release checklist, Plesk performance.
- `PROJECT_PROFILE.md` — проектный профиль; до инициализации содержит безопасные placeholders.
- `PROJECT_PROFILE.template.md` — мастер-шаблон профиля.
- `site-standard.config.json` — единые quality/performance thresholds.

## Куда копировать

Содержимое пакета копируется **в корень репозитория проекта**:

```text
D:\Sites\project-name\
├─ .agents\
├─ .cursor\
├─ docs\
├─ tools\
├─ templates\
├─ site\
│  ├─ index.html
│  └─ assets\
│     ├─ css\
│     ├─ js\
│     ├─ img\
│     └─ fonts\
├─ AGENTS.md
├─ PROJECT_PROFILE.md
├─ PROJECT_PROFILE.template.md
├─ site-standard.config.json
├─ package.json
└─ .gitignore
```

Скрытые `.cursor` и `.agents` обязательны. Проверка в PowerShell:

```powershell
Get-ChildItem -Force
```

Если репозиторий уже содержит одноимённые файлы, их нельзя заменять вслепую: сначала сравнить и объединить правила/handlers/config.

## Минимум на новом ПК

- Git
- GitHub CLI (`gh`)
- Node.js **22.19+**
- Cursor
- Chrome / Chromium
- PowerShell 7 — желательно

Проверка:

```powershell
git --version
gh --version
node --version
npm --version
gh auth status
```

## Запуск нового проекта

Из корня репозитория:

```powershell
npm install
npm run init:project -- --name "Название проекта" --domain "https://example.kz"
npm run quality:all
npm run serve
```

Локальный URL:

```text
http://127.0.0.1:8765/
```

Lighthouse mobile x3:

```powershell
npm run lighthouse:mobile -- http://127.0.0.1:8765/
```

После `init:project` заполните незаполненные поля `PROJECT_PROFILE.md`.

## Что адаптируется под конкретный проект

Меняются только проектные данные:

1. `PROJECT_PROFILE.md` — ниша, география, цели, page types, дизайн, SEO, формы и интеграции.
2. `site-standard.config.json` — домен; `roots/assetRoots` только если структура сайта отличается.
3. `site/index.html` — после утверждения дизайна заменяется реальной главной страницей.
4. Интеграции форм/аналитики — только после подтверждения реальных endpoints/contracts.
5. При необходимости добавляются проектные rules, но универсальные rules сохраняются.

`.agents/skills`, базовые `.cursor/rules`, `tools` и общие `docs` обычно переносятся без изменений.

## Workflow страницы

1. Зафиксировать URL, intent, H1, CTA, материалы и перелинковку.
2. Выполнить `git status`.
3. Найти существующие компоненты и дизайн-систему.
4. Верстать mobile-first чистым HTML/CSS/JS.
5. H1 и первый экран держать в HTML, без ожидания JS.
6. Сразу оптимизировать LCP, изображения, шрифты, CSS/JS.
7. SEO/canonical/breadcrumbs/JSON-LD делать только по подтверждённым данным.
8. Формы вести через один общий handler.
9. Выполнить `npm run quality:all`.
10. Проверить 360/390/412/430/768/1280/1440 px.
11. Проверить Console, Network, menu, CTA, forms, modal, FAQ/tabs/slider.
12. Lighthouse mobile x3.
13. Исправить до release gate.
14. Commit/push/deploy выполнять только по отдельной команде.

## Release gate

- каждый Mobile Performance >= 90;
- целевая mobile median >= 95;
- Accessibility >= 95, цель 100;
- SEO = 100;
- LCP <= 2.5 s;
- CLS <= 0.05;
- TBT <= 100 ms;
- нет 404/403 и Console errors;
- нет horizontal scroll;
- один H1;
- unique Title/Description;
- absolute self-canonical;
- корректные alt;
- forms: label/name/type/autocomplete;
- JSON-LD соответствует видимому контенту;
- secrets во frontend отсутствуют.

Начните с `START_HERE.md`. Полная настройка нового ПК: `docs/NEW_PC_SETUP.md`.
