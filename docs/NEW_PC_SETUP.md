# Настройка нового ПК для clean-site проектов

## 1. Установить базовый софт

Минимальный комплект:
- Git
- GitHub CLI (`gh`)
- Node.js >= 22.19
- Cursor
- Google Chrome / Chromium
- PowerShell 7 — желательно

Проверка:

```powershell
git --version
gh --version
node --version
npm --version
```

## 2. Авторизовать GitHub

```powershell
gh auth login
gh auth status
```

Не сохранять GitHub tokens в файлах проекта.

## 3. Создать общую рабочую папку

Рекомендуемый вариант:

```powershell
New-Item -ItemType Directory -Force D:\Sites | Out-Null
Set-Location D:\Sites
```

Клонировать конкретный репозиторий:

```powershell
git clone <URL_РЕПОЗИТОРИЯ> project-name
Set-Location .\project-name
```

Если репозиторий ещё не создан, сначала создайте/клонируйте его, затем скопируйте содержимое starter pack в корень.

## 4. Скопировать starter pack

После распаковки копировать **содержимое** `universal-clean-site-starter`, а не саму папку внутрь проекта.

В корне должны появиться:

```text
.agents\
.cursor\
docs\
tools\
templates\
site\
AGENTS.md
PROJECT_PROFILE.md
PROJECT_PROFILE.template.md
package.json
site-standard.config.json
```

Проверить скрытые папки:

```powershell
Get-ChildItem -Force
```

Если проект уже содержит одноимённые файлы, сначала сравнить их. Не перезаписывать существующие handlers/config/rules вслепую.

## 5. Установить Node dependencies

Из корня проекта:

```powershell
npm install
```

## 6. Инициализировать проект

```powershell
npm run init:project -- --name "Название проекта" --domain "https://example.kz"
```

После команды:
- `PROJECT_PROFILE.md` создаётся из универсального шаблона;
- `site-standard.config.json` получает реальный домен;
- `site/index.html` получает название/домен и остаётся `noindex, nofollow`;
- `starter-manifest.json` получает отметку `initialized: true`.

Затем вручную заполнить незаполненные поля `PROJECT_PROFILE.md`.

## 7. Первый quality check

```powershell
npm run quality:all
```

Starter содержит временную `site/index.html`, поэтому проверка запускается до начала разработки.

## 8. Локальный сервер

```powershell
npm run serve
```

Открыть:

```text
http://127.0.0.1:8765/
```

## 9. Lighthouse

В отдельном терминале, пока локальный сервер запущен:

```powershell
npm run lighthouse:mobile -- http://127.0.0.1:8765/
```

Скрипт делает 3 mobile-прогона и считает медиану.

## 10. Открытие Cursor

Открывать **корень репозитория**, например:

```text
D:\Sites\project-name
```

Первая команда агенту:

> Прочитай AGENTS.md, PROJECT_PROFILE.md, все применимые rules из .cursor/rules,
> .cursor/skills/build-static-seo-page/SKILL.md и нужные .agents/skills.
> Проверь git status, структуру, Node/npm и npm run quality:all.
> Ничего не публикуй. Покажи готовность проекта к разработке, ограничения
> и отсутствующие входные данные.

## 11. Git sanity check перед работой

```powershell
git status -sb
git branch --show-current
git remote -v
```

Не начинать крупную работу при непонятных незавершённых изменениях или в неожиданной ветке.

## 12. Для каждого следующего проекта

1. Создать новый репозиторий.
2. Скопировать чистый starter в его корень.
3. Выполнить `npm install`.
4. Выполнить `npm run init:project ...`.
5. Заполнить `PROJECT_PROFILE.md`.
6. Зафиксировать SEO-архитектуру и дизайн-систему.
7. Создать эталонные типы страниц.
8. Только после их QA переходить к масштабированию.
