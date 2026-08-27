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
  '<p>Люцерна представлена в каталоге BAS Agros в категории многолетних кормовых трав. Семена поставляются для сельскохозяйственных хозяйств Казахстана.</p><p>Для конкретной позиции отдельно уточняются доступный вариант продукции, характеристики, сведения по партии, наличие и необходимый объём.</p>',
  '<p><strong>Люцерна — многолетняя бобовая кормовая культура.</strong> В сельском хозяйстве её используют для заготовки сена и сенажа, в кормовых посевах и в составе пастбищных систем. Культура формирует глубокую корневую систему и применяется в многолетних кормовых севооборотах.</p><p>Для заказа важно ориентироваться не только на название культуры, но и на характеристики конкретной партии: сорт или вариант, репродукцию, происхождение, показатели семян, доступную фасовку и объём. Эти данные BAS Agros уточняет по фактически доступной продукции.</p>'
);

html = html.replace(
  '<div><dt>Фасовка</dt><dd>Уточняется при обработке заявки</dd></div>',
  '<div><dt>Фасовка</dt><dd>БИГ-БЭГ / МКР Л4 Н-140, 95×95; мешок ПП 56×110. Доступность варианта уточняется по заявке.</dd></div>'
);

const guideMarker = '<section class="product-section product-guide"';
const packagingSection = `<section class="product-section product-articles" data-lucerne-expanded aria-labelledby="product-packaging-title"><div class="home-wrap"><div class="product-section-head"><div><p class="product-eyebrow">Фасовка</p><h2 id="product-packaging-title">Варианты упаковки семян люцерны</h2></div><p>Формат тары можно уточнить при оформлении заявки. Фактический вес нетто одной упаковки зависит от партии и согласуется отдельно.</p></div><div class="product-article-grid"><article><h3>БИГ-БЭГ / МКР</h3><p><strong>МКР Л4 Н-140, 95×95</strong> — мягкий контейнер разового использования с логотипом. Используется как вариант тары для отгрузки крупной партии семян.</p></article><article><h3>Мешок ПП</h3><p><strong>Полипропиленовый мешок 56×110</strong> — альтернативный вариант фасовки. Наличие нужного формата и количество упаковок уточняются для конкретного заказа.</p></article></div><p class="product-helper">Размер тары сам по себе не означает фиксированный вес семян. Вес нетто и количество мест указываются в параметрах конкретной поставки.</p></div></section>`;

if (!html.includes(guideMarker)) {
  throw new Error('Не найден блок подбора на странице люцерны');
}
html = html.replace(guideMarker, `${packagingSection}${guideMarker}`);

const commercialMarker = '<section class="product-section product-commercial"';
const agronomySection = `<section class="product-section product-use" aria-labelledby="product-agronomy-title"><div class="home-wrap"><div class="product-section-head"><div><p class="product-eyebrow">Перед посевом</p><h2 id="product-agronomy-title">Что важно учесть при работе с люцерной</h2></div><p>Ниже — общие агрономические ориентиры для культуры. Точные нормы и технология должны подбираться под сорт, почву, влагу, регион и способ использования.</p></div><div class="product-use-grid"><article class="product-use-card">${'${icon-placeholder}'}<h3>Почва и участок</h3><p>Люцерна лучше реализует потенциал на хорошо дренированных почвах. Застой воды и выраженная кислотность могут ухудшать развитие растений, поэтому состояние поля желательно оценить до посева.</p></article><article class="product-use-card"><h3>Посевное ложе</h3><p>Семена люцерны мелкие, поэтому важны выровненное поле и качественная подготовка посевного слоя. Универсальную глубину заделки без данных о почве и влажности указывать некорректно.</p></article><article class="product-use-card"><h3>Бобовая культура</h3><p>Люцерна относится к бобовым и способна формировать симбиоз с клубеньковыми бактериями. Целесообразность инокуляции семян стоит уточнять с учётом истории поля и обработки конкретной партии.</p></article></div></div></section>`
  .replace('${icon-placeholder}', '');

if (!html.includes(commercialMarker)) {
  throw new Error('Не найден коммерческий блок на странице люцерны');
}
html = html.replace(commercialMarker, `${agronomySection}${commercialMarker}`);

const articlesMarker = '<section class="product-section product-articles" aria-labelledby="product-articles-title"';
const storageSection = `<section class="product-section product-specs" aria-labelledby="product-storage-title"><div class="home-wrap product-two-col"><div><p class="product-eyebrow">После получения</p><h2 id="product-storage-title">Как хранить семена до посева</h2><p>До использования семенной материал лучше сохранять в целой заводской или отгрузочной упаковке и ориентироваться на маркировку и документы конкретной партии.</p></div><dl class="product-spec-list"><div><dt>Влага</dt><dd>Защищать упаковку и семена от увлажнения и конденсата.</dd></div><div><dt>Нагрев</dt><dd>Не размещать рядом с источниками тепла и под длительным прямым солнцем.</dd></div><div><dt>Складирование</dt><dd>Хранить в сухом помещении с нормальной вентиляцией, не допуская повреждения тары.</dd></div><div><dt>Перед посевом</dt><dd>Проверить маркировку партии и актуальные рекомендации по конкретным семенам.</dd></div></dl></div></section>`;

if (!html.includes(articlesMarker)) {
  throw new Error('Не найден блок Агроблога на странице люцерны');
}
html = html.replace(articlesMarker, `${storageSection}${articlesMarker}`);

html = html.replace(
  'placeholder="Например, нужный объём или место доставки"',
  'placeholder="Например, нужный объём, фасовка или место доставки"'
);

fs.writeFileSync(pagePath, html, 'utf8');
console.log('Lucerne content expanded: packaging, agronomy and storage blocks applied.');
