import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.join(process.cwd(), 'site');

const catalogNav = `<nav aria-label="Каталог"><h2>Каталог</h2><ul><li><a href="/catalog/">Каталог семян</a></li><li><a href="/#solutions" data-direction-link="grain">Семена зерновых культур</a></li><li><a href="/catalog/travosmesi/" data-direction-link="forage">Кормовые травы и травосмеси</a></li><li><a href="/catalog/travosmesi/gazonnaya/" data-direction-link="lawn">Семена газонных трав</a></li><li><a href="/#solutions" data-direction-link="agricultural">Семена сельскохозяйственных культур</a></li></ul></nav>`;

const solutionsNav = `<nav aria-label="Решения"><h2>Решения</h2><ul><li><a href="/#solutions">Все направления BAS Agros</a></li><li><a href="/#solutions" data-direction-link="navigation">Автопилоты и системы навигации</a></li><li><a href="/#solutions" data-direction-link="bio">Биопрепараты и биологические решения</a></li><li><a href="/#request" data-home-modal-intent="selection">Подобрать решение под задачу</a></li></ul></nav>`;

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
  if (!html.includes('class="home-footer"')) continue;

  const before = html;
  html = html.replace(/<nav aria-label="Каталог"><h2>Каталог<\/h2><ul>[\s\S]*?<\/ul><\/nav>/, catalogNav);
  html = html.replace(/<nav aria-label="Решения"><h2>Решения<\/h2><ul>[\s\S]*?<\/ul><\/nav>/, solutionsNav);

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`HOME FOOTER V3: updated ${changed} page(s)`);
