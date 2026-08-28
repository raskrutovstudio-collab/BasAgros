import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(
  root,
  'site',
  'catalog',
  'mnogoletnie-kormovye-travy',
  'lyutserna',
  'index.html'
);
const heroImageDir = path.join(root, 'site', 'assets', 'img', 'products');
const heroImageParts = [
  'lucerne-field-hero-v4.part01.txt',
  'lucerne-field-hero-v4.part02.txt',
  'lucerne-field-hero-v4.part03.txt',
  'lucerne-field-hero-v4.part04.txt'
];
const heroImagePath = path.join(heroImageDir, 'lucerne-field-hero.webp');

if (!fs.existsSync(pagePath)) throw new Error('Не найдена собранная страница люцерны');

for (const fileName of heroImageParts) {
  if (!fs.existsSync(path.join(heroImageDir, fileName))) {
    throw new Error(`Не найдена часть изображения поля люцерны: ${fileName}`);
  }
}

const heroImagePayload = heroImageParts
  .map((fileName) => fs.readFileSync(path.join(heroImageDir, fileName), 'utf8').trim())
  .join('');
const heroImageBuffer = Buffer.from(heroImagePayload, 'base64');
if (
  heroImageBuffer.length !== 66390 ||
  heroImageBuffer.subarray(0, 4).toString('ascii') !== 'RIFF' ||
  heroImageBuffer.subarray(8, 12).toString('ascii') !== 'WEBP'
) {
  throw new Error(`Некорректный WebP-файл поля люцерны: ${heroImageBuffer.length} bytes`);
}
fs.mkdirSync(heroImageDir, { recursive: true });
fs.writeFileSync(heroImagePath, heroImageBuffer);

const html = fs.readFileSync(pagePath, 'utf8');
if (!html.includes('/assets/img/products/lucerne-field-hero.webp')) {
  throw new Error('В шаблоне люцерны нет утверждённого hero-изображения поля');
}

console.log(`Lucerne hero image rebuilt from supplied image (${heroImageBuffer.length} bytes); HTML rewrite skipped.`);
