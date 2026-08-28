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
const required = [
  'data-lucerne-commercial-flow',
  'Семена люцерны',
  'Получить коммерческое предложение',
  'Запросить характеристики партии',
  'Характеристики конкретной партии',
  'content="index, follow"'
];

for (const marker of required) {
  if (!html.includes(marker)) {
    throw new Error(`В собранной странице люцерны нет обязательного фрагмента: ${marker}`);
  }
}

if (/noindex|nofollow/i.test(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''))) {
  throw new Error('Страница люцерны всё ещё содержит noindex или nofollow');
}

console.log('Lucerne commercial source verified in generated HTML; post-build content rewrite skipped.');
