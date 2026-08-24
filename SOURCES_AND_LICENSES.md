# Sources and internal provenance

Пакет собран как внутренний reusable standard из правил и skills, ранее применявшихся
в рабочих проектах Raskrutov, и адаптирован для независимого нового проекта.

Сторонний код, библиотеки и assets в конкретном проекте проверяются по их лицензиям отдельно.

## Изображения главной / homepage images

### Оригинальные изображения, созданные для макета

Дата создания: 24.08.2026. Файлы `ref-*` созданы инструментом OpenAI Image Generation специально для визуальной реализации утверждённого макета, затем локально кадрированы и конвертированы в AVIF/WebP. Они являются иллюстративными сценами и не документируют реальные поля, сотрудников, лабораторию, продукцию или процессы BAS Agros.

| Локальные файлы | Использование |
|---|---|
| `ref-hero-field-720.{avif,webp}`, `ref-hero-field-920.{avif,webp}` | Hero и полевой кадр корпоративного коллажа |
| `ref-seeds-480.{avif,webp}`, `ref-seeds-640.{avif,webp}` | Макрокадр семян |
| `ref-hay-480.{avif,webp}`, `ref-hay-640.{avif,webp}` | Сенокос и редакционный материал |
| `ref-pasture-480.{avif,webp}`, `ref-pasture-640.{avif,webp}` | Пастбищное направление |
| `ref-phacelia-480.{avif,webp}`, `ref-phacelia-640.{avif,webp}` | Фацелия и медоносные культуры |
| `ref-forage-480/640/720/960.{avif,webp}` | Травосмеси, сидераты и редакционные материалы |
| `ref-sorghum-480.{avif,webp}`, `ref-sorghum-640.{avif,webp}` | Категория сорго |
| `ref-lab-720.{avif,webp}`, `ref-lab-960.{avif,webp}` | Нейтральная иллюстрация контроля образцов и документов |

На изображениях нет утверждений о сертификатах, сортах, показателях или фактической инфраструктуре компании. Не использовать их как документальное подтверждение.

### Сторонние изображения

Дата получения: 21.08.2026. Все производные файлы хранятся локально в `site/assets/img/home/`. Исходные страницы — Wikimedia Commons. Фото не принадлежат BAS Agros и не показывают склад, сотрудников, сертификаты или транспорт компании.

Адаптация всех подключённых кадров: масштабирование, кадрирование под слот и конвертация в AVIF и WebP. Текст и смысл исходного кадра не менялись.

Производные файлы, созданные из работ CC BY-SA, распространяются на тех же условиях той же версии CC BY-SA, что и исходник. Это совместимо с ShareAlike. Производные из работ в общественном достоянии остаются в общественном достоянии.

| Локальные файлы | Слот | Автор | Исходная страница | Лицензия | Текст лицензии |
|---|---|---|---|---|---|
| `hero-field-720.{avif,webp}`, `hero-field-920.{avif,webp}` | `hero` | PMM | [File:Valdichiana-erba medica.JPG](https://commons.wikimedia.org/wiki/File:Valdichiana-erba_medica.JPG) | Public domain | [PD-self](https://commons.wikimedia.org/wiki/Template:PD-self) |
| `product-espartset-480.{avif,webp}`, `product-espartset-640.{avif,webp}` | `espartset` | Daniel VILLAFRUELA | [File:Onobrychis viciifolia-Sainfouin-201606221.jpg](https://commons.wikimedia.org/wiki/File:Onobrychis_viciifolia-Sainfouin-201606221.jpg) | CC BY-SA 4.0 | [creativecommons.org/licenses/by-sa/4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `product-lyutserna-480.{avif,webp}`, `product-lyutserna-640.{avif,webp}` | `lyutserna` | H. Zell | [File:Medicago sativa 003.JPG](https://commons.wikimedia.org/wiki/File:Medicago_sativa_003.JPG) | CC BY-SA 3.0 | [creativecommons.org/licenses/by-sa/3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| `product-kormovaya-480.{avif,webp}`, `product-kormovaya-640.{avif,webp}` | `travosmes-kormovaya` | N Chadwick | [File:Meadow - pasture - geograph.org.uk - 7166582.jpg](https://commons.wikimedia.org/wiki/File:Meadow_-_pasture_-_geograph.org.uk_-_7166582.jpg) | CC BY-SA 2.0 | [creativecommons.org/licenses/by-sa/2.0](https://creativecommons.org/licenses/by-sa/2.0/) |
| `product-universalnaya-480.{avif,webp}`, `product-universalnaya-640.{avif,webp}` | `travosmes-universalnaya` | N Chadwick | [File:Rolling Greensand pasture and meadow - geograph.org.uk - 7219356.jpg](https://commons.wikimedia.org/wiki/File:Rolling_Greensand_pasture_and_meadow_-_geograph.org.uk_-_7219356.jpg) | CC BY-SA 2.0 | [creativecommons.org/licenses/by-sa/2.0](https://creativecommons.org/licenses/by-sa/2.0/) |
| `product-fatseliya-480.{avif,webp}`, `product-fatseliya-640.{avif,webp}` | `fatseliya` | Gilles San Martin | [File:Phacelia tanacetifolia cover crop (48325691581).jpg](https://commons.wikimedia.org/wiki/File:Phacelia_tanacetifolia_cover_crop_(48325691581).jpg) | CC BY-SA 2.0 | [creativecommons.org/licenses/by-sa/2.0](https://creativecommons.org/licenses/by-sa/2.0/) |
| `purpose-botanical-640.{avif,webp}`, `purpose-botanical-720.{avif,webp}` | `representative` | Meneerke bloem | [File:Phacelia tanacetifolia RHu 001.JPG](https://commons.wikimedia.org/wiki/File:Phacelia_tanacetifolia_RHu_001.JPG) | CC BY-SA 4.0 | [creativecommons.org/licenses/by-sa/4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `about-field-480.{avif,webp}`, `about-field-640.{avif,webp}` | `warehouse` | Navajo Agricultural Products Industry | [File:NAPI Alfalfa.jpg](https://commons.wikimedia.org/wiki/File:NAPI_Alfalfa.jpg) | CC BY-SA 4.0 | [creativecommons.org/licenses/by-sa/4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `about-seeds-480.{avif,webp}`, `about-seeds-640.{avif,webp}` | `seeds` | Victor M. Vicente Selvas, assumed by Commons | [File:Alfalfa seeds.jpg](https://commons.wikimedia.org/wiki/File:Alfalfa_seeds.jpg) | Public domain | [PD-self / own work assumed](https://commons.wikimedia.org/wiki/File:Alfalfa_seeds.jpg) |
| `about-machinery-480.{avif,webp}`, `about-machinery-640.{avif,webp}` | `shipping` | Blair Pittman, U.S. National Archives | [File:TRACTORS PLOWING FIELD - NARA - 545893.jpg](https://commons.wikimedia.org/wiki/File:TRACTORS_PLOWING_FIELD_-_NARA_-_545893.jpg) | Public domain | [PD-USGov](https://commons.wikimedia.org/wiki/Template:PD-USGov) |
| `article-lyutserna-720.{avif,webp}`, `article-lyutserna-960.{avif,webp}` | `article-2` | PMM | [File:Valdichiana-erba medica.JPG](https://commons.wikimedia.org/wiki/File:Valdichiana-erba_medica.JPG) | Public domain | [PD-self](https://commons.wikimedia.org/wiki/Template:PD-self) |
| `article-travostoy-720.{avif,webp}`, `article-travostoy-960.{avif,webp}` | `article-3` | Sdjurovic | [File:Agropyron cristatum IMG 5763.jpg](https://commons.wikimedia.org/wiki/File:Agropyron_cristatum_IMG_5763.jpg) | CC BY-SA 4.0 | [creativecommons.org/licenses/by-sa/4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

Не использованы после проверки кадра:

| Файл Commons | Исходная страница | Причина |
|---|---|---|
| `Agropyron cristatum (7).jpg` | [страница файла](https://commons.wikimedia.org/wiki/File:Agropyron_cristatum_(7).jpg) | Кадр не соответствует житняку |
| `Cover Crop Drill planting cover crop seed.jpg` | [страница файла](https://commons.wikimedia.org/wiki/File:Cover_Crop_Drill_planting_cover_crop_seed.jpg) | На технике читается бренд SCHMEISER |
| `Bags of grain.jpg` | [страница файла](https://commons.wikimedia.org/wiki/File:Bags_of_grain.jpg) | Чужие бренды кормов, рыночная сцена |
| `Grain big bags on trailer.jpg` | [страница файла](https://commons.wikimedia.org/wiki/File:Grain_big_bags_on_trailer.jpg) | Текст и контакты сторонней компании |
