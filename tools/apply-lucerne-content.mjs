import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(
  root,
  'site',
  'catalog',
  'mnogoletnie-kormovye-travy',
  'lyutserna',
  'index.html'
);

if (!fs.existsSync(pagePath)) {
  throw new Error('Не найдена собранная страница люцерны');
}

let html = fs.readFileSync(pagePath, 'utf8');

if (html.includes('data-lucerne-expanded')) {
  console.log('Lucerne expanded content already applied.');
  process.exit(0);
}

html = html.replace(
  /<p>Люцерна представлена в каталоге BAS Agros в категории многолетних кормовых трав\. Семена поставляются для сельскохозяйственных хозяйств Казахстана\.<\/p>\s*<p>Для конкретной позиции отдельно уточняются доступный вариант продукции, характеристики, сведения по партии, наличие и необходимый объём\.<\/p>/,
  '<p>Семена люцерны используют для закладки многолетних кормовых посевов, получения сена, сенажа и зелёной массы. Люцерна относится к бобовым культурам и ценится в животноводстве за питательность и содержание растительного белка.</p><p>Посевы люцерны помогают хозяйству формировать кормовую базу на несколько сезонов. Развитая корневая система позволяет культуре использовать влагу из глубоких слоёв почвы, а симбиоз с клубеньковыми бактериями способствует накоплению биологического азота. Сорт, норму высева и технологию выращивания подбирают с учётом региона, почвы и назначения посевов.</p>'
);

const specsPattern = /<dl class="product-spec-list">[\s\S]*?<\/dl>/;
const specs = `<dl class="product-spec-list product-spec-list-compact">
      <div><dt>Культура</dt><dd>Люцерна посевная</dd></div>
      <div><dt>Научное название</dt><dd>Medicago sativa L.</dd></div>
      <div><dt>Тип</dt><dd>Многолетняя бобовая кормовая</dd></div>
      <div><dt>Использование</dt><dd>Сено, сенаж, кормовые и пастбищные посевы</dd></div>
      <div><dt>Чистота семян</dt><dd>Справочный ориентир: ≥ 99%</dd></div>
      <div><dt>Всхожесть + твёрдые семена</dt><dd>Справочный ориентир: ≥ 85%</dd></div>
      <div><dt>Инертная примесь</dt><dd>Справочный ориентир: ≤ 1%</dd></div>
      <div><dt>Масса 1000 семян</dt><dd>Ориентировочно 1,6–2,2 г</dd></div>
      <div><dt>Норма высева</dt><dd>Ориентир 13,5–16,8 кг/га</dd></div>
      <div><dt>pH почвы</dt><dd>Ориентир 6,3–7,0</dd></div>
      <div><dt>Глубина посева</dt><dd>Ориентир 0,6–1,3 см</dd></div>
      <div><dt>Фасовка</dt><dd>БИГ-БЭГ / МКР Л4 Н-140, 95×95; мешок ПП 56×110</dd></div>
    </dl>`;

if (!specsPattern.test(html)) {
  throw new Error('Не найден список характеристик на странице люцерны');
}
html = html.replace(specsPattern, specs);

html = html.replace(
  '<div><p class="product-eyebrow">Характеристики</p><h2 id="product-specs-title">Что можно уточнить по семенам люцерны</h2><p>Технические параметры должны относиться к конкретной предлагаемой продукции. Поэтому сорт, репродукция, происхождение, фасовка и показатели партии не подменяются универсальными значениями.</p></div>',
  '<div><p class="product-eyebrow">Характеристики</p><h2 id="product-specs-title">Основные показатели семян люцерны</h2><p>Показатели чистоты и всхожести приведены как справочные ориентиры. Для заказа приоритет имеют фактические данные конкретной партии BAS Agros.</p></div>'
);

const guideMarker = '<section class="product-section product-guide"';
const packagingSection = `<section class="product-section product-articles" data-lucerne-expanded aria-labelledby="product-packaging-title"><div class="home-wrap"><div class="product-section-head"><div><p class="product-eyebrow">Фасовка</p><h2 id="product-packaging-title">Варианты упаковки семян люцерны</h2></div><p>Формат тары можно выбрать или уточнить при оформлении заявки. Фактический вес нетто одной упаковки зависит от партии и согласуется отдельно.</p></div><div class="product-article-grid"><article><h3>БИГ-БЭГ / МКР</h3><p><strong>МКР Л4 Н-140, 95×95</strong> — мягкий контейнер разового использования с логотипом. Подходит как вариант тары для крупной отгрузки семян.</p></article><article><h3>Мешок ПП</h3><p><strong>Полипропиленовый мешок 56×110</strong> — альтернативный вариант фасовки для формирования заказа. Количество упаковок рассчитывается по необходимому объёму.</p></article></div><p class="product-helper">Размер тары не означает фиксированный вес семян. Вес нетто и количество мест указываются в параметрах конкретной поставки.</p></div></section>`;

if (!html.includes(guideMarker)) {
  throw new Error('Не найден блок подбора на странице люцерны');
}
html = html.replace(guideMarker, `${packagingSection}${guideMarker}`);

const commercialMarker = '<section class="product-section product-commercial"';
const agronomySection = `<section class="product-section product-use" aria-labelledby="product-agronomy-title"><div class="home-wrap"><div class="product-section-head"><div><p class="product-eyebrow">Перед посевом</p><h2 id="product-agronomy-title">Что важно учесть при работе<br>с люцерной</h2></div><p>Люцерна требовательна к качеству подготовки поля. Точные нормы корректируются под сорт, почву, обеспеченность влагой, регион и выбранную технологию.</p></div><div class="product-use-grid"><article class="product-use-card"><h3>Почва и дренаж</h3><p>Для люцерны предпочтительны глубокие, хорошо дренированные почвы. Длительный застой воды ухудшает состояние корневой системы. Практический ориентир по реакции почвы — около pH 6,3–7,0.</p></article><article class="product-use-card"><h3>Посевное ложе</h3><p>Семена мелкие, поэтому важны выровненная поверхность, плотное посевное ложе и хороший контакт семени с почвой. На более тяжёлых почвах используют неглубокую заделку; на лёгких песчаных допускается несколько большая глубина.</p></article><article class="product-use-card"><h3>Норма высева</h3><p>В зарубежных рекомендациях для рядового посева встречается ориентир 12–15 фунтов чистых жизнеспособных семян на акр, что соответствует примерно 13,5–16,8 кг/га. Фактическую норму корректируют с учётом чистоты, всхожести, покрытия семян и способа посева.</p></article></div></div></section>`;

if (!html.includes(commercialMarker)) {
  throw new Error('Не найден коммерческий блок на странице люцерны');
}
html = html.replace(commercialMarker, `${agronomySection}${commercialMarker}`);

const articlesMarker = '<section class="product-section product-articles" aria-labelledby="product-articles-title"';
const storageSection = `<section class="product-section product-specs" aria-labelledby="product-storage-title"><div class="home-wrap product-two-col"><div><p class="product-eyebrow">После получения</p><h2 id="product-storage-title">Как хранить семена до посева</h2><p>До использования семенной материал лучше сохранять в целой отгрузочной упаковке и ориентироваться на маркировку и документы конкретной партии.</p></div><dl class="product-spec-list"><div><dt>Влага</dt><dd>Защищать упаковку и семена от увлажнения и конденсата.</dd></div><div><dt>Нагрев</dt><dd>Не размещать рядом с источниками тепла и под длительным прямым солнцем.</dd></div><div><dt>Складирование</dt><dd>Хранить в сухом помещении с вентиляцией и не допускать повреждения тары.</dd></div><div><dt>Перед посевом</dt><dd>Проверить маркировку партии, чистоту, всхожесть и рекомендации по конкретным семенам.</dd></div></dl></div></section>`;

if (!html.includes(articlesMarker)) {
  throw new Error('Не найден блок Агроблога на странице люцерны');
}
html = html.replace(articlesMarker, `${storageSection}${articlesMarker}`);

html = html.replace(
  'placeholder="Например, нужный объём или место доставки"',
  'placeholder="Например, нужный объём, фасовка или место доставки"'
);

html = html.replace(
  '<p class="product-helper">Укажите необходимый объём или площадь посева — условия согласовываются по конкретной заявке.</p>',
  '<p class="product-helper">Укажите необходимый объём или площадь посева — условия согласовываются по конкретной заявке. Сорт, показатели партии и доступный вариант фасовки подтверждаются перед поставкой.</p>'
);

// Confirmed commercial data for lucerne.
html = html.replace('<dd>По запросу</dd>', '<dd>от 2 580 000 ₸/т</dd>');
html = html.replace('<dd>По Казахстану</dd>', '<dd>Казахстан и СНГ</dd>');
html = html.replace(
  'Семена люцерны для сельскохозяйственных хозяйств с поставкой по Казахстану. Цена и актуальное наличие уточняются по конкретной заявке.',
  'Семена люцерны для сельскохозяйственных хозяйств с поставкой по Казахстану и странам СНГ. Базовая цена — от 2 580 000 ₸ за тонну; актуальное наличие и итоговые условия уточняются по заявке.'
);
html = html.replace(
  'Фиксированная стоимость на странице не публикуется. Цена и актуальное наличие уточняются для конкретной заявки.',
  '<strong>Базовая цена — от 2 580 000 ₸ за тонну.</strong> Итоговая стоимость зависит от конкретной позиции, партии, объёма, фасовки и условий поставки. Актуальное наличие уточняется по заявке.'
);
html = html.replace('Поставка по Казахстану</h3>', 'Поставка по Казахстану и СНГ</h3>');
html = html.replace(
  'Условия и стоимость доставки согласовываются по заказу.',
  'Поставка возможна по Казахстану и в страны СНГ. Направление, объём и стоимость доставки согласовываются по конкретному заказу.'
);
html = html.replace('<span>Цена — по запросу</span>', '<span>Базовая цена — от 2 580 000 ₸/т</span>');
html = html.replace('<span>Поставка по Казахстану</span>', '<span>Поставка по Казахстану и СНГ</span>');
html = html.replace(
  'Люцерна — семена для хозяйств Казахстана. Цена по запросу, наличие и условия доставки уточняются по заявке. Информация о продукции и документах — по запросу.',
  'Люцерна — семена для хозяйств Казахстана и стран СНГ. Базовая цена от 2 580 000 ₸ за тонну. Наличие, характеристики партии и условия доставки уточняются по заявке.'
);

fs.writeFileSync(pagePath, html, 'utf8');
console.log('Lucerne content expanded: compact specifications, packaging, agronomy, storage, base price and CIS delivery applied.');
