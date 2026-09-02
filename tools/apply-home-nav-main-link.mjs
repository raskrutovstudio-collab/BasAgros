import fs from 'node:fs';
import path from 'node:path';

const siteRoot = path.join(process.cwd(), 'site');
const navOpen = '<nav class="home-nav" id="home-navigation" aria-label="Основная навигация" data-mobile-nav><ul>';
const homeItem = '<li><a href="/">Главная</a></li>';

let changedFiles = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!entry.isFile() || entry.name.toLowerCase() !== 'index.html') continue;

    const html = fs.readFileSync(fullPath, 'utf8');
    if (!html.includes(navOpen)) continue;

    const navStart = html.indexOf(navOpen);
    const navEnd = html.indexOf('</ul>', navStart);
    if (navEnd === -1) continue;

    const navListHtml = html.slice(navStart, navEnd);
    if (navListHtml.includes('href="/">Главная</a>')) continue;

    const next = html.replace(navOpen, `${navOpen}${homeItem}`);
    fs.writeFileSync(fullPath, next, 'utf8');
    changedFiles += 1;
  }
}

walk(siteRoot);
console.log(`Home navigation link applied to ${changedFiles} page(s).`);
