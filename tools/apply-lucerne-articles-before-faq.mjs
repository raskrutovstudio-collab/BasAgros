import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('site/catalog/mnogoletnie-kormovye-travy/lyutserna/index.html');
if (!fs.existsSync(file)) process.exit(0);

let html = fs.readFileSync(file, 'utf8');

const articlesPattern = /<section class="product-section product-articles" aria-labelledby="product-articles-title">[\s\S]*?<\/section>/;
const faqPattern = /<section class="product-section product-faq" aria-labelledby="product-faq-title">/;

const articlesMatch = html.match(articlesPattern);
const faqMatch = html.match(faqPattern);

if (!articlesMatch || !faqMatch) {
  throw new Error('Lucerne articles or FAQ section not found');
}

const articlesSection = articlesMatch[0];
html = html.replace(articlesPattern, '');
html = html.replace(faqPattern, `${articlesSection}\n${faqMatch[0]}`);

fs.writeFileSync(file, html, 'utf8');
console.log('Moved lucerne articles section directly before FAQ');
