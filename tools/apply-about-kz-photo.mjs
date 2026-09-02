import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(process.cwd(), 'site', 'o-kompanii', 'index.html');
if (!fs.existsSync(filePath)) throw new Error('Не найдена собранная страница /o-kompanii/');

let html = fs.readFileSync(filePath, 'utf8');

html = html.replace(
  /<div class="about-classic-team__media"><img[^>]+><\/div>/,
  '<div class="about-classic-team__media"><img src="/assets/img/home/about-machinery-640.webp" width="640" height="480" alt="Сельскохозяйственная техника и поле Северного Казахстана — тематическое фото" loading="lazy" decoding="async"></div>'
);

if (!html.includes('/assets/img/home/about-machinery-640.webp')) {
  throw new Error('Не удалось заменить тематическое фото в блоке о работе с клиентами');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('About page: tropical people photo replaced with Kazakhstan-style agriculture image.');
