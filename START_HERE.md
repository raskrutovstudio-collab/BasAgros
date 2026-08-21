# START HERE — новый проект за 5 шагов

Это универсальный мастер-пакет для новых сайтов на чистом HTML + CSS + vanilla JavaScript.
В нём нет данных конкретного бизнеса, домена или проекта.

## 1. Скопировать пакет в корень нового репозитория

Пример:

```text
D:\Sites\new-project\
├─ .agents\
├─ .cursor\
├─ docs\
├─ site\
├─ templates\
├─ tools\
├─ AGENTS.md
├─ PROJECT_PROFILE.md
├─ package.json
└─ site-standard.config.json
```

Важно: копировать **содержимое** папки `universal-clean-site-starter`, а не создавать вложенность
`new-project\universal-clean-site-starter\...`.

## 2. Установить зависимости

```powershell
npm install
```

Требование: Node.js >= 22.19.

## 3. Инициализировать проект

```powershell
npm run init:project -- --name "Название проекта" --domain "https://example.kz"
```

Команда автоматически:
- создаст проектный `PROJECT_PROFILE.md` из шаблона;
- пропишет домен в `site-standard.config.json`;
- обновит безопасную `noindex`-заглушку `site/index.html`;
- отметит проект как инициализированный в `starter-manifest.json`.

## 4. Заполнить `PROJECT_PROFILE.md`

Обязательно зафиксировать:
- тип сайта и нишу;
- географию и бизнес-цель;
- типы страниц;
- визуальный принцип и референсы;
- SEO-карту/архитектуру, если уже есть;
- формы, CRM, email, аналитику;
- подтверждённые ограничения и факты.

Не начинать массовую разработку, пока профиль не заполнен.

## 5. Проверить стартовое состояние

```powershell
npm run quality:all
npm run serve
```

В другом терминале:

```powershell
npm run lighthouse:mobile -- http://127.0.0.1:8765/
```

Первая команда для Cursor:

> Прочитай AGENTS.md, PROJECT_PROFILE.md, все применимые .cursor/rules,
> .cursor/skills/build-static-seo-page/SKILL.md и нужные .agents/skills.
> Проверь git status, структуру проекта, Node/npm и npm run quality:all.
> Ничего не публикуй. Покажи готовность проекта к разработке, найденные ограничения
> и отсутствующие входные данные.

Дальше используйте `docs/WORKFLOW.md` и `docs/RELEASE_CHECKLIST.md`.
