# SEO Route Normalization — BAS Agros

Производный технический манифест маршрутов. Не заменяет замороженную SEO-карту.

## Источник

- Файл: `docs/seo/BAS_Agros_SEO_karta_Kazakhstan_V3_7_1_DEVELOPMENT_SPEC_FROZEN_2026-08-20.xlsx`
- Версия: `V3.7.1 DEVELOPMENT SPEC FROZEN`, 20.08.2026
- Основной лист: `02_SEO_MAP`, полный используемый диапазон `A1:BZ61`
- Обнаружено: 59 строк страниц, 78 колонок
- Приоритеты: лист `07_BUILD_WAVES`, сверка итогов с `01_SUMMARY` (P0=8, P1=26, P2=25)
- Проектный контекст: `PROJECT_PROFILE.md`

Excel-объект `SEOMapV3` с диапазоном `A2:BO56` считается устаревшим техническим диапазоном и не ограничивает импорт. Замороженный Excel-файл не изменяется.

## Шесть решений

1. **Priority.** Пустой `priority` в `02_SEO_MAP` заполняется значением той же страницы из `07_BUILD_WAVES` по `page_id` и URL.
2. **Indexing gate.** Десять нетоварных страниц с пустым gate получают `CONTENT_REQUIRED`. Итог: 37 `DATA_REQUIRED`, 22 `CONTENT_REQUIRED`.
3. **Индексация.** Целевое состояние карты отделено от текущего технического. Сейчас `READY_TO_INDEX = 0`.
4. **Корневой parent.** У главной `parent_id` = `null`, рынок хранится в `market: "Kazakhstan"`.
5. **Диапазон Excel.** Импорт и валидация используют 59 фактических маршрутов листа `02_SEO_MAP`. Объект таблицы `SEOMapV3` не задаёт лимит.
6. **CRM ID.** Числовые CRM Product ID остаются только у товарных страниц. Текстовые ярлыки нетоварных страниц перенесены в `page_intent`.

## Исходные поля

Значения без самостоятельной правки:

- `page_id`, `page_name`, `url`, `page_type`, `template_type`
- `title`, `h1`, `launch_wave`, `canonical`
- `crm_product_id` товарных страниц, включая несколько ID через `;`
- `target_indexability` — исходный `indexability` карты
- `target_sitemap` — исходный `sitemap` карты
- `indexing_gate`, если он уже был заполнен в `02_SEO_MAP`
- `parent_id` для 58 дочерних страниц
- `priority` — значение `07_BUILD_WAVES`

## Нормализованные поля

- `priority` — подставлен из `07_BUILD_WAVES`, потому что колонка в `02_SEO_MAP` пустая
- `indexing_gate: CONTENT_REQUIRED` — только для 10 страниц с пустым gate
- `indexability: noindex` — текущее техническое состояние
- `sitemap: false` — текущее техническое состояние
- `ready_to_index: false` — по `PROJECT_PROFILE.md`, `READY_TO_INDEX = 0`
- `parent_id: null` и `market: "Kazakhstan"` — только главная
- `page_intent` — исходный текстовый ярлык нетоварной страницы
- `crm_product_id: null` — у нетоварных страниц

## Переключение индексации

`ready_to_index`, `indexability` и `sitemap` меняются только после явного прохождения indexing gate из `PROJECT_PROFILE.md`:

- контент соответствует SEO-карте;
- заполнены обязательные блоки;
- только подтверждённые товарные и бизнес-данные;
- формы дают реальный success/error;
- метаданные и canonical корректны;
- Schema соответствует видимому контенту;
- нет placeholder-текста, битых ссылок и ресурсов;
- пройдены responsive QA и Lighthouse mobile;
- страница включена в финальную перелинковку.

После подтверждённой готовности конкретной страницы допустимо:

- `ready_to_index: true`
- `indexability: index`
- `sitemap: true`

До этого `indexability: index` и `sitemap: true` запрещены. Canonical остаётся целевым self-canonical URL.

## Запрет задним числом

Замороженную SEO-карту V3.7.1 нельзя править, чтобы подогнать производный JSON. Расхождения фиксируются в манифесте и в этой заметке. Любое изменение URL, иерархии или semantic ownership требует отдельного SEO-review.
