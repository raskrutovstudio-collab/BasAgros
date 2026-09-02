import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(process.cwd(), 'site', 'o-kompanii', 'index.html');
if (!fs.existsSync(filePath)) throw new Error('Не найдена собранная страница /o-kompanii/');

let html = fs.readFileSync(filePath, 'utf8');

const heroPattern = /<div class="about-classic-hero__media">[\s\S]*?<div class="about-classic-hero__caption">[\s\S]*?<\/div><\/div>/;
const replacement = '<div class="about-classic-hero__media"><img src="/assets/img/home/ref-lab-960.webp" width="960" height="540" alt="Работа с образцами семян и документами BAS Agros" loading="eager" decoding="async"><div class="about-classic-hero__caption">Работа с семенами, характеристиками партий и документами для B2B-поставок</div></div>';

if (!heroPattern.test(html)) throw new Error('Не найден hero-блок страницы /o-kompanii/');
html = html.replace(heroPattern, replacement);

fs.writeFileSync(filePath, html, 'utf8');
console.log('About page hero image replaced with corporate seed quality image.');
