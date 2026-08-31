import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'site', 'catalog', 'mnogoletnie-kormovye-travy', 'lyutserna', 'index.html');

if (!fs.existsSync(pagePath)) throw new Error('Не найдена собранная страница люцерны');

let html = fs.readFileSync(pagePath, 'utf8');

const guidePattern = /(<section class="product-section product-guide"[\s\S]*?<\/section>)/;
const guideMatch = html.match(guidePattern);
if (!guideMatch) throw new Error('Не найдена секция подбора люцерны');

let guide = guideMatch[1];
const oldGuideCta = 'data-product-modal-intent="commercial_offer">Получить коммерческое предложение</a>';
const newGuideCta = 'data-product-modal-intent="selection_quote">Получить коммерческое предложение</a>';
if (!guide.includes(oldGuideCta)) throw new Error('Не найдена CTA секции подбора');
guide = guide.replace(oldGuideCta, newGuideCta);
html = html.replace(guideMatch[1], guide);

if (!html.includes('data-product-selection-field')) {
  const messageLabel = '        <label for="lucerne-modal-message" class="product-modal-message">';
  if (!html.includes(messageLabel)) throw new Error('Не найдено поле сообщения модальной формы');

  const selectionFields = `        <label for="lucerne-modal-purpose" class="product-modal-selection-field" data-product-selection-field hidden><span>Назначение посева</span><input id="lucerne-modal-purpose" name="sowing_purpose" type="text" placeholder="Например, сенокос или пастбище" disabled></label>\n        <label for="lucerne-modal-area" class="product-modal-selection-field" data-product-selection-field hidden><span>Площадь посева</span><input id="lucerne-modal-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га" disabled></label>\n        <label for="lucerne-modal-volume" class="product-modal-selection-field" data-product-selection-field hidden><span>Необходимый объём</span><input id="lucerne-modal-volume" name="requested_volume" type="text" placeholder="Например, 2 т" disabled></label>\n        <label for="lucerne-modal-delivery" class="product-modal-selection-field" data-product-selection-field hidden><span>Место доставки</span><input id="lucerne-modal-delivery" name="delivery_location" type="text" placeholder="Например, Костанай" disabled></label>\n`;

  html = html.replace(messageLabel, `${selectionFields}${messageLabel}`);
}

html = html.replace(/\/assets\/js\/product\.js\?v=[^"']+/g, '/assets/js/product.js?v=20260831-3');
fs.writeFileSync(pagePath, html, 'utf8');

console.log('Lucerne selection CTA now opens a section-specific modal with purpose, area, volume and delivery fields.');
