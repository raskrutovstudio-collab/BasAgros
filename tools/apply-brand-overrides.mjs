import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'site');
const oldLogo = '/assets/img/bas-agros-logo.png';
const newLogo = '/assets/img/bas-agros-logo.svg';

const audienceIcons = [
  ['Животноводческие хозяйства', '/assets/img/audience-cow.png'],
  ['Фермерские и сельхозпредприятия', '/assets/img/audience-tractor.png'],
  ['Пасечные хозяйства', '/assets/img/audience-bee.png'],
  ['Оптовые покупатели', '/assets/img/audience-box.png']
];

const guideFormMarkup = `<form class="home-form home-form-compact" data-lead-form data-form-name="Главная — помощь с выбором" novalidate>
<label>Задача хозяйства<select name="task"><option value="">Выберите задачу</option><option>Сенокос</option><option>Пастбище</option><option>Медоносный посев</option><option>Сидерация</option></select></label>
<label>Категория<select name="category"><option value="">Выберите категорию</option><option>Травосмеси</option><option>Многолетние травы</option><option>Однолетние травы</option><option>Сорго</option></select></label>
<label>Планируемый объём<input name="desired_volume" type="text" placeholder="Введите объём"></label>
<label>Ваше имя<input name="name" type="text" autocomplete="name" placeholder="Введите имя"></label>
<label>Телефон<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__"></label>
<button class="home-btn home-btn-primary" type="submit" disabled aria-disabled="true">Получить предложение</button>
<p class="home-guide-consent home-field-wide">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
<input class="lead-form-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
</form>`;

function replaceAudienceIcon(html, title, src) {
  const marker = `<strong>${title}</strong>`;
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) return html;

  const svgStart = html.lastIndexOf('<svg class="home-icon"', markerIndex);
  const svgEnd = svgStart === -1 ? -1 : html.indexOf('</svg>', svgStart);
  if (svgStart === -1 || svgEnd === -1 || svgEnd > markerIndex) return html;

  const image = `<img class="home-icon home-audience-icon" src="${src}" width="48" height="48" alt="" aria-hidden="true" decoding="async">`;
  return html.slice(0, svgStart) + image + html.slice(svgEnd + 6);
}

function patchGuide(html) {
  let next = html;
  next = next.replace(
    /(<section class="home-section home-guide"[\s\S]*?<h2 id="guide-title">Поможем сориентироваться в каталоге<\/h2>)<p>[\s\S]*?<\/p><ul class="home-guide-markers">[\s\S]*?<\/ul>/,
    '$1<p>Расскажите о задаче хозяйства и получите подбор семян и смесей с рекомендациями.</p>'
  );
  next = next.replace(
    /<form class="home-form home-form-compact" data-lead-form data-form-name="Главная — помощь с выбором" novalidate>[\s\S]*?<\/form>/,
    guideFormMarkup
  );
  return next;
}

function patchHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'assets') patchHtml(abs);
      continue;
    }
    if (!entry.isFile() || entry.name.toLowerCase() !== 'index.html') continue;

    const html = fs.readFileSync(abs, 'utf8');
    let next = html.replaceAll(oldLogo, newLogo);
    for (const [title, src] of audienceIcons) {
      next = replaceAudienceIcon(next, title, src);
    }
    if (path.resolve(abs) === path.resolve(siteRoot, 'index.html')) {
      next = patchGuide(next);
    }
    if (next !== html) fs.writeFileSync(abs, next, 'utf8');
  }
}

patchHtml(siteRoot);

const cssPath = path.join(siteRoot, 'assets', 'css', 'home.css');
let css = fs.readFileSync(cssPath, 'utf8');
const wideHeader = 'width: min(calc(100% - 1.5rem), 86rem);';
const pageWidth = 'width: min(calc(100% - 2rem), var(--home-max));';
if (css.includes(wideHeader)) {
  css = css.replace(wideHeader, pageWidth);
} else if (!css.includes(pageWidth)) {
  throw new Error('Header width override was not found in home.css');
}

const heroCategoryInlineRule = `
/* Keep first-screen category labels and arrows on one line. */
@media (min-width: 48rem) {
  .home-hero-categories a {
    white-space: nowrap;
  }
}
`;
if (!css.includes('Keep first-screen category labels and arrows on one line.')) {
  css += heroCategoryInlineRule;
}

const audienceIconRule = `
/* Exact audience icons supplied by the client. */
.home-audience-icon {
  display: block;
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  flex: 0 0 3rem;
}
`;
if (!css.includes('Exact audience icons supplied by the client.')) {
  css += audienceIconRule;
}

const guideReferenceRule = `
/* Guide form: visual match to approved homepage reference. */
.home-guide {
  padding-block: clamp(2.35rem, 3.4vw, 3.15rem);
  background:
    radial-gradient(circle at 12% 15%, rgba(61, 139, 88, .22), transparent 34%),
    linear-gradient(112deg, #0f4d2d 0%, #0b3f27 48%, #0c4a2c 100%);
}
.home-guide-grid {
  grid-template-columns: minmax(0, .72fr) minmax(0, 1.48fr);
  align-items: center;
  gap: clamp(2rem, 4vw, 4.4rem);
}
.home-guide h2 {
  max-width: 21rem;
  font-size: clamp(2rem, 2.75vw, 2.55rem);
  line-height: 1.08;
  letter-spacing: -.035em;
}
.home-guide-grid > div > p {
  max-width: 24rem;
  margin: 1rem 0 0;
  color: #e2eee6;
  font-size: .98rem;
  line-height: 1.55;
}
.home-guide-markers { display: none !important; }
.home-form-compact {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .8rem .9rem;
  padding: 1.05rem;
  border: 1px solid rgba(255,255,255,.11);
  border-radius: .65rem;
  background: rgba(4, 43, 25, .32);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035);
}
.home-form-compact label {
  gap: .35rem;
  color: #fff;
  font-size: .78rem;
  font-weight: 750;
  line-height: 1.2;
}
.home-form-compact input,
.home-form-compact select {
  min-height: 3.05rem;
  padding: .7rem .85rem;
  border: 1px solid rgba(15,63,39,.16);
  border-radius: .32rem;
  background: #fff;
  color: #18231d;
  font-size: .96rem;
  font-weight: 600;
  box-shadow: none;
}
.home-form-compact input::placeholder { color: #78837c; opacity: 1; }
.home-form-compact select { cursor: pointer; }
.home-form-compact .home-btn {
  min-height: 3.05rem;
  align-self: end;
  border-radius: .32rem;
  border-color: #2f8c51;
  background: #2f8c51;
  color: #fff;
  font-size: .9rem;
  font-weight: 750;
}
.home-form-compact .home-btn:disabled {
  border-color: #2f8c51;
  background: #2f8c51;
  color: #fff;
  opacity: .72;
}
.home-guide-consent {
  grid-column: 1 / -1;
  margin: .05rem 0 0;
  color: #c9dbcf;
  font-size: .69rem;
  font-weight: 400;
  line-height: 1.35;
}
@media (max-width: 47.99rem) {
  .home-guide-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .home-guide h2 { max-width: 19rem; }
  .home-guide-grid > div > p { max-width: 30rem; }
  .home-form-compact {
    grid-template-columns: 1fr;
    padding: .85rem;
  }
  .home-guide-consent { grid-column: auto; }
}
`;
if (!css.includes('Guide form: visual match to approved homepage reference.')) {
  css += guideReferenceRule;
}

const botanicalPlacementRule = `
/* Hero botanical placement matched to the approved reference: mostly on the white field, stem near the photo edge. */
@media (min-width: 48rem) {
  .home-botanical {
    left: auto;
    right: calc(100% - 1.35rem);
    top: 49%;
    width: 9rem;
    height: auto;
    opacity: .44;
    transform: translateY(-50%);
  }
}
@media (min-width: 80rem) {
  .home-botanical {
    right: calc(100% - 1.2rem);
    top: 48%;
    width: 9rem;
    opacity: .42;
  }
}
`;
if (!css.includes('Hero botanical placement matched to the approved reference')) {
  css += botanicalPlacementRule;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Brand overrides applied: transparent logo, aligned header, inline hero labels, exact audience icons, reference-matched guide form, and corrected botanical placement.');
