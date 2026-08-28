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

const html = fs.readFileSync(pagePath, 'utf8');
if (!html.includes('для фермерских хозяйств и агропромышленных компаний')) {
  throw new Error('В hero люцерны нет утверждённой audience-формулировки');
}

console.log('Lucerne audience copy already present in template.');
