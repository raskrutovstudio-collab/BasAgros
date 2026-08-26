import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const homePath = path.join(root, 'site', 'index.html');

const phonePattern = '\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}';

const guideForm = `<form class="home-form home-form-compact" data-lead-form data-form-name="Главная — помощь с выбором">
<label for="guide-task">Задача хозяйства<select id="guide-task" name="task"><option value="">Выберите задачу</option><option value="Сенокос">Сенокос</option><option value="Пастбище">Пастбище</option><option value="Медоносный посев">Медоносный посев</option><option value="Сидерация">Сидерация</option></select></label>
<label for="guide-category">Категория<select id="guide-category" name="category"><option value="">Выберите категорию</option><option value="Травосмеси">Травосмеси</option><option value="Многолетние травы">Многолетние травы</option><option value="Однолетние травы">Однолетние травы</option><option value="Сорго">Сорго</option></select></label>
<label for="guide-sowing-area">Площадь посева<input id="guide-sowing-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га"></label>
<label for="guide-name">Ваше имя<input id="guide-name" name="name" type="text" autocomplete="name" placeholder="Введите имя"></label>
<label for="guide-phone">Телефон<input id="guide-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="${phonePattern}" placeholder="+7 XXX XXX XX XX"></label>
<button class="home-btn home-btn-primary" type="submit">Получить предложение</button>
<p class="home-guide-consent home-field-wide">Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Отправка формы будет включена после публикации утверждённой политики конфиденциальности.</p>
<div class="home-form-status home-field-wide" data-form-status aria-live="polite" aria-atomic="true">Отправка будет доступна после подключения формы.</div>
<input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
</form>`;

const requestForm = `<form class="home-form" data-lead-form data-form-name="Главная — заявка">
<label for="request-name">Имя<input id="request-name" name="name" type="text" autocomplete="name"></label>
<label for="request-phone">Телефон<input id="request-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="${phonePattern}" placeholder="+7 XXX XXX XX XX"></label>
<label for="request-category">Категория или культура<input id="request-category" name="category" type="text"></label>
<label for="request-sowing-area">Площадь посева<input id="request-sowing-area" name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га"></label>
<label class="home-field-wide" for="request-message">Комментарий<textarea id="request-message" name="message" rows="4"></textarea></label>
<p class="home-guide-consent home-field-wide">Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Отправка формы будет включена после публикации утверждённой политики конфиденциальности.</p>
<button class="home-btn home-btn-primary" type="submit">Получить предложение</button>
<div class="home-form-status home-field-wide" data-form-status aria-live="polite" aria-atomic="true">Отправка будет доступна после подключения формы.</div>
<input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
</form>`;

function replaceForm(html, formName, markup) {
  const pattern = new RegExp(`<form\\b(?=[^>]*data-form-name="${formName.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}")[^>]*>[\\s\\S]*?<\\/form>`);
  if (!pattern.test(html)) throw new Error(`Не найдена форма: ${formName}`);
  return html.replace(pattern, markup);
}

function assertFormContract(html) {
  const forms = [...html.matchAll(/<form\\b[\\s\\S]*?<\\/form>/g)].map((match) => match[0]);
  if (forms.length !== 2) throw new Error(`На главной ожидалось 2 формы, найдено ${forms.length}`);

  const names = new Set();
  for (const form of forms) {
    const nameMatch = form.match(/data-form-name="([^"]+)"/);
    if (!nameMatch) throw new Error('Форма без data-form-name');
    const formName = nameMatch[1];
    if (names.has(formName)) throw new Error(`Дублирующийся data-form-name: ${formName}`);
    names.add(formName);

    const checks = [
      ['data-lead-form', /data-lead-form/],
      ['phone type', /name="phone"[^>]*type="tel"|type="tel"[^>]*name="phone"/],
      ['phone autocomplete', /name="phone"[^>]*autocomplete="tel"|autocomplete="tel"[^>]*name="phone"/],
      ['phone inputmode', /name="phone"[^>]*inputmode="tel"|inputmode="tel"[^>]*name="phone"/],
      ['phone required', /name="phone"[^>]*required|required[^>]*name="phone"/],
      ['phone mask marker', /name="phone"[^>]*data-phone-mask|data-phone-mask[^>]*name="phone"/],
      ['honeypot', /name="website"[^>]*lead-form-honeypot|lead-form-honeypot[^>]*name="website"/],
      ['status', /data-form-status[^>]*aria-live="polite"|aria-live="polite"[^>]*data-form-status/],
      ['submit button', /<button[^>]*type="submit"/]
    ];
    for (const [label, re] of checks) {
      if (!re.test(form)) throw new Error(`${formName}: не выполнено требование ${label}`);
    }
    if (/\\bnovalidate\\b/.test(form)) throw new Error(`${formName}: novalidate запрещён forms-contract`);
    if (/\\baction=/.test(form)) throw new Error(`${formName}: action запрещён forms-contract`);
    if (/name="(?:contact|desired_volume)"/.test(form)) throw new Error(`${formName}: обнаружено устаревшее имя поля`);
    if (!/name="sowing_area"/.test(form)) throw new Error(`${formName}: отсутствует поле sowing_area`);

    const ids = [...form.matchAll(/<(?:input|select|textarea)\\b[^>]*\\bid="([^"]+)"[^>]*>/g)]
      .map((match) => match[1])
      .filter((id) => !id.includes('website'));
    for (const id of ids) {
      if (!new RegExp(`<label\\b[^>]*for="${id}"`).test(form)) {
        throw new Error(`${formName}: поле #${id} не связано с label[for]`);
      }
    }
  }
}

let html = fs.readFileSync(homePath, 'utf8');
html = replaceForm(html, 'Главная — помощь с выбором', guideForm);
html = replaceForm(html, 'Главная — заявка', requestForm);
html = html.replace('Укажите категорию или культуру и желаемый объём.', 'Укажите категорию или культуру и площадь посева.');
assertFormContract(html);
fs.writeFileSync(homePath, html, 'utf8');

console.log('Forms contract applied: 2 homepage forms, phone mask markup, sowing_area and stable field names.');
