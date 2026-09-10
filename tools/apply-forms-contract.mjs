import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const homePath = path.join(root, 'site', 'index.html');
const phonePattern = '\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}';
const consent = 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных.';

const guideForm = `<form class="home-form home-form-compact" data-lead-form data-form-name="Главная — подбор решения под задачу">
<label for="guide-task">Задача хозяйства<select id="guide-task" name="task"><option value="">Выберите задачу</option><option value="Закупка семян">Закупка семян</option><option value="Кормовая база">Кормовая база</option><option value="Газон и озеленение">Газон и озеленение</option><option value="Навигация сельхозтехники">Навигация сельхозтехники</option><option value="Биологическое решение">Биологическое решение</option><option value="Комплексный запрос">Комплексный запрос</option></select></label>
<label for="guide-category">Направление<select id="guide-category" name="category"><option value="">Выберите направление</option><option value="Семена зерновых культур">Семена зерновых культур</option><option value="Семена кормовых трав и травосмеси">Кормовые травы и травосмеси</option><option value="Семена газонных трав">Семена газонных трав</option><option value="Семена сельскохозяйственных культур">Сельскохозяйственные культуры</option><option value="Автопилоты и системы навигации">Автопилоты и навигация</option><option value="Биопрепараты и биологические решения">Биологические решения</option></select></label>
<label for="guide-sowing-area">Площадь / количество техники<input id="guide-sowing-area" name="project_scale" type="text" placeholder="Например, 500 га или 3 единицы"></label>
<label for="guide-desired-volume">Необходимый объём / конфигурация<input id="guide-desired-volume" name="desired_volume" type="text" placeholder="Опишите требуемый объём или комплект"></label>
<label for="guide-delivery-locality">Регион / место доставки<input id="guide-delivery-locality" name="delivery_locality" type="text" autocomplete="address-level2" placeholder="Населённый пункт"></label>
<label for="guide-phone">Телефон<input id="guide-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="${phonePattern}" placeholder="+7 XXX XXX XX XX"></label>
<input type="hidden" name="intent" value="solution_selection">
<button class="home-btn home-btn-primary home-field-wide" type="submit">Получить подбор решения</button>
<p class="home-guide-consent home-field-wide">${consent}</p>
<div class="home-form-status home-field-wide" data-form-status aria-live="polite" aria-atomic="true"></div>
<input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
</form>`;

const requestForm = `<form class="home-form" data-lead-form data-form-name="Главная — коммерческое предложение">
<label for="request-name">Имя<input id="request-name" name="name" type="text" autocomplete="name"></label>
<label for="request-phone">Телефон<input id="request-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="${phonePattern}" placeholder="+7 XXX XXX XX XX"></label>
<label for="request-category">Направление или категория<input id="request-category" name="category" type="text" placeholder="Например, автопилот или семена зерновых"></label>
<label for="request-sowing-area">Площадь / количество техники<input id="request-sowing-area" name="project_scale" type="text" placeholder="Например, 500 га или 3 единицы"></label>
<label for="request-desired-volume">Объём / конфигурация<input id="request-desired-volume" name="desired_volume" type="text" placeholder="Необходимый объём или комплект"></label>
<label for="request-delivery-locality">Населённый пункт доставки<input id="request-delivery-locality" name="delivery_locality" type="text" autocomplete="address-level2" placeholder="Населённый пункт"></label>
<label class="home-field-wide" for="request-message">Комментарий<textarea id="request-message" name="message" rows="4" placeholder="Дополнительные параметры заказа"></textarea></label>
<input type="hidden" name="intent" value="commercial_offer">
<p class="home-guide-consent home-field-wide">${consent}</p>
<button class="home-btn home-btn-primary" type="submit">Получить коммерческое предложение</button>
<div class="home-form-status home-field-wide" data-form-status aria-live="polite" aria-atomic="true"></div>
<input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
</form>`;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceForm(html, formName, markup) {
  const pattern = new RegExp(`<form\\b(?=[^>]*data-form-name="${escapeRegExp(formName)}")[^>]*>[\\s\\S]*?<\\/form>`);
  if (!pattern.test(html)) throw new Error(`Не найдена форма: ${formName}`);
  return html.replace(pattern, markup);
}

function assertFormContract(html) {
  const forms = [...html.matchAll(/<form\b[\s\S]*?<\/form>/g)].map((match) => match[0]);
  if (forms.length !== 3) throw new Error(`На главной ожидалось 3 формы, включая модальную, найдено ${forms.length}`);

  const names = new Set();
  const pageIds = new Set();

  for (const form of forms) {
    const nameMatch = form.match(/data-form-name="([^"]+)"/);
    if (!nameMatch) throw new Error('Форма без data-form-name');
    const formName = nameMatch[1];
    if (names.has(formName)) throw new Error(`Дублирующийся data-form-name: ${formName}`);
    names.add(formName);

    const checks = [
      ['data-lead-form', /data-lead-form/],
      ['phone type', /<input(?=[^>]*name="phone")(?=[^>]*type="tel")[^>]*>/],
      ['phone autocomplete', /<input(?=[^>]*name="phone")(?=[^>]*autocomplete="tel")[^>]*>/],
      ['phone inputmode', /<input(?=[^>]*name="phone")(?=[^>]*inputmode="tel")[^>]*>/],
      ['phone required', /<input(?=[^>]*name="phone")(?=[^>]*required)[^>]*>/],
      ['phone mask marker', /<input(?=[^>]*name="phone")(?=[^>]*data-phone-mask)[^>]*>/],
      ['honeypot', /<input(?=[^>]*name="website")(?=[^>]*class="[^"]*lead-form-honeypot)[^>]*>/],
      ['status', /<(?:div|p)(?=[^>]*data-form-status)(?=[^>]*aria-live="polite")[^>]*>/],
      ['submit button', /<button(?=[^>]*type="submit")[^>]*>/],
      ['project scale', /name="project_scale"/]
    ];

    for (const [label, re] of checks) {
      if (!re.test(form)) throw new Error(`${formName}: не выполнено требование ${label}`);
    }

    if (/\bnovalidate\b/.test(form)) throw new Error(`${formName}: novalidate запрещён forms-contract`);
    if (/\baction=/.test(form)) throw new Error(`${formName}: action запрещён forms-contract`);
    if (/name="contact"/.test(form)) throw new Error(`${formName}: обнаружено устаревшее имя поля`);
    if (/Политика конфиденциальности будет опубликована|отправка станет доступна|Отправка будет доступна после подключения формы/i.test(form)) {
      throw new Error(`${formName}: остался production-placeholder`);
    }
    if (/<a\b[^>]*href=["']\/privacy\//i.test(form)) {
      throw new Error(`${formName}: нельзя ссылаться на несуществующий /privacy/`);
    }

    const controls = [...form.matchAll(/<(?:input|select|textarea)\b[^>]*>/g)].map((match) => match[0]);
    for (const control of controls) {
      if (/name="website"/.test(control) || /type="hidden"/.test(control)) continue;
      const id = control.match(/\bid="([^"]+)"/)?.[1];
      const fieldName = control.match(/\bname="([^"]+)"/)?.[1];
      if (!fieldName) throw new Error(`${formName}: видимое поле без name`);
      if (!id) throw new Error(`${formName}: поле ${fieldName} без id`);
      if (pageIds.has(id)) throw new Error(`Дублирующийся id на странице: ${id}`);
      pageIds.add(id);
      if (!new RegExp(`<label\\b[^>]*for="${escapeRegExp(id)}"`).test(form)) {
        throw new Error(`${formName}: поле #${id} не связано с label[for]`);
      }
    }
  }
}

let html = fs.readFileSync(homePath, 'utf8');
html = replaceForm(html, 'Главная — подбор решения под задачу', guideForm);
html = replaceForm(html, 'Главная — коммерческое предложение', requestForm);
assertFormContract(html);
fs.writeFileSync(homePath, html, 'utf8');

console.log('Forms contract applied: 3 homepage forms including modal, phone mask markup, project_scale and stable field names.');
