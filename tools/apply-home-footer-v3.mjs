import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.join(process.cwd(), 'site');

const catalogNav = `<nav aria-label="Каталог"><h2>Каталог</h2><ul><li><a href="/catalog/">Каталог семян</a></li><li><a href="/#solutions" data-direction-link="grain">Семена зерновых культур</a></li><li><a href="/catalog/travosmesi/" data-direction-link="forage">Кормовые травы и травосмеси</a></li><li><a href="/catalog/travosmesi/gazonnaya/" data-direction-link="lawn">Семена газонных трав</a></li><li><a href="/#solutions" data-direction-link="agricultural">Семена сельскохозяйственных культур</a></li></ul></nav>`;

const solutionsNav = `<nav aria-label="Решения"><h2>Решения</h2><ul><li><a href="/#solutions">Все направления BAS Agros</a></li><li><a href="/#solutions" data-direction-link="navigation">Автопилоты и системы навигации</a></li><li><a href="/#solutions" data-direction-link="bio">Биопрепараты и биологические решения</a></li><li><a href="/#request" data-home-modal-intent="selection">Подобрать решение под задачу</a></li></ul></nav>`;

const phoneIcon = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M7.3 3.5 9.6 8l-1.8 1.6c1 2.3 2.7 4 5 5l1.7-1.8 4.4 2.3c.5.3.8.8.7 1.4-.3 2.1-1.8 3.5-3.9 3.5C9.2 20 4 14.8 4 8.3c0-2 1.4-3.6 3.5-3.9.6-.1 1.2.2 1.5.7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const whatsappIcon = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 8.5c.5 2.3 2.2 4 4.5 4.7l1.1-1.1 2 1c.3.2.5.5.4.8-.2 1.2-1.1 2-2.4 2-3.7 0-6.7-3-6.7-6.7 0-1.2.8-2.2 2-2.4.4-.1.7.1.9.4l1 2-1.1 1.3" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const mailIcon = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const contactsBlock = `<div id="contacts"><h2>Контакты</h2><p><a href="tel:+77059608987" class="home-footer-phone" aria-label="Позвонить по номеру 8 705 960 89 87">${phoneIcon}<span>8 705 960 89 87</span></a></p><p><a href="tel:+77052553242" class="home-footer-phone" aria-label="Позвонить по номеру 8 705 255 32 42">${phoneIcon}<span>8 705 255 32 42</span></a></p><p><a href="tel:+77051940212" class="home-footer-phone" aria-label="Позвонить по номеру 8 705 194 02 12">${phoneIcon}<span>8 705 194 02 12</span></a></p><p><a href="https://wa.me/77052553242" class="home-footer-phone" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp на номер 8 705 255 32 42">${whatsappIcon}<span>WhatsApp</span></a></p><p><a href="mailto:Basagros@mail.ru" class="home-footer-phone" aria-label="Написать на электронную почту Basagros@mail.ru">${mailIcon}<span>Basagros@mail.ru</span></a></p><p>Работаем с хозяйствами по Казахстану.</p><a href="#request" class="home-footer-cta" data-home-modal-intent="commercial_offer">Получить коммерческое предложение →</a></div>`;

const oldHeroSubtitle = 'BAS Agros объединяет семена для разных задач, технологии точного земледелия и биологические решения. Подбор направления и поставка по Казахстану.';
const newHeroSubtitle = 'BAS Agros реализует семена культур и трав для разных задач, технологии точного земледелия и биологические решения для сельского хозяйства. Подбор направления и поставка по Казахстану.';

function htmlFiles(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...htmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) result.push(full);
  }
  return result;
}

let changed = 0;
for (const file of htmlFiles(siteDir)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('class="home-footer"') && !html.includes(oldHeroSubtitle)) continue;

  const before = html;
  html = html.replace(/<nav aria-label="Каталог"><h2>Каталог<\/h2><ul>[\s\S]*?<\/ul><\/nav>/, catalogNav);
  html = html.replace(/<nav aria-label="Решения"><h2>Решения<\/h2><ul>[\s\S]*?<\/ul><\/nav>/, solutionsNav);
  html = html.replace(/<div id="contacts">[\s\S]*?<\/div><\/div><div class="home-wrap home-footer-bottom">/, `${contactsBlock}</div><div class="home-wrap home-footer-bottom">`);
  html = html.replaceAll(oldHeroSubtitle, newHeroSubtitle);

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`HOME FOOTER / HERO V3: updated ${changed} page(s)`);
