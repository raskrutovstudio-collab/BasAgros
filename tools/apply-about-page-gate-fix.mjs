import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(process.cwd(), 'site', 'o-kompanii', 'index.html');
if (!fs.existsSync(filePath)) throw new Error('Не найдена собранная страница /o-kompanii/');

let html = fs.readFileSync(filePath, 'utf8');

html = html.replace(
  '<meta name="robots" content="index, follow">',
  '<meta name="robots" content="noindex, nofollow">'
);

html = html.replace(
  '<nav class="about-breadcrumbs" aria-label="Навигация по разделу"><ol>',
  '<nav class="about-breadcrumbs" aria-label="Навигация по разделу"><ol class="breadcrumbs">'
);

if (!html.includes('<meta name="robots" content="noindex, nofollow">')) {
  throw new Error('Не удалось применить noindex к /o-kompanii/');
}
if (!html.includes('<ol class="breadcrumbs">')) {
  throw new Error('Не удалось привести хлебные крошки /o-kompanii/ к общему формату');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('About page gate fix applied: noindex during QA and canonical breadcrumbs markup.');
