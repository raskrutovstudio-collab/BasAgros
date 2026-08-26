import fs from 'node:fs';
import path from 'node:path';

const siteRoot = path.join(process.cwd(), 'site');
const oldButton = '<a href="/o-kompanii/" class="home-btn home-btn-outline">Связаться</a>';
const phoneButton = '<a href="tel:+77059608987" class="home-btn home-btn-outline" aria-label="Позвонить по номеру 8 705 960 89 87">8 705 960 89 87</a>';

function patchHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      patchHtml(abs);
      continue;
    }
    if (!entry.isFile() || entry.name.toLowerCase() !== 'index.html') continue;

    const html = fs.readFileSync(abs, 'utf8');
    const next = html.replaceAll(oldButton, phoneButton);
    if (next !== html) fs.writeFileSync(abs, next, 'utf8');
  }
}

patchHtml(siteRoot);
console.log('Header contact button replaced with phone link: 8 705 960 89 87.');
