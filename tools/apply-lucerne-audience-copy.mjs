import fs from 'node:fs';
import path from 'node:path';

const pagePath = path.join(
  process.cwd(),
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

html = html.replace(
  'Семена люцерны для сельскохозяйственных хозяйств с поставкой по Казахстану и странам СНГ.',
  'Семена люцерны для фермерских хозяйств и агропромышленных компаний с поставкой по Казахстану и странам СНГ.'
);

fs.writeFileSync(pagePath, html, 'utf8');
console.log('Lucerne hero audience copy updated.');
