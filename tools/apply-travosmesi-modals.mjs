import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'site', 'catalog', 'travosmesi', 'index.html');
const cssPath = path.join(root, 'site', 'assets', 'css', 'travosmesi.css');
const marker = 'data-travosmesi-modal-contract="v1"';

if (!fs.existsSync(pagePath)) throw new Error('Не найдена собранная страница /catalog/travosmesi/');
if (!fs.existsSync(cssPath)) throw new Error('Не найден travosmesi.css');

let html = fs.readFileSync(pagePath, 'utf8');

html = html.replace(
  '<a href="#mix-products" class="home-btn home-btn-primary">Выбрать травосмесь</a>',
  '<a href="#mix-request" class="home-btn home-btn-primary" data-mix-modal-trigger="selection">Выбрать травосмесь</a>'
);

html = html.replace(
  /<a href="#mix-request"(?![^>]*data-mix-modal-trigger)([^>]*)>/g,
  '<a href="#mix-request" data-mix-modal-trigger="commercial"$1>'
);

if (!html.includes(marker)) {
  const modals = `
<div ${marker}>
  <dialog class="home-modal mix-modal" data-mix-modal="selection" aria-labelledby="mix-selection-modal-title" aria-describedby="mix-selection-modal-description">
    <div class="home-modal-panel mix-modal-panel">
      <button class="home-modal-close" type="button" data-mix-modal-close aria-label="Закрыть окно">×</button>
      <p class="home-eyebrow">Подбор травосмеси</p>
      <h2 id="mix-selection-modal-title">Подобрать травосмесь под задачу</h2>
      <p id="mix-selection-modal-description" class="mix-modal-description">Укажите назначение, площадь, необходимый объём и место доставки. Этих данных достаточно для подбора позиции и расчёта поставки.</p>
      <form class="home-form home-modal-form mix-modal-form" data-lead-form data-form-name="Травосмеси — модальное окно — подбор травосмеси">
        <label>Назначение
          <select name="task" required>
            <option value="">Выберите задачу</option>
            <option value="Кормовое направление">Кормовое направление</option>
            <option value="Сенокос">Сенокос</option>
            <option value="Пастбище">Пастбище</option>
            <option value="Рекультивация">Рекультивация</option>
            <option value="Газон и озеленение">Газон и озеленение</option>
            <option value="Другое">Другое</option>
          </select>
        </label>
        <label>Площадь посева
          <input name="sowing_area" type="text" inputmode="decimal" placeholder="Например, 50 га">
        </label>
        <label>Необходимый объём
          <input name="desired_volume" type="text" placeholder="Например, 2 тонны">
        </label>
        <label>Место доставки
          <input name="delivery_locality" type="text" autocomplete="address-level2" placeholder="Населённый пункт">
        </label>
        <label>Телефон
          <input name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX">
        </label>
        <label class="mix-field-wide">Комментарий
          <textarea name="message" rows="3" placeholder="Например, нужна смесь для сенокоса"></textarea>
        </label>
        <input type="hidden" name="intent" value="travosmesi_selection">
        <input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p class="mix-consent mix-field-wide">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
        <button class="home-btn home-btn-primary" type="submit">Подобрать травосмесь</button>
        <div class="home-form-status mix-field-wide" data-form-status aria-live="polite" aria-atomic="true"></div>
      </form>
    </div>
  </dialog>

  <dialog class="home-modal mix-modal" data-mix-modal="commercial" aria-labelledby="mix-commercial-modal-title" aria-describedby="mix-commercial-modal-description">
    <div class="home-modal-panel mix-modal-panel">
      <button class="home-modal-close" type="button" data-mix-modal-close aria-label="Закрыть окно">×</button>
      <p class="home-eyebrow">Коммерческое предложение</p>
      <h2 id="mix-commercial-modal-title">Получить коммерческое предложение</h2>
      <p id="mix-commercial-modal-description" class="mix-modal-description">Укажите травосмесь, объём и место доставки. Менеджер подготовит коммерческое предложение по вашему запросу.</p>
      <form class="home-form home-modal-form mix-modal-form" data-lead-form data-form-name="Травосмеси — модальное окно — коммерческое предложение">
        <label>Травосмесь
          <select name="product_interest">
            <option value="">Нужен подбор</option>
            <option value="Травосмесь Кормовая">Травосмесь «Кормовая»</option>
            <option value="Травосмесь Универсальная">Травосмесь «Универсальная»</option>
            <option value="Травосмесь Рекультивационная">Травосмесь «Рекультивационная»</option>
            <option value="Травосмесь Газонная">Травосмесь «Газонная»</option>
            <option value="Рожь + Вика 65/35">Рожь + Вика 65/35</option>
          </select>
        </label>
        <label>Необходимый объём
          <input name="desired_volume" type="text" placeholder="Например, 2 тонны">
        </label>
        <label>Место доставки
          <input name="delivery_locality" type="text" autocomplete="address-level2" placeholder="Населённый пункт">
        </label>
        <label>Телефон
          <input name="phone" type="tel" inputmode="tel" autocomplete="tel" required data-phone-mask maxlength="16" pattern="\\+7 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}" placeholder="+7 XXX XXX XX XX">
        </label>
        <label class="mix-field-wide">Комментарий
          <textarea name="message" rows="3" placeholder="Дополнительные параметры заказа"></textarea>
        </label>
        <input type="hidden" name="intent" value="travosmesi_quote">
        <input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <p class="mix-consent mix-field-wide">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
        <button class="home-btn home-btn-primary" type="submit">Получить коммерческое предложение</button>
        <div class="home-form-status mix-field-wide" data-form-status aria-live="polite" aria-atomic="true"></div>
      </form>
    </div>
  </dialog>
</div>
<script>
(() => {
  const dialogs = new Map(Array.from(document.querySelectorAll('[data-mix-modal]')).map((dialog) => [dialog.dataset.mixModal, dialog]));
  let returnFocus = null;

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-mix-modal-trigger]');
    if (trigger) {
      const dialog = dialogs.get(trigger.dataset.mixModalTrigger);
      if (!dialog) return;
      event.preventDefault();
      returnFocus = trigger;
      dialog.showModal();
      document.body.classList.add('home-modal-open');
      requestAnimationFrame(() => dialog.querySelector('select, input, textarea, button')?.focus());
      return;
    }

    const close = event.target.closest('[data-mix-modal-close]');
    if (close) close.closest('dialog')?.close();
  });

  dialogs.forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('home-modal-open');
      returnFocus?.focus();
      returnFocus = null;
    });
  });
})();
</script>`;

  html = html.replace('</body>', `${modals}\n</body>`);
}

fs.writeFileSync(pagePath, html, 'utf8');

let css = fs.readFileSync(cssPath, 'utf8');
const cssMarker = '/* Travosmesi intent modals. */';
if (!css.includes(cssMarker)) {
  css += `\n${cssMarker}\n.page-travosmesi.home-modal-open { overflow: hidden; }\n.page-travosmesi .mix-modal { width: min(calc(100% - 2rem), 46rem); max-height: min(90vh, 52rem); padding: 0; border: 0; background: transparent; }\n.page-travosmesi .mix-modal::backdrop { background: rgba(12, 34, 23, .62); }\n.page-travosmesi .mix-modal-panel { position: relative; max-height: 90vh; overflow-y: auto; padding: clamp(1.25rem, 3vw, 2rem); border: 1px solid var(--color-line); background: #fff; box-shadow: 0 1.5rem 4rem rgba(15, 45, 29, .22); }\n.page-travosmesi .mix-modal-panel h2 { max-width: 36rem; margin: 0; color: var(--color-green-deep); font-size: clamp(1.8rem, 4vw, 2.7rem); line-height: 1.05; letter-spacing: -.035em; }\n.page-travosmesi .mix-modal-description { max-width: 38rem; margin: .75rem 0 1.25rem; color: var(--color-muted); }\n.page-travosmesi .mix-modal .home-modal-close { position: absolute; top: .75rem; right: .75rem; z-index: 2; display: grid; width: 2.5rem; height: 2.5rem; place-items: center; padding: 0; border: 1px solid var(--color-line); background: #fff; color: var(--color-green-deep); font-size: 1.65rem; line-height: 1; cursor: pointer; }\n.page-travosmesi .mix-modal-form { grid-template-columns: 1fr 1fr; padding: 0; border: 0; background: transparent; }\n.page-travosmesi .mix-modal-form .home-btn { grid-column: 1 / -1; }\n@media (max-width: 47.99rem) {\n  .page-travosmesi .mix-modal { width: calc(100% - 1rem); }\n  .page-travosmesi .mix-modal-panel { padding: 1rem; padding-top: 3.75rem; }\n  .page-travosmesi .mix-modal-form { grid-template-columns: 1fr; }\n  .page-travosmesi .mix-modal-form .mix-field-wide,\n  .page-travosmesi .mix-modal-form .home-btn,\n  .page-travosmesi .mix-modal-form .home-form-status { grid-column: auto; }\n}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
}

console.log('Travosmesi CTA links now open intent-based modal forms.');
